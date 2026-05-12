# Tutorial: Memperbaiki Error "Forbidden resource" & Fetch Errors

Tutorial ini menjelaskan penyebab dan cara memperbaiki error "Forbidden resource" yang muncul di aplikasi SyIAR Gemilang v3.0, terutama pada halaman Users, Roles, dan Verifikasi PPDB.

## 1. Penyebab Masalah
Masalah utama terletak pada ketidaksesuaian antara nama Role yang didaftarkan di Database (saat proses Seeding) dengan nama Role yang diperiksa oleh Backend (di dalam Controller).

*   **Database Seed (`prisma/seed.ts`):** Menggunakan nama role formal seperti `'Administrator Utama'`, `'Kepala Sekolah'`, `'Guru Mata Pelajaran'`, dll.
*   **Backend Controllers:** Banyak menggunakan placeholder role seperti `'admin'`, `'guru'`, atau `'kepala_sekolah'`.

Karena `RolesGuard` di backend membandingkan string secara persis, login sebagai 'admin' (yang memiliki role `'Administrator Utama'`) akan ditolak ketika mengakses endpoint yang dijaga oleh `@Roles('admin')`.

## 2. Langkah Perbaikan

### A. Update Backend Controllers
Seluruh `@Roles()` decorator di backend harus menggunakan nama role yang sesuai dengan database.

Contoh perubahan pada `users.controller.ts`:
```typescript
// SEBELUM
@Roles('admin')
@Get()
findAll() { ... }

// SESUDAH
@Roles('Administrator Utama')
@Get()
findAll() { ... }
```

Daftar Pemetaan Role yang diperbaiki:
*   `'admin'` -> diganti menjadi `'Administrator Utama'`
*   `'kepala_sekolah'` -> diganti menjadi `'Kepala Sekolah'`
*   `'guru'` -> diganti menjadi `'Guru Mata Pelajaran', 'Wali Kelas'`

### B. Perbaikan "Failed to fetch" (AuditInterceptor)
Error `Failed to fetch` saat melakukan mutasi data (seperti "Tolak Berkas") disebabkan oleh crash pada backend server. Crash ini terjadi di `AuditInterceptor` karena:
1.  Interceptor mencoba mengakses `user.id`, sedangkan Passport/JWT menyimpan ID di `user.userId`.
2.  Tidak adanya penanganan error (`try/catch`) pada proses logging asinkron.

**Solusi:**
Mengubah `AuditInterceptor` untuk menggunakan `user.userId` dan menambahkan blok `try/catch` agar kegagalan logging tidak menghentikan proses utama.

### C. Sinkronisasi Frontend & Backend
Pastikan saat melakukan testing, Anda login menggunakan akun yang memiliki role tersebut. Akun default hasil seeding adalah:
*   **Username:** `admin`
*   **Password:** `admin123`
*   **Role:** `Administrator Utama`

## 3. Verifikasi Perbaikan
Setelah melakukan perubahan pada controller, Anda tidak perlu menjalankan ulang seeding jika database sudah terisi. Cukup restart server backend (NestJS) agar perubahan decorator terbaca.

Error "Forbidden resource" pada konsol browser seharusnya hilang, dan data pada tabel Users serta Roles akan muncul dengan normal.

---
*Dibuat oleh Gemini CLI Agent untuk SyIAR Gemilang v3.0*
