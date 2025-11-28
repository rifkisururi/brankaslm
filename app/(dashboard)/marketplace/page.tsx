"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"

interface Product {
  id: string
  name: string
  brand: string
  weight: number
  type: string
  price: number
  stock: number
  imageUrl?: string
  description?: string
}

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [filter])

  async function fetchProducts() {
    try {
      const url = filter
        ? `/api/products?brand=${filter}`
        : "/api/products"

      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setProducts(data)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Marketplace Logam Mulia</h1>
        <p className="text-gray-600">
          Beli logam mulia fisik dari berbagai brand terpercaya
        </p>
      </div>

      {/* Brand Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <Button
          variant={filter === null ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter(null)}
        >
          Semua
        </Button>
        <Button
          variant={filter === "ANTAM" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("ANTAM")}
        >
          ANTAM
        </Button>
        <Button
          variant={filter === "UBS" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("UBS")}
        >
          UBS
        </Button>
        <Button
          variant={filter === "PAMP_SUISSE" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("PAMP_SUISSE")}
        >
          PAMP Suisse
        </Button>
        <Button
          variant={filter === "LOTUS_ARCHI" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("LOTUS_ARCHI")}
        >
          Lotus Archi
        </Button>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-gray-600">
            Belum ada produk tersedia
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle className="text-lg">{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Brand:</span>
                    <span className="font-semibold">{product.brand}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Berat:</span>
                    <span className="font-semibold">{product.weight} gram</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Stok:</span>
                    <span className="font-semibold">{product.stock} pcs</span>
                  </div>

                  <div className="border-t pt-3">
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(product.price)}
                    </p>
                  </div>

                  {product.description && (
                    <p className="text-sm text-gray-600">
                      {product.description}
                    </p>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Link href={`/marketplace/${product.id}/cash`} className="flex-1">
                      <Button className="w-full" size="sm">
                        Beli Cash
                      </Button>
                    </Link>
                    <Link href={`/marketplace/${product.id}/installment`} className="flex-1">
                      <Button variant="outline" className="w-full" size="sm">
                        Cicilan
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
