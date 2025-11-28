import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

// Get current config
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get active config or create default
    let config = await prisma.installmentConfig.findFirst({
      where: { isActive: true },
    })

    if (!config) {
      config = await prisma.installmentConfig.create({
        data: {
          adminFee: 100000, // IDR 100k
          yearlyMargin: 10, // 10% per year
          lateFeePerDay: 10000, // IDR 10k per day
          minDpPercent: 20,
          maxDpPercent: 50,
          minTenorMonths: 12,
          maxTenorMonths: 36,
        },
      })
    }

    return NextResponse.json(config)
  } catch (error) {
    console.error("Error fetching config:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Update config
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const {
      adminFee,
      yearlyMargin,
      lateFeePerDay,
      minDpPercent,
      maxDpPercent,
      minTenorMonths,
      maxTenorMonths,
    } = body

    // Get current active config
    const currentConfig = await prisma.installmentConfig.findFirst({
      where: { isActive: true },
    })

    if (currentConfig) {
      const updatedConfig = await prisma.installmentConfig.update({
        where: { id: currentConfig.id },
        data: {
          adminFee,
          yearlyMargin,
          lateFeePerDay,
          minDpPercent,
          maxDpPercent,
          minTenorMonths,
          maxTenorMonths,
        },
      })

      return NextResponse.json(updatedConfig)
    } else {
      const newConfig = await prisma.installmentConfig.create({
        data: {
          adminFee,
          yearlyMargin,
          lateFeePerDay,
          minDpPercent,
          maxDpPercent,
          minTenorMonths,
          maxTenorMonths,
        },
      })

      return NextResponse.json(newConfig)
    }
  } catch (error) {
    console.error("Error updating config:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
