# 🚑 Quick Fix - Prisma Configuration Error

## Problem: "Failed to parse syntax of config file at prisma.config.js"

### ⚡ Quick Fix (< 1 minute)

**Option 1: Automated (Recommended)**
```bash
# Linux/macOS/WSL:
./fix-prisma-setup.sh

# Windows PowerShell:
.\fix-prisma-setup.ps1
```

**Option 2: Manual**
```bash
# 1. Delete problematic files (if they exist)
rm -f prisma.config.js prisma.config.ts *.bak

# 2. Reinstall dependencies (auto-generates Prisma Client)
npm install

# 3. Verify it works
npx prisma version
```

---

## Why This Happens

❌ **Problem**: You have a `prisma.config.js` or `prisma.config.ts` file that shouldn't exist

✅ **Solution**: This project uses the **standard Prisma setup** - only `prisma/schema.prisma` is needed

---

## Node.js Version Issues

⚠️ **If you see errors after fixing config:**

**Check your Node.js version:**
```bash
node -v
```

**Required:** v18.x or v20.x (LTS)
**NOT compatible:** v24.x (doesn't exist - you may have a typo in your version)

**Fix it:**
```bash
# Using NVM (recommended):
nvm install 20
nvm use 20

# Then reinstall:
npm install
```

---

## WSL Users (Windows Subsystem for Linux)

**Issue**: Running commands from Windows CMD/PowerShell in a WSL directory causes "UNC path not supported" errors

**Fix**: Run all commands inside WSL:
```bash
# Open WSL terminal
wsl

# Navigate to project
cd ~/projects/hanmarine_shipboard_personnel_system

# Run commands in WSL
npm install
npm run dev
```

---

## Verify Everything Works

```bash
# 1. Check Prisma schema is valid
npx prisma validate
# Should show: "The schema at prisma/schema.prisma is valid 🚀"

# 2. Check Prisma Client was generated
npx prisma version
# Should show: prisma 5.22.0 and @prisma/client 5.22.0

# 3. Test Prisma Client import
node -e "const { PrismaClient } = require('@prisma/client'); console.log('✅ Works!')"
```

---

## Still Having Issues?

📚 See the full guide: **[SETUP_GUIDE.md](./SETUP_GUIDE.md)**

Common issues and solutions:
- Database connection errors
- Port conflicts
- Migration issues
- Environment variable problems

---

## Summary Checklist

After fixing, you should have:

- [ ] No `prisma.config.js` or `prisma.config.ts` files
- [ ] Node.js v18.x or v20.x installed
- [ ] `node_modules/@prisma/client/` exists
- [ ] `npx prisma validate` passes
- [ ] `.env` file with DATABASE_URL configured

**All good? Run:** `npm run dev` 🚀
