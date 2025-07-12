<?php

use App\Http\Controllers\UserProfileController;
use App\Http\Controllers\ResolveCodes\ResolveCodeController;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// NFC code resolution route - this should be the only route here to avoid conflicts
Route::get('/{code}', ResolveCodeController::class)
    ->where('code', '[A-Za-z0-9]+')
    ->name('resolve.code');

