# Deployment Guide — Syiar Gemilang ERP

## Prerequisites

- **Node.js** v20+ (syarat NestJS v11 & Next.js v16)
- **MySQL** 8+ (atau MariaDB 10.5+)
- **nginx** (untuk reverse proxy SSL)
- **PM2** (daemon process manager — `npm i -g pm2`)
- **Git** (untuk clone)

---

## 1. Clone / Siapkan Project

```bash
# Struktur direktori tujuan:
/var/www/syiargemilang/
├── backend/       # NestJS API
├── frontend/      # Next.js app
└── DEPLOY.md
```

---

## 2. Backend (NestJS)

### 2.1 Environment

Buat file `backend/.env`:

```env
DATABASE_URL="mysql://user:password@localhost:3306/syiar_gemilang"
PORT=3001
JWT_SECRET="your-strong-jwt-secret-here"
```

### 2.2 Install & Build

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run seed       # atau: npx ts-node prisma/seed.ts
npm run build
```

### 2.3 Run via PM2

```bash
pm2 start dist/src/main.js --name syiar-api
pm2 save
```

> API running on `http://localhost:3001/api/v1`

---

## 3. Frontend (Next.js)

### 3.1 Environment

Buat file `frontend/.env.local`:

```env
# Domain production (via nginx proxy):
NEXT_PUBLIC_API_URL=https://syiargemilang.web.id/api/v1

# Development LAN (backend di port 3001 langsung):
# NEXT_PUBLIC_API_URL=http://192.168.4.55:3001/api/v1
```

> **PENTING:** Di production (akses via domain/IP non-localhost), kode otomatis pakai `/api/v1` (relative path, same-origin via nginx proxy).
> `NEXT_PUBLIC_API_URL` cuma dipakai untuk development lokal (localhost/127.0.0.1).

### 3.2 Install & Build

```bash
cd frontend
npm install
npm run build       # Next.js production build
```

### 3.3 Run via PM2

```bash
pm2 start node_modules/.bin/next --name syiar-web -- start -p 3002
pm2 save
```

> Frontend running on `http://localhost:3002`

---

## 4. nginx Reverse Proxy

Letakkan di `/etc/nginx/sites-available/syiargemilang.web.id`:

```nginx
server {
    listen 80;
    server_name syiargemilang.web.id www.syiargemilang.web.id api.syiargemilang.web.id;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name syiargemilang.web.id www.syiargemilang.web.id api.syiargemilang.web.id;

    ssl_certificate /etc/letsencrypt/live/syiargemilang.web.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/syiargemilang.web.id/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }

    location /uploads/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://127.0.0.1:3002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }
}
```

Aktifkan:

```bash
ln -s /etc/nginx/sites-available/syiargemilang.web.id /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

---

## 5. SSL Certificate (Let's Encrypt)

```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d syiargemilang.web.id -d www.syiargemilang.web.id
```

---

## 6. Database Migration & Seeding

```bash
cd backend

# Jalankan semua migration
npx prisma migrate deploy

# Seed data (roles, admin user, permissions)
npm run seed

# Admin default setelah seed:
#   Username: admin
#   Password: admin123
```

Jika ada perubahan schema:

```bash
npx prisma migrate dev --name nama_migration
```

---

## 7. PM2 Management

```bash
pm2 list                          # Lihat semua proses
pm2 logs syiar-api                # Log backend
pm2 logs syiar-web               # Log frontend
pm2 restart syiar-api             # Restart backend
pm2 restart syiar-web            # Restart frontend
pm2 startup                       # Auto-start saat reboot
pm2 save                          # Simpan proses list
```

---

## 8. Troubleshooting Login

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Login loading terus | `NEXT_PUBLIC_API_URL` salah | Cek `.env.local`, pastikan指向 backend yg benar |
| 401 Unauthorized | Password salah / user tak ada | Jalankan seed ulang: `npm run seed` |
| CORS error | Backend `app.enableCors()` tak aktif | Cek `backend/src/main.ts` |
| Connection refused | Backend/MySQL mati | `pm2 list`, `systemctl status mysql` |
| White screen | Build error | `pm2 logs` cek error, rebuild |
| Login berhasil tp redirect ke login | JWT_SECRET mismatch | Pastikan backend & frontend pake secret yg sama |

---

## 9. Arsitektur

```
User → https://syiargemilang.web.id
                ↓
              nginx (443 SSL)
              ├── /api/*    → http://127.0.0.1:3001  (NestJS)
              ├── /uploads/ → http://127.0.0.1:3001  (NestJS static)
              └── /*        → http://127.0.0.1:3002  (Next.js)
```

---

## 10. File Penting

| File | Fungsi |
|------|--------|
| `backend/.env` | DB URL, PORT, JWT_SECRET |
| `frontend/.env.local` | `NEXT_PUBLIC_API_URL` |
| `backend/src/main.ts` | Entry point, CORS, global prefix |
| `backend/src/auth/auth.service.ts` | Login logic (bcrypt compare) |
| `backend/src/auth/jwt.strategy.ts` | JWT verification |
| `backend/prisma/schema.prisma` | Database schema |
| `backend/prisma/seed.ts` | Seeder (role, admin, permissions) |
| `frontend/lib/api.ts` | API client, `getBaseUrl()` |
| `nginx config` | Reverse proxy rules |
