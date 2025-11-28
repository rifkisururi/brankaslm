import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// Get all active products
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const brand = searchParams.get("brand")
    const type = searchParams.get("type")

    const where: any = { isActive: true }

    if (brand) {
      where.brand = brand
    }

    if (type) {
      where.type = type
    }

    const products = await prisma.physicalProduct.findMany({
      where,
      orderBy: [{ brand: "asc" }, { weight: "asc" }],
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
