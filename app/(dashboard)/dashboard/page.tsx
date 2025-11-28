"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatGold } from "@/lib/utils"

interface UserData {
  balance: number
  totalTransactions: number
  totalInvested: number
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [goldPrice, setGoldPrice] = useState<{ buyPrice: number; sellPrice: number } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch user data
        const userRes = await fetch("/api/user")
        if (userRes.ok) {
          const data = await userRes.json()
          setUserData(data)
        }

        // Fetch gold price
        const priceRes = await fetch("/api/gold-price")
        if (priceRes.ok) {
          const data = await priceRes.json()
          setGoldPrice(data)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Selamat datang, {session?.user?.name}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Saldo Emas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatGold(userData?.balance || 0)}
            </p>
            {goldPrice && (
              <p className="text-sm text-gray-600 mt-2">
                ≈ {formatCurrency((userData?.balance || 0) * goldPrice.sellPrice)}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Transaksi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {userData?.totalTransactions || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Investasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatCurrency(userData?.totalInvested || 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gold Price */}
      {goldPrice && (
        <Card>
          <CardHeader>
            <CardTitle>Harga Emas Hari Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Harga Beli</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(goldPrice.buyPrice)} / gram
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Harga Jual (Buyback)</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(goldPrice.sellPrice)} / gram
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
