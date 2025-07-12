<?php

use App\Http\Controllers\UserProfileController;
use App\Http\Controllers\ResolveCodes\ResolveCodeController;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    // Profile creation - using prefix to avoid conflicts with resolve codes
    Route::get('/profile/create', [UserProfileController::class, 'create'])->name('profile.create');
    Route::post('/profile/create', [UserProfileController::class, 'store'])->name('profile.store');
});

// Public profile routes (no auth required) - using 'profile/' prefix to avoid conflicts
Route::prefix('profile')->group(function () {
    Route::get('/{profile}', [UserProfileController::class, 'show'])->name('profile.show');
    Route::get('/{profile}/edit', [UserProfileController::class, 'edit'])->middleware('auth')->name('profile.edit');
    Route::put('/{profile}', [UserProfileController::class, 'update'])->middleware('auth')->name('profile.update');
    Route::delete('/{profile}', [UserProfileController::class, 'destroy'])->middleware('auth')->name('profile.destroy');
});

// Contact support route
Route::get('/contact-support', [UserProfileController::class, 'contactSupport'])->name('contact.support');