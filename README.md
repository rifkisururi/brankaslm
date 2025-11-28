# BRANKAS LM - Platform Investasi Emas Digital

Platform investasi emas digital yang terinspirasi dari BRANKAS Logam Mulia. Dibangun dengan Next.js 14 dan PostgreSQL.

## 🚀 Fitur Utama

- ✅ **Autentikasi** - Login dan register dengan NextAuth.js
- ✅ **Dashboard** - Lihat saldo emas dan statistik investasi
- ✅ **Beli Emas** - Beli emas digital dengan harga real-time
- ✅ **Jual Emas (Buyback)** - Jual kembali emas digital Anda
- ✅ **Riwayat Transaksi** - Lihat semua transaksi yang pernah dilakukan
- ✅ **Business Hours Validation** - Transaksi hanya dapat dilakukan Senin-Sabtu, 09:00-15:00 WIB
- 🔜 **Cetak Emas Fisik** - Cetak saldo digital menjadi emas fisik (coming soon)

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

- **User** - Data pengguna dan saldo emas
- **Transaction** - Transaksi beli/jual emas
- **GoldPrice** - Harga emas harian
- **PhysicalPrint** - Request pencetakan emas fisik (coming soon)

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

- [x] User authentication
- [x] Dashboard & portfolio
- [x] Buy/Sell gold transactions
- [x] Transaction history
- [x] Real-time gold prices
- [x] Business hours validation
- [ ] Physical gold printing
- [ ] Email notifications
- [ ] Payment gateway integration
- [ ] Admin dashboard
- [ ] Multi-language support

## 📄 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 👨‍💻 Developer

Developed by [rifkisururi](https://github.com/rifkisururi)
