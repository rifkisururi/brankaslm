import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
          Investasi Emas Digital
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          BRANKAS - Berencana Aman Kelola Emas. Platform investasi emas digital terpercaya untuk masa depan Anda.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/register">
            <Button size="lg">Mulai Investasi</Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">Login</Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Kenapa BRANKAS LM?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Aman & Terpercaya</CardTitle>
              <CardDescription>
                Didukung oleh PT ANTAM Tbk, perusahaan BUMN terpercaya
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Emas Anda tersimpan dengan aman dan dapat dicetak kapan saja
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Harga Transparan</CardTitle>
              <CardDescription>
                Harga real-time dan seragam di semua region
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Update harga harian, tanpa biaya tersembunyi
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fleksibel</CardTitle>
              <CardDescription>
                Beli dan jual kapan saja sesuai kebutuhan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Tersedia berbagai pilihan gramasi untuk pencetakan fisik
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How it Works */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Cara Kerja</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="font-semibold mb-2">Daftar Akun</h3>
            <p className="text-gray-600 text-sm">Buat akun dengan data diri yang valid</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="font-semibold mb-2">Beli Emas</h3>
            <p className="text-gray-600 text-sm">Pilih jumlah emas yang ingin dibeli</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="font-semibold mb-2">Simpan Digital</h3>
            <p className="text-gray-600 text-sm">Emas tersimpan aman dalam bentuk digital</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              4
            </div>
            <h3 className="font-semibold mb-2">Cetak atau Jual</h3>
            <p className="text-gray-600 text-sm">Cetak ke fisik atau jual kembali</p>
          </div>
        </div>
      </section>

      {/* Business Hours */}
      <section className="text-center bg-blue-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Jam Operasional Transaksi</h2>
        <p className="text-lg text-gray-700">
          Senin - Sabtu, 09:00 - 15:00 WIB
        </p>
        <p className="text-gray-600 mt-2">
          Di luar jam operasional, Anda tetap dapat melihat saldo dan riwayat transaksi
        </p>
      </section>
    </div>
  )
}
