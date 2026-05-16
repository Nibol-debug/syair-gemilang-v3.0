# Panduan Deploy SyIAR Gemilang ke Ubuntu Server + CyberPanel

## Prerequisites

- Ubuntu Server 20.04 / 22.04 / 24.04
- CyberPanel sudah terinstall
- Domain (misal: `syiar.domain.com`)
- Akses SSH root ke server

---

## 1. Siapkan Environment di Server

```bash
ssh root@ip-server
```

### Install Node.js 20 LTS

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs git
node -v
npm -v
```

### Install PM2 (Process Manager untuk Node.js)

```bash
npm install -g pm2
```

### Install MySQL Client (jika MySQL belum ada)

```bash
apt-get install -y mysql-client
```

---

## 2. Clone Project ke Server

```bash
mkdir -p /home/syiar
cd /home/syiar
git clone <url-repo> .
```

Atau upload via SCP / CyberPanel File Manager.

---

## 3. Setup Database

### Opsi A: Pakai MySQL di CyberPanel

Buat database lewat CyberPanel → Databases → Create Database.

Catat: `DB_NAME`, `DB_USER`, `DB_PASSWORD`.

### Opsi B: Pakai Docker (seperti development)

```bash
cd /home/syiar
docker-compose up -d mysql
```

> Pastikan Docker sudah terinstall di server.

---

## 4. Setup Backend (NestJS)

```bash
cd /home/syiar/backend
cp .env .env.production
nano .env.production
```

Sesuaikan isi `.env.production`:

```env
DATABASE_URL="mysql://user:password@localhost:3306/syiar_gemilang"
PORT=3001
JWT_SECRET="<ganti-dengan-secret-kuat>"
```

```bash
npm install
npx prisma generate
npx prisma db push
# atau jika ada migration: npx prisma migrate deploy
npm run build
```

### Jalankan Backend dengan PM2

```bash
pm2 start dist/main.js --name syiar-backend
pm2 save
pm2 startup
```

Backend berjalan di `http://localhost:3001`.

---

## 5. Setup Frontend (Next.js)

```bash
cd /home/syiar/frontend
nano .env.production
```

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

```bash
npm install
npm run build
```

### Jalankan Frontend dengan PM2

```bash
pm2 start node_modules/.bin/next --name syiar-frontend -- start -p 3000
pm2 save
```

Frontend berjalan di `http://localhost:3000`.

---

## 6. Konfigurasi CyberPanel (OpenLiteSpeed)

### 6.1. Buat Website

1. Login ke CyberPanel
2. **Website → Create Website**
3. Isi domain (misal: `syiar.domain.com`)
4. Pilih PHP (tidak terlalu dipakai, hanya untuk static)
5. Submit

### 6.2. Setup Reverse Proxy untuk Backend

1. **Website → List Websites → Pilih domain → OpenLiteSpeed → Virtual Host**

2. Tambahkan rewrite rule di bagian **Context / Rewrite**:

   Tambahkan rule rewrite untuk proxy backend:

   ```apache
   rewrite ^/api/(.*) http://localhost:3001/api/$1 [P,E=PROXY]
   ```

   Atau lebih mudah: tambahkan External App & Script Handler.

3. Pergi ke **External App** tab:

   - **App Type**: WebSocket Proxy atau URI Authority
   - **Name**: `syiar-backend`
   - **Address**: `http://localhost:3001`
   - Simpan

4. Pergi ke **Script Handler** → **Add New**:

   - **Suffix**: Not needed, biarkan kosong
   - **Handler Type**: Proxy
   - **Handler Name**: `syiar-backend`

5. **Context** → **Add New**:

   - **Type**: Proxy
   - **URI**: `/api/`
   - **App Name**: `syiar-backend`
   - **Headers**: Tambahkan:
     - `X-Forwarded-For` → `$SERVER_ADDR`
     - `X-Real-IP` → `$REMOTE_ADDR`
     - `Host` → `$SERVER_NAME`

### 6.3. Setup Reverse Proxy untuk Frontend

Ulangi langkah di atas untuk frontend:

1. **External App**: `syiar-frontend` → `http://localhost:3000`
2. **Script Handler**: Proxy → `syiar-frontend`
3. **Context**:

   - **Type**: Proxy
   - **URI**: `/`
   - **App Name**: `syiar-frontend`

> **Urutan context penting**: Context `/api/` harus didaftarkan **sebelum** context `/`.

### 6.4. (Alternatif) Static + Proxy - Lebih Sederhana

Cara paling sederhana: arahkan semua traffic ke frontend, dan biarkan frontend Next.js yang memanggil backend via internal network.

#### Virtual Host → Rewrite Rules:

```apache
# Semua /api/* dilempar ke backend
rewrite ^/api/(.*) http://localhost:3001/api/$1 [P,E=PROXY]

# Sisanya ke frontend Next.js
rewrite ^/(.*) http://localhost:3000/$1 [P,E=PROXY]
```

Ini menghindari setup Context yang rumit.

### 6.5. Redirect Port 80/443

Pastikan domain sudah pointing ke IP server. CyberPanel biasanya sudah handle SSL via Let's Encrypt (Auto SSL).

**SSL → Enable SSL** untuk domain.

---

## 7. Verifikasi

```bash
# Cek status PM2
pm2 status
pm2 logs syiar-backend
pm2 logs syiar-frontend
```

Buka `https://syiar.domain.com` di browser.

---

## 8. Troubleshooting

### 8.1. Error 502 Bad Gateway

- Pastikan backend & frontend jalan: `pm2 status`
- Cek port: `ss -tlnp | grep -E '3000|3001'`
- Cek log PM2: `pm2 logs`

### 8.2. Body stream already read

Sudah diperbaiki di `frontend/lib/api.ts`. Jika masih muncul, pastikan sudah pakai kode terbaru.

### 8.3. CORS Error

Pastikan backend mengizinkan origin dari frontend. Cek di backend `.env`:

```env
CORS_ORIGIN=https://syiar.domain.com
```

Jika belum ada, tambahkan di `backend/src/main.ts`:

```typescript
app.enableCors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
});
```

### 8.4. Prisma database error

```bash
cd /home/syiar/backend
npx prisma db push
npx prisma generate
```

### 8.5. Restart semua service

```bash
pm2 restart syiar-backend syiar-frontend
pm2 save
```

---

## 9. Update Deployment

```bash
cd /home/syiar
git pull

# Backend
cd backend
npm install
npx prisma generate
npm run build
pm2 restart syiar-backend

# Frontend
cd ../frontend
npm install
npm run build
pm2 restart syiar-frontend
```

---

## 10. Referensi

- CyberPanel Docs: https://docs.cyberpanel.net
- PM2: https://pm2.keymetrics.io
- Next.js Deployment: https://nextjs.org/docs/app/building-your-application/deploying
- NestJS Production: https://docs.nestjs.com/deployment
