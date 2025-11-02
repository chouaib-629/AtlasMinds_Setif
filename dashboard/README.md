# AtlasMinds Admin Dashboard

A modern Next.js dashboard for managing AtlasMinds youth centers and virtual house operations.

## Features

- 🔐 Admin authentication with JWT
- 👤 Role-based access control (Super Admin vs Regular Admin)
- 📊 Dashboard overview with statistics
- 🏛️ Virtual Youth House management (Super Admin only)
- 🏢 Youth Centers management
- 📅 Events management
- 👥 User management
- 🌓 Dark mode support
- 📱 Responsive design

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Laravel backend API running on `http://localhost:8000`

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Copy the environment file:
```bash
cp .env.example .env.local
```

3. Update `.env.local` with your API base URL if needed:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Roles

### Super Admin
- Full system access
- Can manage Virtual Youth House
- Can manage all youth centers
- System-wide operations

### Admin (Youth House Director)
- Manages their assigned youth center
- Can create and manage events
- Can view and manage users within their center

## API Integration

The dashboard connects to the Laravel backend API at `/api/admin` endpoints:

- `POST /api/admin/login` - Admin login
- `GET /api/admin/me` - Get admin profile
- `POST /api/admin/logout` - Admin logout
- `POST /api/admin/refresh` - Refresh JWT token

All API requests include the JWT token in the `Authorization` header:
```
Authorization: Bearer {token}
```

## Project Structure

```
src/
├── app/
│   ├── dashboard/       # Dashboard pages
│   ├── login/           # Login page
│   ├── layout.tsx       # Root layout with AuthProvider
│   └── page.tsx         # Home page (redirects)
├── components/
│   ├── Auth/            # Authentication components
│   └── Layout/          # Layout components
├── config/
│   └── api.ts           # API configuration
├── contexts/
│   └── AuthContext.tsx  # Authentication context
└── lib/
    └── api.ts           # API service
```

## Building for Production

```bash
npm run build
npm start
```

## Technologies

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- JWT Authentication
