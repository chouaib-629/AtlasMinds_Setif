# Complete cPanel Deployment Guide

This guide provides step-by-step instructions to deploy the AtlasMinds Setif project (Backend, Dashboard Frontend, and Mobile App) on a cPanel server.

## Prerequisites

- cPanel hosting account with SSH access
- PHP 8.2 or higher with required extensions
- MySQL/MariaDB database
- Node.js 18+ (for building frontend)
- Composer installed
- Domain names configured:
  - `api.yourdomain.com` (for backend API)
  - `admin.yourdomain.com` or `dashboard.yourdomain.com` (for dashboard)
  - `app.yourdomain.com` (optional, for web app)

---

## PART 1: BACKEND (Laravel API) Deployment

### Step 1: Upload Backend Files

1. **Via cPanel File Manager or FTP:**
   - Navigate to `public_html/api` (or create subdomain `api.yourdomain.com`)
   - Upload all backend files EXCEPT:
     - `node_modules/`
     - `vendor/`
     - `.env`
     - `storage/logs/*`
     - `.git/`

2. **Recommended Structure:**
   ```
   public_html/
   ├── api/                    # Backend root
   │   ├── app/
   │   ├── bootstrap/
   │   ├── config/
   │   ├── database/
   │   ├── public/            # Point domain to this
   │   ├── routes/
   │   └── ...
   ```

### Step 2: Configure Domain/Document Root

**Option A: Subdomain Setup (Recommended)**
1. In cPanel → **Subdomains**
2. Create subdomain: `api.yourdomain.com`
3. Point document root to: `/home/username/public_html/api/public`

**Option B: Subdirectory Setup**
1. Upload to `public_html/api`
2. Access via `yourdomain.com/api`

### Step 3: Set File Permissions

**Via SSH or cPanel Terminal:**
```bash
cd ~/public_html/api
chmod -R 755 storage bootstrap/cache
chmod -R 775 storage bootstrap/cache
chown -R username:username storage bootstrap/cache
```

### Step 4: Create Database

1. **cPanel → MySQL Databases:**
   - Create database: `atlasminds_api`
   - Create user: `atlasminds_user`
   - Add user to database with ALL PRIVILEGES
   - Note: Database name, username, and password

### Step 5: Configure Environment Variables

1. **Create `.env` file in backend root:**
   ```bash
   cd ~/public_html/api
   cp .env.example .env  # If .env.example exists, or create new .env
   ```

2. **Edit `.env` file:**
   ```env
   APP_NAME="AtlasMinds API"
   APP_ENV=production
   APP_KEY=
   APP_DEBUG=false
   APP_URL=https://api.yourdomain.com
   APP_TIMEZONE=UTC

   LOG_CHANNEL=stack
   LOG_DEPRECATIONS_CHANNEL=null
   LOG_LEVEL=error

   DB_CONNECTION=mysql
   DB_HOST=localhost
   DB_PORT=3306
   DB_DATABASE=username_atlasminds_api
   DB_USERNAME=username_atlasminds_user
   DB_PASSWORD=your_secure_password

   BROADCAST_DRIVER=log
   CACHE_DRIVER=file
   FILESYSTEM_DISK=local
   QUEUE_CONNECTION=sync
   SESSION_DRIVER=file
   SESSION_LIFETIME=120

   # JWT Configuration
   JWT_SECRET=
   JWT_TTL=60
   JWT_REFRESH_TTL=20160

   # CORS Configuration
   CORS_ALLOWED_ORIGINS="https://admin.yourdomain.com,https://app.yourdomain.com,http://localhost:3000,http://localhost:8081"
   CORS_ALLOWED_METHODS="GET,POST,PUT,PATCH,DELETE,OPTIONS"
   CORS_ALLOWED_HEADERS="Content-Type,Authorization,X-Requested-With"
   CORS_ALLOW_CREDENTIALS=true

   # Mail Configuration (if needed)
   MAIL_MAILER=smtp
   MAIL_HOST=smtp.yourdomain.com
   MAIL_PORT=587
   MAIL_USERNAME=noreply@yourdomain.com
   MAIL_PASSWORD=your_mail_password
   MAIL_ENCRYPTION=tls
   MAIL_FROM_ADDRESS=noreply@yourdomain.com
   MAIL_FROM_NAME="${APP_NAME}"
   ```

