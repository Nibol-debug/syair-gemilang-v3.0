# Plan: Implementasi Fitur Lanjutan HRM (High-Level Architecture)

Dokumen ini memuat perencanaan teknis dan arsitektur untuk pengembangan fitur lanjutan pada Modul Personalia (HRM) di SyIAR Gemilang v3.0, sesuai dengan spesifikasi dari proposal awal.

---

## 1. Latar Belakang & Motivasi

Berdasarkan dokumen `@proposal.md` dan `@proposalAsli.doc`, sistem ERP yang dibangun harus mencakup manajemen operasional yang komprehensif. Modul HRM yang ada saat ini sudah memiliki fungsionalitas dasar (profil, absensi, dokumen). Perencanaan ini bertujuan untuk melengkapi fungsionalitas HRM dengan:
1.  **Workflow Pengajuan Cuti & Izin Online**
2.  **Payroll & Slip Gaji Digital (E-Slip)**
3.  **Penilaian Kinerja Guru (PKG / Appraisal)**
4.  **Inventarisasi Alat Kerja Pegawai**
5.  **Riwayat Pendidikan & Karir Pegawai**

---

## 2. Pembaruan Skema Database (Prisma)

Kita akan menambahkan dan memperbarui model di `backend/prisma/schema.prisma`.

### 2.1. Model `EmployeeHistory` (Riwayat Pegawai)
Melacak rekam jejak karir dan pendidikan.
*   `id` (String, UUID)
*   `employee_id` (String, FK ke Employee)
*   `type` (String) - Enum: `promotion`, `education`, `mutation`, `achievement`
*   `description` (Text) - Detail riwayat.
*   `date` (DateTime)

### 2.2. Model `LeaveRequest` (Pengajuan Cuti/Izin)
Mendigitalisasi form izin manual.
*   `id` (String, UUID)
*   `employee_id` (String, FK ke Employee)
*   `type` (String) - Enum: `sick`, `annual_leave`, `emergency`, `maternity`
*   `start_date` (DateTime)
*   `end_date` (DateTime)
*   `reason` (Text)
*   `proof_url` (Text, Nullable) - Link ke surat dokter atau bukti lain.
*   `status` (String) - Default: `pending`, opsi: `approved`, `rejected`
*   `approver_id` (String, FK ke User, Nullable) - Siapa yang menyetujui/menolak.
*   `created_at`, `updated_at`

### 2.3. Model `Payroll` (Penggajian & E-Slip)
Data penggajian bulanan. **Privasi Ketat** diterapkan di level Controller.
*   `id` (String, UUID)
*   `employee_id` (String, FK ke Employee)
*   `month` (Int)
*   `year` (Int)
*   `basic_salary` (Decimal)
*   `allowances` (Decimal) - Tunjangan (jabatan, transport, dll).
*   `deductions` (Decimal) - Potongan (absen, kasbon, dll). Terintegrasi dengan absen harian.
*   `net_salary` (Decimal)
*   `status` (String) - `pending`, `paid`
*   `pdf_url` (Text, Nullable) - Link ke e-slip yang digenerate sistem.
*   `payment_date` (DateTime, Nullable)
*   *Constraint:* `@@unique([employee_id, month, year])`

### 2.4. Model `EmployeeAppraisal` (Penilaian Kinerja / PKG)
**Transparan** bagi pegawai yang dinilai.
*   `id` (String, UUID)
*   `employee_id` (String, FK ke Employee) - Yang dinilai (`Appraisee`).
*   `evaluator_id` (String, FK ke Employee) - Yang menilai (`Appraiser`).
*   `period` (String) - Misal: "2026-Semester 1"
*   `discipline_score` (Decimal) - Kedisiplinan (bisa auto-kalkulasi dari absen).
*   `pedagogic_score` (Decimal) - Pedagogik/KBM.
*   `professional_score` (Decimal) - Profesionalisme/Soft Skill.
*   `notes` (Text) - Catatan kualitatif dari atasan.
*   `created_at`

### 2.5. Model `AssetLoan` (Inventarisasi Alat Kerja)
Menghubungkan entitas `Asset` dengan `Employee`.
*   `id` (String, UUID)
*   `asset_id` (String, FK ke Asset)
*   `employee_id` (String, FK ke Employee)
*   `loan_date` (DateTime)
*   `expected_return_date` (DateTime, Nullable)
*   `actual_return_date` (DateTime, Nullable)
*   `status` (String) - `borrowed`, `returned`, `overdue`
*   `condition_on_return` (String, Nullable)
*   `notes` (Text, Nullable)

---

## 3. Pengembangan Backend (NestJS)

