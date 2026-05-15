# ⚠️ DAFTAR ERROR & PENDING ISSUES - SyIAR GEMILANG v3.0

Dokumen ini mencatat bug, error, dan fitur yang masih dalam tahap pengembangan atau memerlukan perbaikan teknis/data.

---

## 1. 🛑 Isu Data & Konfigurasi (Kritis)

### 1.1. Missing Employee ID pada Token JWT
- **Deskripsi**: Banyak fitur HRM (Cuti, Slip Gaji, PKG) terlihat "loading forever" atau error karena user yang login tidak memiliki `employee_id` yang terhubung di tabel `users`.
- **Dampak**: Pegawai tidak bisa menggunakan fitur self-service.
- **Solusi**: Perlu sinkronisasi manual di database antara tabel `users` dan `employees`.

---

## 2. 🛠️ Bug & Fitur Belum Sempurna (Low Priority)

| No | Fitur | Kendala | Status |
|----|-------|---------|--------|
| 1 | **Upload File** | URL masih bersifat mock/fake, belum tersimpan di storage permanen. | Perlu Integrasi S3/Cloud |
| 2 | **Generate PDF** | E-Slip gaji belum bisa didownload sebagai PDF (masih tampilan web). | Perlu Library `jspdf` |
| 3 | **QR Scanner** | Belum ada interface scanner di frontend untuk peminjaman aset. | Perlu `html5-qrcode` |
| 4 | **Export Excel** | Beberapa modul (HRM/Finance) belum memiliki fungsi export. | Perlu Library `xlsx` |
| 5 | **Notifikasi Real-time** | WebSocket sudah ada di backend tapi belum sepenuhnya di-handle di frontend. | In Progress |

---

## 3. 📝 Catatan Perbaikan Terakhir (Sudah di-Fix)
*Berikut adalah error yang sudah berhasil diperbaiki namun perlu dipastikan kembali setelah server restart:*

- ✅ **FK Violation Finance**: Masalah pada input pembayaran sudah di-handle.
- ✅ **Route Conflict Assets**: Endpoint `/asset-loans` sudah dipisahkan dari `/assets/:id`.
- ✅ **Validation Pipe**: Masalah penolakan query params pada API sudah di-fix.
- ✅ **HRM Backend Fixes**: Logic `employeeId` di controller sudah diperbaiki.

---

## 4. 🚀 Rekomendasi Langkah Selanjutnya

1. **Sinkronisasi User**: Jalankan query update untuk menghubungkan `users.employee_id` ke `employees.id`.
2. **Library Implementation**: Install dan konfigurasi library PDF dan Excel di frontend.
3. **Cloud Storage**: Set up environment variables untuk storage (AWS S3 atau local disk storage yang valid).

---
*Dokumen ini diperbarui secara manual untuk melacak sisa pekerjaan pengembangan.*
