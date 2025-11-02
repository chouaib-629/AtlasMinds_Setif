<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Protected routes
Route::middleware('auth:api')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    
    // Example protected route
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

// Admin routes (with /admin prefix)
Route::prefix('admin')->group(function () {
    // Public admin routes
    Route::post('/register', [\App\Http\Controllers\AdminAuthController::class, 'register']);
    Route::post('/login', [\App\Http\Controllers\AdminAuthController::class, 'login']);
    Route::post('/forgot-password', [\App\Http\Controllers\AdminAuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [\App\Http\Controllers\AdminAuthController::class, 'resetPassword']);

    // Protected admin routes
    Route::middleware('auth:admin')->group(function () {
        Route::get('/me', [\App\Http\Controllers\AdminAuthController::class, 'me']);
        Route::post('/logout', [\App\Http\Controllers\AdminAuthController::class, 'logout']);
        Route::post('/refresh', [\App\Http\Controllers\AdminAuthController::class, 'refresh']);
    });
});

// Example public API route
Route::get('/test', function () {
    return response()->json([
        'message' => 'API is working!',
        'status' => 'success'
    ]);
});

