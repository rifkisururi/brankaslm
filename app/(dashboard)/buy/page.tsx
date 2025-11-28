"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatGold, isBusinessHours } from "@/lib/utils"
import { useRouter } from "next/navigation"

export default function BuyPage() {
  const router = useRouter()
  const [amount, setAmount] = useState("")
  const [goldPrice, setGoldPrice] = useState<{ buyPrice: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    async function fetchPrice() {
      try {
        const res = await fetch("/api/gold-price")
        if (res.ok) {
          const data = await res.json()
          setGoldPrice(data)
        }
      } catch (error) {
        console.error("Error fetching price:", error)
      }
    }

    fetchPrice()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!isBusinessHours()) {
      setError("Transaksi hanya dapat dilakukan Senin-Sabtu, 09:00-15:00 WIB")
      return
    }

    const amountNum = parseFloat(amount)
    if (!amountNum || amountNum <= 0) {
      setError("Jumlah harus lebih dari 0")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "BUY",
          amount: amountNum,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Terjadi kesalahan")
        setLoading(false)
        return
      }

      setSuccess(true)
      setAmount("")
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (error) {
      setError("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  const totalPrice = goldPrice && amount ? parseFloat(amount) * goldPrice.buyPrice : 0

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Beli Emas</h1>

      {!isBusinessHours() && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md mb-6">
          <p className="font-semibold">Di luar jam operasional</p>
          <p className="text-sm">Transaksi hanya dapat dilakukan Senin-Sabtu, 09:00-15:00 WIB</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Pembelian Emas Digital</CardTitle>
          <CardDescription>
            Masukkan jumlah gram emas yang ingin dibeli
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">
                Pembelian berhasil! Mengalihkan ke dashboard...
              </div>
            )}

            {goldPrice && (
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-sm text-gray-600 mb-1">Harga Beli Hari Ini</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(goldPrice.buyPrice)} / gram
                </p>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium">
                Jumlah (gram)
              </label>
              <Input
                id="amount"
                type="number"
                step="0.0001"
                placeholder="1.0000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            {totalPrice > 0 && (
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600 mb-1">Total Pembayaran</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(totalPrice)}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {formatGold(parseFloat(amount))} emas digital
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !isBusinessHours()}
            >
              {loading ? "Memproses..." : "Beli Sekarang"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
