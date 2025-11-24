# 🚢 HANMARINE CREW MANAGEMENT SYSTEM - PANDUAN LENGKAP

## 📑 DAFTAR ISI

1. [Pengenalan Sistem](#pengenalan-sistem)
2. [Login & Akses](#login--akses)
3. [Modul Utama](#modul-utama)
4. [Workflow Lengkap](#workflow-lengkap)
5. [FAQ & Troubleshooting](#faq--troubleshooting)

---

## 🎯 PENGENALAN SISTEM

### Apa itu Hanmarine Crew Management System?

System yang mengelola **SELURUH PROSES CREW** dari recruitment sampai off-boarding:

```
RECRUITMENT → DATA COLLECTION → DOCUMENTATION → CV GENERATION → 
OWNER APPROVAL → ONBOARDING → DEPLOYMENT → MONITORING → 
ROTATION → OFF-BOARDING
```

### Fitur Utama

✅ **Crew Database** - Kelola data crew lengkap  
✅ **Certificate Tracking** - Monitor certificate expiry  
✅ **Contract Management** - Track contract duration & rotation  
✅ **Onboarding Workflow** - 8-step onboarding process  
✅ **CV Generator** - Generate CV per 6 flag states  
✅ **Application System** - Recruitment & approval workflow  
✅ **Vessel Management** - Data kapal dan assignment  
✅ **Reporting** - Semester reports & analytics  

---

## 🔐 LOGIN & AKSES

### Cara Login

1. Buka browser: `http://localhost:3000`
2. Login dengan credentials:
   - **Username**: `director`
   - **Password**: `hanmarine123`

### User Roles & Akses

| Role | Username | Akses Level |
|------|----------|-------------|
| **Director** | `director` | Full Access (semua fitur) |
| **Crewing Manager** | `crewing` | Crew, Applications, Onboarding, Vessels |
| **Expert Staff** | `expert` | Crew, Applications, Certificates, Onboarding |
| **Documentation Officer** | `documentation` | Documents, Forms, Checklists, Onboarding |
| **Accounting Officer** | `accounting` | Crew, Applications, Documents |
| **Training Officer** | `training` | Crew, Certificates, Training |
| **Operational Staff** | `operational` | Crew, Vessels, Certificates |

**Note**: Semua user password default: `hanmarine123`

---

## 📋 MODUL UTAMA

### 1️⃣ DASHBOARD (Overview)

**URL**: `/dashboard`

**Fungsi**:
- Overview statistics crew (Total, Onboard, Standby)
- Certificate alerts (Expired, <1 year, <1.5 years)
- Contract rotation alerts (vessel-type based)
- Complete workflow guide (10 steps)
- Quick actions

**Metrics yang Ditampilkan**:
- 👥 **Total Crew** - Total crew di database
- 🚢 **Crew Onboard** - Crew yang sedang onboard
- ⚓ **Crew Standby** - Crew yang standby
- ⚠️ **Cert < 1 Tahun** - Certificate akan expire <1 year (CRITICAL)
- 📋 **Cert < 1.5 Tahun** - Certificate akan expire <1.5 years (WARNING)
- ❌ **Cert Expired** - Certificate sudah expired

**Contract Rotation Logic**:
- **Tanker vessels**: 9-month contract → warning at 7 months
- **General Cargo**: 8-month contract → warning at 6 months

---

### 2️⃣ RECRUITMENT & ONBOARDING

#### A. Applications (`/applications`)

**Fungsi**: Manage recruitment applications

**Features**:
- View all applications
- Filter by status (Applied, Shortlisted, Interview, Approved, Offered, Accepted, Rejected)
- Filter "Joining Pending" (approved tapi checklist belum lengkap)
- Approve/Reject applications
- Create new application
- Prepare joining documents

**Workflow**:
1. Create new application (`/applications/new`)
2. Review & approve/reject
3. After approval → Prepare joining
4. Complete checklist (Medical & Training)
5. Ready to deploy

#### B. Onboarding Workflow (`/onboarding`)

**Fungsi**: 8-step visual workflow tracker

**8 Steps**:
1. **Pengumpulan Data** - Form serah terima crew
2. **Scanning Dokumen** - Scan sertifikat & passport
3. **Input Data** - Entry ke database system
4. **Generate CV** - Create CV per flag state
5. **Submit ke Owner** - Email CV untuk approval
6. **Approval Checklist** - DOC-CHECKLIST, Next of Kin, Declaration
7. **Onboard** - Update crew list, CRP, HUBLA
8. **Archive** - Simpan dokumen fisik & digital

**Features**:
- Interactive flowchart
- Expandable step details
- Progress tracking
- Quick action buttons per step

#### C. CV Generator (`/cv-generator`)

**Fungsi**: Generate professional crew CV

**6 Flag State Templates**:
- 🇧🇸 Bahamas
- 🇵🇦 Panama
- 🇲🇭 Marshall Islands
- 🇸🇬 Singapore
- 🇱🇷 Liberia
- 🇲🇹 Malta

**Features**:
- Select crew from database
- Choose flag template
- Auto-validate required fields
- Preview CV (HTML format)
- Download CV

**Required Fields** (varies by flag):
- Personal information
- Contact details
- Next of kin
- Certificates & licenses
- Sea service experience
- Education background

#### D. Import Data (`/import`)

**Fungsi**: Bulk import dari Excel

**2 Import Types**:
1. **Import Vessels** - Import data kapal dari sheet FLAG
2. **Import Crew List** - Import crew dari excel crew list

**Excel Format**:
- **Vessels**: NAME OF VESSSEL, FLAG, DESKRIPSI, OWNER
- **Crew**: NAME/SEAMAN NAME, RANK/POSITION, Vessel

---

### 3️⃣ CREW OPERATIONS

#### A. Crew List (`/crew`)

**Fungsi**: Main crew database

**Features**:
- Search by name, rank, vessel
- Filter by status (Active, Onboard, Standby, Available, On Leave, Inactive)
- Add new crew
- View crew details
- Status badges (color-coded)

**Crew Statuses**:
- 🟢 **ACTIVE** - Active crew
- 🔵 **ONBOARD** - Currently on vessel
- 🟡 **STANDBY** - Available for assignment
- ⚪ **AVAILABLE** - Ready to join
- 🟠 **ON_LEAVE** - On leave/vacation
- ⚫ **INACTIVE** - Not active

**Add New Crew**:
1. Fill name (required)
2. Fill rank (required)
3. Fill vessel (optional)
4. Select status
5. Click "Simpan crew"

#### B. Crew Detail Pages

**URL**: `/crew/[id]`

**Sub-pages Available**:
- `/crew/[id]/edit` - Edit crew information
- `/crew/[id]/sea-service` - Sea service record
- `/crew/[id]/joining-instruction` - Joining instructions
- `/crew/[id]/evaluation` - Performance evaluation
- `/crew/[id]/repatriation` - Repatriation details
- `/crew/[id]/document-checklist` - Document compliance

#### C. Replacement Schedule (`/replacement-schedule`)

**Fungsi**: Crew Replacement Plan (CRP)

**Features**:
- View upcoming crew rotations
- Plan replacement timeline
- Track sign-on/sign-off dates
- Monitor contract expiry

---

### 4️⃣ VESSEL MANAGEMENT

#### Vessels (`/vessels`)

**Fungsi**: Manage vessel data

**Features**:
- List all vessels
- Add new vessel
- Edit vessel details
- Assign crew to vessel
- Track crew onboard per vessel

**Vessel Information**:
- Vessel name
- Flag state
- Vessel type (Tanker, General Cargo, Container, Bulk Carrier, etc.)
- Owner
- IMO number
- Current crew list

---

### 5️⃣ REFERENCE & TOOLS

#### A. Certificates Guide (`/certificates`)

**Fungsi**: Reference 60+ certificate types

**6 Categories**:
1. **LICENSE** - CoC, CoP, GMDSS, etc.
2. **TRAINING** - BST, SCRB, AFF, MFA, etc.
3. **MEDICAL** - Medical Certificate, Yellow Fever, etc.
4. **ENDORSEMENT** - Flag state endorsements
5. **PROFICIENCY** - Specialized certifications
6. **IDENTITY** - Passport, Seaman Book, Visa, etc.

**Features**:
- Filter by rank (Master, Chief Officer, 2nd Officer, etc.)
- Filter by category
- View validity period
- View issuing authority
- Required for specific ranks

**Certificate Information**:
- Certificate code
- Full name
- Validity period (years)
- Required for which ranks
- Issuing authority

#### B. Position Guide (`/recruitment`)

**Fungsi**: Reference 16 crew positions

**16 Positions**:
- Master
- Chief Officer
- 2nd Officer
- 3rd Officer
- Chief Engineer
- 2nd Engineer
- 3rd Engineer
- 4th Engineer
- Bosun
- AB (Able Seaman)
- OS (Ordinary Seaman)
- Oiler
- Wiper
- Fitter
- Cook/Chief Cook
- Messman

**Information per Position**:
- Job description
- Required certificates
- Minimum experience
- Key responsibilities

#### C. Forms Templates (`/forms`)

**Fungsi**: 12 form templates

**Form Types**:
- Employment application forms
- Contract forms
- Declaration forms
- Medical forms
- Training forms
- Checklist forms

**Features**:
- View form templates
- Fill form online
- Submit form
- Track form status

#### D. Checklists (`/checklists`)

**Fungsi**: Compliance checklists

**Features**:
- Document checklist
- Medical checklist
- Training checklist
- Onboarding checklist
- Off-boarding checklist

---

### 6️⃣ MONITORING & REPORTS

#### A. Documents (`/documents`)

**Fungsi**: Certificate tracking & document management

**Features**:
- View all crew documents
- Track certificate expiry
- Filter expired/expiring certificates
- Verify documents
- Upload new documents

**Certificate Alerts**:
- ❌ **Expired** - Past expiry date
- ⚠️ **Critical (<1 year)** - Less than 1 year to expiry
- 📋 **Warning (<1.5 years)** - Less than 1.5 years to expiry
- ✅ **OK** - More than 1.5 years valid

#### B. Semester Reports (`/semester-reports`)

**Fungsi**: Periodic reports

**Features**:
- Generate semester reports
- Crew statistics
- Certificate renewals
- Contract renewals
- Onboard/sign-off summary

#### C. Owners (`/owners`)

**Fungsi**: Vessel owner management

**Features**:
- List of vessel owners
- Contact information
- Vessels per owner
- Communication history

---

## 🔄 WORKFLOW LENGKAP

### ✅ SCENARIO 1: NEW CREW RECRUITMENT

**Step-by-step**:

```
1. RECEIVE APPLICATION
   → /applications/form
   → Select "HGF-CR-02: Application for Employment"
   → Fill form & submit

2. ADD TO DATABASE
   → /crew
   → Click "+ Add Crew"
   → Fill: Name, Rank, DOB, Passport, Seaman Book
   → Save

3. UPLOAD & SCAN DOCUMENTS
   → /onboarding → Step 2 (Scanning)
   → Scan: Passport, Seaman Book, Certificates
   → Upload to system

4. INPUT CERTIFICATE DATA
   → /crew/[id]
   → Add certificates
   → Input: Type, Number, Issue Date, Expiry Date
   → Save each certificate

5. GENERATE CV
   → /cv-generator
   → Select crew from dropdown
   → Select flag state template
   → Verify required fields
   → Click "Generate CV"
   → Download CV (PDF/HTML)

6. SUBMIT TO OWNER
   → Email CV to vessel owner
   → Include: Position applied, Vessel name
   → Wait for approval

7. IF APPROVED → COMPLETE CHECKLIST
   → /applications/form → "DOC-CHECKLIST"
   → /applications/form → "AC-02: Next of Kin"
   → /applications/form → "AC-04: Declaration"
   → /applications/form → "AC-06: Employment Contract"
   → Submit all forms

8. UPDATE STATUS TO ONBOARD
   → /crew/[id] → Change status to "ONBOARD"
   → /replacement-schedule → Update CRP
   → /vessels → Assign to vessel
   → Send joining instruction

9. ARCHIVE DOCUMENTS
   → Physical: Store in filing cabinet
   → Digital: All documents in system
```

**Timeline**: 2-4 weeks (depends on owner approval)

---

### ⚠️ SCENARIO 2: CERTIFICATE RENEWAL

**Step-by-step**:

```
1. CHECK DASHBOARD ALERTS
   → /dashboard
   → View "CERT < 1 TAHUN" or "CERT < 1.5 TAHUN"
   → Click "Lihat Detail" button
   → Get list of affected crew

2. IDENTIFY CREW WITH EXPIRING CERTS
   → Review list
   → Note: Crew name, Certificate type, Expiry date
   → Prioritize: Expired → <1 year → <1.5 years

3. CONTACT CREW FOR RENEWAL
   → /crew/[id] → View certificate details
   → Call/Email crew
   → Inform about expiring certificate
   → Arrange renewal training/medical

4. CREW COMPLETES RENEWAL
   → Crew attends training/medical
   → Receives new certificate
   → Sends copy to office

5. UPDATE CERTIFICATE IN SYSTEM
   → /crew/[id] → Edit certificate
   → Update: Issue Date, Expiry Date, Certificate Number
   → Upload new certificate file
   → Save

6. VERIFY ALERT CLEARED
   → /dashboard → Check alert count decreased
   → /documents → Verify certificate now shows "OK" status
```

**Timeline**: 1-2 weeks per certificate

---

### 🔄 SCENARIO 3: CONTRACT ROTATION

**Step-by-step**:

```
1. MONITOR ROTATION ALERTS
   → /dashboard → "Rotation Alerts" section
   → See crew approaching contract limit
   → Note severity:
      - WARNING (yellow): Tanker 7m, Cargo 6m
      - CRITICAL (red): Tanker 9m+, Cargo 8m+

2. DECIDE: EXTEND OR REPLACE

   OPTION A: EXTEND CONTRACT
   → Click "📅 Extend Contract" button
   → Enter new sign-off date
   → Reason for extension
   → System updates contract
   → Alert severity changes

   OPTION B: FIND REPLACEMENT
   → Click "Propose Replacement" button
   → System redirect to /applications/new
   → Rank auto-filled with same rank
   → Find Candidate panel appears
   → Filter: AVAILABLE + Same rank
   → Search candidate by name
   → Sort by: Docs Quality
   → Review badge: ✅ docs ok / ⚠️ expiring / ❌ expired
   → Click "Pilih" on best candidate
   → Submit application

3. IF REPLACEMENT: PROCESS APPLICATION
   → /applications → Filter: APPLIED
   → Review candidate
   → Approve application
   → Prepare joining documents
   → Complete checklist (Medical & Training)

4. COORDINATE HANDOVER
   → Current crew: Sign-off date
   → Replacement crew: Sign-on date
   → Gap: Minimize overlap or gap
   → Update CRP

5. UPDATE SYSTEM
   → Current crew: Status → "ASHORE"
   → Replacement: Status → "ONBOARD"
   → /replacement-schedule → Update
   → /vessels → Update crew assignment

6. PROCESS SIGN-OFF
   → /crew/[id]/repatriation
   → Record repatriation details
   → Flight ticket, hotel, etc.
   → Archive documents
```

**Timeline**: 1-2 months advance planning

---

### ✈️ SCENARIO 4: CREW SIGN-OFF

**Step-by-step**:

```
1. CREW SIGN-OFF FROM VESSEL
   → Receive notification from vessel
   → Note: Sign-off date, port

2. UPDATE CREW STATUS
   → /crew/[id]
   → Change status: "ONBOARD" → "ASHORE"
   → Update end date of assignment

3. PROCESS REPATRIATION (if needed)
   → /crew/[id]/repatriation
   → Record: Flight details, Hotel, Travel dates
   → Upload: Flight ticket, Hotel voucher
   → Save

4. COLLECT DOCUMENTS
   → Sea service discharge book
   → Certificate of sea service
   → Performance evaluation
   → Medical records (if any)
   → Upload to system

5. GENERATE SEMESTER REPORT
   → /semester-reports
   → Include sign-off data
   → Export report

6. ARCHIVE DOCUMENTS
   → /documents → Upload all files
   → Physical docs → File cabinet
   → Update document checklist

7. UPDATE CREW STATUS
   → Status options:
      - "STANDBY" - Available for next assignment
      - "ON_LEAVE" - Taking leave
      - "INACTIVE" - Not available

8. FOLLOW-UP
   → If STANDBY: Add to available pool
   → If ON_LEAVE: Schedule return date
   → If INACTIVE: Note reason
```

**Timeline**: 1-2 weeks

---

## ❓ FAQ & TROUBLESHOOTING

### General Questions

**Q: Bagaimana cara login pertama kali?**  
A: Username: `director`, Password: `hanmarine123`. Akses full system.

**Q: Lupa password?**  
A: Hubungi admin IT. Default password semua user: `hanmarine123`

**Q: Bagaimana cara menambah crew baru?**  
A: `/crew` → Click "+ Add Crew" → Fill form → Save

**Q: Bagaimana cara generate CV?**  
A: `/cv-generator` → Select crew → Select flag → Generate → Download

**Q: Apa beda Tanker dan General Cargo contract?**  
A: Tanker = 9 bulan, General Cargo = 8 bulan. System otomatis hitung.

---

### Certificate Management

**Q: Certificate alerts tidak muncul?**  
A: Pastikan certificate expiry date sudah diinput di system. Cek `/crew/[id]` → Certificates

**Q: Certificate status salah?**  
A: Edit certificate → Update expiry date → Save. System auto-recalculate.

**Q: Bagaimana cara bulk update certificates?**  
A: Belum ada fitur. Update manual per crew.

**Q: Certificate expired tapi crew masih onboard?**  
A: URGENT! Contact crew immediately untuk renewal. Update system setelah renewed.

---

### Application & Onboarding

**Q: Application stuck di status APPLIED?**  
A: Review application → Approve/Reject. Status akan berubah.

**Q: Joining Pending tidak hilang setelah checklist lengkap?**  
A: Pastikan KEDUA checkbox dicentang (Medical & Training). Klik "Simpan Checklist".

**Q: Bagaimana cara reject application?**  
A: `/applications` → Click "Reject" button → Confirm

**Q: Onboarding workflow tidak update?**  
A: Workflow adalah reference guide, bukan real-time tracker. Follow steps manually.

---

### Contract & Rotation

**Q: Rotation alert tidak muncul padahal crew sudah >7 bulan?**  
A: Pastikan crew status = "ONBOARD" dan assignment memiliki startDate. Check `/crew/[id]`.

**Q: Vessel type tidak ada, contract limit berapa?**  
A: Default General Cargo (8 bulan). Tambahkan vessel type di `/vessels`.

**Q: Bagaimana cara extend contract?**  
A: Dashboard rotation alert → Click "Extend Contract" → Enter new date → Save

**Q: Find Candidate tidak show crew?**  
A: Filter: Status = AVAILABLE + Rank sama. Jika kosong, tidak ada candidate available.

---

### System Issues

**Q: Dashboard tidak load?**  
A: Check database connection (PostgreSQL port 5433). Restart server.

**Q: Crew tidak muncul di list?**  
A: Check search filter dan status filter. Reset ke "ALL".

**Q: Import Excel failed?**  
A: Check Excel format. Column names harus exact match (case-insensitive).

**Q: Page crash atau error?**  
A: Check browser console (F12). Report error ke IT team.

---

### Best Practices

✅ **Daily Tasks**:
1. Check dashboard alerts
2. Review rotation alerts
3. Process new applications
4. Update certificate renewals

✅ **Weekly Tasks**:
1. Review crew status
2. Update CRP
3. Follow up pending applications
4. Verify document completeness

✅ **Monthly Tasks**:
1. Generate semester reports
2. Audit certificate expiries
3. Review contract extensions
4. Update vessel assignments

✅ **Data Entry**:
- Always double-check dates (format: DD/MM/YYYY or YYYY-MM-DD)
- Upload documents after data entry
- Use consistent naming (e.g., "JOHN DOE" not "john doe")
- Verify certificate numbers are correct

✅ **Communication**:
- Email CV dengan subject: "[Vessel Name] - [Rank] Application - [Crew Name]"
- CC crewing manager di semua correspondence
- Keep records of owner communication

---

## 📞 SUPPORT

**Technical Issues**: IT Team  
**System Access**: Administrator  
**Feature Requests**: Crewing Manager  
**Training**: HR Department  

**System Info**:
- **Version**: 1.0.0
- **Last Updated**: November 2025
- **Tech Stack**: Next.js 14, PostgreSQL, Prisma ORM
- **Port**: `http://localhost:3000`

---

**🚢 HANMARINE SHIPBOARD PERSONNEL SYSTEM**  
*Simplifying Crew Management, One Click at a Time*
