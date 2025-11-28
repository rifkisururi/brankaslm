"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function PrintPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Cetak Emas Fisik</h1>

      <Card>
        <CardHeader>
          <CardTitle>Fitur Segera Hadir</CardTitle>
          <CardDescription>
            Pencetakan emas fisik akan segera tersedia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Anda akan dapat mencetak saldo emas digital Anda menjadi emas fisik dengan berbagai pilihan gramasi.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
