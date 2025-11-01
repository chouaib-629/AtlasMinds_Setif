# Laravel Backend API

This is a Laravel backend application providing API endpoints for the mobile app and dashboard.

## Prerequisites

- PHP >= 8.2
- Composer
- MySQL Server
- Node.js and npm (for frontend assets)

## Installation

1. **Install dependencies:**
   ```bash
   composer install
   ```

2. **Environment Configuration:**
   - Copy `.env.example` to `.env` (if not already done)
   - Update the `.env` file with your MySQL database credentials:
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

4. **Run migrations:**
   ```bash
   php artisan migrate
   ```

5. **Install frontend dependencies (optional):**
   ```bash
   npm install
   ```

## Running the Application

Start the development server:
```bash
php artisan serve
```

The API will be available at `http://localhost:8000`

## API Endpoints

The API routes are defined in `routes/api.php`. All API endpoints are prefixed with `/api`.

Example test endpoint:
- `GET /api/test` - Returns a test response

## CORS Configuration

CORS middleware is configured to allow cross-origin requests from the mobile app and dashboard. The configuration is set up in `bootstrap/app.php`.

## Database

This project uses MySQL as the database. Make sure your MySQL server is running and the database specified in `.env` exists before running migrations.

## Project Structure

- `app/Http/Controllers/` - API controllers
- `routes/api.php` - API route definitions
- `database/migrations/` - Database migrations
- `config/database.php` - Database configuration

## Next Steps

- Define your API endpoints in `routes/api.php`
- Create controllers in `app/Http/Controllers/`
- Create models in `app/Models/`
- Add migrations for your database schema