### Step 6: Install Dependencies and Setup

**Via SSH:**
```bash
cd ~/public_html/api

# Install Composer dependencies
composer install --no-dev --optimize-autoloader

# Generate application key
php artisan key:generate

# Generate JWT secret
php artisan jwt:secret

# Run migrations
php artisan migrate --force

# (Optional) Seed database
php artisan db:seed --force

# Clear and cache configuration
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Optimize for production
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Step 7: Create .htaccess for Laravel

**Create/Update `public/.htaccess`:**
```apache
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Send Requests To Front Controller...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>

# Security Headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>
```

### Step 8: Test Backend API

1. Visit: `https://api.yourdomain.com/api/test`
2. Should return: `{"message":"API is working!","status":"success"}`

---

## PART 2: DASHBOARD (Next.js Frontend) Deployment

### Step 1: Build Dashboard Locally (or on Server)

**On your local machine or server with Node.js:**
```bash
cd dashboard
npm install
npm run build
```

This creates a `out/` or `.next/` directory with production files.

### Step 2: Upload Dashboard Files

1. **Upload built files to cPanel:**
   - For Next.js static export: Upload `out/` directory contents
   - For Next.js standalone: Upload entire `.next/` directory + `package.json` + `next.config.ts`

2. **Recommended Structure:**
   ```
   public_html/
   ├── dashboard/              # Dashboard root
   │   ├── .next/
   │   ├── public/
   │   ├── package.json
   │   └── ...
   ```

### Step 3: Configure Domain/Document Root

1. **Create subdomain:** `admin.yourdomain.com` or `dashboard.yourdomain.com`
2. **Point document root to:** `/home/username/public_html/dashboard` (or `.next` if standalone)

### Step 4: Create Environment File

**Create `.env.production` or `.env.local` in dashboard root:**
```env
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com/api
```

**Or update `next.config.ts` to include:**
```typescript
const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.yourdomain.com/api',
  },
};
```

### Step 5: Configure Next.js for Production (if needed)

**Update `next.config.ts`:**
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // or 'export' for static
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.yourdomain.com/api',
  },
};

export default nextConfig;
```

### Step 6: Server Configuration for Next.js

**Option A: Static Export (Recommended for cPanel)**
1. Update `next.config.ts`:
   ```typescript
   const nextConfig: NextConfig = {
     output: 'export',
     trailingSlash: true,
   };
   ```
2. Build: `npm run build`
3. Upload `out/` directory contents to document root

**Option B: Node.js Server (Requires Node.js on cPanel)**
1. Install Node.js via cPanel → **Setup Node.js App**
2. Set startup file: `server.js` or use Next.js start script
3. Run: `npm run start`

### Step 7: Create .htaccess for Dashboard

**Create `.htaccess` in dashboard root:**
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /

    # Handle Next.js routing
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
```

---

## PART 3: DIGITAL DAR ECHABEB APP (React/Vite) Deployment

### Step 1: Build Web App

**On local machine or server:**
```bash
cd "Digital Dar Echabeb App"
npm install
npm run build
```

### Step 2: Upload Built Files

1. Upload `build/` directory contents to:
   - `public_html/app/` (if using subdomain `app.yourdomain.com`)
   - Or `public_html/` (if main domain)

### Step 3: Configure Domain

1. Create subdomain: `app.yourdomain.com`
2. Point document root to: `/home/username/public_html/app`

### Step 4: Create Environment File

**Create `.env.production`:**
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

**Important:** Rebuild after changing `.env`:
```bash
npm run build
```

### Step 5: Create .htaccess

**Create `.htaccess` in app root:**
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /

    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
```

---

## PART 4: MOBILE APP Configuration

The mobile app needs configuration updates to point to production API.

### Update API Configuration

**File: `mobieApp/config/api.js`**
```javascript
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:8000/api'  // Development
  : 'https://api.yourdomain.com/api'; // Production - UPDATE THIS