### 3.1. Struktur Modul
Kita akan membuat modul baru atau memperluas modul `EmployeesModule`:
*   `LeavesModule`
*   `PayrollsModule`
*   `AppraisalsModule`
*   `AssetLoansModule` (Mungkin bagian dari `AssetsModule`)

### 3.2. Spesifikasi Endpoint (API)
*   **Cuti / Izin:**
    *   `POST /api/v1/leaves`: Pengajuan cuti (dengan upload file via `multer`). Memicu service `Notifications` ke Kepsek.
    *   `GET /api/v1/leaves`: List cuti (Filter by status, employee).
    *   `PATCH /api/v1/leaves/:id/approve`: Approval cuti oleh admin.
*   **Payroll:**
    *   `GET /api/v1/payrolls`: Menampilkan data gaji. Dibatasi oleh `@RolesGuard`: hanya `Administrator Utama`, `Bendahara`, atau Pegawai yang melihat miliknya sendiri (Pengecekan ID di Controller).
    *   `POST /api/v1/payrolls/generate`: (Admin/Bendahara) Auto-generate payroll berdasarkan kehadiran bulan berjalan.
*   **Appraisal:**
    *   `POST /api/v1/appraisals`: Atasan menyimpan nilai bawahan.
    *   `GET /api/v1/appraisals/me`: Pegawai melihat rapor kinerjanya (Transparan).
*   **Aset & Peminjaman:**
    *   `POST /api/v1/assets/loans`: Pegawai pinjam aset (Bisa dipicu via QR Scan dari Frontend).

### 3.3. Logika Otomatisasi (Cron/Service Logic)
*   **Pemotongan Gaji:** Saat fungsi `/payrolls/generate` dipanggil, service akan melakukan *query* ke `EmployeeAttendance` untuk menghitung jumlah "Alpa" dan mengalikannya dengan *rate* potongan per hari.
*   **Integrasi Kedisiplinan PKG:** Skor awal kedisiplinan pada `EmployeeAppraisal` di-*seed* berdasarkan rasio keterlambatan/kehadiran.

---

## 4. Pengembangan Frontend (Next.js)

### 4.1. Struktur Halaman Baru
Dashboard akan diperluas dengan *routing* berikut:

*   **Bagi Pegawai (Self-Service):**
    *   `/hrm/my-leaves`: Form dinamis pengajuan izin (Upload bukti surat dokter/keterangan) dan tracking status real-time.
    *   `/hrm/my-payroll`: Histori slip gaji. Tombol *Download PDF* (menggunakan `jspdf` atau API backend).
    *   `/hrm/my-appraisal`: Menampilkan *Spider/Radar Chart* (menggunakan `recharts`) untuk visualisasi PKG.

*   **Bagi Administrator / Kepsek:**
    *   `/hrm/leaves-approval`: Tabel *Queue* cuti yang menunggu *approval*.
    *   `/hrm/payrolls`: Dashboard manajemen gaji, tombol auto-kalkulasi potong gaji.
    *   `/hrm/appraisals`: Form evaluasi terstruktur untuk menilai pegawai.
    *   `/assets/loans`: Log peminjaman barang (Scanner QR Code integrasi dengan library seperti `html5-qrcode`).

### 4.2. Fitur Spesifik
*   **Slip Gaji Digital (E-Slip):** Desain slip gaji profesional menggunakan HTML-to-PDF generation.
*   **Alert Peminjaman Aset:** Jika status pegawai diubah menjadi `resign`, frontend memanggil API untuk memverifikasi apakah ada relasi `AssetLoan` dengan status `borrowed`. Jika ada, *prompt warning* muncul menghalangi proses *resign* sebelum barang dikembalikan.

---

## 5. Keamanan & Hak Akses (RBAC)

| Modul | Peran yang Diizinkan (Akses Penuh) | Akses Terbatas (Self-Service) |
| :--- | :--- | :--- |
| **Cuti/Izin** | Admin Utama, Kepala Sekolah | Guru, Staf (Hanya data sendiri) |
| **Payroll** | Admin Utama, Bendahara | Guru, Staf (Hanya data sendiri) |
| **Appraisal** | Admin Utama, Kepala Sekolah | Guru, Staf (Hanya lihat data sendiri) |
| **Peminjaman** | Admin Utama, Staf Sarpras | Guru, Staf (Hanya data sendiri) |

---

## 6. Penutup (Langkah Selanjutnya)
Jika plan ini disetujui, langkah eksekusi (coding) akan dimulai dengan:
1. Memperbarui `schema.prisma`.
2. Menjalankan migrasi database (`npx prisma migrate dev`).
3. Meng-generate service dan controller di NestJS.
4. Membuat UI komponen dan halaman di Next.js.
                                                                                                                                                                                                                            151,1         Bot



