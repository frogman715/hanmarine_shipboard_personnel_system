# 🚀 CARA PAKAI SISTEM HANMARINE - PANDUAN PRAKTIS

**Panduan lengkap dari nol sampai bisa pakai sistem untuk daily operations**

---

## 📋 DAFTAR ISI

1. [Akses Sistem](#1-akses-sistem)
2. [Dashboard - Tampilan Utama](#2-dashboard---tampilan-utama)
3. [Manajemen Crew](#3-manajemen-crew)
4. [Proses Rekrutmen](#4-proses-rekrutmen)
5. [Certificate Management](#5-certificate-management)
6. [Crew Assignment & Rotation](#6-crew-assignment--rotation)
7. [Generate Joining Instruction](#7-generate-joining-instruction)
8. [Daily Operations](#8-daily-operations)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. AKSES SISTEM

### Buka Browser & Login

```
URL: http://localhost:3000
```

**Kalau sistem belum jalan:**

```powershell
# Buka terminal PowerShell di folder project
cd c:\Users\askal\Desktop\hanmarine_apps\hanmarine_shipboard_personnel_system

# Jalankan development server
npm run dev
```

**Tunggu sampai muncul:**
```
✓ Ready in 2.5s
○ Local: http://localhost:3000
```

**Buka browser → ketik:** `http://localhost:3000`

---

## 2. DASHBOARD - TAMPILAN UTAMA

### Yang Lo Lihat di Dashboard:

```
┌─────────────────────────────────────────────────────┐
│  📊 HANMARINE DASHBOARD                             │
├─────────────────────────────────────────────────────┤
│                                                      │
│  📈 STATISTICS                                       │
│  ┌──────────┬──────────┬──────────┬──────────┐    │
│  │ 48 Crew  │ 4 Vessels│ 28 Active│ 5 Apps   │    │
│  └──────────┴──────────┴──────────┴──────────┘    │
│                                                      │
│  🔴 ALERTS                                          │
│  • 3 certificates expiring in 30 days               │
│  • 1 expired certificate - URGENT                   │
│  • 2 crew available for rotation                    │
│                                                      │
│  📋 QUICK ACTIONS                                   │
│  [+ Add New Crew]  [+ New Application]              │
│  [View Certificates] [Crew Changes]                 │
│                                                      │
│  📊 RECENT ACTIVITIES                               │
│  • John Doe signed on MV Pacific Star               │
│  • New application from Michael Smith               │
│  • Certificate updated for Jane Wilson              │
└─────────────────────────────────────────────────────┘
```

---

## 3. MANAJEMEN CREW

### 3.1 Lihat Daftar Crew

**Klik:** `Crew Management` di menu atas

**Atau ketik:** `http://localhost:3000/crew`

**Yang Lo Lihat:**

| Name | Rank | Status | Vessel | Certificates | Actions |
|------|------|--------|--------|--------------|---------|
| John Doe | Master | ON_BOARD | MV Pacific Star | 8/10 ✅ 2🟠 | View/Edit |
| Jane Smith | Chief Officer | AVAILABLE | - | 10/10 ✅ | View/Edit |
| Mike Wilson | Chief Engineer | ON_LEAVE | - | 9/10 ✅ 1🔴 | View/Edit |

**Fitur:**
- 🔍 **Search bar** - cari nama atau rank
- 🎯 **Filter by status** - Active, Available, On Board, On Leave
- 📊 **Sort** - by name, rank, atau status

---

### 3.2 Tambah Crew Baru

**Step-by-step:**

1. **Klik tombol** `+ Add New Crew`

2. **Isi form Basic Info:**
   ```
   ✏️ Full Name: John Doe
   ✏️ Date of Birth: 15/05/1985 (format: DD/MM/YYYY)
   ✏️ Nationality: Indonesia
   ✏️ Passport Number: A1234567
   ✏️ Seaman Book Number: SB123456
   ```

3. **Contact Information:**
   ```
   ✏️ Email: john.doe@email.com
   ✏️ Phone: +62812345678
   ✏️ Address: Jl. Pelaut No. 123, Jakarta
   ```

4. **Position & Experience:**
   ```
   ✏️ Rank/Position: Master (pilih dari dropdown)
   ✏️ Years of Experience: 15
   ✏️ Previous Vessel: MV Ocean Star
   ```

5. **Klik:** `Save Crew`

**✅ Berhasil!** Crew baru masuk ke database dengan status `AVAILABLE`

---

### 3.3 Edit Crew Data

1. **Di list crew**, klik tombol **[View]** atau **[Edit]**

2. **Lo akan masuk ke halaman detail crew:**
   ```
   http://localhost:3000/crew/123
   ```

3. **Lo bisa:**
   - Edit basic information
   - Update contact details
   - Change status
   - View certificates
   - View sea service history
   - View assignments

4. **Klik** `Update` untuk simpan perubahan

---

## 4. PROSES REKRUTMEN

### 4.1 New Application (Aplikasi Baru)

**Scenario:** Ada calon pelaut baru yang apply

**Step 1: Create Application**

1. Klik: `Applications` → `+ New Application`
   ```
   URL: http://localhost:3000/applications/new
   ```

2. **Pilih Crew:**
   - Kalau crew **sudah ada** di database → pilih dari dropdown
   - Kalau crew **belum ada** → klik `+ Add New Crew` dulu

3. **Applied Rank/Position:**
   ```
   ✏️ Applied Rank: Master, Chief Officer, dll
   ```

4. **Notes (opsional):**
   ```
   ✏️ Special requirements atau catatan tambahan
   ```

5. **Klik:** `Submit Application`

**✅ Status:** `PENDING_INTERVIEW`

---

**Step 2: Document Verification**

1. **Buka application:**
   ```
   Applications → View → Detail Application
   ```

2. **Upload/Check certificates:**
   - Certificate of Competency (COC)
   - STCW certificates
   - Medical certificate (PEME)
   - Passport & Seaman Book
   - Training certificates

3. **Verifikasi di SEACOM** (Departemen Perhubungan Laut):
   - Physical check ✅
   - Online verification ✅
   - Barcode check ✅

4. **Update status:** `DOCUMENT_CHECK` → `VERIFIED`

---

**Step 3: Assessment**

1. **Create assessment record**
2. **Input scores:**
   ```
   Technical Knowledge: 85/100
   English Proficiency: 80/100
   Safety Awareness: 90/100
   Interview: 88/100
   ──────────────────────
   Average: 85.75/100 ✅ (Passing: 75)
   ```

3. **Update status:** `ASSESSMENT` → `PASSED`

---

**Step 4: Medical Examination**

1. **Schedule PEME** (Pre-Employment Medical Examination)
2. **Upload medical certificate**
3. **Verify:**
   - Valid max 2 years ✅
   - All fitness criteria met ✅
   - Color vision (if applicable) ✅

4. **Update status:** `MEDICAL_CHECK` → `FIT`

---

**Step 5: Final Approval**

1. **Operations Manager review** → Approve
2. **QMR final approval** → Approve

3. **Update status:** `APPROVED` ✅

---

**Step 6: Contract & Documentation**

1. **Generate employment contract**
2. **Next of Kin form** (HGF-AC-02)
3. **Allotment form** (HGF-AC-03)
4. **Declaration form** (HGF-AC-04)

5. **Update status:** `DOCUMENTATION` → `COMPLETED`

---

**Step 7: Training**

1. **Schedule in-house training**
2. **Record training completion**

3. **Update status:** `TRAINING` → `COMPLETED`

---

**Step 8: Ready to Join**

1. **Assign to vessel**
2. **Generate Joining Instruction** (lihat section 7)

3. **Status final:** `READY_TO_JOIN` → `ON_BOARD`

---

### 4.2 Track Application Status

**Dashboard Applications:**

```
Applications List:
┌─────────────────────────────────────────────────────┐
│ John Doe - Master                    APPROVED ✅     │
│ Applied: Nov 15, 2025                               │
│ Progress: ████████████████████░░ 90%               │
│ Next: Generate Joining Instruction                  │
├─────────────────────────────────────────────────────┤
│ Jane Smith - Chief Officer       MEDICAL_CHECK 🟡   │
│ Applied: Nov 18, 2025                               │
│ Progress: ████████░░░░░░░░░░░░ 40%                │
│ Next: Upload medical certificate                    │
├─────────────────────────────────────────────────────┤
│ Mike Wilson - Chief Engineer    PENDING_INTERVIEW 🔵│
│ Applied: Nov 19, 2025                               │
│ Progress: ████░░░░░░░░░░░░░░░░ 20%                │
│ Next: Schedule interview                            │
└─────────────────────────────────────────────────────┘
```

---

## 5. CERTIFICATE MANAGEMENT

### 5.1 View All Certificates

**Klik:** `Certificates` di menu

**URL:** `http://localhost:3000/certificates`

**Yang Lo Lihat:**

| Crew Name | Certificate Type | Number | Issue Date | Expiry Date | Status |
|-----------|------------------|--------|------------|-------------|--------|
| John Doe | COC - Master | 123456 | 01/01/2023 | 01/01/2028 | ✅ Valid (37 months) |
| John Doe | STCW Basic Safety | BS789 | 15/03/2022 | 15/03/2027 | 🟠 Expiring (16 months) |
| Jane Smith | Medical (PEME) | M456 | 01/11/2024 | 01/11/2026 | ✅ Valid (12 months) |
| Mike Wilson | COC - Chief Eng | 789123 | 10/05/2020 | 10/05/2025 | 🔴 EXPIRED! |

**Color Coding:**
- 🟢 **Green/✅** - Valid (>30 days)
- 🟠 **Orange** - Expiring (≤30 days)
- 🔴 **Red** - Expired or ≤15 months before joining

---

### 5.2 Add New Certificate

**Step-by-step:**

1. **Buka crew profile:**
   ```
   Crew → John Doe → Certificates tab
   ```

2. **Klik:** `+ Add Certificate`

3. **Isi form:**
   ```
   ✏️ Certificate Type: COC - Master (dropdown)
   ✏️ Certificate Number: 123456
   ✏️ Issue Date: 01/01/2023
   ✏️ Expiry Date: 01/01/2028
   ✏️ Issuing Authority: Directorate General of Sea Transportation
   ✏️ Issuing Country: Indonesia
   ✏️ File Upload: [Browse] (opsional - upload PDF/image)
   ```

4. **Klik:** `Save Certificate`

**✅ Certificate saved!** Sistem otomatis hitung:
- Days until expiry
- Alert status
- Compliance status

---

### 5.3 Certificate Alerts

**Sistem otomatis kasih alert:**

**Dashboard Alerts:**
```
🔴 URGENT (Expired):
• Mike Wilson - COC expired 6 months ago - CANNOT JOIN VESSEL

🟠 CRITICAL (≤30 days):
• John Doe - STCW Basic Safety expires in 28 days
• Jane Smith - Medical expires in 15 days

🟡 WARNING (≤15 months):
• Sarah Lee - COC expires in 14 months (renew before next joining)
```

**Action Required:**
1. Contact crew
2. Schedule renewal
3. Update certificate after renewal

---

### 5.4 Certificate Renewal Process

**When certificate hampir expired:**

1. **System alert** 15 months before expiry (untuk joining)
2. **Notify crew** via email/phone
3. **Schedule renewal** with competent authority
4. **Crew renew certificate**
5. **Upload new certificate** ke sistem
6. **Update expiry date**
7. **Alert cleared** ✅

---

## 6. CREW ASSIGNMENT & ROTATION

### 6.1 Assign Crew to Vessel

**Scenario:** Lo mau assign crew ke kapal

**Step 1: Check Vessel Manning**

1. **Klik:** `Vessels` → Select vessel
   ```
   URL: http://localhost:3000/vessels/1
   ```

2. **Lihat current manning:**
   ```
   MV PACIFIC STAR
   ════════════════════════════════════════
   Position         | Current Crew    | Status
   ─────────────────┼─────────────────┼────────
   Master           | John Doe        | ✅ On Board
   Chief Officer    | Jane Smith      | ✅ On Board
   Chief Engineer   | [VACANT]        | 🔴 Need Crew
   2nd Engineer     | Mike Wilson     | ✅ On Board
   ════════════════════════════════════════
   Manning: 3/4 (75%) - UNDERMANNED ⚠️
   ```

---

**Step 2: Find Available Crew**

1. **Klik:** `Crew Management` → Filter by `AVAILABLE`

2. **Check qualifications:**
   ```
   Available Chief Engineers:
   • Robert Brown
     - COC: Valid (24 months)
     - Medical: Valid (8 months)
     - STCW: All valid
     - Last vessel: MV Ocean Star
     - Available since: Nov 1, 2025
     ✅ QUALIFIED
   ```

---

**Step 3: Create Assignment**

1. **Klik:** `+ New Assignment`

2. **Fill form:**
   ```
   ✏️ Crew: Robert Brown (dropdown)
   ✏️ Vessel: MV PACIFIC STAR (dropdown)
   ✏️ Position: Chief Engineer (dropdown)
   ✏️ Join Date: 2025-12-01
   ✏️ Contract Duration: 6 months
   ✏️ Expected Sign-off: 2026-06-01
   ✏️ Notes: Relief for maintenance period
   ```

3. **System auto-check:**
   ```
   ✅ All certificates valid (>15 months)
   ✅ Position matches qualification (COC - Chief Engineer)
   ✅ Medical fit
   ✅ No conflicting assignments
   ✅ Ready to join
   ```

4. **Klik:** `Create Assignment`

**✅ Assignment created!**
- Crew status → `READY_TO_JOIN`
- Vessel manning updated
- Joining instruction ready to generate

---

### 6.2 Crew Rotation Planning

**Dashboard menampilkan:**

```
📅 UPCOMING ROTATIONS (Next 60 Days)
════════════════════════════════════════════════════════
Vessel: MV PACIFIC STAR
┌────────────────┬──────────────┬─────────────┬──────────┐
│ Crew           │ Position     │ Sign-off    │ Status   │
├────────────────┼──────────────┼─────────────┼──────────┤
│ John Doe       │ Master       │ Dec 15,2025 │ 🟠 26d   │
│ Jane Smith     │ Chief Off    │ Jan 10,2026 │ 🟢 52d   │
│ Robert Brown   │ Chief Eng    │ Jun 1, 2026 │ 🟢 194d  │
└────────────────┴──────────────┴─────────────┴──────────┘

ACTION NEEDED:
• Find replacement for John Doe (Master) - Sign-off in 26 days
• Prepare rotation for Jane Smith
```

**Step untuk rotation:**

1. **Identify crew yang akan sign-off**
2. **Search available replacement**
3. **Check certificates & medical**
4. **Create new assignment** (overlap 1-2 hari untuk handover)
5. **Generate joining instruction** for new crew
6. **Update sign-off** untuk crew lama

---

## 7. GENERATE JOINING INSTRUCTION

### 7.1 Cara Generate Joining Instruction

**Joining Instruction = Surat instruksi untuk crew join kapal**

**Step 1: Go to Joining Instruction Page**

```
URL: http://localhost:3000/joining-instructions
```

**Step 2: Klik** `+ Generate New`

**Step 3: Select Data**

```
┌─────────────────────────────────────────────┐
│  GENERATE JOINING INSTRUCTION               │
├─────────────────────────────────────────────┤
│                                              │
│  ✏️ Select Crew:                            │
│  [Dropdown: Robert Brown - Chief Engineer]  │
│                                              │
│  ✏️ Select Vessel:                          │
│  [Dropdown: MV PACIFIC STAR]                │
│                                              │
│  ✏️ Select Assignment:                      │
│  [Auto-filled based on crew & vessel]       │
│                                              │
│  📅 Join Date: 2025-12-01                   │
│  📍 Join Port: Singapore                    │
│  🏢 Agent: PSA Singapore                    │
│                                              │
│  [Generate PDF] [Generate HTML Preview]     │
└─────────────────────────────────────────────┘
```

**Step 4: Preview or Generate PDF**

**Klik:** `Generate HTML Preview` untuk lihat dulu

**Content yang di-generate otomatis:**

```
═══════════════════════════════════════════════
       JOINING INSTRUCTION
═══════════════════════════════════════════════

Date: November 19, 2025
Reference: JI-2025-001

TO: ROBERT BROWN
    Chief Engineer

VESSEL: MV PACIFIC STAR
────────────────────────────────────────────────

JOINING DETAILS:
• Port of Joining: Singapore
• Expected Date: December 1, 2025
• Agent: PSA Singapore

TRAVEL ARRANGEMENTS:
• Flight: [To be arranged]
• Visa: [Check requirements]

DOCUMENTS TO BRING:
✅ Valid Passport
✅ Seaman Book
✅ COC - Chief Engineer (Valid until: Jan 2028)
✅ STCW Certificates
✅ Medical Certificate (Valid until: Aug 2026)
✅ Yellow Fever Certificate (if applicable)

CONTACT INFORMATION:
• Master: Capt. John Doe (+1234567890)
• Company: PT Hann Global Indonesia
• 24/7 Emergency: +62-812-1270-3647

IMPORTANT NOTES:
• Report 24 hours before joining
• Bring all original certificates
• Check COVID-19 requirements

═══════════════════════════════════════════════
Prepared by: PT Hann Global Indonesia
Date: November 19, 2025
═══════════════════════════════════════════════
```

**Step 5: Download PDF**

**Klik:** `Generate PDF` → File auto-download

**File name:** `JI-ROBERT-BROWN-MV-PACIFIC-STAR-2025-12-01.pdf`

---

### 7.2 Send to Crew

**Cara kirim ke crew:**

1. **Download PDF** dari sistem
2. **Email ke crew** dengan attachment
3. **CC to:**
   - Vessel Master
   - Operations Manager
   - Agent at joining port

**Email template:**

```
Subject: Joining Instruction - MV PACIFIC STAR - Dec 1, 2025

Dear Mr. Robert Brown,

Please find attached your Joining Instruction for MV PACIFIC STAR.

Join Date: December 1, 2025
Join Port: Singapore

Please review all details and confirm receipt.

Contact our office for any questions:
Phone: +62-812-1270-3647
Email: operations@hanmarine.com

Best regards,
PT Hann Global Indonesia
Operations Department
```

---

## 8. DAILY OPERATIONS

### 8.1 Morning Routine (Daily Tasks)

**9:00 AM - Check Dashboard:**

```
✓ Review alerts
✓ Check certificates expiring today/this week
✓ Review new applications
✓ Check crew availability
```

**Action items:**
- 🔴 **Red alerts** → Immediate action
- 🟠 **Orange alerts** → Schedule within 48 hours
- 🟡 **Yellow alerts** → Plan for next week

---

### 8.2 Certificate Monitoring

**Weekly Task (Every Monday):**

1. **Run certificate report:**
   ```
   Certificates → Filter: Expiring in 60 days
   ```

2. **Create renewal list:**
   ```
   Crew          Certificate      Expiry      Action
   ─────────────────────────────────────────────────
   John Doe      STCW Basic      Dec 15      Schedule renewal
   Jane Smith    Medical         Jan 10      Book PEME
   ```

3. **Contact crews** → Schedule renewals

4. **Follow up** weekly until renewed

---

### 8.3 Recruitment Tracking

**Track all active applications:**

```
Applications → View All → Filter: In Progress

Status Report:
• PENDING_INTERVIEW: 2 applications
• DOCUMENT_CHECK: 3 applications  
• ASSESSMENT: 1 application
• MEDICAL_CHECK: 2 applications
• APPROVED: 1 application (waiting for vessel)
```

**Weekly meeting:**
- Review progress with team
- Identify bottlenecks
- Set targets for next week

---

### 8.4 Monthly Tasks

**First week of month:**

1. **Generate reports:**
   - Total crew count
   - New recruits
   - Certificates renewed
   - Crew rotations completed

2. **Review compliance:**
   - Certificate compliance rate
   - Medical fitness rate
   - Training completion rate

3. **Plan rotations:**
   - Next 90 days crew changes
   - Available crew pool
   - Training needs

---

## 9. TROUBLESHOOTING

### 9.1 Sistem Tidak Bisa Diakses

**Problem:** Browser tidak bisa buka `http://localhost:3000`

**Solution:**

```powershell
# Check apakah server running
Get-Process -Name node

# Kalau tidak ada, start server:
cd c:\Users\askal\Desktop\hanmarine_apps\hanmarine_shipboard_personnel_system
npm run dev

# Tunggu sampai muncul: "Ready in X.Xs"
```

---

### 9.2 Database Error

**Problem:** Error "Cannot connect to database"

**Solution:**

```powershell
# Check PostgreSQL running
Get-Service -Name postgresql*

# Kalau stopped, start service:
Start-Service postgresql-x64-14  # sesuaikan dengan version

# Atau restart:
Restart-Service postgresql-x64-14
```

---

### 9.3 Data Tidak Muncul

**Problem:** Dashboard kosong atau crew list kosong

**Solution:**

```powershell
# Run seed data (isi database dengan sample data)
cd c:\Users\askal\Desktop\hanmarine_apps\hanmarine_shipboard_personnel_system

# Reset database & seed
npx prisma migrate reset --force
npx prisma db seed

# Restart server
npm run dev
```

---

### 9.4 Form Tidak Bisa Submit

**Problem:** Error saat submit form

**Check:**

1. **Field validation:**
   - Semua required fields terisi?
   - Format tanggal benar? (DD/MM/YYYY)
   - Email format valid?
   - Phone number valid?

2. **Browser console:**
   - Buka Developer Tools (F12)
   - Check tab "Console" untuk error messages
   - Screenshot error dan contact support

---

### 9.5 Certificate Alert Tidak Akurat

**Problem:** System kasih alert tapi certificate masih valid

**Solution:**

1. **Check tanggal expiry** di database
2. **Update certificate:**
   ```
   Crew → Certificates → Edit certificate
   → Update expiry date → Save
   ```
3. **Refresh dashboard** (F5)

---

## 📞 BUTUH BANTUAN?

### Contact Support:

**Technical Issues:**
- Email: dev@hanmarine.com
- Phone: +62-813-8225-5995 (Operations Staff)

**System Training:**
- QMR: qmr@hanmarine.com
- Phone: +62-812-1270-3647

**Emergency (24/7):**
- Director: +62-812-1270-3647

---

## 📚 DOKUMENTASI LENGKAP

### Untuk penjelasan detail:

1. **[QUICK_START_GUIDE.md](./docs/HGQS_PROCEDURES_MANUAL/QUICK_START_GUIDE.md)**
   - Penjelasan sistem HGQS
   - Compliance requirements
   - Role-specific guides

2. **[SYSTEM_GUIDE.md](./SYSTEM_GUIDE.md)**
   - System overview
   - All modules explained
   - FAQ & troubleshooting

3. **[WORKFLOW_GUIDE.md](./WORKFLOW_GUIDE.md)**
   - Detailed workflows
   - Step-by-step procedures
   - Best practices

4. **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)**
   - API reference (untuk developer)
   - Integration guide
   - Code examples

---

## ✅ CHECKLIST UNTUK NEW USER

**Week 1:**
- [ ] Akses sistem & login
- [ ] Explore dashboard
- [ ] Browse crew list
- [ ] View certificates
- [ ] Check vessels
- [ ] Review applications

**Week 2:**
- [ ] Add new crew (test data)
- [ ] Create test application
- [ ] Add certificates
- [ ] Generate joining instruction
- [ ] Try all filters & searches

**Week 3:**
- [ ] Real data entry
- [ ] Process real applications
- [ ] Manage certificates
- [ ] Create assignments
- [ ] Generate reports

**Week 4:**
- [ ] Daily operations routine
- [ ] Weekly certificate monitoring
- [ ] Application tracking
- [ ] Rotation planning
- [ ] Master all features ✅

---

## 🎯 TIPS & BEST PRACTICES

### Tips untuk Efficiency:

1. **Use keyboard shortcuts:**
   - `Ctrl+F` untuk search di page
   - `Ctrl+Click` untuk buka link di tab baru
   - `F5` untuk refresh data

2. **Bookmark important pages:**
   - Dashboard: `http://localhost:3000`
   - Crew List: `http://localhost:3000/crew`
   - Certificates: `http://localhost:3000/certificates`
   - Applications: `http://localhost:3000/applications`

3. **Daily routine:**
   - Start day: Check dashboard alerts
   - Mid-day: Review applications
   - End day: Update progress notes

4. **Certificate monitoring:**
   - Set reminder: Check every Monday
   - Create renewal calendar
   - Contact crews 2 months before expiry

5. **Data backup:**
   - System auto-backup daily
   - Download important PDFs locally
   - Keep manual records for critical data

---

## 🚀 LO SIAP PAKAI SISTEM!

**Sistem ini sekarang:**
- ✅ Running di `http://localhost:3000`
- ✅ Database ready dengan sample data
- ✅ Semua fitur bisa dipakai
- ✅ Documentation lengkap
- ✅ Ready untuk production!

**Next steps:**
1. **Buka browser** → `http://localhost:3000`
2. **Explore dashboard** → lihat-lihat dulu
3. **Try add crew** → coba tambahin data test
4. **Read documentation** → untuk detail lengkap
5. **Start using for real** → mulai pakai untuk operational!

**Ada pertanyaan?** Just ask atau contact support! 😊

---

**Document Version**: 1.0  
**Created**: November 19, 2025  
**For**: HanMarine Shipboard Personnel System v1.0.0  
**Status**: ✅ Ready to Use
