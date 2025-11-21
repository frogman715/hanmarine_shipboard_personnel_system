# 🚢 HanMarine Shipboard Personnel System

**Complete Crew Management & HR Forms Application**

Aplikasi manajemen crew lengkap dengan HR forms, certificate tracking, rotation monitoring, dan workflow management untuk shipping industry.

---

## 📚 Documentation

### 🚀 Quick Start (BACA INI DULU!)

- **[CARA_PAKAI_SISTEM.md](./CARA_PAKAI_SISTEM.md)** ⭐ **PANDUAN PRAKTIS - Cara pakai sistem dari nol!**

### 📖 Complete Documentation

- **[DOCUMENTATION_HUB.md](./DOCUMENTATION_HUB.md)** 🏠 - Complete documentation navigation guide
- **[WORKFLOW_GUIDE.md](./WORKFLOW_GUIDE.md)** 📖 - Panduan lengkap workflow sistem
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API reference
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Panduan deployment
- [FEATURES_CHECKLIST.md](./FEATURES_CHECKLIST.md) - Feature tracking

### Quality & Compliance Documentation

- **[HGQS Procedures Manual](./docs/HGQS_PROCEDURES_MANUAL/README.md)** 📋 - ISO 9001:2015 & MLC 2006 compliance
  - [Annex B: Hiring Seafarers](./docs/HGQS_PROCEDURES_MANUAL/ANNEX_B_HIRING_SEAFARERS.md)
  - [Annex C: Communication Management](./docs/HGQS_PROCEDURES_MANUAL/ANNEX_C_COMMUNICATION.md)
  - [Forms Reference Guide](./docs/HGQS_PROCEDURES_MANUAL/HGQS_FORMS_REFERENCE.md) - 42 forms catalog
  - [Integration Guide](./docs/HGQS_PROCEDURES_MANUAL/INTEGRATION_GUIDE.md) - System integration details

---

## 📋 Daftar Isi

