# 🔌 HanMarine API Documentation

**Complete API Reference for Shipboard Personnel System**

---

## 📋 Table of Contents

1. [API Overview](#api-overview)
2. [Authentication](#authentication)
3. [Crew API](#crew-api)
4. [Certificate API](#certificate-api)
5. [Application API](#application-api)
6. [Forms API](#forms-api)
7. [Sea Service API](#sea-service-api)
8. [Joining Instructions API](#joining-instructions-api)
9. [Error Handling](#error-handling)
10. [Examples](#examples)

---

## API Overview

### Base URL
```
http://localhost:3000/api
```

### Content-Type
All requests and responses use `application/json`

### Response Format
```json
{
  "data": {},           // Response data
  "error": null,        // Error message if any
  "status": 200         // HTTP status code
}
```

---

## Authentication

**Current State**: No authentication required (ready for NextAuth.js implementation)

**Future**: Will require Bearer token in header
```
Authorization: Bearer <token>
```

---

## Crew API

### List All Crew

**Endpoint**: `GET /api/crew`

**Query Parameters**:
- `limit` (optional): Number of records to return (default: 100)
- `offset` (optional): Number of records to skip (default: 0)
- `status` (optional): Filter by status (ACTIVE, INACTIVE, ONBOARD, etc.)
- `search` (optional): Search by name or rank

**Request**:
```bash
GET http://localhost:3000/api/crew
```

**Response**:
```json
[
  {
    "id": 1,
    "fullName": "John Smith",
    "rank": "Master",
    "vessel": "MV Golden Star",
    "status": "ONBOARD",
    "dateOfBirth": "1980-05-15T00:00:00Z",
    "placeOfBirth": "London, UK",
    "religion": "Christian",
    "address": "123 Main St, London",
    "phoneMobile": "+44123456789",
    "phoneHome": "+44987654321",
    "bloodType": "O+",
    "heightCm": 180,
    "weightKg": 75,
    "crewStatus": "ACTIVE"
  }
]
```

**Status Codes**:
- `200`: Success
- `400`: Invalid parameters
- `500`: Server error

---

### Get Specific Crew

**Endpoint**: `GET /api/crew?id=<crewId>`

**Query Parameters**:
- `id` (required): Crew ID

**Request**:
```bash
GET http://localhost:3000/api/crew?id=1
```

**Response**:
```json
{
  "id": 1,
  "fullName": "John Smith",
  "rank": "Master",
  "vessel": "MV Golden Star",
  "status": "ONBOARD",
  ... other fields ...,
  "certificates": [
    {
      "id": 1,
      "type": "COC",
      "issueDate": "2020-01-15",
      "expiryDate": "2025-01-15",
      "issuer": "Maritime Authority",
      "remarks": "Valid"
    }
  ],
  "seaServices": [
    {
      "id": 1,
      "vesselName": "MV Golden Star",
      "rank": "Master",
      "grt": 50000,
      "signOn": "2024-06-01",
      "signOff": null
    }
  ],
  "applications": [],
  "joiningInstructions": []
}
```

---

### Create Crew

**Endpoint**: `POST /api/crew`

**Request Body**:
```json
{
  "fullName": "Jane Doe",
  "rank": "Chief Officer",
  "vessel": "MV Ocean Explorer",
  "status": "AVAILABLE",
  "dateOfBirth": "1985-03-20",
  "placeOfBirth": "Singapore",
  "religion": "Buddhist",
  "address": "456 River Road, Singapore",
  "phoneMobile": "+6581234567",
  "phoneHome": "+6567654321",
  "bloodType": "A+",
  "heightCm": 165,
  "weightKg": 60
}
```

**Request**:
```bash
curl -X POST http://localhost:3000/api/crew \
  -H "Content-Type: application/json" \
  -d '{"fullName": "Jane Doe", "rank": "Chief Officer", ...}'
```

**Response** (201 Created):
```json
{
  "id": 2,
  "fullName": "Jane Doe",
  "rank": "Chief Officer",
  ... (all fields with defaults)
}
```

**Error Response** (400 Bad Request):
```json
{
  "error": "fullName is required"
}
```

---

## Certificate API

### List Crew Certificates

**Endpoint**: `GET /api/certificates?crewId=<crewId>`

**Query Parameters**:
- `crewId` (required): Crew ID

**Request**:
```bash
GET http://localhost:3000/api/certificates?crewId=1
```

**Response**:
```json
[
  {
    "id": 1,
    "crewId": 1,
    "type": "COC",
    "issueDate": "2020-01-15T00:00:00Z",
    "expiryDate": "2025-01-15T00:00:00Z",
    "issuer": "IMO",
    "remarks": "Valid Certificate of Competency"
  },
  {
    "id": 2,
    "crewId": 1,
    "type": "Medical",
    "issueDate": "2023-06-01T00:00:00Z",
    "expiryDate": "2026-06-01T00:00:00Z",
    "issuer": "Maritime Medical Center",
    "remarks": "Medical fitness certificate"
  }
]
```

---

### Add Certificate

**Endpoint**: `POST /api/certificates`

**Request Body**:
```json
{
  "crewId": 1,
  "type": "STCW",
  "issueDate": "2023-01-15",
  "expiryDate": "2026-01-15",
  "issuer": "Philippine Maritime Authority",
  "remarks": "Advanced Fire Fighting"
}
```

**Required Fields**:
- `crewId`: Crew ID
- `type`: Certificate type

**Request**:
```bash
curl -X POST http://localhost:3000/api/certificates \
  -H "Content-Type: application/json" \
  -d '{"crewId": 1, "type": "STCW", ...}'
```

**Response** (201 Created):
```json
{
  "id": 3,
  "crewId": 1,
  "type": "STCW",
  "issueDate": "2023-01-15T00:00:00Z",
  "expiryDate": "2026-01-15T00:00:00Z",
  "issuer": "Philippine Maritime Authority",
  "remarks": "Advanced Fire Fighting"
}
```

---

### Update Certificate

**Endpoint**: `PUT /api/certificates`

**Request Body**:
```json
{
  "id": 1,
  "expiryDate": "2027-01-15",
  "remarks": "Renewed"
}
```

**Required Fields**:
- `id`: Certificate ID

**Optional Fields**: Any certificate field to update

**Request**:
```bash
curl -X PUT http://localhost:3000/api/certificates \
  -H "Content-Type: application/json" \
  -d '{"id": 1, "expiryDate": "2027-01-15"}'
```

**Response** (200 OK):
```json
{
  "id": 1,
  "crewId": 1,
  "type": "COC",
  "issueDate": "2020-01-15T00:00:00Z",
  "expiryDate": "2027-01-15T00:00:00Z",
  "issuer": "IMO",
  "remarks": "Renewed"
}
```

---

### Delete Certificate

**Endpoint**: `DELETE /api/certificates?id=<certificateId>`

**Query Parameters**:
- `id` (required): Certificate ID

**Request**:
```bash
curl -X DELETE http://localhost:3000/api/certificates?id=1
```

**Response** (200 OK):
```json
{
  "id": 1,
  "message": "Certificate deleted successfully"
}
```

**Error Response** (404 Not Found):
```json
{
  "error": "Certificate not found"
}
```

---

## Application API

### List All Applications

**Endpoint**: `GET /api/applications`

**Query Parameters**:
- `crewId` (optional): Filter by crew ID

**Request**:
```bash
GET http://localhost:3000/api/applications
GET http://localhost:3000/api/applications?crewId=1
```

**Response**:
```json
[
  {
    "id": 1,
    "crewId": 1,
    "appliedRank": "Master",
    "applicationDate": "2024-11-01T00:00:00Z",
    "status": "INTERVIEW",
    "interviewDate": "2024-11-15T10:00:00Z",
    "interviewNotes": "Excellent performance, strong candidates",
    "offeredDate": null,
    "acceptedDate": null,
    "rejectionReason": null,
    "notes": "Waiting for interview result",
    "crew": {
      "id": 1,
      "fullName": "John Smith"
    }
  }
]
```

---

### Create Application

**Endpoint**: `POST /api/applications`

**Request Body**:
```json
{
  "crewId": 1,
  "appliedRank": "Master",
  "applicationDate": "2024-11-01",
  "notes": "Applying for Master position on MV Golden Star"
}
```

**Required Fields**:
- `crewId`: Crew ID to apply

**Optional Fields**:
- `appliedRank`: Rank applied for
- `applicationDate`: Application date (default: now)
- `notes`: Additional notes

**Request**:
```bash
curl -X POST http://localhost:3000/api/applications \
  -H "Content-Type: application/json" \
  -d '{"crewId": 1, "appliedRank": "Master"}'
```

**Response** (201 Created):
```json
{
  "id": 1,
  "crewId": 1,
  "appliedRank": "Master",
  "applicationDate": "2024-11-01T00:00:00Z",
  "status": "APPLIED",
  "interviewDate": null,
  "interviewNotes": null,
  "offeredDate": null,
  "acceptedDate": null,
  "rejectionReason": null,
  "notes": "Applying for Master position on MV Golden Star"
}
```

---

### Update Application Status

**Endpoint**: `PUT /api/applications`

**Request Body**:
```json
{
  "id": 1,
  "status": "INTERVIEW",
  "interviewDate": "2024-11-15T10:00:00",
  "interviewNotes": "Excellent performance"
}
```

**Status Progression**:
```
APPLIED → SHORTLISTED → INTERVIEW → APPROVED → OFFERED → ACCEPTED
                                            ↘ REJECTED (any stage)
```

**Allowed Field Updates**:
- `status`: New status value
- `interviewDate`: When updating to INTERVIEW
- `interviewNotes`: Interview feedback
- `offeredDate`: When updating to OFFERED
- `acceptedDate`: When updating to ACCEPTED
- `rejectionReason`: When updating to REJECTED

**Request**:
```bash
curl -X PUT http://localhost:3000/api/applications \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "status": "INTERVIEW",
    "interviewDate": "2024-11-15T10:00:00Z",
    "interviewNotes": "Good candidate"
  }'
```

**Response** (200 OK):
```json
{
  "id": 1,
  "crewId": 1,
  "status": "INTERVIEW",
  "interviewDate": "2024-11-15T10:00:00Z",
  "interviewNotes": "Good candidate",
  "offeredDate": null,
  "acceptedDate": null,
  "rejectionReason": null
}
```

---

## Forms API

### Get Form Template

**Endpoint**: `GET /api/forms?code=<formCode>`

**Query Parameters**:
- `code` (required): Form code (HGF-CR-01, HGF-CR-02, etc.)

**Request**:
```bash
GET http://localhost:3000/api/forms?code=HGF-CR-01
```

**Response**:
```json
{
  "id": 1,
  "code": "HGF-CR-01",
  "name": "Document Checklist",
  "description": "Crew document verification checklist",
  "fields": [
    {
      "id": 1,
      "name": "vesselName",
      "label": "Vessel Name",
      "type": "text",
      "section": "Metadata",
      "required": true,
      "repeating": false,
      "placeholder": "Enter vessel name",
      "options": null,
      "order": 1
    },
    {
      "id": 2,
      "name": "seamanName",
      "label": "Seaman's Name",
      "type": "text",
      "section": "Metadata",
      "required": true,
      "repeating": false,
      "placeholder": "Enter seaman name",
      "options": null,
      "order": 2
    }
    // ... more fields ...
  ]
}
```

---

### Get Form Submission

**Endpoint**: `GET /api/forms?submissionId=<submissionId>`

**Query Parameters**:
- `submissionId` (required): Form submission ID

**Request**:
```bash
GET http://localhost:3000/api/forms?submissionId=1
```

**Response**:
```json
{
  "id": 1,
  "templateId": 1,
  "crewId": 1,
  "applicationId": null,
  "submittedAt": "2024-11-01T10:00:00Z",
  "updatedAt": "2024-11-01T10:00:00Z",
  "status": "DRAFT",
  "data": [
    {
      "id": 1,
      "fieldName": "vesselName",
      "value": "MV Golden Star",
      "rowIndex": 0
    },
    {
      "id": 2,
      "fieldName": "seamanName",
      "value": "John Smith",
      "rowIndex": 0
    }
    // ... more field values ...
  ]
}
```

---

### Create Form Submission

**Endpoint**: `POST /api/forms`

**Request Body**:
```json
{
  "templateId": 1,
  "crewId": 1,
  "applicationId": null,
  "status": "DRAFT",
  "data": {
    "vesselName": "MV Golden Star",
    "seamanName": "John Smith",
    "birthDate": "1980-05-15",
    "flag": "Singapore",
    "rank": "Master"
  }
}
```

**Required Fields**:
- `templateId`: Form template ID

**Optional Fields**:
- `crewId`: Associated crew ID
- `applicationId`: Associated application ID
- `status`: Submission status (default: DRAFT)
- `data`: Form field values as object

**Request**:
```bash
curl -X POST http://localhost:3000/api/forms \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": 1,
    "crewId": 1,
    "status": "DRAFT",
    "data": {"vesselName": "MV Golden Star", ...}
  }'
```

**Response** (201 Created):
```json
{
  "id": 1,
  "templateId": 1,
  "crewId": 1,
  "status": "DRAFT",
  "submittedAt": "2024-11-01T10:00:00Z",
  "data": [...]
}
```

---

### Update Form Submission

**Endpoint**: `PUT /api/forms`

**Request Body**:
```json
{
  "id": 1,
  "status": "SUBMITTED",
  "data": {
    "vesselName": "MV Ocean Explorer",
    "seamanName": "John Smith"
  }
}
```

**Required Fields**:
- `id`: Submission ID

**Optional Fields**:
- `status`: Update status
- `data`: Update field values

**Request**:
```bash
curl -X PUT http://localhost:3000/api/forms \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "status": "SUBMITTED",
    "data": {"vesselName": "MV Ocean Explorer"}
  }'
```

**Response** (200 OK):
```json
{
  "id": 1,
  "templateId": 1,
  "status": "SUBMITTED",
  "updatedAt": "2024-11-01T10:30:00Z",
  "data": [...]
}
```

---

## Sea Service API

### List Sea Service Records

**Endpoint**: `GET /api/sea-service?crewId=<crewId>`

**Query Parameters**:
- `crewId` (required): Crew ID

**Request**:
```bash
GET http://localhost:3000/api/sea-service?crewId=1
```

**Response**:
```json
[
  {
    "id": 1,
    "crewId": 1,
    "vesselName": "MV Golden Star",
    "rank": "Master",
    "grt": 50000,
    "dwt": 80000,
    "engineType": "Diesel",
    "bhp": 15000,
    "companyName": "Golden Shipping Co",
    "flag": "Singapore",
    "signOn": "2024-06-01T00:00:00Z",
    "signOff": null,
    "remarks": "Current assignment"
  },
  {
    "id": 2,
    "crewId": 1,
    "vesselName": "MV Ocean Explorer",
    "rank": "Chief Officer",
    "grt": 35000,
    "dwt": 55000,
    "engineType": "Diesel",
    "bhp": 12000,
    "companyName": "Ocean Shipping Ltd",
    "flag": "Panama",
    "signOn": "2023-01-15T00:00:00Z",
    "signOff": "2024-05-31T00:00:00Z",
    "remarks": "Completed contract satisfactorily"
  }
]
```

**Note**: Records are ordered by signOn DESC (newest first)

---

### Add Sea Service Record

**Endpoint**: `POST /api/sea-service`

**Request Body**:
```json
{
  "crewId": 1,
  "vesselName": "MV Golden Star",
  "rank": "Master",
  "grt": 50000,
  "dwt": 80000,
  "engineType": "Diesel",
  "bhp": 15000,
  "companyName": "Golden Shipping Co",
  "flag": "Singapore",
  "signOn": "2024-06-01",
  "signOff": null,
  "remarks": "Current assignment"
}
```

**Required Fields**:
- `crewId`: Crew ID
- `vesselName`: Vessel name

**Optional Fields**: All other fields

**Request**:
```bash
curl -X POST http://localhost:3000/api/sea-service \
  -H "Content-Type: application/json" \
  -d '{
    "crewId": 1,
    "vesselName": "MV Golden Star",
    "rank": "Master",
    "grt": 50000,
    ...
  }'
```

**Response** (201 Created):
```json
{
  "id": 1,
  "crewId": 1,
  "vesselName": "MV Golden Star",
  "rank": "Master",
  "grt": 50000,
  "dwt": 80000,
  "engineType": "Diesel",
  "bhp": 15000,
  "companyName": "Golden Shipping Co",
  "flag": "Singapore",
  "signOn": "2024-06-01T00:00:00Z",
  "signOff": null,
  "remarks": "Current assignment"
}
```

---

### Update Sea Service Record

**Endpoint**: `PUT /api/sea-service`

**Request Body**:
```json
{
  "id": 1,
  "signOff": "2024-11-30",
  "remarks": "Contract completed"
}
```

**Required Fields**:
- `id`: Sea service record ID

**Optional Fields**: Any field to update

**Request**:
```bash
curl -X PUT http://localhost:3000/api/sea-service \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "signOff": "2024-11-30",
    "remarks": "Contract completed"
  }'
```

**Response** (200 OK):
```json
{
  "id": 1,
  "crewId": 1,
  "vesselName": "MV Golden Star",
  "rank": "Master",
  "grt": 50000,
  "signOn": "2024-06-01T00:00:00Z",
  "signOff": "2024-11-30T00:00:00Z",
  "remarks": "Contract completed"
}
```

---

### Delete Sea Service Record

**Endpoint**: `DELETE /api/sea-service?id=<recordId>`

**Query Parameters**:
- `id` (required): Sea service record ID

**Request**:
```bash
curl -X DELETE http://localhost:3000/api/sea-service?id=1
```

**Response** (200 OK):
```json
{
  "id": 1,
  "message": "Sea service record deleted successfully"
}
```

---

## Joining Instructions API

### List Joining Instructions

**Endpoint**: `GET /api/joining-instructions?crewId=<crewId>`

**Query Parameters**:
- `crewId` (optional): Filter by crew ID

**Request**:
```bash
GET http://localhost:3000/api/joining-instructions?crewId=1
```

**Response**:
```json
[
  {
    "id": 1,
    "crewId": 1,
    "applicationId": null,
    "instructionText": "Report to vessel at Singapore port. Undergo safety briefing...",
    "travelDetails": "Flight SQ123 arrives Singapore 15-Nov-2024 14:00. Hotel Holiday Inn reserved.",
    "issuedAt": "2024-11-10T00:00:00Z",
    "issuedBy": "HR Manager John Doe"
  }
]
```

---

### Create Joining Instruction

**Endpoint**: `POST /api/joining-instructions`

**Request Body**:
```json
{
  "crewId": 1,
  "instructionText": "1. Report to vessel at Singapore port\n2. Undergo safety briefing\n3. Sign on documents",
  "travelDetails": "Flight SQ123 arrives Singapore 15-Nov-2024. Hotel Holiday Inn reserved.",
  "issuedBy": "HR Manager John Doe"
}
```

**Required Fields**:
- `crewId` or `applicationId`: Associated crew or application
- `instructionText`: Joining procedures

**Optional Fields**:
- `travelDetails`: Travel information
- `issuedBy`: Authorizer name

**Request**:
```bash
curl -X POST http://localhost:3000/api/joining-instructions \
  -H "Content-Type: application/json" \
  -d '{
    "crewId": 1,
    "instructionText": "1. Report to vessel...",
    "travelDetails": "Flight SQ123...",
    "issuedBy": "HR Manager John Doe"
  }'
```

**Response** (201 Created):
```json
{
  "id": 1,
  "crewId": 1,
  "instructionText": "1. Report to vessel...",
  "travelDetails": "Flight SQ123...",
  "issuedAt": "2024-11-10T00:00:00Z",
  "issuedBy": "HR Manager John Doe"
}
```

---

### Update Joining Instruction

**Endpoint**: `PUT /api/joining-instructions`

**Request Body**:
```json
{
  "id": 1,
  "instructionText": "Updated joining procedures",
  "travelDetails": "Flight SQ124 (changed from SQ123)"
}
```

**Required Fields**:
- `id`: Joining instruction ID

**Optional Fields**: Any field to update

**Request**:
```bash
curl -X PUT http://localhost:3000/api/joining-instructions \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "instructionText": "Updated joining procedures"
  }'
```

**Response** (200 OK):
```json
{
  "id": 1,
  "crewId": 1,
  "instructionText": "Updated joining procedures",
  "travelDetails": "Flight SQ124 (changed from SQ123)",
  "issuedAt": "2024-11-10T00:00:00Z",
  "issuedBy": "HR Manager John Doe"
}
```

---

### Delete Joining Instruction

**Endpoint**: `DELETE /api/joining-instructions?id=<instructionId>`

**Query Parameters**:
- `id` (required): Joining instruction ID

**Request**:
```bash
curl -X DELETE http://localhost:3000/api/joining-instructions?id=1
```

**Response** (200 OK):
```json
{
  "id": 1,
  "message": "Joining instruction deleted successfully"
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Missing required field |
| 404 | Not Found | Record doesn't exist |
| 500 | Server Error | Database error |

### Error Response Format

```json
{
  "error": "Error message describing what went wrong"
}
```

### Common Errors

**Missing Required Field**:
```json
{
  "error": "crewId is required"
}
```

**Record Not Found**:
```json
{
  "error": "Crew not found"
}
```

**Invalid Status Transition**:
```json
{
  "error": "Cannot transition from OFFERED to APPLIED"
}
```

**Database Error**:
```json
{
  "error": "Database error: connection failed"
}
```

---

## Examples

### Example 1: Complete Crew Onboarding Workflow

**Step 1: Create Crew**
```bash
curl -X POST http://localhost:3000/api/crew \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Captain Ahmed Hassan",
    "rank": "Master",
    "status": "AVAILABLE",
    "dateOfBirth": "1975-08-12",
    "placeOfBirth": "Cairo, Egypt",
    "religion": "Islam",
    "address": "123 Nile Road, Cairo",
    "phoneMobile": "+20123456789"
  }'
```

**Step 2: Add Certificate**
```bash
curl -X POST http://localhost:3000/api/certificates \
  -H "Content-Type: application/json" \
  -d '{
    "crewId": 1,
    "type": "COC",
    "issueDate": "2022-01-15",
    "expiryDate": "2027-01-15",
    "issuer": "Egyptian Maritime Authority"
  }'
```

**Step 3: Create Application**
```bash
curl -X POST http://localhost:3000/api/applications \
  -H "Content-Type: application/json" \
  -d '{
    "crewId": 1,
    "appliedRank": "Master",
    "notes": "Applying for Master on MV Golden Star"
  }'
```

**Step 4: Update Application Status**
```bash
curl -X PUT http://localhost:3000/api/applications \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "status": "INTERVIEW",
    "interviewDate": "2024-11-20T10:00:00Z",
    "interviewNotes": "Excellent candidate, strong experience"
  }'
```

**Step 5: Add Sea Service**
```bash
curl -X POST http://localhost:3000/api/sea-service \
  -H "Content-Type: application/json" \
  -d '{
    "crewId": 1,
    "vesselName": "MV Golden Star",
    "rank": "Master",
    "grt": 50000,
    "dwt": 80000,
    "engineType": "Diesel",
    "bhp": 15000,
    "companyName": "Golden Shipping",
    "flag": "Singapore",
    "signOn": "2024-11-01"
  }'
```

**Step 6: Generate Joining Instruction**
```bash
curl -X POST http://localhost:3000/api/joining-instructions \
  -H "Content-Type: application/json" \
  -d '{
    "crewId": 1,
    "instructionText": "Report to MV Golden Star at Singapore port Terminal 3. Sign-on date: 1 Nov 2024 at 14:00 hrs. Undergo mandatory safety briefing.",
    "travelDetails": "Flight EY456 arrives Singapore 31-Oct-2024 at 22:00. Hotel: Marina Bay Sands. Contact: HR Manager +65 6123 4567",
    "issuedBy": "Captain John Smith, Fleet Manager"
  }'
```

---

### Example 2: Submit HGF-CR-02 Application Form

**Get Form Template**:
```bash
curl http://localhost:3000/api/forms?code=HGF-CR-02
```

**Create Form Submission**:
```bash
curl -X POST http://localhost:3000/api/forms \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": 2,
    "crewId": 1,
    "applicationId": 1,
    "status": "SUBMITTED",
    "data": {
      "shipName": "MV Golden Star",
      "familyName": "Hassan",
      "givenName": "Ahmed",
      "rank": "Master",
      "birthDate": "1975-08-12",
      "height": "182",
      "weight": "78",
      "nationality": "Egyptian",
      "seamanBookNumber": "EGY123456",
      "address": "123 Nile Road, Cairo, Egypt",
      "religion": "Islam",
      "maritalStatus": "Married",
      "lastSchool": "Cairo High School",
      "course": "Master of Ships",
      "courseFrom": "2000",
      "courseTo": "2002",
      "family": [
        {
          "relation": "Spouse",
          "name": "Fatima Hassan",
          "birthDate": "1978-03-20",
          "occupation": "Teacher"
        },
        {
          "relation": "Son",
          "name": "Mohamed Hassan",
          "birthDate": "2005-06-15",
          "occupation": "Student"
        }
      ],
      "seaExperience": [
        {
          "vesselName": "MV Ocean Explorer",
          "rank": "Chief Officer",
          "signOn": "2022-01-15",
          "signOff": "2023-06-30",
          "type": "Container",
          "engine": "Diesel",
          "grt": "35000",
          "hp": "12000",
          "agency": "Ocean Shipping Ltd",
          "principal": "Maersk Line",
          "reason": "End of contract"
        }
      ]
    }
  }'
```

---

**Last Updated**: November 15, 2025  
**API Version**: 1.0.0
