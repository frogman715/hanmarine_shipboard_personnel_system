# HanMarine Shipboard Personnel System
# Prisma Setup Fix Script (PowerShell)
# Run this if you're having Prisma configuration issues after pulling from GitHub

Write-Host "🚀 HanMarine - Prisma Setup Fix Script" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js version
Write-Host "📋 Checking Node.js version..." -ForegroundColor Yellow
$nodeVersion = node -v
Write-Host "   Current version: $nodeVersion"

if ($nodeVersion -match "v18\." -or $nodeVersion -match "v20\.") {
    Write-Host "   ✅ Node.js version is compatible" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  WARNING: Node.js version may be incompatible" -ForegroundColor Yellow
    Write-Host "      Recommended: v18.x or v20.x LTS"
    Write-Host "      Current: $nodeVersion"
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        exit 1
    }
}
Write-Host ""

# Check for unwanted config files
Write-Host "🔍 Checking for problematic config files..." -ForegroundColor Yellow
$foundBadFiles = $false

if (Test-Path "prisma.config.js") {
    Write-Host "   ❌ Found: prisma.config.js (this file causes errors)" -ForegroundColor Red
    $foundBadFiles = $true
}

if (Test-Path "prisma.config.ts") {
    Write-Host "   ❌ Found: prisma.config.ts (this file causes errors)" -ForegroundColor Red
    $foundBadFiles = $true
}

if (Test-Path "prisma.config.ts.bak") {
    Write-Host "   ⚠️  Found: prisma.config.ts.bak (backup file)" -ForegroundColor Yellow
    $foundBadFiles = $true
}

if ($foundBadFiles) {
    Write-Host ""
    Write-Host "   These files are NOT needed for this project."
    Write-Host "   Prisma only needs the 'prisma/schema.prisma' file."
    Write-Host ""
    $delete = Read-Host "Delete these files? (y/n)"
    if ($delete -eq "y" -or $delete -eq "Y") {
        Remove-Item "prisma.config.js" -ErrorAction SilentlyContinue
        Remove-Item "prisma.config.ts" -ErrorAction SilentlyContinue
        Remove-Item "prisma.config.ts.bak" -ErrorAction SilentlyContinue
        Write-Host "   ✅ Deleted problematic config files" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Keeping files - you may encounter errors" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ✅ No problematic config files found" -ForegroundColor Green
}
Write-Host ""

# Check for prisma/schema.prisma
Write-Host "📄 Checking Prisma schema..." -ForegroundColor Yellow
if (Test-Path "prisma/schema.prisma") {
    Write-Host "   ✅ Found: prisma/schema.prisma" -ForegroundColor Green
} else {
    Write-Host "   ❌ ERROR: prisma/schema.prisma not found!" -ForegroundColor Red
    Write-Host "      This is required for Prisma to work."
    exit 1
}
Write-Host ""

# Check for .env file
Write-Host "🔐 Checking environment configuration..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "   ✅ Found: .env file" -ForegroundColor Green
    $envContent = Get-Content ".env" -Raw
    if ($envContent -match "DATABASE_URL") {
        Write-Host "   ✅ DATABASE_URL is configured" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  WARNING: DATABASE_URL not found in .env" -ForegroundColor Yellow
        Write-Host "      Add: DATABASE_URL=`"postgresql://user:password@localhost:5433/hanmarine?schema=public`""
    }
} else {
    Write-Host "   ⚠️  WARNING: .env file not found" -ForegroundColor Yellow
    Write-Host "      Creating .env file with template..."
    $envTemplate = @"
# PostgreSQL Database Connection
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/hanmarine?schema=public"

# Adjust these values:
# - Username: postgres (or your PostgreSQL username)
# - Password: postgres (or your PostgreSQL password)
# - Host: localhost (or your database server IP)
# - Port: 5433 (or 5432 if using default)
# - Database: hanmarine
"@
    $envTemplate | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "   ✅ Created .env file - please edit it with your database credentials" -ForegroundColor Green
}
Write-Host ""

# Check if node_modules exists
Write-Host "📦 Checking dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "   ✅ node_modules exists" -ForegroundColor Green
    $reinstall = Read-Host "Reinstall dependencies to ensure Prisma Client is up to date? (y/n)"
    if ($reinstall -eq "y" -or $reinstall -eq "Y") {
        Write-Host "   🔄 Reinstalling dependencies..."
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Host "   ❌ ERROR: npm install failed" -ForegroundColor Red
            Write-Host "      Check your network connection and npm configuration"
            exit 1
        }
    } else {
        Write-Host "   ⏭️  Skipping reinstall"
    }
} else {
    Write-Host "   ⚠️  node_modules not found" -ForegroundColor Yellow
    Write-Host "   🔄 Installing dependencies..."
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "   ❌ ERROR: npm install failed" -ForegroundColor Red
        Write-Host "      Check your network connection and npm configuration"
        exit 1
    }
}
Write-Host ""

# Generate Prisma Client
Write-Host "⚙️  Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Prisma Client generated successfully" -ForegroundColor Green
} else {
    Write-Host "   ❌ ERROR: Failed to generate Prisma Client" -ForegroundColor Red
    Write-Host "      Check the error messages above"
    exit 1
}
Write-Host ""

# Check Prisma Client
Write-Host "🔍 Verifying Prisma Client..." -ForegroundColor Yellow
if (Test-Path "node_modules/@prisma/client") {
    Write-Host "   ✅ Prisma Client found in node_modules" -ForegroundColor Green
} else {
    Write-Host "   ❌ ERROR: Prisma Client not found" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Final summary
Write-Host "✨ Setup Complete!" -ForegroundColor Cyan
Write-Host "================="  -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ All checks passed. Your Prisma setup is ready!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Make sure PostgreSQL is running"
Write-Host "  2. Update .env with your database credentials"
Write-Host "  3. Run: npx prisma migrate dev (to create database tables)"
Write-Host "  4. Run: npm run dev (to start the development server)"
Write-Host ""
Write-Host "📚 For more help, see SETUP_GUIDE.md"
Write-Host ""

exit 0
