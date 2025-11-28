"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"
import { id } from "date-fns/locale"

interface InstallmentPayment {
  id: string
  paymentNumber: number
  dueDate: string
  amount: number
  lateFee: number
  paidAmount: number
  paidAt: string | null
  status: string
}

interface Installment {
  id: string
  totalAmount: number
  dpAmount: number
  dpPercent: number
  adminFee: number
  margin: number
  monthlyPayment: number
  tenorMonths: number
  paymentDate: number
  status: string
  startDate: string
  endDate: string
  order: {
    product: {
      name: string
      brand: string
    }
  }
  payments: InstallmentPayment[]
}

export default function InstallmentPage() {
  const [installments, setInstallments] = useState<Installment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInstallments()
  }, [])

  async function fetchInstallments() {
    try {
      const res = await fetch("/api/installments")
      if (res.ok) {
        const data = await res.json()
        setInstallments(data)
      }
    } catch (error) {
      console.error("Error fetching installments:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handlePayment(installmentId: string, paymentId: string, amount: number) {
    try {
      const res = await fetch(`/api/installments/${installmentId}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, amount }),
      })

      if (res.ok) {
        alert("Pembayaran berhasil!")
        fetchInstallments()
      } else {
        const data = await res.json()
        alert(data.error || "Gagal melakukan pembayaran")
      }
    } catch (error) {
      alert("Terjadi kesalahan")
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Cicilan Saya</h1>

      {installments.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-gray-600">
            Belum ada cicilan aktif
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {installments.map((installment) => (
            <Card key={installment.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>
                    {installment.order.product.brand} - {installment.order.product.name}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      installment.status === "COMPLETED"
                        ? "bg-green-100 text-green-700"
                        : installment.status === "ACTIVE"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {installment.status}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Summary */}
                <div className="grid md:grid-cols-4 gap-4 mb-6 pb-6 border-b">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Harga</p>
                    <p className="font-semibold">
                      {formatCurrency(installment.totalAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">DP ({installment.dpPercent}%)</p>
                    <p className="font-semibold">
                      {formatCurrency(installment.dpAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Cicilan/Bulan</p>
                    <p className="font-semibold">
                      {formatCurrency(installment.monthlyPayment)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tenor</p>
                    <p className="font-semibold">{installment.tenorMonths} bulan</p>
                  </div>
                </div>

                {/* Payment Schedule */}
                <div>
                  <h3 className="font-semibold mb-4">Jadwal Pembayaran</h3>
                  <div className="space-y-3">
                    {installment.payments.map((payment) => {
                      const totalDue = payment.amount + payment.lateFee
                      const isOverdue = new Date(payment.dueDate) < new Date() && payment.status !== "PAID"

                      return (
                        <div
                          key={payment.id}
                          className={`flex items-center justify-between p-4 rounded-lg border ${
                            payment.status === "PAID"
                              ? "bg-green-50 border-green-200"
                              : isOverdue
                              ? "bg-red-50 border-red-200"
                              : "bg-gray-50"
                          }`}
                        >
                          <div className="flex-1">
                            <p className="font-semibold">
                              Pembayaran #{payment.paymentNumber}
                            </p>
                            <p className="text-sm text-gray-600">
                              Jatuh Tempo:{" "}
                              {format(new Date(payment.dueDate), "dd MMMM yyyy", {
                                locale: id,
                              })}
                            </p>
                            {payment.lateFee > 0 && (
                              <p className="text-sm text-red-600">
                                Denda: {formatCurrency(payment.lateFee)}
                              </p>
                            )}
                          </div>

                          <div className="text-right mr-4">
                            <p className="font-bold">
                              {formatCurrency(totalDue)}
                            </p>
                            {payment.paidAmount > 0 && (
                              <p className="text-sm text-gray-600">
                                Dibayar: {formatCurrency(payment.paidAmount)}
                              </p>
                            )}
                          </div>

                          {payment.status !== "PAID" ? (
                            <Button
                              size="sm"
                              onClick={() =>
                                handlePayment(
                                  installment.id,
                                  payment.id,
                                  totalDue - payment.paidAmount
                                )
                              }
                            >
                              Bayar
                            </Button>
                          ) : (
                            <span className="px-4 py-2 bg-green-600 text-white rounded-md text-sm">
                              LUNAS
                            </span>
                          )}
                        </div>
                      )
                    })}
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
