# Syiar Gemilang (ERP Sekolah) 🚀

Sistem ERP terintegrasi untuk Sekolah RGI (Rumah Gemilang Indonesia).

## 🛠️ Tech Stack
- **Backend**: NestJS + Prisma ORM
- **Frontend**: Next.js (TypeScript, Vanilla CSS)
- **Database**: MySQL 8.0 (Docker)

## 🏗️ Project Structure
- `/backend`: NestJS application
- `/frontend`: Next.js application
- `docker-compose.yml`: MySQL database configuration

## ⚙️ Setup & Running

### 1. Database (Docker)
Pastikan Docker sudah jalan, lalu jalankan:
```bash
docker compose up -d
```
*Note: MySQL berjalan di port `3307` (Host).*

### 2. Backend
```bash
cd backend
npm install
# Database sudah otomatis di-migrate dan di-seed saat setup awal.
# Jika ingin reset/seed ulang:
npx prisma migrate reset
npm run start:dev
```
- **Port**: 3001
- **API Prefix**: `/api/v1`
- **Default Admin**: `admin` / `admin123`

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
- **Port**: 3000

## 📝 Global Rules (Wajib Diikuti)
1. **ID**: Semua ID wajib UUID.
2. **DTO**: Gunakan class-validator untuk semua input.
3. **Audit**: Semua perubahan data dicatat otomatis via `AuditInterceptor`.
4. **Pagination**: Gunakan `PaginationDto` untuk endpoint list data.
5. **Modular**: Pisahkan logic per module sesuai folder di `src`.

## 🗺️ Roadmap
1. [x] Master Data & Auth (Foundation)
2. [ ] Module 1: Student (InProgress)
3. [ ] Module 2: HRM
4. [ ] Module 3: Academic
5. [ ] Module 4: CBT (Core System)
6. [ ] Module 5: Grading
