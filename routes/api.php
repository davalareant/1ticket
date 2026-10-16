<?php

use App\Http\Controllers\Api\AirportController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\FlightController;
use App\Http\Controllers\Api\PaymentController;
use Illuminate\Support\Facades\Route;

// Public authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public airport and search routes
Route::get('/airports', [AirportController::class, 'index']);
Route::get('/flights/search', [FlightController::class, 'search']);
Route::get('/flights/{id}/seats', [FlightController::class, 'seats']);
Route::get('/payment-methods', [PaymentController::class, 'methods']);

// Protected routes (Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Bookings
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::get('/bookings/{kode}', [BookingController::class, 'show']);
    Route::post('/bookings/{kode}/cancel', [BookingController::class, 'cancel']);

    // Payments
    Route::post('/bookings/{kode}/pay', [PaymentController::class, 'pay']);
    Route::post('/payments/{referensi}/simulate', [PaymentController::class, 'simulate']);
});
