<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UploadController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect('/dashboard');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

Route::middleware(['auth'])->group(function () {
    // Upload routes - available for profile creation before email verification
    Route::post('upload/image', [UploadController::class, 'uploadImage'])->name('upload.image');
    Route::delete('upload/image', [UploadController::class, 'deleteImage'])->name('upload.delete');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/admin.php';
require __DIR__ . '/resolve.php'; // Load resolve routes first to avoid conflicts
require __DIR__ . '/profile.php'; // Ensure this is included for user profile routes