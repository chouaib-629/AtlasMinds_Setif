# Quick Deployment Checklist for cPanel

Use this checklist to ensure all components are properly configured for production.

## Pre-Deployment Setup

### 1. Domain Configuration
- [ ] Create subdomain: `api.yourdomain.com` (Backend API)
- [ ] Create subdomain: `admin.yourdomain.com` or `dashboard.yourdomain.com` (Dashboard)
- [ ] Create subdomain: `app.yourdomain.com` (Optional - Web App)
- [ ] Enable SSL/HTTPS for all subdomains

### 2. Database Setup
- [ ] Create MySQL database via cPanel
- [ ] Create database user with ALL PRIVILEGES
- [ ] Note database credentials (host, name, username, password)

---

## Backend Deployment

### Files Upload
- [ ] Upload backend files to `public_html/api/` (excluding `vendor/`, `node_modules/`, `.env`)
- [ ] Set document root of `api.yourdomain.com` to `public_html/api/public`

### Configuration
- [ ] Create `.env` file in backend root with production values
- [ ] Update `APP_URL=https://api.yourdomain.com`
- [ ] Update database credentials in `.env`
- [ ] Add CORS origins: `CORS_ALLOWED_ORIGINS="https://admin.yourdomain.com,https://app.yourdomain.com"`
- [ ] Run: `php artisan key:generate`
- [ ] Run: `php artisan jwt:secret`
- [ ] Run: `composer install --no-dev --optimize-autoloader`
- [ ] Run: `php artisan migrate --force`

### Permissions
- [ ] Set permissions: `chmod -R 775 storage bootstrap/cache`
- [ ] Verify `.htaccess` is in `public/` directory

### Testing
- [ ] Test: `https://api.yourdomain.com/api/test` (should return JSON)

---

## Dashboard Deployment

### Build & Upload
- [ ] Run: `cd dashboard && npm install && npm run build`
- [ ] Upload build output to `public_html/dashboard/`
- [ ] Set document root of `admin.yourdomain.com` to dashboard directory

### Configuration
- [ ] Create `.env.production` or `.env.local` with:
  ```
  NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com/api
  ```
- [ ] Or verify `next.config.ts` has correct API URL fallback

### Testing
- [ ] Visit: `https://admin.yourdomain.com`
- [ ] Test login functionality
- [ ] Verify API calls work (check browser console for errors)

---

## Web App Deployment (Digital Dar Echabeb App)

### Build & Upload
- [ ] Run: `cd "Digital Dar Echabeb App" && npm install && npm run build`
- [ ] Upload `build/` directory contents to `public_html/app/`

### Configuration
- [ ] Create `.env.production` with:
  ```
  VITE_API_BASE_URL=https://api.yourdomain.com/api
  ```
- [ ] **Rebuild** after changing `.env`: `npm run build`

### Testing
- [ ] Visit: `https://app.yourdomain.com`
- [ ] Test authentication
- [ ] Verify API connectivity

---

## Mobile App Configuration

### Update API Config
- [ ] Edit: `mobieApp/config/api.js`
- [ ] Change production URL to: `'https://api.yourdomain.com/api'`

### Build
- [ ] **iOS:**
  - [ ] Run: `cd ios && pod install && cd ..`
  - [ ] Build release: `npx react-native run-ios --configuration Release`
- [ ] **Android:**
  - [ ] Build release: `cd android && ./gradlew assembleRelease`

### Testing
- [ ] Install on device
- [ ] Test login and API connectivity

---

## CORS Verification

### Backend
- [ ] Verify `backend/config/cors.php` exists
- [ ] Verify `.env` has `CORS_ALLOWED_ORIGINS` with all frontend domains
- [ ] Run: `php artisan config:clear && php artisan config:cache`

### Test CORS
- [ ] Open browser console on dashboard
- [ ] Make API request
- [ ] Verify no CORS errors appear

---

## Security Checklist

- [ ] `APP_DEBUG=false` in backend `.env`
- [ ] SSL/HTTPS enabled on all domains
- [ ] File permissions set correctly (755 for directories, 644 for files)
- [ ] `.env` file has 600 permissions (if possible)
- [ ] `.git` directory removed from production
- [ ] `storage/logs` not publicly accessible
- [ ] Strong passwords for database and JWT secret

---

## Final Testing

### Backend
- [ ] `GET https://api.yourdomain.com/api/test` → Returns JSON
- [ ] `POST https://api.yourdomain.com/api/login` → Returns JWT token
- [ ] Protected routes require authentication

### Frontend Sync
- [ ] Dashboard can login → Receives token → Can access protected routes
- [ ] Web app can login → Receives token → Can access protected routes
- [ ] Mobile app can login → Receives token → Can access protected routes
- [ ] All apps can refresh tokens
- [ ] All apps logout correctly

### Data Sync
- [ ] Changes made in dashboard reflect in mobile app
- [ ] Changes made in mobile app reflect in dashboard
- [ ] Real-time data sync works (if applicable)

---

## Troubleshooting

### CORS Errors
- Check `CORS_ALLOWED_ORIGINS` in backend `.env`
- Clear config cache: `php artisan config:clear`
- Verify frontend domains match exactly (including `https://`)

### 500 Errors
- Check `storage/logs/laravel.log`
- Verify file permissions
- Check `.env` configuration

### API Not Connecting
- Verify API URL in frontend config files
- Check SSL certificate validity
- Verify backend is accessible via browser

---

## Quick Command Reference

```bash
# Backend
cd ~/public_html/api
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan config:cache
php artisan route:cache

# Check logs
tail -f storage/logs/laravel.log
```

---

## Support Domains Template

Replace `yourdomain.com` with your actual domain in:
- Backend `.env`: `APP_URL` and `CORS_ALLOWED_ORIGINS`
- Dashboard `.env.production`: `NEXT_PUBLIC_API_BASE_URL`
- Web App `.env.production`: `VITE_API_BASE_URL`
- Mobile App `config/api.js`: Production URL

---

**All components must use the same API base URL:**
```
https://api.yourdomain.com/api
```