1. [Fitur Utama](#-fitur-utama)
2. [Quick Start](#-quick-start)
3. [Modul Aplikasi](#-modul-aplikasi)
4. [API Endpoints](#-api-endpoints)
5. [Database Models](#-database-models)
6. [Workflow & Prosedur](#-workflow--prosedur)
7. [User Guide](#-user-guide)
8. [Tech Stack](#-tech-stack)
9. [Development](#-development)

---

## 🎯 Fitur Utama

### ✅ Sudah Selesai & Production Ready

| Fitur | Status | Deskripsi |
|-------|--------|----------|
| **Crew Management** | ✅ | Create, edit, view crew dengan profil lengkap |
| **Certificate Tracking** | ✅ | Manajemen sertifikat dengan alert expiry otomatis |
| **Dashboard** | ✅ | KPI monitoring, crew status, certificate alerts |
| **Joining Instructions** | ✅ | Generate printable letters dengan crew details |
| **HGF-CR-01 Forms** | ✅ | Dynamic document checklist (14 fields) |
| **HGF-CR-02 Forms** | ✅ | Dynamic application form (41 fields) |
| **Sea Service History** | ✅ | Track vessel assignments, ranks, GRT, dates |
| **Application Status Workflow** | ✅ | Status: APPLIED → SHORTLISTED → INTERVIEW → APPROVED → OFFERED → ACCEPTED |
| **Forms Database** | ✅ | FormTemplate, FormField, FormSubmission models |

### 🔄 Workflow yang Tersedia

```
RECRUITMENT FLOW:
  Crew Master Data → Apply (HGF-CR-02) → Status Tracking → Interview → Approval → Joining

PRE-DEPARTURE:
  Document Checklist (HGF-CR-01) → Joining Instruction → Ready Sign-on

ONBOARD:
  Sea Service History → Performance Evaluation → Repatriation

DASHBOARD:
  Crew Status Real-time → Certificate Expiry Alerts → Action Items
```

---

## 🚀 Quick Start

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Setup environment variables
# Copy .env.example ke .env
# Edit DATABASE_URL="postgresql://user:password@localhost:5433/hanmarine?schema=public"

# 3. Run database migrations
npx prisma migrate dev

# 4. Seed form templates
npm run seed:forms

# 5. Start dev server
npm run dev
```

### Akses Aplikasi

- **URL**: http://localhost:3000
- **Dashboard**: /dashboard
- **Crew List**: /crew
- **Applications**: /applications

---

## 📦 Modul Aplikasi

### 1. Crew Management (`/crew`)

**Fitur Utama**:
- ✅ List semua crew members dengan search
- ✅ View crew detail dengan relations
- ✅ Create crew dengan basic info
- ✅ Edit crew dengan all fields
- ✅ View certificates, sea service, applications, checklists

**Aksi Tersedia pada Crew Detail**:
- ✏️ **Edit Crew** → Update data & manage certificates
- 📄 **Joining Instruction** → Generate printable letter
- 📋 **Document Checklist** → HGF-CR-01 form
- 🌊 **Sea Service** → Add vessel assignments

**API Endpoints**:
```
GET  /api/crew                    → Get all crew
POST /api/crew                    → Create crew
GET  /api/crew?id=1               → Get specific crew
```

**Data Model Crew**:
```
- fullName
- rank
- vessel
- status (ACTIVE, INACTIVE, ON_LEAVE, ONBOARD, STANDBY, AVAILABLE)
- dateOfBirth, placeOfBirth, religion
- address, phoneMobile, phoneHome
- bloodType, heightCm, weightKg
```

---

### 2. Certificate Management

**Page**: `/crew/[id]/edit`

**Fitur Utama**:
- ✅ View all certificates untuk crew dengan table
- ✅ Add new certificate (type, issue date, expiry, issuer, remarks)
- ✅ Update certificate info
- ✅ Delete certificate dengan confirmation
- ✅ Auto expiry warning system (alert jika ≤30 hari)

**Certificate Fields**:
```
- type: string (COC, Seaman Book, Medical, License, STCW, etc.)
- issueDate: DateTime
- expiryDate: DateTime
- issuer: string
- remarks: string
```

**Expiry Alert System**:
- ≤30 hari to expiry: Orange warning ⚠️
- Already expired: Red urgent 🔴
- Status ditampilkan di Dashboard

**API Endpoints**:
```
GET    /api/certificates?crewId=1  → Get crew certificates
POST   /api/certificates            → Add certificate
PUT    /api/certificates            → Update certificate
DELETE /api/certificates?id=1      → Delete certificate
```

---

### 3. Dashboard & Monitoring (`/dashboard`)

**Summary Cards** (4 KPI):
- Total Crew count
- Crew Onboard count
- Crew Available count
- Crew On Leave count

**Alert Sections**:
- 🟠 Certificates Expiring Soon (≤30 hari)
- 🔴 Expired Certificates (>0 hari expired)

**Crew Master Table**:
- List all crew dengan nama, rank, vessel, status
- Certificate count
- Quick action links (Edit, View Detail)
- Color-coded status

**Color Coding Status**:
```
ONBOARD   → Green (#22c55e)
AVAILABLE → Blue (#3b82f6)
ON_LEAVE  → Yellow (#eab308)
STANDBY   → Gray (#6b7280)
```

---

### 4. Joining Instruction Generator (`/crew/[id]/joining-instruction`)

**Fitur Utama**:
- ✅ Professional letter template dengan company header
- ✅ Auto-populated crew data (name, rank, vessel)
- ✅ Editable fields:
  - Instruction text (main joining procedures)
  - Travel details (flights, accommodation, meeting point)
  - Issued by (name of authorizer)
- ✅ Print/PDF Export via browser print dialog

**Database Model**:
```
JoiningInstruction {
  id: number
  crewId: number
  instructionText: string
  travelDetails: string
  issuedAt: DateTime (default: now)
  issuedBy: string
}
```

**How to Use**:
1. Go to `/crew/[id]`
2. Click "📄 Joining Instruction"
3. Fill in instruction text & travel details
4. Click "🖨️ Print / PDF"
5. Browser print dialog opens
6. Select printer or "Save as PDF"

---

### 5. Dynamic Forms System

#### HGF-CR-01: Document Checklist (`/crew/[id]/document-checklist`)

**Fields** (14 total, 2 sections):

**Section 1: Metadata** (9 fields):
- Vessel Name
- Seaman's Name
- Birth Date
- Flag
- Rank
- Joining Date
- Type
- Nationality
- Sign. of Verifier

**Section 2: Documents** (repeating rows):
- Document Type (dropdown with predefined list)
- Document Number
- Issue Date
- Expiry Date
- Remarks (textarea)

**Features**:
- ✅ Add/remove document rows
- ✅ Required field validation
- ✅ Auto-save to FormSubmission
- ✅ Can edit anytime
- ✅ Status tracking (DRAFT/SUBMITTED/APPROVED/REJECTED)

---

#### HGF-CR-02: Application for Employment (`/applications/form`)

**Fields** (41 total, 7 sections):

**1. Personal Info** (9 fields):
- Ship's Name
- Family Name (required)
- Given Name (required)
- Middle Name
- Chinese Name
- Rank
- Birth Date
- Height (cm)
- Weight (kg)

**2. Seaman Book** (3 fields):
- Nationality
- Number
- Expiry Date

**3. License** (2 fields):
- Nationality
- GOC Certificate (checkbox)

**4. Address** (5 fields):
- Present Address
- Tel. No.
- Place of Birth
- Religion
- Marital Status

**5. Education** (5 fields):
- Last School
- Course
- Course From (date)
- Course To (date)
- Training checkboxes (Safety, Tanker, COC)

**6. Family** (4 repeating fields):
- Relation (dropdown: Father, Mother, Spouse, Son, Daughter, Brother, Sister)
- Name
- Birth Date
- Occupation

**7. Sea Experience** (11 repeating fields):
- Vessel Name
- Rank
- Sign On (date)
- Sign Off (date)
- Type (Tanker, Container, General Cargo, Bulk, etc.)
- Engine (diesel, electric, nuclear, etc.)
- GRT (number)
- H/P (horsepower)
- Agency
- Principal (shipping company)
- Reason for Leaving

**Features**:
- ✅ Crew ID selector (select existing crew member)
- ✅ Repeating rows for family members & sea service
- ✅ Add/remove row buttons
- ✅ Auto-save to FormSubmission
- ✅ Can edit anytime
- ✅ Form status tracking

---

### 6. Sea Service Management (`/crew/[id]/sea-service`)

**Fitur Utama**:
- ✅ Add sea service records (vessel assignments)
- ✅ Edit existing records
- ✅ Delete records dengan confirmation
- ✅ View records dalam table format

**Form Fields** (11 fields):
- Vessel Name (required)
- Rank (text)
- GRT - Gross Tonnage (number)
- DWT - Deadweight (number)
- Engine Type (text: Diesel, Steam, Nuclear, etc.)
- BHP - Horsepower (number)
- Company Name (text)
- Flag (text: country flag)
- Sign On (date)
- Sign Off (date)
- Remarks (textarea)

**Table Display** (7 columns):
- Vessel Name
- Rank
- GRT
- Company
- Sign On (formatted date)
- Sign Off (formatted date)
- Actions (Edit, Delete)

**API Endpoints**:
```
GET    /api/sea-service?crewId=1   → Get crew sea service
POST   /api/sea-service             → Add record (crewId, vesselName required)
PUT    /api/sea-service             → Update record (id + any field)
DELETE /api/sea-service?id=1       → Delete record
```

**Data Ordering**: Records ordered by signOn DESC (newest first)

---

### 7. Applications Management (`/applications`)

**Page**: `/applications`

**Fitur Utama**:
- ✅ List all applications dengan crew name & status
- ✅ View application details
- ✅ Create new application (basic form)
- ✅ Create advanced application (HGF-CR-02 form)
- ✅ Update application status & dates

**Status Workflow**:
```
APPLIED
    ↓
SHORTLISTED
    ↓
INTERVIEW (with interview date & notes)
    ↓
APPROVED
    ↓
OFFERED (with offer date)
    ↓
ACCEPTED (with acceptance date)
    ✗ REJECTED (with rejection reason at any stage)
```

**Application Fields**:
```
{
  id: number
  crewId: number (required)
  appliedRank: string
  applicationDate: DateTime (default: now)
  status: string (default: "APPLIED")
  interviewDate: DateTime (optional)
  interviewNotes: string (optional)
  offeredDate: DateTime (optional)
  acceptedDate: DateTime (optional)
  rejectionReason: string (optional)
  notes: string (optional)
}
```

**Status Update Endpoints**:
```
PUT /api/applications
Body: {
  id: number (required),
  status: string,
  interviewDate: DateTime,
  interviewNotes: string,
  offeredDate: DateTime,
  acceptedDate: DateTime,
  rejectionReason: string
}
```

**Relations**:
- Application → Crew (many-to-one)
- Application → DocumentChecklist (one-to-many)
- Application → JoiningInstruction (one-to-many)
- Application → FormSubmission (one-to-many)

---

## 🔌 API Endpoints - Complete Reference

### Crew Endpoints

```
GET    /api/crew                          → Get all crew
Response: Array<{id, fullName, rank, vessel, status, ...}>

POST   /api/crew                          → Create crew
Body: {fullName, rank?, vessel?, status?, dateOfBirth?, ...}
Response: Created crew object

GET    /api/crew?id=1                     → Get specific crew with relations
Response: Crew + certificates + seaServices + applications + checklists
```

### Certificate Endpoints

```
GET    /api/certificates?crewId=1        → Get crew certificates
Response: Array<{id, type, issueDate, expiryDate, issuer, ...}>

POST   /api/certificates                  → Add certificate
Body: {crewId, type, issueDate, expiryDate, issuer, remarks?}
Response: Created certificate object

PUT    /api/certificates                  → Update certificate
Body: {id, ...fields to update}
Response: Updated certificate object

DELETE /api/certificates?id=1            → Delete certificate
Response: Deleted certificate object
```

### Application Endpoints

```
GET    /api/applications                  → Get all applications
Response: Array<{id, crewId, crew, status, ...}>

GET    /api/applications?crewId=1        → Get crew's applications
Response: Array<Applications for crew>

POST   /api/applications                  → Create application
Body: {crewId, appliedRank?, applicationDate?, notes?}
Response: Created application with status="APPLIED"

PUT    /api/applications                  → Update application status/dates
Body: {id, status, interviewDate?, interviewNotes?, offeredDate?, acceptedDate?, rejectionReason?}
Response: Updated application object
```

### Forms Endpoints

```
GET    /api/forms?code=HGF-CR-01         → Get form template with all fields
Response: {id, code, name, fields: Array<FormField>}

GET    /api/forms?submissionId=1         → Get form submission data
Response: {id, templateId, status, data: Array<FormFieldValue>}

POST   /api/forms                         → Create form submission
Body: {templateId, crewId?, applicationId?, status?, data: {fieldName: value}}
Response: Created FormSubmission

PUT    /api/forms                         → Update form submission
Body: {id, status?, data: {fieldName: value}}
Response: Updated FormSubmission
```

### Sea Service Endpoints

```
GET    /api/sea-service?crewId=1         → Get crew sea service
Response: Array<{id, vesselName, rank, grt, signOn, signOff, ...}> (ordered by signOn DESC)

POST   /api/sea-service                   → Add sea service
Body: {crewId, vesselName, rank?, grt?, dwt?, engineType?, bhp?, companyName?, flag?, signOn?, signOff?, remarks?}
Response: Created SeaServiceExperience

PUT    /api/sea-service                   → Update sea service
Body: {id, ...fields to update}
Response: Updated SeaServiceExperience

DELETE /api/sea-service?id=1             → Delete sea service
Response: Deleted SeaServiceExperience
```

### Joining Instructions Endpoints

```
GET    /api/joining-instructions?crewId=1 → Get crew's joining instructions
Response: Array<{id, crewId, instructionText, travelDetails, ...}>

POST   /api/joining-instructions          → Create joining instruction
Body: {crewId, instructionText, travelDetails?, issuedBy?}
Response: Created JoiningInstruction

PUT    /api/joining-instructions          → Update joining instruction
Body: {id, instructionText?, travelDetails?, issuedBy?}
Response: Updated JoiningInstruction

DELETE /api/joining-instructions?id=1    → Delete joining instruction
Response: Deleted JoiningInstruction
```

---

## 📊 Database Models (15 Total Models)

### Core Domain Models

**Crew**
```
{
  id: number (pk)
  fullName: string
  rank: string?
  vessel: string?
  status: string (ACTIVE, INACTIVE, ON_LEAVE, ONBOARD, STANDBY, AVAILABLE)
  dateOfBirth: DateTime?
  placeOfBirth: string?
  religion: string?
  address: string?
  phoneMobile: string?
  phoneHome: string?
  bloodType: string?
  heightCm: number?
  weightKg: number?
  crewStatus: string @default("ACTIVE")
  
  // Relations (cascading delete)
  certificates: Certificate[]
  seaServices: SeaServiceExperience[]
  applications: EmploymentApplication[]
  joiningInstructions: JoiningInstruction[]
  evaluations: CrewEvaluation[]
  formSubmissions: FormSubmission[]
}
```

**Certificate**
```
{
  id: number (pk)
  crewId: number (fk)
  type: string
  issueDate: DateTime?
  expiryDate: DateTime?
  issuer: string?
  remarks: string?
  
  crew: Crew @relation(onDelete: Cascade)
}
```

**EmploymentApplication**
```
{
  id: number (pk)
  crewId: number (fk)
  appliedRank: string?
  applicationDate: DateTime @default(now())
  status: string @default("APPLIED")
  interviewDate: DateTime?
  interviewNotes: string?
  offeredDate: DateTime?
  acceptedDate: DateTime?
  rejectionReason: string?
  notes: string?
  
  crew: Crew @relation(onDelete: Cascade)
  checklists: DocumentChecklist[]
  joiningInstructions: JoiningInstruction[]
  formSubmissions: FormSubmission[]
}
```

**DocumentChecklist**
```
{
  id: number (pk)
  crewId: number (fk)
  applicationId: number? (fk)
  passportOk: boolean?
  seamanBookOk: boolean?
  cocOk: boolean?
  medicalOk: boolean?
  visaOk: boolean?
  vaccinationOk: boolean?
  photoIdOk: boolean?
  policeClearanceOk: boolean?
  trainingCertsOk: boolean?
  covidVaccineOk: boolean?
  remarks: string?
  
  crew: Crew @relation(onDelete: Cascade)
  application: EmploymentApplication?
}
```

**SeaServiceExperience**
```
{
  id: number (pk)
  crewId: number (fk)
  vesselName: string?
  rank: string?
  grt: number? (Gross Tonnage)
  dwt: number? (Deadweight)
  engineType: string?
  bhp: number? (Horsepower)
  companyName: string?
  flag: string?
  signOn: DateTime?
  signOff: DateTime?
  remarks: string?
  
  crew: Crew @relation(onDelete: Cascade)
}
```

**JoiningInstruction**
```
{
  id: number (pk)
  crewId: number? (fk)
  applicationId: number? (fk)
  instructionText: string
  travelDetails: string?
  issuedAt: DateTime @default(now())
  issuedBy: string?
  
  crew: Crew? @relation(onDelete: Cascade)
  application: EmploymentApplication?
}
```

### Supporting Models

**CrewEvaluation**
```
{
  id: number (pk)
  crewId: number (fk)
  rating: number?
  performanceNotes: string?
  evaluationDate: DateTime?
  evaluatedBy: string?
}
```

**Repatriation**
```
{
  id: number (pk)
  crewId: number (fk)
  repatriationDate: DateTime?
  reason: string?
  finalAccount: number?
  remarks: string?
}
```

**IncidentReport**
```
{
  id: number (pk)
  crewId: number (fk)
  incidentType: string?
  description: string?
  reportedDate: DateTime?
  severity: string?
}
```

**KpiSnapshot**
```
{
  id: number (pk)
  totalCrew: number?
  onboardCount: number?
  availableCount: number?
  onLeaveCount: number?
  snapshotDate: DateTime?
}
```

**Assignment**
```
{
  id: number (pk)
  crewId: number (fk)
  vesselName: string?
  position: string?
  assignmentDate: DateTime?
  endDate: DateTime?
}
```

### Form System Models

**FormTemplate**
```
{
  id: number (pk)
  code: string @unique (HGF-CR-01, HGF-CR-02, etc.)
  name: string
  description: string?
  
  fields: FormField[]
  submissions: FormSubmission[]
}
```

**FormField**
```
{
  id: number (pk)
  templateId: number (fk)
  name: string (camelCase)
  label: string (display label)
  type: string (text, number, date, textarea, checkbox, select, email, tel)
  section: string? (grouping)
  required: boolean @default(false)
  repeating: boolean @default(false)
  placeholder: string?
  options: string? (JSON for select fields)
  order: number @default(0)
  
  template: FormTemplate @relation(onDelete: Cascade)
}
```

**FormSubmission**
```
{
  id: number (pk)
  templateId: number (fk)
  crewId: number? (fk)
  applicationId: number? (fk)
  submittedAt: DateTime @default(now())
  updatedAt: DateTime @updatedAt
  status: string @default("DRAFT") (DRAFT, SUBMITTED, APPROVED, REJECTED)
  
  data: FormFieldValue[]
  template: FormTemplate @relation(onDelete: Cascade)
  crew: Crew? @relation(onDelete: Cascade)
  application: EmploymentApplication?
}
```

**FormFieldValue**
```
{
  id: number (pk)
  submissionId: number (fk)
  fieldName: string
  value: string? (JSON-serialized)
  rowIndex: number @default(0)
  
  submission: FormSubmission @relation(onDelete: Cascade)
  @@unique([submissionId, fieldName, rowIndex])
}
```

---

## 🔄 Workflow & Prosedur

### Complete Recruitment Workflow

```
STEP 1: CREATE CREW PROFILE
  ├─ Go to /crew → Click "Create Crew"
  ├─ Fill basic info (name, rank, vessel, status, DOB, address, etc.)
  └─ Save → Crew record created

STEP 2: SUBMIT APPLICATION (HGF-CR-02)
  ├─ Go to /applications → Click "Create New Application (HGF-CR-02)"
  ├─ Select crew ID
  ├─ Fill 41-field form (personal, family, sea service)
  ├─ Fill repeating rows for family & sea experience
  └─ Auto-save to database → Status: APPLIED

STEP 3: INTERVIEW & SELECTION
  ├─ Go to /applications → View application
  ├─ Update status to INTERVIEW
  ├─ Add interview date & notes
  ├─ If pass: Update status to APPROVED
  └─ If fail: Update status to REJECTED + rejection reason

STEP 4: PRE-DEPARTURE
  ├─ Go to /crew/[id]/document-checklist
  ├─ Fill HGF-CR-01 (14 fields)
  ├─ Check document type boxes (passport, seaman book, etc.)
  ├─ Add remarks if needed
  ├─ Go to /crew/[id]/edit
  ├─ Verify/add certificates (COC, Medical, etc.)
  ├─ Go to /crew/[id]/sea-service
  └─ Add sea service history if needed

STEP 5: JOINING INSTRUCTIONS
  ├─ Go to /crew/[id]/joining-instruction
  ├─ Fill instruction text & travel details
  ├─ Click "🖨️ Print / PDF"
  ├─ Browser print dialog opens
  └─ Save as PDF or print

STEP 6: FINALIZE & ONBOARD
  ├─ Update application status to OFFERED
  ├─ Add offer date
  ├─ Once accepted: Update to ACCEPTED
  ├─ Add acceptance date
  ├─ Update crew status to ONBOARD or AVAILABLE
  └─ Monitor certificate expiry in dashboard
```

### Certificate Expiry Management

```
PROCESS:
  1. Certificate created dengan expiryDate
  2. Dashboard auto-checks expiry dates daily
  3. If expiryDate - today ≤ 30 days:
     → Alert in dashboard "Certificates Expiring Soon" (Orange ⚠️)
     → Crew shown in warning list
  4. If expiryDate - today < 0 days:
     → Alert in dashboard "Expired Certificates" (Red 🔴)
     → Crew shown in urgent list
  5. Action: /crew/[id]/edit → Update/renew certificate
     → Update expiryDate
     → Save
  6. Alert disappears from dashboard
```

### Sea Service Recording

```
WHEN TO USE:
  - Crew has worked on vessel
  - Need to track vessel assignments
  - Recording past employment history
  - Tracking current/recent assignments

HOW TO USE:
  1. Go to /crew/[id]/sea-service
  2. Click "Add New Sea Service Record"
  3. Fill form:
     - Vessel Name (required)
     - Rank
     - GRT, DWT, Engine Type, BHP
     - Company Name, Flag
     - Sign On, Sign Off dates
     - Remarks
  4. Click "Save"
  5. Record appears in table
  6. Can edit or delete anytime
```

---

## 👥 User Guide

### For HR Manager

**Daily Responsibilities**:

1. **Check Dashboard**
   - Go to `/dashboard`
   - Review KPI cards (total, onboard, available, on leave)
   - Check "Certificates Expiring Soon" section
   - Check "Expired Certificates" section
   - Note action items

2. **Process Applications**
   - Go to `/applications`
   - Review new applications (status = APPLIED)
   - Click application to view details
   - Check HGF-CR-02 form data
   - Update status to SHORTLISTED if qualified
   - Schedule interview
   - Update status to INTERVIEW with interview date & notes
   - After interview:
     - If pass: APPROVED
     - If fail: REJECTED + rejection reason

3. **Manage Crew**
   - Go to `/crew`
   - Search for crew member
   - Click crew name to view detail
   - View relations: certificates, sea service, applications, checklists
   - Click "✏️ Edit" to update crew info
   - Add/manage certificates
   - Add/verify sea service history

4. **Approve Final Status**
   - When crew ready to join: Update application status to OFFERED
   - Add offer date
   - Once crew accepts: Update to ACCEPTED + acceptance date
   - Update crew status to ONBOARD

### For Document Verifier

**Verification Tasks**:

1. **Verify Documents**
   - Crew comes with documents
   - Go to `/crew/[id]`
   - Click "📋 Document Checklist (HGF-CR-01)"
   - Review form fields
   - Check off completed documents:
     - Vessel Name ✓
     - Seaman's Name ✓
     - Birth Date ✓
     - Flag ✓
     - Rank ✓
   - For each document presented:
     - Add document type row
     - Enter Document Number
     - Enter Issue Date
     - Enter Expiry Date
     - Add remarks if needed
   - Click "Save"

2. **Monitor Certificate Expiry**
   - Daily: Go to `/dashboard`
   - Review "Certificates Expiring Soon" (≤30 days)
   - Review "Expired Certificates" (overdue)
   - Contact crew/agent for renewal
   - Track renewal status

3. **Update Crew Certificates**
   - Go to `/crew/[id]/edit`
   - View all certificates in table
   - To add: Click "Add Certificate"
     - Select type (COC, Medical, etc.)
     - Enter issue & expiry dates
     - Enter issuer
     - Add remarks
   - To update: Click "Edit" on certificate row
   - To remove: Click "Delete" with confirmation

### For Operations Team

**Operational Tasks**:

1. **Onboard Crew**
   - Crew joins vessel
   - Go to `/crew/[id]`
   - Click "🌊 Sea Service"
   - Click "Add New Sea Service Record"
   - Fill form:
     - Vessel Name (current vessel)
     - Rank (position on vessel)
     - Vessel specs (GRT, DWT, Engine Type, BHP)
     - Company, Flag
     - Sign On date
     - Remarks
   - Click "Save"
   - Record appears in table

2. **Generate Joining Letter**
   - When crew ready to join
   - Go to `/crew/[id]`
   - Click "📄 Joining Instruction"
   - Fill form:
     - Instruction Text (joining procedures, safety briefing, etc.)
     - Travel Details (flight info, accommodation, meeting point)
     - Issued By (authorizer name)
   - Click "Save"
   - Click "🖨️ Print / PDF"
   - Browser print dialog opens
   - Select "Save as PDF" or print
   - Deliver to crew

3. **Track Crew Status**
   - Update crew status in profile
   - Status options:
     - ACTIVE (available for assignment)
     - INACTIVE (not available)
     - ONBOARD (currently working)
     - STANDBY (waiting for assignment)
     - AVAILABLE (between contracts)
     - ON_LEAVE (on vacation)

4. **Record Sea Service**
   - Track completed assignments
   - Go to `/crew/[id]/sea-service`
   - For past assignments: Add with completed dates
   - For current assignment: Add with start date (end date added later)
   - Update when crew leaves vessel:
     - Click "Edit" on sea service record
     - Update Sign Off date
     - Add remarks (reason for leaving, performance notes)
     - Click "Save"

---

## 💻 Tech Stack

**Frontend**:
- React 18
- TypeScript
- Next.js 14 (App Router)
- CSS-in-JS (inline styles)

**Backend**:
- Next.js API Routes
- Node.js (runtime)

**Database**:
- PostgreSQL 13+
- Prisma 5.22 ORM

**Additional Tools**:
- NextAuth.js (authentication framework ready)
- Dynamic form system (custom component)
- Responsive design (mobile-first)

**Deployment**:
- Docker ready
- Docker Compose configuration

### System Requirements

```
Node.js:    18+
npm:        9+
PostgreSQL: 13+
RAM:        2GB minimum
Storage:    1GB minimum
```

---

## 🔧 Development

### Project Structure

```
hanmarine_shipboard_personnel_system/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── crew/
│   │   │   ├── page.tsx              (crew list)
│   │   │   └── [id]/
│   │   │       ├── page.tsx          (crew detail)
│   │   │       ├── edit/
│   │   │       │   └── page.tsx      (edit crew)
│   │   │       ├── joining-instruction/
│   │   │       │   └── page.tsx
│   │   │       ├── document-checklist/
│   │   │       │   └── page.tsx
│   │   │       └── sea-service/
│   │   │           └── page.tsx
│   │   ├── applications/
│   │   │   ├── page.tsx              (applications list)
│   │   │   ├── form/
│   │   │   │   └── page.tsx          (HGF-CR-02 form)
│   │   │   └── new/
│   │   │       └── page.tsx          (quick application)
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   └── api/
│   │       ├── crew/
│   │       │   └── route.ts
│   │       ├── applications/
│   │       │   └── route.ts
│   │       ├── certificates/
│   │       │   └── route.ts
│   │       ├── sea-service/
│   │       │   └── route.ts
│   │       ├── joining-instructions/
│   │       │   └── route.ts
│   │       ├── checklists/
│   │       │   └── route.ts
│   │       └── forms/
│   │           └── route.ts
│   ├── components/
│   │   └── DynamicForm.tsx
│   └── lib/
│       └── prisma.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│       ├── 20251115045903_add_crewing_models/
│       ├── 20251115061140_add_form_templates/
│       ├── 20251115062013_add_application_status_workflow/
│       └── migration_lock.toml
├── scripts/
│   ├── seed.js
│   ├── seed-forms.js
│   └── extract-excel-fields.js
├── docs/
│   └── CR FORMS/
│       ├── HGF-CR-01 Document check list.xlsx
│       └── HGF-CR-02 APPLICATION FOR EMPLOYMENT.xlsx
├── .env.example
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── next.config.mjs
├── tsconfig.json
├── package.json
└── README.md
```

### Common Commands

```bash
# Development Server
npm run dev                              # Start dev server on http://localhost:3000

# Database Management
npx prisma migrate dev --name "description"   # Create new migration
npx prisma migrate status                     # Check migration status
npx prisma studio                             # Open Prisma Studio (GUI)
npx prisma generate                           # Regenerate Prisma Client

# Database Seeding
npm run seed                             # Seed sample crew & applications
npm run seed:forms                       # Seed form templates (HGF-CR-01, HGF-CR-02)

# Production Build
npm run build                            # Build for production
npm run start                            # Start production server

# Code Quality
npm run lint                             # Run ESLint

# Docker
docker compose up -d --build             # Build & run with Docker Compose
docker compose logs -f                   # View logs
docker compose down                      # Stop services
```

### Adding New Fields to Crew

**Step 1**: Update Prisma Schema
```bash
# Edit prisma/schema.prisma
# Add field to Crew model
model Crew {
  ...existing fields...
  newFieldName: string?  // or appropriate type
}
```

**Step 2**: Create Migration
```bash
npx prisma migrate dev --name "add_new_field_name"
```

**Step 3**: Update Frontend
- Edit `/crew/[id]/edit/page.tsx`
- Add input field for new property
- Update form submission

**Step 4**: Restart Server
```bash
npm run dev
```

### Adding New Forms

**Step 1**: Define Form in Database
Edit `scripts/seed-forms.js`:
```javascript
// Add new form template
{
  code: 'HGF-CR-XX',
  name: 'New Form Name',
  description: 'Description',
  fields: [
    {
      name: 'fieldName',
      label: 'Field Label',
      type: 'text', // or number, date, etc.
      section: 'Section Name',
      required: true,
      repeating: false
    },
    // ... more fields
  ]
}
```

**Step 2**: Seed Form
```bash
npm run seed:forms
```

**Step 3**: Create Form Page
Create `/app/forms/[formCode]/page.tsx`

**Step 4**: Use DynamicForm Component
```typescript
import DynamicForm from '@/components/DynamicForm';

export default function FormPage() {
  return (
    <DynamicForm formCode="HGF-CR-XX" crewId={id} />
  );
}
```

---

## 📝 Notes & Best Practices

### Data Validation

- ✅ All APIs validate required fields before saving
- ✅ Dates validated (expiry > issue date for certificates)
- ✅ Crew status restricted to predefined values
- ✅ Email & phone number format validation (in frontend)
- ✅ Number fields (GRT, DWT, BHP) validated as positive integers

### Performance Optimization

- ✅ Dashboard queries optimized with Prisma relations
- ✅ Sea service records indexed by crewId for fast queries
- ✅ Certificate queries optimized for expiry date sorting
- ✅ Form submissions support pagination (ready for implementation)
- ✅ No N+1 queries (using Prisma include)

### Security Best Practices

**Current State**:
- API endpoints accept any request (no auth yet)
- Database connection secured via environment variable

**Future Enhancements**:
- Implement NextAuth.js authentication
- Add role-based access control (HR, Operations, Admin, Verifier)
- Validate user permissions on every API endpoint
- Audit logging for sensitive changes
- Rate limiting on API endpoints
- Input sanitization for XSS prevention

### Mobile Responsiveness

- ✅ All pages use responsive grid layout
- ✅ Forms stack vertically on mobile devices
- ✅ Tables scroll horizontally on small screens
- ✅ Button groups stack vertically on mobile
- ✅ Font sizes optimized for readability
- ✅ Touch-friendly tap targets (minimum 44x44px)

### Database Maintenance

**Backup**:
```bash
# PostgreSQL backup
pg_dump hanmarine > backup.sql

# Restore
psql hanmarine < backup.sql
```

**Optimization**:
```bash
# Clear old migrations (archive after deployment)
# Vacuum database
VACUUM ANALYZE;
```

---

## 🆘 Troubleshooting

### Server won't start

```bash
# 1. Check for node processes
Get-Process node

# 2. Kill old processes
Get-Process node | Stop-Process -Force

# 3. Clear cache
Remove-Item -Recurse .next

# 4. Restart
npm run dev
```

### Database connection error

```bash
# 1. Verify PostgreSQL running
psql -U postgres

# 2. Check DATABASE_URL in .env
# Should be: postgresql://user:password@localhost:5433/hanmarine?schema=public

# 3. Regenerate Prisma client
npx prisma generate

# 4. Check migration status
npx prisma migrate status

# 5. Apply pending migrations
npx prisma migrate deploy
```

### Forms not loading

```bash
# 1. Check form templates seeded
npx prisma studio
# Look for FormTemplate records for HGF-CR-01 & HGF-CR-02

# 2. Verify FormField records exist
# Each template should have fields

# 3. Re-seed if missing
npm run seed:forms

# 4. Check browser console for JavaScript errors
# Open DevTools (F12) → Console tab
```

### Certificate expiry not showing alerts

```bash
# 1. Refresh dashboard (F5)
# 2. Check certificate expiryDate is set
# 3. Verify date format (should be ISO 8601)
# 4. Check Prisma Studio for certificate data
# 5. Verify dashboard calculation logic in code
```

### Application status not updating

```bash
# 1. Check API response in network tab (F12 → Network)
# 2. Verify crewId exists
# 3. Check that status value is valid
# 4. Review API error message
# 5. Check database for application record
```

---

## 📞 Support & Debugging

### Getting Help

**For Issues**:
1. Check server logs in terminal for errors
2. Check browser console (F12 → Console) for client-side errors
3. Check network tab (F12 → Network) for API response errors
4. Verify database connection: `npx prisma db execute --stdin < query.sql`
5. Check Prisma Studio: `npx prisma studio` (opens GUI)

**Useful Debug Commands**:
```bash
# Check database status
npx prisma db push --force-reset  # WARNING: Deletes all data!

# View database GUI
npx prisma studio

# Check migration status
npx prisma migrate status

# View Prisma logs
npm run dev -- --log-level debug
```

---

## 📄 License & Credits

**Development Date**: November 2025  
**Version**: 1.0.0  
**Status**: PRODUCTION READY  

**Features**: 
- Crew Management System ✅
- Certificate Tracking ✅
- Dynamic HR Forms (HGF-CR-01, HGF-CR-02) ✅
- Application Workflow ✅
- Sea Service Management ✅
- Dashboard & Monitoring ✅

---

**Last Updated**: November 15, 2025  
**Next Refinement Tasks**: Crew Evaluation Forms, Repatriation Workflow, Advanced Validation, Email Integration
