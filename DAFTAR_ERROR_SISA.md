# ⚠️ DAFTAR ERROR & PENDING ISSUES - SyIAR GEMILANG v3.0

Dokumen ini mencatat bug, error, dan fitur yang masih dalam tahap pengembangan atau memerlukan perbaikan teknis/data.

---

## 1. 🛑 Isu Data & Konfigurasi (Kritis)

### 1.1. ~~Missing Employee ID pada Token JWT~~ ✅ **SELESAI**
- **Status**: ✅ Semua user (admin & guru) sudah terhubung ke `employee_id` di tabel `users`.
- **Akun baru**: User `gibran` (password: `ganteng123`) dibuat untuk pegawai `mas Gibran ganteng`.
- **Catatan**: User siswa (`amba`, `rus`) tidak perlu `employee_id`.

---

## 2. 🛠️ Bug & Fix yang Baru Dilakukan (16 Mei 2026)

| No | Bug | File | Fix |
|----|-----|------|-----|
| 1 | **Appraisals PKG error FK violation** saat buat penilaian | `appraisals.controller.ts:21` | `evaluator_id` pake `user.employeeId` (sebelumnya fallback ke `user.sub` yang menyebabkan UUID user masuk ke kolom FK employee) |
| 2 | **My Appraisals selalu kosong** | `appraisals.controller.ts:41` | Filter pake `user.employeeId` (sebelumnya pake `user.sub`) |
| 3 | **My Asset Loans selalu kosong** | `asset-loans.controller.ts:36` | Filter pake `user.employeeId` (sebelumnya pake `user.sub`) |
| 4 | **Leaves employee_id undefined** | `leaves.controller.ts:21` | Guard null check sebelum pake `employeeId` |
| 5 | **Finance delete Fee kena FK violation** | `finance.service.ts:74` | Validasi jumlah payment terkait sebelum delete |
| 6 | **Finance delete Payment tanpa validasi** | `finance.service.ts:242` | Validasi payment exists sebelum delete |

### Semua user dicek employee_id-nya:
- ✅ Admin `a` → linked ke employee "Admin A"
- ✅ Admin `Atmin R` → linked ke employee "Atmin R"
- ✅ Admin `admin` → linked ke employee "Admin Utama"
- ✅ Admin `pak muhidin` → linked ke employee "Pak Muhidin"
- ✅ Guru `gibran` (baru) → linked ke employee "mas Gibran ganteng"

---

## 3. 🛠️ Bug & Fitur Belum Sempurna (Low Priority)

| No | Fitur | Kendala | Status |
|----|-------|---------|--------|
| 1 | **Upload File** | URL masih bersifat mock/fake, belum tersimpan di storage permanen. | Perlu Integrasi S3/Cloud |
| 2 | **Generate PDF** | E-Slip gaji belum bisa didownload sebagai PDF (masih tampilan web). | Perlu Library `jspdf` |
| 3 | **QR Scanner** | Belum ada interface scanner di frontend untuk peminjaman aset. | Perlu `html5-qrcode` |
| 4 | **Export Excel** | Beberapa modul (HRM/Finance) belum memiliki fungsi export. | Perlu Library `xlsx` |
| 5 | **Notifikasi Real-time** | WebSocket sudah ada di backend tapi belum sepenuhnya di-handle di frontend. | In Progress |

---

## 4. 📝 Catatan Perbaikan Sebelumnya (Sudah di-Fix)

- ✅ **FK Violation Finance**: Masalah pada input pembayaran sudah di-handle.
- ✅ **Route Conflict Assets**: Endpoint `/asset-loans` sudah dipisahkan dari `/assets/:id`.
- ✅ **Validation Pipe**: Masalah penolakan query params pada API sudah di-fix.
- ✅ **HRM Backend Fixes**: Logic `employeeId` di controller sudah diperbaiki.

---

## 5. 🚀 Rekomendasi Langkah Selanjutnya

1. ✅ ~~**Sinkronisasi User**: Jalankan query update untuk menghubungkan `users.employee_id` ke `employees.id`.~~
2. **Library Implementation**: Install dan konfigurasi library PDF dan Excel di frontend.
3. **Cloud Storage**: Set up environment variables untuk storage (AWS S3 atau local disk storage yang valid).
4. **Restart Backend Server** agar semua fix berlaku (JWT token baru diperlukan setelah relink employee_id).

---

*Dokumen ini diperbarui: 16 Mei 2026*
