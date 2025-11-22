# 🚀 CARA JALANKAN APLIKASI HANMARINE

**Panduan Lengkap untuk Menjalankan dan Mengakses Aplikasi**

---

## ✅ STATUS APLIKASI

Aplikasi sudah **SIAP DIGUNAKAN** dengan semua perbaikan berikut:
- ✅ Dependencies sudah terinstall
- ✅ Environment sudah dikonfigurasi  
- ✅ TypeScript errors sudah diperbaiki
- ✅ Build berhasil tanpa error
- ✅ Aplikasi ready untuk dijalankan

---

## 🎯 CARA JALANKAN APLIKASI

### Opsi 1: Development Mode (Recommended)

```bash
# 1. Buka terminal di folder project
cd /path/to/hanmarine_shipboard_personnel_system

# 2. Jalankan development server
npm run dev

# 3. Tunggu sampai muncul:
# ✓ Ready in 2-3 seconds
# ○ Local: http://localhost:3000
```

**Akses aplikasi:** Buka browser dan ketik `http://localhost:3000`

### Opsi 2: Production Mode

```bash
# 1. Build aplikasi untuk production
npm run build

# 2. Start production server
npm start

# 3. Akses di: http://localhost:3000
```

### Opsi 3: Development dengan Network Access

Jika ingin akses dari komputer lain di jaringan yang sama:

```bash
npm run dev:lan

# Akses dari komputer lain:
# http://[IP-ADDRESS]:3000
```

---

## 🌐 AKSES APLIKASI

Setelah server jalan, buka browser dan akses:

```
http://localhost:3000
```

### 🏠 Halaman Utama

Anda akan melihat **Dashboard** dengan:
- 📊 Statistik: Total Crew, Vessels, Applications
- 🔔 Alerts: Certificate expiry warnings
- 📋 Quick Actions: Add Crew, New Application
- 📈 Recent Activities

---

## 📱 MENU UTAMA APLIKASI

### 1️⃣ **Dashboard** - `/`
   - Overview sistem
   - KPI dan statistik
   - Alerts dan notifikasi

### 2️⃣ **Crew Management** - `/crew`
   - Daftar semua crew
   - Add/Edit crew profile
   - View certificates
   - Sea service records

### 3️⃣ **Applications** - `/applications`
   - Employment applications
   - Application workflow
   - Approval process
   - Document checklist

### 4️⃣ **Vessels** - `/vessels`
   - Vessel list
   - Vessel details
   - Crew assignments

### 5️⃣ **Certificates** - `/certificates`
   - Certificate reference (60+ types)
   - Certificate tracking
   - Expiry monitoring

### 6️⃣ **Forms** - `/forms`
   - HGF-CR-01: Document Checklist
   - HGF-CR-02: Employment Application
   - 12 form templates

### 7️⃣ **Joining Instructions** - `/joining-instructions`
   - Generate joining instructions
   - Crew deployment documents

---

## 🔧 TROUBLESHOOTING

### Problem: Port 3000 sudah dipakai

```bash
# Gunakan port lain
PORT=3001 npm run dev
# Akses di: http://localhost:3001
```

### Problem: Dependencies error

```bash
# Install ulang dependencies
npm install

# Generate Prisma client
npm run prisma:generate
```

### Problem: Database connection error

Check file `.env` di root folder:
```env
DATABASE_URL="postgresql://localhost:5432/hanmarine?schema=public"
```

Pastikan PostgreSQL sudah running!

### Problem: Build error

```bash
# Clean install
rm -rf node_modules .next
npm install
npm run build
```

---

## 📸 TAMPILAN APLIKASI

### Dashboard
```
┌─────────────────────────────────────────────────┐
│  🚢 HANMARINE SHIPBOARD PERSONNEL SYSTEM       │
├─────────────────────────────────────────────────┤
│                                                  │
│  📊 OVERVIEW                                    │
│  ┌──────────┬──────────┬──────────┬──────────┐ │
│  │ 48 Crew  │ 4 Vessels│ 28 Active│ 5 Apps   │ │
│  └──────────┴──────────┴──────────┴──────────┘ │
│                                                  │
│  🔴 ALERTS                                      │
│  • 3 certificates expiring soon                 │
│  • 1 expired certificate - URGENT               │
│                                                  │
│  📋 QUICK ACTIONS                               │
│  [+ Add Crew] [+ Application] [View Certs]      │
└─────────────────────────────────────────────────┘
```

### Crew Management
```
Search: [____________]  Filter: [All Status ▼]

┌────────────────────────────────────────────────┐
│ Name          │ Rank      │ Status   │ Actions│
├────────────────────────────────────────────────┤
│ John Doe      │ Master    │ ON_BOARD │ [View] │
│ Jane Smith    │ C/O       │ AVAILABLE│ [View] │
│ Mike Wilson   │ C/E       │ ON_LEAVE │ [View] │
└────────────────────────────────────────────────┘
```

---

## 📚 DOKUMENTASI LENGKAP

Untuk panduan lebih detail, baca:

1. **[CARA_PAKAI_SISTEM.md](./CARA_PAKAI_SISTEM.md)** - Panduan penggunaan lengkap
2. **[README.md](./README.md)** - Overview sistem
3. **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - API endpoints
4. **[WORKFLOW_GUIDE.md](./WORKFLOW_GUIDE.md)** - Workflow procedures

---

## 🎯 QUICK START CHECKLIST

- [ ] Terminal di folder project
- [ ] Run `npm run dev`
- [ ] Tunggu "Ready" message
- [ ] Buka browser: `http://localhost:3000`
- [ ] Explore dashboard
- [ ] Try add new crew
- [ ] Check certificates
- [ ] View applications

---

## 💡 TIPS

1. **Bookmark URL utama:**
   - Dashboard: `http://localhost:3000`
   - Crew: `http://localhost:3000/crew`
   - Applications: `http://localhost:3000/applications`

2. **Keyboard Shortcuts:**
   - Ctrl + K: Quick search (jika available)
   - Ctrl + /: View shortcuts

3. **Development:**
   - Hot reload aktif - save file langsung update browser
   - Check console untuk errors (F12)

---

## ✅ APLIKASI SIAP DIGUNAKAN!

Semua error sudah diperbaiki. Aplikasi ready untuk:
- ✅ Crew management
- ✅ Certificate tracking
- ✅ Application processing
- ✅ Document generation
- ✅ Workflow automation

**Selamat menggunakan HanMarine Shipboard Personnel System! 🚢**

---

*Last updated: 2025-11-22*
*Build status: ✅ SUCCESS*
