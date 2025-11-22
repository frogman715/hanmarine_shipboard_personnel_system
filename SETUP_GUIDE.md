# 🚀 Setup Guide - HanMarine Shipboard Personnel System

## For Users Pulling from GitHub

This guide will help you properly set up the project after cloning/pulling from GitHub, avoiding common Prisma configuration issues.

---

## ⚠️ Common Issues & Solutions

### Issue: "Failed to parse syntax of config file at prisma.config.js"

**Cause**: You have a `prisma.config.js` or `prisma.config.ts` file that shouldn't exist.

**Solution**: This project uses the standard Prisma setup. Delete any `prisma.config.js` or `prisma.config.ts` files:

```bash
# Delete if they exist
rm prisma.config.js
rm prisma.config.ts
rm prisma.config.ts.bak

# Or on Windows PowerShell:
Remove-Item prisma.config.js -ErrorAction SilentlyContinue
Remove-Item prisma.config.ts -ErrorAction SilentlyContinue
Remove-Item prisma.config.ts.bak -ErrorAction SilentlyContinue
```

**Note**: These files are NOT needed. Prisma only needs the `prisma/schema.prisma` file.

---

## 📋 Prerequisites

### Required Software

1. **Node.js**: v18.x or v20.x (LTS recommended)
   - ❌ DO NOT use Node.js v24.x (it's incompatible with some dependencies)
   - ✅ Recommended: v20.x LTS
   
   Check your version:
   ```bash
   node -v
   ```
   
   If you need to install/update Node.js:
   - Download from: https://nodejs.org/
   - Or use NVM (Node Version Manager):
     ```bash
     # Linux/macOS
     nvm install 20
     nvm use 20
     
     # Windows
     nvm install 20.19.0
     nvm use 20.19.0
     ```

2. **npm**: v9.x or v10.x (comes with Node.js)
   ```bash
   npm -v
   ```

3. **PostgreSQL**: v13 or higher
   - Download from: https://www.postgresql.org/download/
   - Or use Docker (recommended):
     ```bash
     docker run --name hanmarine-db -e POSTGRES_PASSWORD=postgres -p 5433:5432 -d postgres:15
     ```

---

## 🔧 Step-by-Step Setup

### Step 1: Clone the Repository (if not done yet)

```bash
git clone https://github.com/frogman715/hanmarine_shipboard_personnel_system.git
cd hanmarine_shipboard_personnel_system
```

### Step 2: Check for Unwanted Config Files

```bash
# Check if prisma.config files exist (they shouldn't)
ls -la prisma.config.* 2>/dev/null || echo "Good! No prisma.config files found."

# If they exist, delete them:
rm prisma.config.js prisma.config.ts *.bak 2>/dev/null
```

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Copy the example (if exists) or create new
touch .env
```

Edit `.env` and add your database connection:

```env
# PostgreSQL Database Connection
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/hanmarine?schema=public"

# Adjust the values based on your setup:
# - Username: postgres (default)
# - Password: your PostgreSQL password
# - Host: localhost (or your database server)
# - Port: 5433 (or 5432 if default)
# - Database: hanmarine
```

### Step 4: Install Dependencies

This will automatically run `prisma generate` after installation:

```bash
npm install
```

**Expected Output:**
```
...installing packages...
> postinstall
> prisma generate

Prisma schema loaded from prisma/schema.prisma
✔ Generated Prisma Client to ./node_modules/@prisma/client
```

### Step 5: Initialize the Database

```bash
# Apply all migrations to create tables
npx prisma migrate deploy

# Or for development (creates migration history):
npx prisma migrate dev
```

### Step 6: Seed Initial Data (Optional)

```bash
# Seed form templates (HGF-CR-01, HGF-CR-02)
npm run seed:forms

# Seed sample crew data (optional)
npm run seed
```

### Step 7: Start the Development Server

```bash
npm run dev
```

The application should now be running at: http://localhost:3000

---

## ✅ Verification Steps

### 1. Check Prisma Client Generation

```bash
npx prisma generate
```

**Expected Output:**
```
Prisma schema loaded from prisma/schema.prisma
✔ Generated Prisma Client (v5.22.0) to ./node_modules/@prisma/client
```

### 2. Check Database Connection

```bash
npx prisma db execute --stdin <<< "SELECT 1"
```

### 3. Open Prisma Studio (Database GUI)

```bash
npx prisma studio
```

This should open http://localhost:5555 with a visual database interface.

### 4. Test the Application

Visit these URLs:
- http://localhost:3000 - Home page
- http://localhost:3000/dashboard - Dashboard
- http://localhost:3000/crew - Crew management

---

## 🐛 Troubleshooting

### Problem: "Cannot find module '@prisma/client'"

**Solution:**
```bash
npx prisma generate
npm run dev
```

### Problem: "Port 3000 already in use"

**Solution:**
```bash
# Find and kill the process using port 3000
# Linux/macOS:
lsof -ti:3000 | xargs kill -9

# Windows PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# Or use a different port:
npm run dev -- -p 3001
```

### Problem: "Database connection error"

**Solution:**
1. Verify PostgreSQL is running:
   ```bash
   # Linux/macOS:
   pg_isready
   
   # Or check service status:
   sudo systemctl status postgresql  # Linux
   brew services list                # macOS
   ```

2. Check your `.env` DATABASE_URL:
   - Correct username/password?
   - Correct host and port?
   - Database exists?

3. Create database if needed:
   ```bash
   psql -U postgres
   CREATE DATABASE hanmarine;
   \q
   ```

4. Test connection:
   ```bash
   npx prisma db execute --stdin <<< "SELECT 1"
   ```

### Problem: Running from Windows but using WSL

**Issue:** UNC paths not supported when running Node.js from Windows CMD/PowerShell in a WSL directory.

**Solution:** Run all commands directly in WSL:
```bash
# Open WSL terminal
wsl

# Navigate to project
cd ~/projects/hanmarine_shipboard_personnel_system

# Run commands in WSL
npm install
npm run dev
```

### Problem: Node.js version incompatibility

**Error:** Various package errors, Prisma issues, or build failures

**Solution:** Use Node.js v18.x or v20.x:
```bash
# Check version
node -v

# If wrong version, install correct one:
# Using NVM:
nvm install 20
nvm use 20

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 🔍 Understanding the Prisma Setup

This project uses the **standard Prisma configuration**:

### What EXISTS (correct):
- ✅ `prisma/schema.prisma` - Main Prisma schema file
- ✅ `prisma/migrations/` - Database migration history
- ✅ `.env` - Environment variables (DATABASE_URL)
- ✅ `node_modules/@prisma/client/` - Generated Prisma Client (after npm install)

### What DOES NOT exist (and shouldn't):
- ❌ `prisma.config.js` - Not needed, causes errors
- ❌ `prisma.config.ts` - Not needed, causes errors
- ❌ `prisma/prisma.config.*` - Not needed

### How Prisma Works in This Project:

1. **Schema Definition**: `prisma/schema.prisma` contains all models
2. **Client Generation**: Runs automatically via `postinstall` script in package.json
3. **Manual Generation**: Can run `npx prisma generate` anytime
4. **Database Sync**: Use `npx prisma migrate dev` or `npx prisma db push`

---

## 📚 Next Steps

After successful setup:

1. **Read the Documentation:**
   - [CARA_PAKAI_SISTEM.md](./CARA_PAKAI_SISTEM.md) - System usage guide
   - [WORKFLOW_GUIDE.md](./WORKFLOW_GUIDE.md) - Workflow documentation
   - [README.md](./README.md) - Complete system overview

2. **Explore the Application:**
   - Dashboard: http://localhost:3000/dashboard
   - Crew Management: http://localhost:3000/crew
   - Applications: http://localhost:3000/applications

3. **Development:**
   - See README.md for development commands
   - Check Prisma Studio for database inspection
   - Review API routes in `src/app/api/`

---

## 💡 Tips

1. **Always run `npm install` after pulling changes** - It ensures Prisma Client is regenerated
2. **Keep Node.js updated** - Use LTS versions (v18.x or v20.x)
3. **Use Prisma Studio** - Best way to inspect and edit database: `npx prisma studio`
4. **Check migration status** - Before running: `npx prisma migrate status`
5. **WSL Users** - Run all commands inside WSL, not from Windows

---

## 📞 Getting Help

If you still have issues:

1. Check the main [README.md](./README.md) troubleshooting section
2. Review [GitHub Issues](https://github.com/frogman715/hanmarine_shipboard_personnel_system/issues)
3. Create a new issue with:
   - Your Node.js version (`node -v`)
   - Your npm version (`npm -v`)
   - Error messages (full output)
   - Steps you've tried

---

## ✨ Summary Checklist

After following this guide, you should have:

- [ ] Node.js v18.x or v20.x installed
- [ ] PostgreSQL running
- [ ] No `prisma.config.js` or `prisma.config.ts` files
- [ ] `.env` file with correct DATABASE_URL
- [ ] Dependencies installed (`npm install`)
- [ ] Prisma Client generated
- [ ] Database migrated
- [ ] Development server running
- [ ] Application accessible at http://localhost:3000

**Congratulations! Your setup is complete! 🎉**
