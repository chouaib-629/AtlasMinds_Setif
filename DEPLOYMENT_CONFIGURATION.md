# Deployment Configuration Guide

This document contains all the configuration changes needed to sync backend, frontend, and mobile app for production deployment.

## Environment Variables to Set

### Backend (.env file in `/backend`)

```env
APP_URL=https://api.yourdomain.com
CORS_ALLOWED_ORIGINS="https://admin.yourdomain.com,https://dashboard.yourdomain.com,https://app.yourdomain.com"
```

**Important:** Replace `yourdomain.com` with your actual domain.

---

### Dashboard (Next.js)

**Option 1: Environment File**
Create `.env.production` or `.env.local` in `/dashboard`:
```env
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com/api
```

**Option 2: Already configured in `next.config.ts`**
The config file reads from environment variable automatically.

---

### Digital Dar Echabeb App (Vite/React)

**Create `.env.production` in `/Digital Dar Echabeb App`:**
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

**Important:** After changing `.env.production`, rebuild:
```bash
npm run build
```

---

### Mobile App (React Native)

**File to update: `/mobieApp/config/api.js`**

Change line 12:
```javascript
: 'https://api.yourdomain.com/api'; // UPDATE THIS
```

**Then rebuild:**
```bash
# iOS
cd ios && pod install && cd ..
npx react-native run-ios --configuration Release

# Android
cd android && ./gradlew assembleRelease
```

---

## Domain Configuration Summary

| Component | Domain | API Endpoint |
|-----------|--------|--------------|
| Backend API | `api.yourdomain.com` | `https://api.yourdomain.com/api` |
| Dashboard | `admin.yourdomain.com` | Points to: `https://api.yourdomain.com/api` |
| Web App | `app.yourdomain.com` | Points to: `https://api.yourdomain.com/api` |
| Mobile App | N/A (installed app) | Points to: `https://api.yourdomain.com/api` |

---

## CORS Configuration

The backend CORS is configured to accept requests from:
- `https://admin.yourdomain.com`
- `https://dashboard.yourdomain.com`
- `https://app.yourdomain.com`

**Update in `/backend/.env`:**
```env
CORS_ALLOWED_ORIGINS="https://admin.yourdomain.com,https://dashboard.yourdomain.com,https://app.yourdomain.com"
```

Then clear config cache:
```bash
php artisan config:clear
php artisan config:cache
```

---

## Testing Checklist

After deployment, test:

1. ✅ Backend API: `https://api.yourdomain.com/api/test`
2. ✅ Dashboard can login and fetch data
3. ✅ Web app can login and fetch data
4. ✅ Mobile app can connect to API
5. ✅ CORS errors don't appear in browser console
6. ✅ JWT tokens work across all clients
7. ✅ All endpoints accessible

---

## Quick Reference

**All apps must point to the same backend API:**
```
https://api.yourdomain.com/api
```

Replace `yourdomain.com` with your actual domain name.

