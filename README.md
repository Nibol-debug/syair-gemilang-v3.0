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
```bash
docker compose up -d
```
*Note: MySQL berjalan di port `3307`.*

### 2. Backend
```bash
cd backend
npm install
npx prisma db push --accept-data-loss
npx prisma db seed
# Database sudah di-migrate dan di-seed otomatis saat setup.
npm run start:dev
```
- **Port**: 3001
- **API Prefix**: `/api/v1`
- **Admin**: `admin` / `admin123`

---

## 🧪 CARA TESTING (Manual via API Client)

### A. AUTH
1. **Login**: `POST /auth/login` (Body: `{ "username": "admin", "password": "admin123" }`)
2. **Me**: `GET /auth/me` (Bearer Token required)

### B. STUDENT (Module 1)
1. **List**: `GET /students?page=1&limit=10`
2. **Export**: `GET /students/export` (Download Excel)

### C. ACADEMIC (Module 4)
1. **Add Schedule**: `POST /schedules` (Cek validasi bentrok guru/kelas)
2. **Bulk Attendance**: `POST /attendance` (Input absen sekelas)

### D. CBT (Module 5)
1. **Create Exam**: `POST /exams` (Input soal MCQ/Essay)
2. **Start Exam**: `POST /exams/:id/start` (Butuh token & sesuai jurusan)
3. **Submit**: `POST /exams/sessions/:sessionId/submit` (Otomatis hitung nilai)

### E. GRADING (Module 6)
1. **Finalize**: `POST /grades/finalize` (Hitung nilai rapor per mapel)
2. **Report**: `GET /grades/final/:student_id` (Lihat riwayat nilai akhir)

---

## 📝 Global Rules
1. **UUID**: Semua ID wajib UUID.
2. **Audit**: Perubahan data otomatis masuk tabel `audit_logs`.
3. **KKM**: Batas lulus adalah **75**.
4. **Roles**: Admin, Guru, Siswa.

## 🗺️ Progress
- [x] Module 1: Student
- [x] Module 2: Auth & ACL
- [x] Module 3: HRM
- [x] Module 4: Academic
- [x] Module 5: CBT (Core)
- [x] Module 6: Grading & Reporting
