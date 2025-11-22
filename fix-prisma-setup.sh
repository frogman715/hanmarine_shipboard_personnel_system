#!/bin/bash

# HanMarine Shipboard Personnel System
# Prisma Setup Fix Script
# Run this if you're having Prisma configuration issues after pulling from GitHub

echo "🚀 HanMarine - Prisma Setup Fix Script"
echo "======================================"
echo ""

# Check Node.js version
echo "📋 Checking Node.js version..."
NODE_VERSION=$(node -v)
echo "   Current version: $NODE_VERSION"

if [[ "$NODE_VERSION" == v18.* ]] || [[ "$NODE_VERSION" == v20.* ]]; then
    echo "   ✅ Node.js version is compatible"
else
    echo "   ⚠️  WARNING: Node.js version may be incompatible"
    echo "      Recommended: v18.x or v20.x LTS"
    echo "      Current: $NODE_VERSION"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi
echo ""

# Check for unwanted config files
echo "🔍 Checking for problematic config files..."
FOUND_BAD_FILES=0

if [ -f "prisma.config.js" ]; then
    echo "   ❌ Found: prisma.config.js (this file causes errors)"
    FOUND_BAD_FILES=1
fi

if [ -f "prisma.config.ts" ]; then
    echo "   ❌ Found: prisma.config.ts (this file causes errors)"
    FOUND_BAD_FILES=1
fi

if [ -f "prisma.config.ts.bak" ]; then
    echo "   ⚠️  Found: prisma.config.ts.bak (backup file)"
    FOUND_BAD_FILES=1
fi

if [ $FOUND_BAD_FILES -eq 1 ]; then
    echo ""
    echo "   These files are NOT needed for this project."
    echo "   Prisma only needs the 'prisma/schema.prisma' file."
    echo ""
    read -p "Delete these files? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -f prisma.config.js prisma.config.ts prisma.config.ts.bak
        echo "   ✅ Deleted problematic config files"
    else
        echo "   ⚠️  Keeping files - you may encounter errors"
    fi
else
    echo "   ✅ No problematic config files found"
fi
echo ""

# Check for prisma/schema.prisma
echo "📄 Checking Prisma schema..."
if [ -f "prisma/schema.prisma" ]; then
    echo "   ✅ Found: prisma/schema.prisma"
else
    echo "   ❌ ERROR: prisma/schema.prisma not found!"
    echo "      This is required for Prisma to work."
    exit 1
fi
echo ""

# Check for .env file
echo "🔐 Checking environment configuration..."
if [ -f ".env" ]; then
    echo "   ✅ Found: .env file"
    if grep -q "DATABASE_URL" .env; then
        echo "   ✅ DATABASE_URL is configured"
    else
        echo "   ⚠️  WARNING: DATABASE_URL not found in .env"
        echo "      Add: DATABASE_URL=\"postgresql://user:password@localhost:5433/hanmarine?schema=public\""
    fi
else
    echo "   ⚠️  WARNING: .env file not found"
    echo "      Creating .env file with template..."
    cat > .env << 'EOF'
# PostgreSQL Database Connection
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/hanmarine?schema=public"

# Adjust these values:
# - Username: postgres (or your PostgreSQL username)
# - Password: postgres (or your PostgreSQL password)
# - Host: localhost (or your database server IP)
# - Port: 5433 (or 5432 if using default)
# - Database: hanmarine
EOF
    echo "   ✅ Created .env file - please edit it with your database credentials"
fi
echo ""

# Check if node_modules exists
echo "📦 Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "   ✅ node_modules exists"
    read -p "Reinstall dependencies to ensure Prisma Client is up to date? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "   🔄 Reinstalling dependencies..."
        if ! npm install; then
            echo "   ❌ ERROR: npm install failed"
            echo "      Check your network connection and npm configuration"
            exit 1
        fi
    else
        echo "   ⏭️  Skipping reinstall"
    fi
else
    echo "   ⚠️  node_modules not found"
    echo "   🔄 Installing dependencies..."
    if ! npm install; then
        echo "   ❌ ERROR: npm install failed"
        echo "      Check your network connection and npm configuration"
        exit 1
    fi
fi
echo ""

# Generate Prisma Client
echo "⚙️  Generating Prisma Client..."
npx prisma generate
if [ $? -eq 0 ]; then
    echo "   ✅ Prisma Client generated successfully"
else
    echo "   ❌ ERROR: Failed to generate Prisma Client"
    echo "      Check the error messages above"
    exit 1
fi
echo ""

# Check Prisma Client
echo "🔍 Verifying Prisma Client..."
if [ -d "node_modules/@prisma/client" ]; then
    echo "   ✅ Prisma Client found in node_modules"
else
    echo "   ❌ ERROR: Prisma Client not found"
    exit 1
fi
echo ""

# Final summary
echo "✨ Setup Complete!"
echo "================="
echo ""
echo "✅ All checks passed. Your Prisma setup is ready!"
echo ""
echo "Next steps:"
echo "  1. Make sure PostgreSQL is running"
echo "  2. Update .env with your database credentials"
echo "  3. Run: npx prisma migrate dev (to create database tables)"
echo "  4. Run: npm run dev (to start the development server)"
echo ""
echo "📚 For more help, see SETUP_GUIDE.md"
echo ""

exit 0
