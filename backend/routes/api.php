<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [RegisteredUserController::class, 'store'])
    ->middleware('guest')
    ->name('register');

Route::post('/login', [AuthenticatedSessionController::class, 'store'])
    ->middleware('guest')
    ->name('login');

// Protected routes
Route::middleware(['jwt.auth'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/me', [AuthenticatedSessionController::class, 'me'])
        ->name('me');
    
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
        
    Route::post('/refresh', [AuthenticatedSessionController::class, 'refresh'])
        ->name('refresh');

    Route::apiResource('products', ProductController::class);
});
