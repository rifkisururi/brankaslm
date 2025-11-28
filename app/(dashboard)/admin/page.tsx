"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"

interface InstallmentConfig {
  id: string
  adminFee: number
  yearlyMargin: number
  lateFeePerDay: number
  minDpPercent: number
  maxDpPercent: number
  minTenorMonths: number
  maxTenorMonths: number
}

export default function AdminPage() {
  const [config, setConfig] = useState<InstallmentConfig | null>(null)
  const [formData, setFormData] = useState({
    adminFee: 0,
    yearlyMargin: 0,
    lateFeePerDay: 0,
    minDpPercent: 20,
    maxDpPercent: 50,
    minTenorMonths: 12,
    maxTenorMonths: 36,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchConfig()
  }, [])

  async function fetchConfig() {
    try {
      const res = await fetch("/api/admin/config")
      if (res.ok) {
        const data = await res.json()
        setConfig(data)
        setFormData({
          adminFee: Number(data.adminFee),
          yearlyMargin: Number(data.yearlyMargin),
          lateFeePerDay: Number(data.lateFeePerDay),
          minDpPercent: Number(data.minDpPercent),
          maxDpPercent: Number(data.maxDpPercent),
          minTenorMonths: data.minTenorMonths,
          maxTenorMonths: data.maxTenorMonths,
        })
      }
    } catch (error) {
      console.error("Error fetching config:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)

    try {
      const res = await fetch("/api/admin/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        alert("Konfigurasi berhasil disimpan!")
        fetchConfig()
      } else {
        alert("Gagal menyimpan konfigurasi")
      }
    } catch (error) {
      alert("Terjadi kesalahan")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Installment Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Konfigurasi Cicilan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Biaya Admin (IDR)</label>
              <Input
                type="number"
                value={formData.adminFee}
                onChange={(e) =>
                  setFormData({ ...formData, adminFee: Number(e.target.value) })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Margin per Tahun (%)
              </label>
              <Input
                type="number"
                step="0.1"
                value={formData.yearlyMargin}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    yearlyMargin: Number(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Denda per Hari (IDR)
              </label>
              <Input
                type="number"
                value={formData.lateFeePerDay}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    lateFeePerDay: Number(e.target.value),
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Min DP (%)</label>
                <Input
                  type="number"
                  value={formData.minDpPercent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minDpPercent: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Max DP (%)</label>
                <Input
                  type="number"
                  value={formData.maxDpPercent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxDpPercent: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">
                  Min Tenor (bulan)
                </label>
                <Input
                  type="number"
                  value={formData.minTenorMonths}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minTenorMonths: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  Max Tenor (bulan)
                </label>
                <Input
                  type="number"
                  value={formData.maxTenorMonths}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxTenorMonths: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving ? "Menyimpan..." : "Simpan Konfigurasi"}
            </Button>
          </CardContent>
        </Card>

        {/* Current Config Display */}
        {config && (
          <Card>
            <CardHeader>
              <CardTitle>Konfigurasi Saat Ini</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Biaya Admin:</span>
                  <span className="font-semibold">
                    {formatCurrency(config.adminFee)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Margin per Tahun:</span>
                  <span className="font-semibold">
                    {config.yearlyMargin}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Denda per Hari:</span>
                  <span className="font-semibold">
                    {formatCurrency(config.lateFeePerDay)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Range DP:</span>
                  <span className="font-semibold">
                    {config.minDpPercent}% - {config.maxDpPercent}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Range Tenor:</span>
                  <span className="font-semibold">
                    {config.minTenorMonths} - {config.maxTenorMonths} bulan
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Product Management */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Manajemen Produk</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-center py-8">
              Fitur manajemen produk akan segera tersedia. Saat ini produk dapat ditambahkan melalui database.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
