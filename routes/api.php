<?php

use App\Http\Controllers\Api\AirportController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\FlightController;
use App\Http\Controllers\Api\PaymentController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\VoucherController;

// Public authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public airport, search, and vouchers routes
Route::get('/airports', [AirportController::class, 'index']);
Route::get('/flights/search', [FlightController::class, 'search']);
Route::get('/flights/{id}/seats', [FlightController::class, 'seats']);
Route::get('/payment-methods', [PaymentController::class, 'methods']);
Route::get('/vouchers/active', [VoucherController::class, 'getActiveVouchers']);
Route::post('/vouchers/validate', [VoucherController::class, 'validateVoucher']);

// Protected routes (Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Bookings
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::get('/bookings/{kode}', [BookingController::class, 'show']);
    Route::post('/bookings/{kode}/cancel', [BookingController::class, 'cancel']);
    Route::post('/bookings/{kode}/check-in', [BookingController::class, 'checkIn']);

    // Payments
    Route::post('/bookings/{kode}/pay', [PaymentController::class, 'pay']);
    Route::post('/payments/{referensi}/simulate', [PaymentController::class, 'simulate']);
});
