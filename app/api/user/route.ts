import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        balance: true,
        accountType: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get transaction stats
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
        status: "COMPLETED",
      },
    })

    const totalInvested = transactions
      .filter((t) => t.type === "BUY")
      .reduce((sum, t) => sum + Number(t.totalPrice), 0)

    return NextResponse.json({
      balance: Number(user.balance),
      totalTransactions: transactions.length,
      totalInvested,
    })
  } catch (error) {
    console.error("Error fetching user data:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
