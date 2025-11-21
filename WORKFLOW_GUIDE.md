# 🚢 HANMARINE CREW MANAGEMENT SYSTEM - WORKFLOW GUIDE

## 📋 DAFTAR ISI

### OVERVIEW
- [Pengenalan Sistem](#pengenalan-sistem)
- [Alur Lengkap Crew Management](#alur-lengkap-crew-management)

### MAIN MODULES
1. [📥 RECRUITMENT & ONBOARDING](#1-recruitment--onboarding)
2. [👥 CREW OPERATIONS](#2-crew-operations)
3. [🚢 VESSEL MANAGEMENT](#3-vessel-management)
4. [📜 REFERENCE & TOOLS](#4-reference--tools)
5. [📊 MONITORING & REPORTS](#5-monitoring--reports)

### WORKFLOWS
- [Workflow: New Crew Recruitment](#workflow-new-crew-recruitment)
- [Workflow: Certificate Renewal](#workflow-certificate-renewal)
- [Workflow: Contract Rotation](#workflow-contract-rotation)
- [Workflow: Crew Sign-Off](#workflow-crew-sign-off)

---

## 🎯 PENGENALAN SISTEM

Hanmarine Crew Management System mengatur **SELURUH LIFECYCLE CREW** dari awal recruitment sampai akhir kontrak:

```
RECRUITMENT → DATA COLLECTION → DOCUMENTATION → CV GENERATION → 
OWNER APPROVAL → ONBOARDING → DEPLOYMENT → MONITORING → 
ROTATION → OFF-BOARDING
```

### Quick Links:
- **Dashboard**: `http://localhost:3000/dashboard`
- **Login**: Username `director` / Password `hanmarine123`

---

## 🔄 ALUR LENGKAP CREW MANAGEMENT

### 10 TAHAP UTAMA:

```
1️⃣  RECRUITMENT      → Cari dan select crew
2️⃣  DATA COLLECTION  → Kumpul dokumen dan sertifikat
3️⃣  DOCUMENTATION    → Scan dan input data
4️⃣  CV GENERATION    → Buat CV sesuai flag
5️⃣  OWNER APPROVAL   → Submit ke owner kapal
6️⃣  ONBOARDING       → Lengkapi checklist dan kontrak
7️⃣  DEPLOYMENT       → Crew onboard ke kapal
8️⃣  MONITORING       → Track sertifikat dan kontrak
9️⃣  ROTATION         → Planning replacement crew
🔟  OFF-BOARDING     → Sign-off dan repatriation
```

---

## 1️⃣ RECRUITMENT & ONBOARDING

---

## 1. Monitoring Kontrak & Rotasi Crew

### Dashboard Overview
Buka **Dashboard** untuk lihat overview sistem:
```
http://localhost:3001/dashboard
```

### Fitur Monitoring:
- **StatCards** (bagian atas):
  - 👥 **TOTAL CREW** - Total crew di database
  - ⚠️ **CERTIFICATES EXPIRING** - Sertifikat akan expire ≤30 hari
  - ❌ **CERTIFICATES EXPIRED** - Sertifikat sudah expired
  - 📅 **7+ MONTH CONTRACTS** - Crew onboard ≥7 bulan (warning)
  - 🧳 **JOINING PENDING** - Aplikasi APPROVED tapi belum siap join
  - ✅ **APPROVED (TOTAL)** - Total aplikasi yang sudah disetujui

- **Critical Alerts**:
  - Badge merah: Expired certificates, 8+ month contracts
  - Badge kuning: Expiring certificates (30 hari), 7+ month contracts
  - Badge biru: Joining pending (checklist belum lengkap)

- **Rotation Alerts (≥7 months onboard)**:
  - List crew yang sudah onboard ≥7 bulan
  - Menampilkan: Nama, Rank, Vessel, Sign-on date, Months onboard
  - Badge severity:
    - **WARNING** (kuning): 7-8 bulan
    - **CRITICAL** (merah): >8 bulan
  - Aksi cepat:
    - **Propose Replacement**: Buat aplikasi pengganti
    - **View Crew**: Lihat detail crew

### Flow Monitoring:
```
Dashboard → Rotation Alerts → Identify crew mendekati habis kontrak
         → Check months onboard
         → Decide: Perpanjang atau cari pengganti
```

---

## 2. Propose Replacement (Ajukan Pengganti)

### Alur Lengkap:

#### Step 1: Dari Rotation Alert
1. Buka **Dashboard** → scroll ke **Rotation Alerts**
2. Lihat crew yang mendekati habis kontrak (7m+ atau 8m+)
3. Klik tombol **"Propose Replacement"**

#### Step 2: Find Candidate (Auto-Filter)
Sistem otomatis redirect ke `/applications/new` dengan prefill:
- **Rank**: Sama dengan crew yang akan diganti
- **Notes**: "Replacement for [Nama Crew] ([Vessel Name])"

**Panel "Find Candidate"** akan muncul dengan fitur:
- ✅ Filter otomatis crew AVAILABLE dengan rank yang sama
- 🔍 Search by nama
- 📊 Sorting options:
  - **Sort: Docs Quality** (default) - Prioritas kandidat dengan dokumen lengkap
  - **Sort: A-Z** - Urutan alfabetis
- 📋 Badge kualitas dokumen per kandidat:
  - ✅ **docs ok** (hijau): Semua sertifikat valid >30 hari
  - ⚠️ **expiring** (kuning): Ada sertifikat ≤30 hari
  - ❌ **expired** (merah): Ada sertifikat expired
  - (Kosong): Tidak ada data sertifikat

#### Step 3: Pilih Kandidat
1. Cari kandidat di panel **Find Candidate**
2. Klik tombol **"Pilih"** pada kandidat terbaik
3. Form aplikasi otomatis terisi:
   - Crew: [Kandidat terpilih]
   - Rank yang dilamar: [Sesuai kebutuhan]
   - Catatan: [Auto-filled dengan context replacement]
4. Edit jika perlu, lalu klik **"Buat aplikasi"**

### Flow Diagram:
```
Dashboard Rotation Alert
    ↓
Propose Replacement (klik)
    ↓
Find Candidate Panel
  - Filter: AVAILABLE + Rank sama
  - Search by nama
  - Sort by docs quality
  - Badge: docs ok / expiring / expired
    ↓
Pilih Kandidat
    ↓
Submit Application
    ↓
Status: APPLIED
```

---

## 3. Review & Approval Aplikasi

### Halaman Applications
```
http://localhost:3001/applications
```

### Fitur Review:

#### Filter & Search:
- **Toggle "Joining Pending only"**: Tampilkan hanya aplikasi APPROVED/ACCEPTED dengan checklist belum lengkap
- **Dropdown Status Filter**:
  - All / Applied / Shortlisted / Interview / Approved / Offered / Accepted / Rejected
- **Badge "Pending"** (biru): Inline di status, menandakan checklist belum lengkap

#### Aksi per Aplikasi:
- **Approve**: Set status → APPROVED (owner menyetujui)
- **Reject**: Set status → REJECTED (owner menolak)
- **Prepare Joining**: Buat checklist & joining instruction (hanya muncul setelah APPROVED/ACCEPTED)
- **Open Checklist**: Buka halaman checklist untuk centang medical/training

### Flow Approval:
```
Applications List
    ↓
Filter: Show only APPLIED / SHORTLISTED
    ↓
Review kandidat (lihat rank, notes, crew profile)
    ↓
Klik "Approve" atau "Reject"
    ↓
Status → APPROVED
    ↓
Badge "Pending" muncul (checklist belum ada)
```

### Link dari Dashboard:
Klik **"Review"** di badge "JOINING PENDING" → otomatis filter aplikasi yang pending

---

## 4. Prepare Joining (Siapkan Dokumen)

### Setelah Aplikasi APPROVED:

#### Step 1: Prepare Joining (System)
1. Di halaman **Applications**, klik tombol **"Prepare Joining"**
2. System otomatis membuat:
   - **DocumentChecklist**: Entry untuk centang medical & training
   - **JoiningInstruction**: Template instruksi joining

#### Step 2: Open Checklist (Manual Follow-up)
```
http://localhost:3001/applications/[ID]/joining
```

**Fitur Checklist:**
- ✅ Checkbox **Medical Check-up selesai**
- ✅ Checkbox **Training for join selesai**
- 📝 **Catatan**: Field text untuk detail (mis. "MCU tanggal 20/11, BST refresh selesai")
- Tombol **Simpan Checklist** dan **Refresh**

#### Workflow Checklist:
1. Koordinasi dengan kandidat untuk medical check-up
2. Jadwalkan training yang diperlukan (BST, SCRB, dll)
3. Setelah selesai, buka halaman Checklist
4. Centang **Medical Check-up selesai** ✅
5. Centang **Training for join selesai** ✅
6. Isi catatan detail (opsional)
7. Klik **Simpan Checklist**

### Status Tracking:
- **Sebelum checklist lengkap**: Badge "Pending" muncul di Applications list
- **Setelah checklist lengkap**: Badge "Pending" hilang
- Dashboard StatCard **JOINING PENDING** akan berkurang

### Flow Diagram:
```
Application APPROVED
    ↓
Prepare Joining (klik)
  → System buat DocumentChecklist + JoiningInstruction
    ↓
Open Checklist (klik)
    ↓
Centang Medical ✅
Centang Training ✅
Isi Catatan
    ↓
Simpan Checklist
    ↓
Badge "Pending" hilang
Kandidat siap join kapal
```

---

## 5. Manage Crew Data

### Crew List
```
http://localhost:3001/crew
```

### Fitur:
- **Search**: Cari by nama, rank, atau vessel
- **Filter Status**: All Status / Active / Onboard / Standby / Available / On Leave / Inactive
- **Clickable Rows**: Klik nama crew → detail page
- **Status Badges** (color-coded):
  - 🟢 ACTIVE / ONBOARD
  - 🔵 STANDBY / AVAILABLE
  - 🟡 ON_LEAVE
  - ⚪ INACTIVE

### Add New Crew:
Panel kiri halaman `/crew`:
1. Isi **Nama lengkap** (required)
2. Isi **Rank / jabatan** (required)
3. Isi **Vessel** (opsional)
4. Pilih **Status** (AVAILABLE / ONBOARD / ON LEAVE)
5. Klik **Simpan crew**

### Crew Detail Page:
```
http://localhost:3001/crew/[ID]
```
Akses fitur:
- Edit crew data
- Document checklist
- Joining instruction
- Evaluation
- Repatriation
- Sea service

---

## 6. Import Data Excel

### Import Vessel Data
```
http://localhost:3001/import
```

#### Step 1: Pilih Tipe Import
- **Import Vessels**: Data kapal dari sheet FLAG
- **Import Crew List**: Data crew dari sheet crew list

#### Step 2: Upload File Excel
1. Klik radio button **"Import Vessels"** atau **"Import Crew List"**
2. Klik **"Choose File"** dan pilih file Excel
3. Klik **"Upload and Import"**

#### Step 3: Review Result
System akan tampilkan:
- **Imported**: Jumlah record berhasil import
- **Skipped**: Jumlah record di-skip (duplikat atau error)
- **Total Processed**: Total baris yang diproses

### Format Excel yang Didukung:

#### Vessel (Sheet: FLAG)
Kolom yang diparse:
- NAME OF VESSSEL
- FLAG
- DESKRIPSI (vessel type)
- OWNER

#### Crew List
Kolom yang dicari (case-insensitive):
- NAME / SEAMAN NAME / Crew Name
- RANK / POSITION
- Vessel (opsional)

### Cek Import Status:
Klik link **"Check import status"** → `/api/debug/import-status`
Lihat:
- Total crew
- Total vessels
- Recent crew records
- Recent vessel records

---

## 7. Certificate Management

### View Certificates
Per crew: `/crew/[ID]` → Certificate section (future feature)

### Add Certificate (API):
```bash
POST /api/certificates
{
  "crewId": 1,
  "type": "BST",
  "issueDate": "2024-01-15",
  "expiryDate": "2029-01-15",
  "issuer": "STCW Training Center",
  "remarks": "Renewal"
}
```

### Certificate Monitoring:
Dashboard otomatis monitor:
- **Expired**: expiryDate < today
- **Expiring**: expiryDate ≤ 30 hari
- **Warning**: expiryDate ≤ 90 hari
- **OK**: expiryDate > 90 hari

### Certificate Timeline (Dashboard):
Bagian "Certificate Timeline (Next 30 Days)" menampilkan:
- Crew name
- Certificate type
- Expiry date
- Sorted by nearest expiry

---

## 📊 Complete Workflow: End-to-End

### Scenario: Crew Rotation Process

```
1. MONITORING
   Dashboard → Rotation Alerts
   ↓ Lihat: John Doe (MT Tanker Alpha) - 8 months onboard
   
2. PROPOSE REPLACEMENT
   Klik "Propose Replacement"
   ↓ System prefill: Rank = Chief Officer
   ↓ Find Candidate: Filter AVAILABLE + Rank CO
   ↓ Search: "Jane" → Lihat Jane Smith (docs ok ✅)
   ↓ Klik "Pilih" → Submit Application
   
3. REVIEW & APPROVAL
   Applications → Filter: APPLIED
   ↓ Review: Jane Smith - CO - "Replacement for John Doe"
   ↓ Klik "Approve"
   ↓ Status: APPROVED ✅
   ↓ Badge "Pending" muncul (checklist belum ada)
   
4. PREPARE JOINING
   Klik "Prepare Joining"
   ↓ System buat DocumentChecklist + JoiningInstruction
   ↓ Klik "Open Checklist"
   
5. FOLLOW-UP DOKUMEN
   /applications/[ID]/joining
   ↓ Koordinasi medical checkup Jane (selesai 20/11)
   ↓ Jadwalkan BST refresh (selesai 22/11)
   ↓ Centang "Medical ✅" + "Training ✅"
   ↓ Isi catatan: "MCU 20/11 OK, BST 22/11 OK, tunggu visa"
   ↓ Klik "Simpan Checklist"
   
6. MONITOR PROGRESS
   Dashboard → JOINING PENDING: 0
   ↓ Applications → Badge "Pending" hilang
   ↓ Jane Smith siap join MT Tanker Alpha
   ↓ John Doe bisa repatriasi sesuai jadwal
```

---

## 🔧 Tips & Best Practices

### Daily Operations:
1. **Pagi**: Cek Dashboard untuk alerts (certificates, contracts)
2. **Review Applications**: Filter "APPLIED" → Approve/Reject
3. **Follow-up Joining**: Klik "Review" di JOINING PENDING badge
4. **Update Checklist**: Centang medical/training begitu selesai

### Contract Monitoring:
- Review crew **≥7 months**: Mulai cari pengganti
- Review crew **≥8 months**: Prioritas tinggi (critical)
- Gunakan "Propose Replacement" untuk workflow cepat

### Candidate Selection:
- Prioritas kandidat dengan badge **✅ docs ok**
- Hindari kandidat dengan badge **❌ expired** (kecuali urgent)
- Kandidat dengan **⚠️ expiring** masih OK (perpanjang paralel)

### Checklist Management:
- Update checklist segera setelah medical/training selesai
- Gunakan field "Catatan" untuk detail (tanggal, hasil, pending items)
- Review JOINING PENDING badge setiap hari

---

## 🚀 Quick Links

- **Dashboard**: `http://localhost:3001/dashboard`
- **Crew List**: `http://localhost:3001/crew`
- **Applications**: `http://localhost:3001/applications`
- **New Application**: `http://localhost:3001/applications/new`
- **Import Data**: `http://localhost:3001/import`
- **API Debug**: `http://localhost:3001/api/debug/import-status`

---

## 📞 Support

Untuk pertanyaan atau issue, hubungi:
- **Developer**: PT Hanmarine Services IT Team
- **System**: Hanmarine Shipboard Personnel System v1.0
- **Tech Stack**: Next.js 14, PostgreSQL, Prisma ORM

---

**Last Updated**: November 16, 2025
