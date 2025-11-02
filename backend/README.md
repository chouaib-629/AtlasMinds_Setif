# Laravel Backend API

This is a Laravel backend application providing API endpoints for the mobile app and admin dashboard. It uses JWT (JSON Web Tokens) for authentication.

## Prerequisites

- PHP >= 8.2
- Composer
- MySQL Server (or compatible database)
- Node.js and npm (for frontend assets, optional)

## Installation

1. **Install dependencies:**
   ```bash
   composer install
   ```

2. **Environment Configuration:**
   - Copy `.env.example` to `.env` (if not already done)
   - Update the `.env` file with your database credentials:
     ```env
     DB_CONNECTION=mysql
     DB_HOST=127.0.0.1
     DB_PORT=3306
     DB_DATABASE=your_database_name
     DB_USERNAME=your_database_username
     DB_PASSWORD=your_database_password
     ```

3. **Generate application key:**
   ```bash
   php artisan key:generate
   ```

4. **Generate JWT secret:**
   ```bash
   php artisan jwt:secret
   ```

5. **Install frontend dependencies (optional):**
   ```bash
   npm install
   ```

## Database Setup

### Run Migrations

Create all database tables:
```bash
php artisan migrate
```

Or run migrations with fresh database (⚠️ **Warning**: This will drop all tables):
```bash
php artisan migrate:fresh
```

### Run Seeders

Seed the database with default data (admins and test user):
```bash
php artisan db:seed
```

Or run specific seeders:
```bash
# Seed only admins
php artisan db:seed --class=AdminSeeder

# Seed only users
php artisan db:seed --class=UserSeeder
```

#### Default Accounts Created by Seeders

**Admins:**
- Super Admin: `super@admin.com` / `admin123`
- Admin: `admin@admin.com` / `admin123`

**Users:**
- Test User: `user@youth.com` / `azerty123`

### Complete Setup (Fresh Database)

To start with a fresh database and populate it with seeders:
```bash
php artisan migrate:fresh --seed
```

## Running the Application

Start the development server:
```bash
php artisan serve
```

The API will be available at `http://localhost:8000`

You can specify a different port:
```bash
php artisan serve --port=8080
```

## API Endpoints

All API endpoints are prefixed with `/api`.

Base URL: `http://localhost:8000/api`

### User Authentication Endpoints

**Public Routes:**

- `POST /api/register` - Register a new user
  ```json
  {
    "nom": "User",
    "prenom": "Test",
    "date_de_naissance": "2000-01-15",
    "adresse": "123 Rue de Test",
    "commune": "Sétif",
    "wilaya": "Sétif",
    "numero_telephone": "0550123456",
    "email": "user@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }
  ```

- `POST /api/login` - Login user
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- `POST /api/forgot-password` - Request password reset
  ```json
  {
    "email": "user@example.com"
  }
  ```

- `POST /api/reset-password` - Reset password with token
  ```json
  {
    "email": "user@example.com",
    "token": "reset_token",
    "password": "newpassword123",
    "password_confirmation": "newpassword123"
  }
  ```

**Protected Routes (Requires JWT Token):**

Include the JWT token in the Authorization header:
```
Authorization: Bearer {your_jwt_token}
```

- `GET /api/me` - Get authenticated user information
- `POST /api/logout` - Logout user
- `POST /api/refresh` - Refresh JWT token
- `GET /api/user` - Get current user (alternative endpoint)

### Admin Authentication Endpoints

All admin endpoints are prefixed with `/api/admin`.

**Public Admin Routes:**

- `POST /api/admin/register` - Register a new admin
  ```json
  {
    "name": "Admin Name",
    "email": "admin@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }
  ```

- `POST /api/admin/login` - Login admin
  ```json
  {
    "email": "admin@example.com",
    "password": "password123"
  }
  ```

- `POST /api/admin/forgot-password` - Request password reset
  ```json
  {
    "email": "admin@example.com"
  }
  ```

- `POST /api/admin/reset-password` - Reset password with token
  ```json
  {
    "email": "admin@example.com",
    "token": "reset_token",
    "password": "newpassword123",
    "password_confirmation": "newpassword123"
  }
  ```

**Protected Admin Routes (Requires Admin JWT Token):**

Include the admin JWT token in the Authorization header:
```
Authorization: Bearer {your_admin_jwt_token}
```

- `GET /api/admin/me` - Get authenticated admin information
- `POST /api/admin/logout` - Logout admin
- `POST /api/admin/refresh` - Refresh admin JWT token

### Test Endpoint

- `GET /api/test` - Returns a test response
  ```json
  {
    "message": "API is working!",
    "status": "success"
  }
  ```

## Authentication

This application uses **JWT (JSON Web Tokens)** for authentication via the `tymon/jwt-auth` package.

### User Authentication
- Uses `api` guard with `users` provider
- JWT tokens are generated for authenticated users
- Protected routes use `auth:api` middleware

### Admin Authentication
- Uses `admin` guard with `admins` provider
- Separate JWT tokens for admins
- Protected routes use `auth:admin` middleware
- Admin tokens include custom claim: `type: 'admin'`

## CORS Configuration

CORS middleware is configured to allow cross-origin requests from the mobile app and dashboard. The configuration is set up in `bootstrap/app.php`.

## Database

This project uses MySQL as the database. Make sure your MySQL server is running and the database specified in `.env` exists before running migrations.

### Database Tables

- `users` - User accounts (mobile app users)
- `admins` - Admin accounts (dashboard users)
- `password_reset_tokens` - Password reset tokens for users
- `admin_password_reset_tokens` - Password reset tokens for admins
- `cache` - Cache table
- `jobs` - Queue jobs table

## Project Structure

- `app/Http/Controllers/` - API controllers
  - `AuthController.php` - User authentication controller
  - `AdminAuthController.php` - Admin authentication controller
- `app/Models/` - Models
  - `User.php` - User model
  - `Admin.php` - Admin model
- `routes/api.php` - API route definitions
- `database/migrations/` - Database migrations
- `database/seeders/` - Database seeders
  - `AdminSeeder.php` - Seeds default admin accounts
  - `UserSeeder.php` - Seeds test user account
- `config/auth.php` - Authentication configuration
- `config/jwt.php` - JWT configuration

## Testing

Test the API endpoints using tools like Postman, cURL, or any HTTP client.

Example login request with cURL:
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@youth.com","password":"azerty123"}'
```

Example authenticated request:
```bash
curl -X GET http://localhost:8000/api/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Troubleshooting

- **JWT errors**: Make sure you've run `php artisan jwt:secret`
- **Database connection errors**: Verify your `.env` database credentials
- **Migration errors**: Ensure the database exists and credentials are correct
- **CORS errors**: Check that CORS is properly configured in `bootstrap/app.php`
