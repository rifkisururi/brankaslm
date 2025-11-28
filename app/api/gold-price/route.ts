import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// Mock gold price - dalam production, ini akan fetch dari API eksternal
const MOCK_GOLD_PRICE = {
  buyPrice: 1250000, // IDR per gram
  sellPrice: 1200000, // IDR per gram (buyback)
}

export async function GET() {
  try {
    // Check if we have today's price
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let goldPrice = await prisma.goldPrice.findFirst({
      where: {
        date: {
          gte: today,
        },
      },
      orderBy: {
        date: "desc",
      },
    })

    // If no price for today, create one (in production, fetch from API)
    if (!goldPrice) {
      goldPrice = await prisma.goldPrice.create({
        data: {
          buyPrice: MOCK_GOLD_PRICE.buyPrice,
          sellPrice: MOCK_GOLD_PRICE.sellPrice,
          date: new Date(),
        },
      })
    }

    return NextResponse.json({
      buyPrice: Number(goldPrice.buyPrice),
      sellPrice: Number(goldPrice.sellPrice),
      date: goldPrice.date,
    })
  } catch (error) {
    console.error("Error fetching gold price:", error)
    // Return mock data if database fails
    return NextResponse.json(MOCK_GOLD_PRICE)
  }
}
