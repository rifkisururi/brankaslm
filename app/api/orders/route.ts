import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

// Create order
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { productId, quantity, paymentType, shippingAddress, notes } = body

    // Get product
    const product = await prisma.physicalProduct.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    if (!product.isActive) {
      return NextResponse.json(
        { error: "Product is not active" },
        { status: 400 }
      )
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { error: "Insufficient stock" },
        { status: 400 }
      )
    }

    const totalPrice = Number(product.price) * quantity

    // Create order
    const order = await prisma.physicalOrder.create({
      data: {
        userId: session.user.id,
        productId,
        quantity,
        pricePerUnit: product.price,
        totalPrice,
        paymentType,
        shippingAddress,
        notes,
        status: paymentType === "CASH" ? "PENDING" : "PENDING", // Will be updated after payment/installment setup
      },
      include: {
        product: true,
      },
    })

    // Update stock
    await prisma.physicalProduct.update({
      where: { id: productId },
      data: {
        stock: {
          decrement: quantity,
        },
      },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Get user orders
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const orders = await prisma.physicalOrder.findMany({
      where: { userId: session.user.id },
      include: {
        product: true,
        installment: {
          include: {
            payments: {
              orderBy: { paymentNumber: "asc" },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
