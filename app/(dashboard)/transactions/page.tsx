"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatGold } from "@/lib/utils"
import { format } from "date-fns"
import { id } from "date-fns/locale"

interface Transaction {
  id: string
  type: string
  amount: number
  pricePerGram: number
  totalPrice: number
  status: string
  createdAt: string
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch("/api/transactions")
        if (res.ok) {
          const data = await res.json()
          setTransactions(data)
        }
      } catch (error) {
        console.error("Error fetching transactions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Riwayat Transaksi</h1>

      {transactions.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-gray-600">
            Belum ada transaksi
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <Card key={transaction.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          transaction.type === "BUY"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {transaction.type === "BUY" ? "BELI" : "JUAL"}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          transaction.status === "COMPLETED"
                            ? "bg-green-100 text-green-700"
                            : transaction.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600">
                      {format(new Date(transaction.createdAt), "dd MMMM yyyy, HH:mm", {
                        locale: id,
                      })}
                    </p>

                    <div className="mt-3 grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Jumlah</p>
                        <p className="font-semibold">
                          {formatGold(transaction.amount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Harga/gram</p>
                        <p className="font-semibold">
                          {formatCurrency(transaction.pricePerGram)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="font-semibold">
                          {formatCurrency(transaction.totalPrice)}
                        </p>
                      </div>
                    </div>
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
