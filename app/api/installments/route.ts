import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import {
  calculateInstallment,
  generatePaymentSchedule,
  validateDpPercent,
  validateTenor,
} from "@/lib/installment"

// Create installment plan
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { orderId, dpPercent, tenorMonths, paymentDate } = body

    // Validate payment date (1-31)
    if (paymentDate < 1 || paymentDate > 31) {
      return NextResponse.json(
        { error: "Invalid payment date" },
        { status: 400 }
      )
    }

    // Get order
    const order = await prisma.physicalOrder.findUnique({
      where: { id: orderId },
      include: { product: true },
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    if (order.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    if (order.paymentType !== "INSTALLMENT") {
      return NextResponse.json(
        { error: "Order is not for installment" },
        { status: 400 }
      )
    }

    // Check if installment already exists
    const existingInstallment = await prisma.installment.findUnique({
      where: { orderId },
    })

    if (existingInstallment) {
      return NextResponse.json(
        { error: "Installment already exists for this order" },
        { status: 400 }
      )
    }

    // Get config
    const config = await prisma.installmentConfig.findFirst({
      where: { isActive: true },
    })

    if (!config) {
      return NextResponse.json(
        { error: "Installment configuration not found" },
        { status: 500 }
      )
    }

    // Validate DP and tenor
    if (
      !validateDpPercent(
        dpPercent,
        Number(config.minDpPercent),
        Number(config.maxDpPercent)
      )
    ) {
      return NextResponse.json(
        {
          error: `DP must be between ${config.minDpPercent}% and ${config.maxDpPercent}%`,
        },
        { status: 400 }
      )
    }

    if (
      !validateTenor(tenorMonths, config.minTenorMonths, config.maxTenorMonths)
    ) {
      return NextResponse.json(
        {
          error: `Tenor must be between ${config.minTenorMonths} and ${config.maxTenorMonths} months`,
        },
        { status: 400 }
      )
    }

    // Calculate installment
    const calculation = calculateInstallment(
      Number(order.totalPrice),
      dpPercent,
      tenorMonths,
      Number(config.adminFee),
      Number(config.yearlyMargin)
    )

    // Generate payment schedule
    const startDate = new Date()
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + tenorMonths)

    const paymentSchedule = generatePaymentSchedule(
      startDate,
      paymentDate,
      calculation.monthlyPayment,
      tenorMonths,
      calculation.principalAmount,
      calculation.margin
    )

    // Create installment and payments in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create installment
      const installment = await tx.installment.create({
        data: {
          userId: session.user.id,
          orderId,
          totalAmount: calculation.totalAmount,
          dpAmount: calculation.dpAmount,
          dpPercent: calculation.dpPercent,
          adminFee: calculation.adminFee,
          margin: calculation.margin,
          marginPercent: calculation.marginPercent,
          totalWithMargin: calculation.totalWithMargin,
          monthlyPayment: calculation.monthlyPayment,
          tenorMonths,
          paymentDate,
          startDate,
          endDate,
          status: "PENDING", // Will be ACTIVE after DP is paid
        },
      })

      // Create payment schedule
      const payments = await Promise.all(
        paymentSchedule.map((schedule) =>
          tx.installmentPayment.create({
            data: {
              installmentId: installment.id,
              paymentNumber: schedule.paymentNumber,
              dueDate: schedule.dueDate,
              amount: schedule.amount,
              status: "UNPAID",
            },
          })
        )
      )

      return { installment, payments }
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error("Error creating installment:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Get user installments
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const installments = await prisma.installment.findMany({
      where: { userId: session.user.id },
      include: {
        order: {
          include: {
            product: true,
          },
        },
        payments: {
          orderBy: { paymentNumber: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(installments)
  } catch (error) {
    console.error("Error fetching installments:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
