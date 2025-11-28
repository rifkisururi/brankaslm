"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0">
          <nav className="space-y-2">
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full justify-start">
                Dashboard
              </Button>
            </Link>
            <Link href="/buy">
              <Button variant="ghost" className="w-full justify-start">
                Beli Emas
              </Button>
            </Link>
            <Link href="/sell">
              <Button variant="ghost" className="w-full justify-start">
                Jual Emas
              </Button>
            </Link>
            <Link href="/print">
              <Button variant="ghost" className="w-full justify-start">
                Cetak Fisik
              </Button>
            </Link>
            <Link href="/transactions">
              <Button variant="ghost" className="w-full justify-start">
                Riwayat Transaksi
              </Button>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
