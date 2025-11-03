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
    
    // Activity registration/join endpoints
    Route::post('/educations/{id}/join', [\App\Http\Controllers\Api\EducationController::class, 'join']);
    Route::post('/clubs/{id}/join', [\App\Http\Controllers\Api\ClubController::class, 'join']);
    Route::post('/direct-activities/{id}/join', [\App\Http\Controllers\Api\DirectActivityController::class, 'join']);
    
    // Leaderboard endpoint
    Route::get('/leaderboard', [\App\Http\Controllers\Api\LeaderboardController::class, 'index']);
    
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

        // Education Inscriptions routes
        Route::get('/education-inscriptions', [\App\Http\Controllers\Admin\EducationInscriptionController::class, 'index']);
        Route::patch('/education-inscriptions/{id}/status', [\App\Http\Controllers\Admin\EducationInscriptionController::class, 'updateStatus']);

        // Club Inscriptions routes
        Route::get('/club-inscriptions', [\App\Http\Controllers\Admin\ClubInscriptionController::class, 'index']);
        Route::patch('/club-inscriptions/{id}/status', [\App\Http\Controllers\Admin\ClubInscriptionController::class, 'updateStatus']);

        // Direct Activity Inscriptions routes
        Route::get('/direct-activity-inscriptions', [\App\Http\Controllers\Admin\DirectActivityInscriptionController::class, 'index']);
        Route::patch('/direct-activity-inscriptions/{id}/status', [\App\Http\Controllers\Admin\DirectActivityInscriptionController::class, 'updateStatus']);

        // Education CRUD routes
        Route::get('/educations', [\App\Http\Controllers\Admin\EducationController::class, 'index']);
        Route::post('/educations', [\App\Http\Controllers\Admin\EducationController::class, 'store']);
        Route::get('/educations/{id}', [\App\Http\Controllers\Admin\EducationController::class, 'show']);
        Route::put('/educations/{id}', [\App\Http\Controllers\Admin\EducationController::class, 'update']);
        Route::delete('/educations/{id}', [\App\Http\Controllers\Admin\EducationController::class, 'destroy']);

        // Club CRUD routes
        Route::get('/clubs', [\App\Http\Controllers\Admin\ClubController::class, 'index']);
        Route::post('/clubs', [\App\Http\Controllers\Admin\ClubController::class, 'store']);
        Route::get('/clubs/{id}', [\App\Http\Controllers\Admin\ClubController::class, 'show']);
        Route::put('/clubs/{id}', [\App\Http\Controllers\Admin\ClubController::class, 'update']);
        Route::delete('/clubs/{id}', [\App\Http\Controllers\Admin\ClubController::class, 'destroy']);

        // Direct Activity CRUD routes
        Route::get('/direct-activities', [\App\Http\Controllers\Admin\DirectActivityController::class, 'index']);
        Route::post('/direct-activities', [\App\Http\Controllers\Admin\DirectActivityController::class, 'store']);
        Route::get('/direct-activities/{id}', [\App\Http\Controllers\Admin\DirectActivityController::class, 'show']);
        Route::put('/direct-activities/{id}', [\App\Http\Controllers\Admin\DirectActivityController::class, 'update']);
        Route::delete('/direct-activities/{id}', [\App\Http\Controllers\Admin\DirectActivityController::class, 'destroy']);

        // Settings routes
        Route::get('/settings', [\App\Http\Controllers\Admin\SettingsController::class, 'index']);
        Route::put('/settings', [\App\Http\Controllers\Admin\SettingsController::class, 'update']);
    });
});

// Public routes for mobile app - Education, Clubs, Direct Activities
Route::get('/educations', [\App\Http\Controllers\Api\EducationController::class, 'index']);
Route::get('/educations/featured', [\App\Http\Controllers\Api\EducationController::class, 'featured']);
Route::get('/educations/{id}', [\App\Http\Controllers\Api\EducationController::class, 'show']);

Route::get('/clubs', [\App\Http\Controllers\Api\ClubController::class, 'index']);
Route::get('/clubs/featured', [\App\Http\Controllers\Api\ClubController::class, 'featured']);
Route::get('/clubs/{id}', [\App\Http\Controllers\Api\ClubController::class, 'show']);

Route::get('/direct-activities', [\App\Http\Controllers\Api\DirectActivityController::class, 'index']);
Route::get('/direct-activities/featured', [\App\Http\Controllers\Api\DirectActivityController::class, 'featured']);
Route::get('/direct-activities/{id}', [\App\Http\Controllers\Api\DirectActivityController::class, 'show']);

// Home screen endpoint
Route::get('/home', [\App\Http\Controllers\Api\HomeController::class, 'index']);

// Example public API route
Route::get('/test', function () {
    return response()->json([
        'message' => 'API is working!',
        'status' => 'success'
    ]);
});

