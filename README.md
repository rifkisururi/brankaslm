# BRANKAS LM - Platform Investasi Emas Digital

Platform investasi emas digital yang terinspirasi dari BRANKAS Logam Mulia. Dibangun dengan Next.js 14 dan PostgreSQL.

## 🚀 Fitur Utama

### Emas Digital
- ✅ **Autentikasi** - Login dan register dengan NextAuth.js
- ✅ **Dashboard** - Lihat saldo emas dan statistik investasi
- ✅ **Beli Emas Digital** - Beli emas digital dengan harga real-time
- ✅ **Jual Emas (Buyback)** - Jual kembali emas digital Anda
- ✅ **Riwayat Transaksi** - Lihat semua transaksi yang pernah dilakukan
- ✅ **Business Hours Validation** - Transaksi hanya dapat dilakukan Senin-Sabtu, 09:00-15:00 WIB

### Logam Mulia Fisik
- ✅ **Marketplace** - Jual beli logam mulia fisik (ANTAM, UBS, PAMP Suisse, Lotus Archi)
- ✅ **Berbagai Brand & Gramasi** - Pilihan produk dari berbagai brand terpercaya
- ✅ **Pembelian Cash** - Beli logam mulia fisik secara tunai
- ✅ **Sistem Cicilan** - Cicilan emas fisik dengan:
  - Tenor minimal 1 tahun
  - DP 20-50% (configurable)
  - Biaya admin (configurable)
  - Margin tahunan (configurable)
  - Generate tabel angsuran otomatis
  - User pilih tanggal pembayaran
  - Sistem denda keterlambatan

### Admin Features
- ✅ **Admin Dashboard** - Kelola konfigurasi sistem
- ✅ **Konfigurasi Cicilan** - Atur biaya admin, margin, dan denda
- ✅ **Manajemen Produk** - Kelola produk logam mulia fisik

## 🛠 Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Hook Form + Zod

**Backend:**
- Next.js API Routes
- Prisma ORM
- NextAuth.js

**Database:**
- Neon PostgreSQL (Serverless)

## 📦 Installation

1. Clone repository:
```bash
git clone https://github.com/rifkisururi/brankaslm.git
cd brankaslm
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:
```bash
cp .env.example .env
```

Edit `.env` dan isi dengan credentials Anda:
```env
DATABASE_URL="your-neon-database-url"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

4. Generate Prisma Client dan migrate database:
```bash
npx prisma generate
npx prisma db push
```

5. Run development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🗄 Database Schema

### User Management
- **User** - Data pengguna, saldo emas, dan role (USER/ADMIN)

### Emas Digital
- **Transaction** - Transaksi beli/jual emas digital
- **GoldPrice** - Harga emas harian
- **PhysicalPrint** - Request pencetakan emas fisik

### Logam Mulia Fisik
- **PhysicalProduct** - Katalog produk logam mulia (ANTAM, UBS, dll)
- **PhysicalOrder** - Order pembelian produk fisik
- **Installment** - Data cicilan pelanggan
- **InstallmentPayment** - Jadwal pembayaran cicilan
- **InstallmentConfig** - Konfigurasi sistem cicilan (admin)

## 🚀 Deploy ke Vercel

1. Push code ke GitHub
2. Import repository di [Vercel](https://vercel.com)
3. Set environment variables di Vercel:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
4. Deploy!

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Neon PostgreSQL connection string | Yes |
| `NEXTAUTH_SECRET` | Secret key untuk NextAuth.js | Yes |
| `NEXTAUTH_URL` | URL aplikasi (production/development) | Yes |
| `GOLD_API_KEY` | API key untuk gold price API | No |
| `GOLD_API_URL` | URL gold price API | No |

## 🎯 Roadmap

### Completed ✅
- [x] User authentication & authorization
- [x] Dashboard & portfolio
- [x] Buy/Sell digital gold transactions
- [x] Transaction history
- [x] Real-time gold prices
- [x] Business hours validation
- [x] Marketplace logam mulia fisik
- [x] Physical gold product catalog
- [x] Installment system (cicilan)
- [x] Payment schedule generation
- [x] Late fee calculation
- [x] Admin dashboard
- [x] Installment configuration

### In Progress 🚧
- [ ] Product image management
- [ ] Physical gold printing from digital balance
- [ ] Order tracking & shipping

### Planned 📋
- [ ] Payment gateway integration (Midtrans, Xendit)
- [ ] Email notifications
- [ ] SMS notifications for payment reminders
- [ ] Export reports (PDF/Excel)
- [ ] Multi-language support (EN/ID)
- [ ] Mobile app (React Native)

## 📄 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 👨‍💻 Developer

Developed by [rifkisururi](https://github.com/rifkisururi)
