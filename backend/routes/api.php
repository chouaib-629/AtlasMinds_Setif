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
    Route::put('/preferences', [AuthController::class, 'updatePreferences']);
    
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

        // Events routes
        Route::get('/events', [\App\Http\Controllers\Admin\EventController::class, 'index']);
        Route::post('/events', [\App\Http\Controllers\Admin\EventController::class, 'store']);
        Route::get('/events/{id}', [\App\Http\Controllers\Admin\EventController::class, 'show']);
        Route::put('/events/{id}', [\App\Http\Controllers\Admin\EventController::class, 'update']);
        Route::delete('/events/{id}', [\App\Http\Controllers\Admin\EventController::class, 'destroy']);

        // Payments routes
        Route::get('/payments', [\App\Http\Controllers\Admin\PaymentController::class, 'index']);
        Route::get('/payments/{id}', [\App\Http\Controllers\Admin\PaymentController::class, 'show']);
        Route::patch('/payments/{id}/status', [\App\Http\Controllers\Admin\PaymentController::class, 'updateStatus']);

        // Participants routes (inscriptions - users registered for events)
        Route::get('/participants', [\App\Http\Controllers\Admin\ParticipantController::class, 'index']);
        Route::get('/participants/{id}', [\App\Http\Controllers\Admin\ParticipantController::class, 'show']);
        Route::get('/participants/{id}/attendance', [\App\Http\Controllers\Admin\ParticipantController::class, 'attendance']);

        // Users routes (all users)
        Route::get('/users', [\App\Http\Controllers\Admin\UserController::class, 'index']);
        Route::get('/users/{id}', [\App\Http\Controllers\Admin\UserController::class, 'show']);

        // Leaderboard routes
        Route::get('/leaderboard', [\App\Http\Controllers\Admin\LeaderboardController::class, 'index']);

        // Chats routes
        Route::get('/chats', [\App\Http\Controllers\Admin\ChatController::class, 'index']);
        Route::post('/chats', [\App\Http\Controllers\Admin\ChatController::class, 'store']);
        Route::put('/chats/{id}', [\App\Http\Controllers\Admin\ChatController::class, 'update']);
        Route::delete('/chats/{id}', [\App\Http\Controllers\Admin\ChatController::class, 'destroy']);

        // Livestreams routes
        Route::get('/livestreams', [\App\Http\Controllers\Admin\LivestreamController::class, 'index']);
        Route::post('/livestreams', [\App\Http\Controllers\Admin\LivestreamController::class, 'store']);
        Route::put('/livestreams/{id}', [\App\Http\Controllers\Admin\LivestreamController::class, 'update']);
        Route::delete('/livestreams/{id}', [\App\Http\Controllers\Admin\LivestreamController::class, 'destroy']);

        // Event Inscriptions routes
        Route::get('/event-inscriptions', [\App\Http\Controllers\Admin\EventInscriptionController::class, 'index']);
        Route::patch('/event-inscriptions/{id}/status', [\App\Http\Controllers\Admin\EventInscriptionController::class, 'updateStatus']);
    });
});

// Example public API route
Route::get('/test', function () {
    return response()->json([
        'message' => 'API is working!',
        'status' => 'success'
    ]);
});

