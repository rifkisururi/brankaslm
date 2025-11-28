export default function Footer() {
  return (
    <footer className="border-t bg-gray-50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">BRANKAS LM</h3>
            <p className="text-gray-600 text-sm">
              Berencana Aman Kelola Emas - Platform investasi emas digital terpercaya
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Layanan</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Beli Emas</li>
              <li>Jual Emas</li>
              <li>Cetak Fisik</li>
              <li>Riwayat Transaksi</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Jam Operasional</h4>
            <p className="text-sm text-gray-600">
              Senin - Sabtu<br />
              09:00 - 15:00 WIB
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
          © {new Date().getFullYear()} BRANKAS LM. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
