import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { isBusinessHours } from "@/lib/utils"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    return NextResponse.json(transactions)
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check business hours
    if (!isBusinessHours()) {
      return NextResponse.json(
        { error: "Transaksi hanya dapat dilakukan Senin-Sabtu, 09:00-15:00 WIB" },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { type, amount } = body

    if (!type || !amount || amount <= 0) {
      return NextResponse.json(
        { error: "Tipe transaksi dan jumlah harus diisi" },
        { status: 400 }
      )
    }

    // Get current gold price
    const goldPrice = await prisma.goldPrice.findFirst({
      orderBy: { date: "desc" },
    })

    if (!goldPrice) {
      return NextResponse.json(
        { error: "Harga emas tidak tersedia" },
        { status: 500 }
      )
    }

    const pricePerGram = type === "BUY" ? Number(goldPrice.buyPrice) : Number(goldPrice.sellPrice)
    const totalPrice = amount * pricePerGram

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Validate sell transaction
    if (type === "SELL" && Number(user.balance) < amount) {
      return NextResponse.json(
        { error: "Saldo emas tidak mencukupi" },
        { status: 400 }
      )
    }

    // Create transaction and update balance
    const transaction = await prisma.$transaction(async (tx) => {
      // Create transaction
      const newTransaction = await tx.transaction.create({
        data: {
          userId: session.user.id,
          type,
          amount,
          pricePerGram,
          totalPrice,
          status: "COMPLETED",
        },
      })

      // Update user balance
      const balanceChange = type === "BUY" ? amount : -amount
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          balance: {
            increment: balanceChange,
          },
        },
      })

      return newTransaction
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error("Error creating transaction:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