```

### Build Mobile App

**For iOS:**
```bash
cd mobieApp
npm install
cd ios
pod install
cd ..
npx react-native run-ios --configuration Release
```

**For Android:**
```bash
cd mobieApp
npm install
cd android
./gradlew assembleRelease
```

**Update `mobieApp/android/app/src/main/AndroidManifest.xml` for production API.**

---

## PART 5: CORS Configuration Updates

### Backend CORS Configuration

**File: `backend/bootstrap/app.php` - Update middleware:**
```php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->api(prepend: [
        \Illuminate\Http\Middleware\HandleCors::class,
    ]);
    
    // ... rest of middleware
})
```

**Create or update `backend/config/cors.php`:**
```php
<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'https://admin.yourdomain.com',
        'https://dashboard.yourdomain.com',
        'https://app.yourdomain.com',
        'http://localhost:3000',  // Development only
        'http://localhost:8081',   // Mobile dev
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];
```

**Or use environment variables in `bootstrap/app.php`:**
```php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->api(prepend: [
        \Illuminate\Http\Middleware\HandleCors::class,
    ]);
    
    $middleware->validateCsrfTokens(except: [
        'api/*',
    ]);
})
```

**Add to `.env`:**
```env
CORS_ALLOWED_ORIGINS="https://admin.yourdomain.com,https://app.yourdomain.com,http://localhost:3000"
```

---

## PART 6: SSL/HTTPS Configuration

### Enable SSL in cPanel

1. **cPanel → SSL/TLS Status**
2. Install SSL certificate (Let's Encrypt is free)
3. Force HTTPS redirect in `.htaccess`:

**Backend `.htaccess`:**
```apache
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

## PART 7: Testing & Verification

### 1. Test Backend API
```bash
curl https://api.yourdomain.com/api/test
```

### 2. Test CORS
- Open browser console on dashboard/admin panel
- Check for CORS errors when making API calls

### 3. Test Authentication
- Login from dashboard
- Login from mobile app
- Login from web app
- Verify tokens are working

### 4. Verify All Endpoints
- Test public endpoints (no auth required)
- Test protected endpoints (require JWT)
- Test admin endpoints

---

## PART 8: Security Checklist

- [ ] `.env` file has correct permissions (600)
- [ ] `APP_DEBUG=false` in production
- [ ] Strong database passwords
- [ ] SSL/HTTPS enabled
- [ ] CORS configured properly
- [ ] File permissions set correctly
- [ ] `.git` folder removed from production
- [ ] `storage/logs` not publicly accessible
- [ ] JWT secret is strong
- [ ] Regular backups configured

---

## PART 9: Troubleshooting

### Backend Issues

**500 Error:**
- Check file permissions
- Check `.env` configuration
- Check `storage/logs/laravel.log`

**CORS Errors:**
- Verify CORS origins in `config/cors.php` or `.env`
- Clear config cache: `php artisan config:clear`

**Database Connection:**
- Verify database credentials in `.env`
- Check database user privileges
- Test connection: `php artisan tinker` → `DB::connection()->getPdo();`

### Frontend Issues

**API Not Connecting:**
- Verify `NEXT_PUBLIC_API_BASE_URL` or `VITE_API_BASE_URL`
- Check CORS configuration
- Verify SSL certificate

**Build Errors:**
- Clear `node_modules` and reinstall
- Check Node.js version (18+)
- Verify all environment variables

---

## PART 10: Maintenance Commands

**Regular maintenance via SSH:**
```bash
cd ~/public_html/api

# Clear all caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Re-optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Check logs
tail -f storage/logs/laravel.log
```

---

## Quick Reference: Domain Setup

| Service | Domain | Document Root |
|---------|--------|---------------|
| Backend API | `api.yourdomain.com` | `/home/username/public_html/api/public` |
| Dashboard | `admin.yourdomain.com` | `/home/username/public_html/dashboard` |
| Web App | `app.yourdomain.com` | `/home/username/public_html/app` |

---

## Support

For issues, check:
1. cPanel error logs
2. Laravel logs: `storage/logs/laravel.log`
3. Browser console (CORS, network errors)
4. Server error logs in cPanel

---

**Last Updated:** Deployment guide for AtlasMinds Setif Project

