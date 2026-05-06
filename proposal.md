---

# 📘 PROPOSAL PENGEMBANGAN SISTEM ERP SEKOLAH

## **Syiar Gemilang (Sistem Informasi Akademik Rumah Gemilang Indonesia)**

---

# 1. 🧾 Pendahuluan

Seiring dengan meningkatnya kebutuhan digitalisasi di lingkungan pendidikan, lembaga membutuhkan sistem yang mampu mengelola seluruh aktivitas akademik dan administrasi secara terintegrasi.

Proposal ini menawarkan pengembangan sistem **Enterprise Resource Planning (ERP)** berbasis web yang dirancang khusus untuk kebutuhan operasional sekolah di Rumah Gemilang Indonesia.

Fokus tahap awal pengembangan adalah implementasi **Modul Ujian Online (CBT)** sebagai fondasi utama, yang kemudian akan dikembangkan menjadi sistem ERP sekolah yang lengkap dan terintegrasi.

---

# 2. 🎯 Tujuan Pengembangan

Tujuan utama sistem ini adalah:

* Meningkatkan efisiensi operasional sekolah
* Mengurangi penggunaan kertas (paperless system)
* Menjamin transparansi dan akurasi data
* Menyediakan sistem terpusat untuk ±1300 siswa
* Mendukung akses multi-perangkat (HP, laptop, dll)

---

# 3. 💡 Keuntungan Utama

| Manfaat         | Deskripsi                                             |
| --------------- | ----------------------------------------------------- |
| Efisiensi Biaya | Mengurangi biaya kertas, tinta, dan distribusi ujian  |
| Integritas Data | Sistem anti-cheat dan audit log menjaga keaslian data |
| Sentralisasi    | Semua data siswa, guru, nilai dalam satu sistem       |
| Aksesibilitas   | Bisa diakses dari berbagai device (BYOD)              |
| Otomatisasi     | Nilai, laporan, dan rekap dihitung otomatis           |

---

# 4. 🧩 Cakupan Modul Sistem (Scope of Work)

Sistem ERP ini terdiri dari beberapa modul utama yang saling terintegrasi:

---

## 4.1 Modul Manajemen Siswa (Student Management)

Sebagai pusat data utama seluruh siswa.

### Fitur:

* Data lengkap siswa (NIS, NIK, alamat, dll)
* Data orang tua/wali
* Manajemen jurusan & kelas (multi jurusan: TKJ, DBS, DG, dll)
* Manajemen angkatan (batch/tahun masuk)
* Riwayat siswa (aktif, pindah, alumni)
* Import/export data Excel
* Generate kartu pelajar + QR Code
* Dashboard statistik siswa

---

## 4.2 Modul Manajemen Pengguna & Hak Akses (ACL)

Mengatur keamanan dan akses sistem.

### Fitur:

* Login multi-user (admin, guru, siswa, dll)
* Role-Based Access Control (RBAC)
* Audit log aktivitas pengguna
* Device locking (khusus ujian CBT)

---

## 4.3 Modul Kepegawaian (HRM)

Mengelola data guru dan staf.

### Fitur:

* Profil guru & staf
* Riwayat pendidikan & jabatan
* Upload dokumen (ijazah, sertifikat)
* Absensi guru
* Statistik tenaga pengajar

---

## 4.4 Modul Akademik (Academic Management)

Mengatur kegiatan belajar mengajar.

### Fitur:

* Manajemen mata pelajaran
* Penjadwalan pelajaran (anti bentrok)
* Absensi siswa real-time
* Jurnal mengajar guru
* Kalender akademik

---

## 4.5 Modul PPDB Online

Mengelola proses penerimaan siswa baru.

### Fitur:

* Form pendaftaran online
* Upload dokumen
* Verifikasi admin
* Ujian seleksi (integrasi CBT)
* Pengumuman hasil
* Daftar ulang

---

## 4.6 Modul Ujian Online (CBT)

Sistem ujian digital sebagai core system.

### Fitur:

* Bank soal terpusat
* Tipe soal (PG, essay, dll)
* Token ujian
* Random soal & jawaban
* Monitoring real-time
* Auto grading (pilihan ganda)

### Fitur Keamanan:

* Deteksi pindah tab
* Fullscreen mode
* Auto submit jika curang
* Device locking

---

## 4.7 Modul Penilaian

Mengolah nilai siswa secara otomatis.

### Fitur:

* Integrasi nilai dari CBT
* Input nilai tugas manual
* Perhitungan nilai akhir otomatis
* KKM & status kelulusan
* Deskripsi nilai otomatis
* E-Rapor (PDF)
* Grafik perkembangan siswa

---

## 4.8 Modul Keuangan

Mengelola pembayaran sekolah.

### Fitur:

* Tagihan SPP otomatis
* Pencatatan pembayaran
* Laporan tunggakan
* Histori pembayaran siswa
* Notifikasi pembayaran
* Cetak kuitansi

---

## 4.9 Modul Inventaris (Asset Management)

Mengelola aset sekolah.

### Fitur:

* Data barang & lokasi
* QR Code aset
* Peminjaman barang
* Kondisi barang
* Riwayat perawatan

---

## 4.10 Dashboard Multi-User

Portal sesuai peran pengguna.

### Role:

* Admin
* Kepala Sekolah
* Guru
* Wali Kelas
* Bendahara
* Siswa
* Orang Tua

---

# 5. 🛠️ Spesifikasi Teknis

* Backend: NestJS
* Frontend: Next.js
* Database: MySQL
* Server: Linux (Ubuntu LTS)
* Web Server: Nginx / OpenLiteSpeed
* Realtime: WebSocket

---

# 6. 🔐 Keamanan Sistem

* JWT Authentication
* Role-Based Access Control
* Audit Log aktivitas
* Enkripsi password
* Device Locking (CBT)
* Anti-cheat system

---

# 7. 🗺️ Roadmap Pengembangan

Tahapan pengembangan sistem:

1. Master Data & User Management
2. Modul Siswa & Kepegawaian
3. Modul PPDB
4. Modul Akademik
5. Modul CBT (Core System)
6. Modul Penilaian
7. Modul Keuangan & Inventaris
8. Dashboard & Reporting

---

# 8. 📈 Penutup

Dengan adanya sistem ERP ini, diharapkan seluruh proses operasional sekolah dapat berjalan lebih efisien, transparan, dan terintegrasi dalam satu platform digital.

Sistem ini tidak hanya menjadi solusi jangka pendek, tetapi juga investasi jangka panjang dalam transformasi digital pendidikan di Rumah Gemilang Indonesia.

---

# 🔥 CATATAN (VERSI LU SEKARANG)

Proposal ini sekarang:

✅ rapi & profesional
✅ gak terlalu teknis (cocok buat presentasi)
✅ tetap kuat secara sistem
✅ sesuai kondisi sekolah lu (multi jurusan & angkatan)

---

