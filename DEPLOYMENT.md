# 🚀 HanMarine Deployment Guide

**Production Deployment & DevOps Configuration**

---

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Local Development Setup](#local-development-setup)
3. [Docker Deployment](#docker-deployment)
4. [Database Setup](#database-setup)
5. [Environment Configuration](#environment-configuration)
6. [Production Deployment](#production-deployment)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Troubleshooting](#troubleshooting)

---

## ✅ Pre-Deployment Checklist

- [ ] All features tested locally
- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] Docker images built successfully
- [ ] All dependencies installed
- [ ] Database backed up
- [ ] Error logging configured
- [ ] Security review completed
- [ ] API endpoints tested with real data
- [ ] Performance testing completed

---

## 🔧 Local Development Setup

### Windows PowerShell Setup

**1. Install Prerequisites**:
```powershell
# Check Node.js
node --version          # Should be 18+
npm --version           # Should be 9+

# Check PostgreSQL
psql --version          # Should be 13+

# Check Docker (optional)
docker --version
docker-compose --version
```

**2. Clone & Install**:
```powershell
# Clone repository
git clone <repo-url>
cd hanmarine_shipboard_personnel_system

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**3. Configure Environment Variables**:
```bash
# .env file
DATABASE_URL="postgresql://postgres:password@localhost:5433/hanmarine?schema=public"
NEXTAUTH_SECRET="your-secret-key-change-this"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
```

**4. Setup Database**:
```powershell
# Create database
createdb -U postgres -h localhost -p 5433 hanmarine

# Run migrations
npx prisma migrate dev

# Seed data (optional)
npm run seed:forms
npm run seed
```

**5. Start Development Server**:
```powershell
npm run dev

# Server starts on http://localhost:3000
```

---

## 🐳 Docker Deployment

### Docker Compose Setup (Recommended)

**1. Build & Run**:
```bash
# Build images
docker compose up -d --build

# Check status
docker compose ps

# View logs
docker compose logs -f

# Stop services
docker compose down
```

### docker-compose.yml Configuration

```yaml
version: '3.9'

services:
  # PostgreSQL Database
  db:
    image: postgres:15-alpine
    container_name: hanmarine_db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: your_secure_password
      POSTGRES_DB: hanmarine
    ports:
      - "5433:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - hanmarine_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Next.js Application
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: hanmarine_app
    environment:
      DATABASE_URL: "postgresql://postgres:your_secure_password@db:5432/hanmarine?schema=public"
      NEXTAUTH_SECRET: "your-secret-key-change-this"
      NEXTAUTH_URL: "http://localhost:3000"
      NODE_ENV: "production"
    ports:
      - "3000:3000"
    depends_on:
      db:
        condition: service_healthy
    networks:
      - hanmarine_network
    restart: unless-stopped

volumes:
  postgres_data:

networks:
  hanmarine_network:
    driver: bridge
```

### Dockerfile Configuration

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Next.js app
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy Prisma schema and generated client
COPY prisma ./prisma
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Copy environment example
COPY .env.example .env

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/crew', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["npm", "start"]
```

### Docker Commands Reference

```bash
# Build image
docker build -t hanmarine:latest .

# Run container
docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@host:5433/hanmarine" \
  -e NEXTAUTH_SECRET="secret" \
  --name hanmarine_app \
  hanmarine:latest

# View logs
docker logs -f hanmarine_app

# Execute command in container
docker exec -it hanmarine_app npx prisma studio

# Stop container
docker stop hanmarine_app

# Remove container
docker rm hanmarine_app

# Remove image
docker rmi hanmarine:latest
```

---

## 🗄️ Database Setup

### PostgreSQL Installation

**Windows**:
```powershell
# Download & install from https://www.postgresql.org/download/windows/
# Or use Chocolatey
choco install postgresql13

# Verify installation
psql --version
```

### Database Creation

```sql
-- Connect to PostgreSQL
psql -U postgres -h localhost -p 5433

-- Create database
CREATE DATABASE hanmarine;

-- Create user (optional)
CREATE USER hanmarine_user WITH PASSWORD 'secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE hanmarine TO hanmarine_user;
```

### Connection String

```
postgresql://username:password@host:port/database?schema=public

Examples:
- Local: postgresql://postgres:password@localhost:5433/hanmarine?schema=public
- Remote: postgresql://user:pass@db.example.com:5432/hanmarine?schema=public
- Docker: postgresql://postgres:password@db:5432/hanmarine?schema=public
```

### Database Backup

```bash
# Backup database
pg_dump -U postgres -h localhost hanmarine > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup
psql -U postgres -h localhost hanmarine < backup_20241115_100000.sql

# Using Docker
docker exec hanmarine_db pg_dump -U postgres hanmarine > backup.sql
```

### Database Migrations

```bash
# Check migration status
npx prisma migrate status

# Apply pending migrations
npx prisma migrate deploy

# Create new migration
npx prisma migrate dev --name "description_of_changes"

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# View migration history
npx prisma migrate resolve --rolled-back "20251115045903_add_crewing_models"
```

---

## 🔐 Environment Configuration

### .env File Template

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5433/hanmarine?schema=public"

# Authentication
NEXTAUTH_SECRET="generate-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_DEBUG="false"

# Application
NODE_ENV="production"
PORT="3000"

# Email (future)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="app-password"

# Logging
LOG_LEVEL="info"

# API
API_TIMEOUT="30000"
```

### Generate NEXTAUTH_SECRET

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -base64 32
```

### Environment by Stage

**Development** (.env.local):
```
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5433/hanmarine?schema=public
NEXTAUTH_DEBUG=true
LOG_LEVEL=debug
```

**Staging** (.env.staging):
```
NODE_ENV=staging
DATABASE_URL=postgresql://user:pass@staging-db.example.com:5432/hanmarine?schema=public
NEXTAUTH_DEBUG=false
LOG_LEVEL=info
```

**Production** (.env.production):
```
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@prod-db.example.com:5432/hanmarine?schema=public
NEXTAUTH_DEBUG=false
LOG_LEVEL=warn
```

---

## 🌍 Production Deployment

### Pre-Production Checklist

- [ ] Database backed up
- [ ] All migrations tested
- [ ] SSL certificates configured
- [ ] Error logging setup
- [ ] Performance optimized
- [ ] Security headers configured
- [ ] CORS properly configured
- [ ] Rate limiting configured
- [ ] Monitoring alerts setup
- [ ] Disaster recovery plan ready

### Deployment Steps

**1. Prepare Server**:
```bash
# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# Install Docker (optional)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

**2. Clone Repository**:
```bash
cd /var/www
git clone <repo-url> hanmarine_app
cd hanmarine_app
npm install
```

**3. Configure Environment**:
```bash
# Create .env file
cp .env.example .env

# Edit with production values
nano .env

# Set permissions
chmod 600 .env
```

**4. Run Migrations**:
```bash
npx prisma migrate deploy
npx prisma db seed
```

**5. Build Application**:
```bash
npm run build
```

**6. Start Application**:
```bash
# Using PM2 (recommended)
npm install -g pm2
pm2 start npm --name "hanmarine" -- start
pm2 save
pm2 startup

# Or using systemd
sudo systemctl start hanmarine
sudo systemctl enable hanmarine
```

### Systemd Service File

Create `/etc/systemd/system/hanmarine.service`:

```ini
[Unit]
Description=HanMarine Shipboard Personnel System
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/hanmarine_app
Environment="NODE_ENV=production"
EnvironmentFile=/var/www/hanmarine_app/.env
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable hanmarine
sudo systemctl start hanmarine
```

### Nginx Reverse Proxy

Create `/etc/nginx/sites-available/hanmarine.conf`:

```nginx
upstream hanmarine_app {
    server localhost:3000;
}

server {
    listen 80;
    server_name hanmarine.example.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name hanmarine.example.com;

    # SSL certificates
    ssl_certificate /etc/ssl/certs/hanmarine.crt;
    ssl_certificate_key /etc/ssl/private/hanmarine.key;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Proxy settings
    location / {
        proxy_pass http://hanmarine_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript application/json;
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/hanmarine.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### SSL Certificate Setup (Let's Encrypt)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --nginx -d hanmarine.example.com

# Auto-renew
sudo systemctl enable certbot.timer
```

---

## 📊 Monitoring & Maintenance

### Health Checks

```bash
# API health check
curl http://localhost:3000/api/crew

# Database connection
npx prisma db execute --stdin < health_check.sql

# Container health
docker ps | grep hanmarine_app
```

### Logging

**Application Logs**:
```bash
# PM2 logs
pm2 logs hanmarine

# Systemd logs
sudo journalctl -u hanmarine -f

# Docker logs
docker logs -f hanmarine_app
```

### Performance Monitoring

```bash
# CPU & Memory usage
top

# Disk usage
df -h

# Database statistics
npx prisma db execute --stdin
SELECT * FROM pg_stat_statements;
```

### Database Maintenance

```bash
# Vacuum & analyze
psql -U postgres hanmarine << EOF
VACUUM ANALYZE;
REINDEX DATABASE hanmarine;
EOF

# Monitor slow queries
ALTER SYSTEM SET log_min_duration_statement = 1000;
SELECT pg_reload_conf();
```

### Automated Backups

Create `/home/deploy/backup.sh`:

```bash
#!/bin/bash

BACKUP_DIR="/backups/hanmarine"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$DATE.sql"

mkdir -p $BACKUP_DIR

# Backup database
pg_dump -U postgres hanmarine > $BACKUP_FILE

# Compress
gzip $BACKUP_FILE

# Keep only last 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

# Optional: Upload to S3
# aws s3 cp $BACKUP_FILE.gz s3://hanmarine-backups/
```

Add to crontab:
```bash
# Run daily at 2 AM
0 2 * * * /home/deploy/backup.sh
```

---

## 🆘 Troubleshooting

### Application Won't Start

```bash
# Check logs
npm run dev 2>&1 | head -50

# Verify Node.js
which node
node --version

# Clear node_modules
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Database Connection Issues

```bash
# Test PostgreSQL connection
psql -h localhost -p 5433 -U postgres -d hanmarine -c "SELECT 1"

# Check DATABASE_URL format
echo $DATABASE_URL

# Verify credentials
psql -h localhost -p 5433 -U postgres -c "\du"

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Docker Issues

```bash
# Check container status
docker ps -a | grep hanmarine

# View container logs
docker logs hanmarine_app

# Rebuild image
docker compose down
docker compose up -d --build

# Check network connectivity
docker exec hanmarine_app ping db
```

### Performance Issues

```bash
# Check slow queries
psql -U postgres hanmarine -c "SELECT * FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;"

# Analyze table
ANALYZE <table_name>;

# Add indexes
CREATE INDEX idx_crew_status ON "Crew"(status);
CREATE INDEX idx_cert_expiry ON "Certificate"("expiryDate");
```

### Out of Memory

```bash
# Increase swap
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Limit Node.js memory
NODE_OPTIONS="--max-old-space-size=4096" npm start
```

---

## 📈 Scaling Considerations

### Horizontal Scaling

- Use load balancer (Nginx, HAProxy)
- Deploy multiple app instances
- Use shared database (same PostgreSQL)
- Implement session storage (Redis)

### Vertical Scaling

- Increase server RAM
- Upgrade CPU cores
- Improve database indexing
- Optimize queries

### Database Scaling

- Read replicas for reporting
- Connection pooling (PgBouncer)
- Archive old data
- Partition large tables

---

**Last Updated**: November 15, 2025  
**Version**: 1.0.0  
**Status**: Production Ready
