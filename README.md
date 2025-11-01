# AtlasMinds Setif Project

This repository contains three main projects:

1. **Mobile App** (`mobieApp/`) - React Native app with Expo Go
2. **Dashboard** (`dashboard/`) - Next.js admin dashboard
3. **Backend** (`backend/`) - Laravel API with MySQL

## Project Structure

```
AtlasMinds_Setif/
├── mobieApp/          # React Native mobile application
├── dashboard/         # Next.js admin dashboard
└── backend/           # Laravel API backend
```

## Quick Start

### Mobile App (React Native + Expo)
```bash
cd mobieApp
npm install
npm start
```

### Dashboard (Next.js)
```bash
cd dashboard
npm install
npm run dev
```

### Backend (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

## Technologies Used

- **Mobile App**: React Native, Expo Go
- **Dashboard**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Laravel, PHP, MySQL

## Development

Each project has its own README with detailed setup instructions:
- [Mobile App README](./mobieApp/README.md)
- [Dashboard README](./dashboard/README.md)
- [Backend README](./backend/README.md)

## Notes

- The backend API is configured to accept requests from both the mobile app and dashboard
- CORS is configured in the Laravel backend
- All API endpoints are prefixed with `/api`
- Make sure MySQL is running before starting the backend

