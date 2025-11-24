# 🔐 Login Instructions

## ✅ USERS SUDAH DIBUAT!

Database sudah di-seed dengan 7 user accounts. Sekarang bisa login!

---

## 🚀 CARA LOGIN:

### 1. Buka browser:
```
http://localhost:3000
```

### 2. Akan auto-redirect ke login page:
```
http://localhost:3000/login
```

### 3. Gunakan salah satu account berikut:

---

## 👥 DEFAULT ACCOUNTS:

| Role | Username | Password | Email |
|------|----------|----------|-------|
| 🏢 **Director** | `director` | `hanmarine123` | director@hanmarine.com |
| ⚓ **Crewing Manager** | `crewing` | `hanmarine123` | crewing@hanmarine.com |
| 🎓 **Expert Staff** | `expert` | `hanmarine123` | expert@hanmarine.com |
| 📄 **Documentation Officer** | `documentation` | `hanmarine123` | documentation@hanmarine.com |
| 💰 **Accounting Officer** | `accounting` | `hanmarine123` | accounting@hanmarine.com |
| 📚 **Training Officer** | `training` | `hanmarine123` | training@hanmarine.com |
| 🔧 **Operational Staff** | `operational` | `hanmarine123` | operational@hanmarine.com |

---

## 🔑 QUICK LOGIN:

**Untuk full access, gunakan:**
- Username: `director`
- Password: `hanmarine123`

**Atau untuk crewing operations:**
- Username: `crewing`
- Password: `hanmarine123`

---

## 📋 PERMISSIONS PER ROLE:

### 🏢 DIRECTOR (Full Access)
- ✅ All pages and features
- ✅ Approve applications
- ✅ Manage all data

### ⚓ CREWING MANAGER
- ✅ Dashboard, Crew, Applications
- ✅ Onboarding Workflow
- ✅ CV Generator
- ✅ Certificates
- ✅ Replacement Schedule
- ✅ Vessels, Reports

### 🎓 EXPERT STAFF
- ✅ Dashboard, Crew, Applications
- ✅ Onboarding Workflow
- ✅ CV Generator
- ✅ Certificates
- ✅ Vessels

### 📄 DOCUMENTATION OFFICER
- ✅ Dashboard, Crew, Applications
- ✅ Documents, Forms, Checklists
- ✅ Onboarding Workflow
- ✅ CV Generator
- ✅ Certificates

### 💰 ACCOUNTING OFFICER
- ✅ Dashboard, Crew
- ✅ Applications, Documents
- ✅ Certificates

### 📚 TRAINING OFFICER
- ✅ Dashboard, Crew, Applications
- ✅ Documents, Forms, Checklists
- ✅ Certificates
- ✅ Recruitment/Positions

### 🔧 OPERATIONAL STAFF
- ✅ Dashboard
- ✅ Crew, Vessels
- ✅ Certificates
- ✅ Recruitment/Positions

---

## 🔄 SETELAH LOGIN:

1. **Redirect ke Dashboard** automatically
2. **Access Features:**
   - 📊 Dashboard → Stats & alerts
   - 👥 Crew → Manage crew
   - 🔄 Workflow → Onboarding process
   - 📄 CV Generator → Generate CV per flag
   - 📜 Certificates → Certificate reference
   - 🚢 Positions → Rank system
   - 📝 Applications → Forms

---

## 🛠️ TROUBLESHOOTING:

### Problem: "Invalid credentials"
**Solution:** 
- Pastikan username lowercase: `director` bukan `Director`
- Password: `hanmarine123` (case sensitive)

### Problem: "Account is deactivated"
**Solution:** 
- Jalankan lagi: `node scripts/seed-users.js`

### Problem: Redirect loop ke /login
**Solution:**
- Clear browser cookies
- Restart dev server: `npm run dev`

### Problem: "Unauthorized" error
**Solution:**
- Login dengan role yang punya permission
- Director punya full access

---

## 🧪 TEST LOGIN:

```bash
# 1. Pastikan dev server running
npm run dev

# 2. Buka browser
http://localhost:3000

# 3. Login dengan:
Username: director
Password: hanmarine123

# 4. Cek akses semua pages:
- http://localhost:3000/dashboard
- http://localhost:3000/onboarding
- http://localhost:3000/cv-generator
- http://localhost:3000/certificates
- http://localhost:3000/recruitment
```

---

## 📞 AUTHENTICATION FLOW:

```
User opens http://localhost:3000
          ↓
     middleware.ts checks cookie
          ↓
    No cookie? → Redirect to /login
          ↓
    User enters credentials
          ↓
    POST /api/auth/login
          ↓
    Verify with database (bcrypt)
          ↓
    Set user_session cookie
          ↓
    Redirect to /dashboard
          ↓
    Middleware allows access based on role
```

---

## 🔐 SECURITY FEATURES:

- ✅ Password hashing dengan bcrypt
- ✅ HTTP-only cookies
- ✅ Role-based access control (RBAC)
- ✅ Session validation on every request
- ✅ Last login tracking
- ✅ Active/inactive account status

---

## 💡 TIPS:

1. **Development:** Gunakan `director` account untuk test semua fitur
2. **Testing RBAC:** Login dengan different roles untuk test permissions
3. **Production:** Ganti password default sebelum deploy
4. **Logout:** Hapus cookie `user_session` dari browser DevTools

---

## ✅ STATUS:

- ✅ Users created in database
- ✅ Login page ready
- ✅ Authentication API working
- ✅ Middleware configured
- ✅ Role permissions set
- ✅ Cookie-based sessions

**SIAP LOGIN SEKARANG! 🎉**
