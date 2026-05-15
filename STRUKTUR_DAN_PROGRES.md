# 📄 STRUKTUR FUNGSI & PROGRES PENGEMBANGAN - SyIAR GEMILANG v3.0

Dokumen ini menjelaskan arsitektur teknis, struktur folder, fungsi utama sistem, dan status progres pengembangan secara mendetail dan valid sesuai codebase saat ini.

---

## 1. 🏗️ Arsitektur Sistem

Sistem SyIAR Gemilang dibangun dengan arsitektur modern berbasis TypeScript:

- **Backend**: NestJS (v10+) dengan Prisma ORM.
- **Frontend**: Next.js (v15+) menggunakan App Router.
- **Database**: MySQL 8.0 terbungkus Docker.
- **Prinsip**: Modular, Type-safe, Role-based Access Control (RBAC), dan Audit Trail.

---

## 2. 📂 Struktur Codebase

### 2.1. Backend (`/backend/src`)
Sistem menggunakan struktur modular NestJS:
- `common/`: Interceptors (Audit), Guards (JWT, Roles), Filters, dan DTO global.
- `prisma/`: Service dan module untuk koneksi database.
- `auth/`: Logika JWT, login, dan validasi device.
- `modules/`: (Contoh: `students/`, `hrm/`, `cbt/`) Setiap module memiliki:
  - `*.controller.ts`: Endpoint API.
  - `*.service.ts`: Logika bisnis.
  - `*.module.ts`: Registrasi module.
  - `dto/*.dto.ts`: Validasi input menggunakan `class-validator`.

### 2.2. Frontend (`/frontend`)
Mengikuti pola Next.js App Router:
- `app/`: Routing sistem.
  - `(dashboard)/`: Group route untuk area terproteksi (Dashboard, Siswa, dll).
  - `login/`: Halaman autentikasi.
  - `ppdb/`: Halaman pendaftaran publik.
- `components/`: Komponen UI reusable (Button, Table, Layout).
- `lib/`: Utility functions dan API client (fetch wrappers).
- `hooks/`: Custom React hooks (e.g., `useUserRole`).

---

## 3. 🛠️ Struktur Fungsi Utama

### 3.1. Core Modules (Master Data & Security)
- **Auth & ACL**: Manajemen 8 role (Admin, Guru, Siswa, dll) dengan Audit Log otomatis.
- **Master Data**: Manajemen Jurusan, Kelas, Angkatan, Mata Pelajaran, dan Cabang.

### 3.2. Manajemen Siswa & PPDB
- **Siswa**: Profil lengkap, QR Code, riwayat status, dan export/import Excel.
- **PPDB**: Form pendaftaran publik, upload berkas, dan konversi otomatis ke siswa.

### 3.3. Akademik & CBT (Ujian Online)
- **Akademik**: Jadwal anti-bentrok, presensi real-time, dan jurnal mengajar.
- **CBT**: Bank soal (MCQ/Essay), token ujian, dan **Anti-Cheat System** (tab-switch detection).

### 3.4. Grading & E-Rapor
- **Grading**: Kalkulasi nilai otomatis (Tugas + UTS + UAS + CBT).
- **E-Rapor**: Generate PDF rapor digital per semester.
- **Remedial**: Workflow otomatis untuk siswa di bawah KKM (75).

### 3.5. HRM & Kepegawaian (Advanced)
- **HRM**: Profil pegawai, presensi mandiri, pengajuan cuti, dan slip gaji digital.
- **Appraisal**: Penilaian kinerja guru dan staf (PKG).

---

## 4. 📈 Progres Pengembangan (Validasi Terakhir: 15 Mei 2026)

| Modul | Backend Status | Frontend Status | Progres |
|-------|----------------|-----------------|---------|
| **Auth & ACL** | ✅ 100% | ✅ 100% | **Selesai** |
| **Master Data** | ✅ 100% | ✅ 100% | **Selesai** |
| **Siswa & PPDB** | ✅ 100% | ✅ 100% | **Selesai** |
| **Akademik** | ✅ 100% | ✅ 100% | **Selesai** |
| **CBT (Core)** | ✅ 100% | ✅ 100% | **Selesai** |
| **Penilaian (Grading)** | ✅ 100% | ✅ 100% | **Selesai** |
| **E-Rapor PDF** | ✅ 100% | ✅ 100% | **Selesai** |
| **HRM (Basic & Adv)** | ✅ 90% | ✅ 80% | **Dalam Perbaikan** |
| **Keuangan** | ✅ 100% | ✅ 80% | **Selesai Core** |
| **Aset / Inventaris** | ✅ 100% | ✅ 80% | **Selesai Core** |

---

## 5. ⚠️ Status Isu & Rencana Perbaikan

### 1. Masalah Employee ID (HRM)
- **Isu**: Beberapa fitur HRM (Cuti, Slip Gaji) error karena user tidak punya `employeeId`.
- **Status**: Backend sudah siap, perlu pembersihan data di database untuk menghubungkan user ke pegawai.

### 2. Notifikasi Finance
- **Isu**: FK Violation pada modul pembayaran.
- **Status**: Sedang diperbaiki di level repository layer.

### 3. Fitur Berikutnya (Roadmap)
- Integrasi WhatsApp Notifikasi untuk tunggakan spp.
- Implementasi QR Scanner untuk peminjaman aset di mobile browser.
- Peningkatan Dashboard Analytics untuk Kepala Sekolah.

---
**Catatan:** Progres ini valid sesuai dengan codebase versi 3.0 yang berjalan saat ini.
