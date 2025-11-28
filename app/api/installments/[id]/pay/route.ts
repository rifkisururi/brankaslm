import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { calculateLateFee } from "@/lib/installment"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { paymentId, amount } = body

    // Get payment
    const payment = await prisma.installmentPayment.findUnique({
      where: { id: paymentId },
      include: {
        installment: {
          include: {
            order: true,
          },
        },
      },
    })

    if (!payment) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      )
    }

    if (payment.installment.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    if (payment.status === "PAID") {
      return NextResponse.json(
        { error: "Payment already paid" },
        { status: 400 }
      )
    }

    // Get config for late fee
    const config = await prisma.installmentConfig.findFirst({
      where: { isActive: true },
    })

    if (!config) {
      return NextResponse.json(
        { error: "Configuration not found" },
        { status: 500 }
      )
    }

    // Calculate late fee
    const lateFee = calculateLateFee(
      payment.dueDate,
      Number(config.lateFeePerDay)
    )

    const totalDue = Number(payment.amount) + lateFee
    const paidAmount = Number(payment.paidAmount) + amount

    // Update payment
    const updatedPayment = await prisma.installmentPayment.update({
      where: { id: paymentId },
      data: {
        paidAmount,
        lateFee,
        status: paidAmount >= totalDue ? "PAID" : payment.status,
        paidAt: paidAmount >= totalDue ? new Date() : payment.paidAt,
      },
    })

    // Check if all payments are completed
    const allPayments = await prisma.installmentPayment.findMany({
      where: { installmentId: payment.installmentId },
    })

    const allPaid = allPayments.every((p) => p.status === "PAID")

    if (allPaid) {
      // Update installment status
      await prisma.installment.update({
        where: { id: payment.installmentId },
        data: { status: "COMPLETED" },
      })

      // Update order status
      await prisma.physicalOrder.update({
        where: { id: payment.installment.orderId },
        data: { status: "PAID" },
      })
    }

    return NextResponse.json(updatedPayment)
  } catch (error) {
    console.error("Error processing payment:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
