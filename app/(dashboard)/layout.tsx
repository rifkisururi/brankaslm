"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    async function checkAdmin() {
      if (session?.user?.id) {
        try {
          const res = await fetch("/api/user")
          if (res.ok) {
            const data = await res.json()
            setIsAdmin(data.role === "ADMIN")
          }
        } catch (error) {
          console.error("Error checking admin status:", error)
        }
      }
    }
    checkAdmin()
  }, [session])

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

            <div className="pt-4 pb-2">
              <p className="text-xs text-gray-500 font-semibold px-3">EMAS DIGITAL</p>
            </div>
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
            <Link href="/transactions">
              <Button variant="ghost" className="w-full justify-start">
                Riwayat Transaksi
              </Button>
            </Link>

            <div className="pt-4 pb-2">
              <p className="text-xs text-gray-500 font-semibold px-3">LOGAM MULIA FISIK</p>
            </div>
            <Link href="/marketplace">
              <Button variant="ghost" className="w-full justify-start">
                Marketplace
              </Button>
            </Link>
            <Link href="/installment">
              <Button variant="ghost" className="w-full justify-start">
                Cicilan Saya
              </Button>
            </Link>

            {isAdmin && (
              <>
                <div className="pt-4 pb-2">
                  <p className="text-xs text-gray-500 font-semibold px-3">ADMIN</p>
                </div>
                <Link href="/admin">
                  <Button variant="ghost" className="w-full justify-start">
                    Admin Dashboard
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
