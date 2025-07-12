<?php
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\BatchController;
use App\Http\Controllers\Admin\ProfileAdminController;
use App\Http\Controllers\Admin\ResolveCodeAdminController;
use App\Http\Controllers\Admin\UserManagementController;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
    Route::get('resolve-codes', [ResolveCodeAdminController::class, 'index'])->name('admin.resolve-codes.index');
    Route::post('resolve-codes', [ResolveCodeAdminController::class, 'store'])->name('admin.resolve-codes.store');
    Route::post('resolve-codes/mark-as-copied', [ResolveCodeAdminController::class, 'markAsCopied'])->name('admin.resolve-codes.mark-as-copied');
    Route::delete('resolve-codes/{id}', [ResolveCodeAdminController::class, 'destroy'])->name('admin.resolve-codes.destroy');// Batch routes
    Route::get('batches', [BatchController::class, 'index'])->name('admin.batches.index');
    Route::get('batches/{batch}', [BatchController::class, 'show'])->name('admin.batches.show');
    Route::delete('batches/{batch}', [BatchController::class, 'destroy'])->name('admin.batches.destroy');    // Profile management routes
    Route::get('profiles', [ProfileAdminController::class, 'index'])->name('admin.profiles.index');
    Route::delete('profiles/bulk-delete', [ProfileAdminController::class, 'bulkDelete'])->name('admin.profiles.bulk-delete');
    Route::get('profiles/{profile}', [ProfileAdminController::class, 'show'])->name('admin.profiles.show');
    Route::delete('profiles/{profile}', [ProfileAdminController::class, 'destroy'])->name('admin.profiles.destroy');
    Route::patch('profiles/{profile}/toggle-visibility', [ProfileAdminController::class, 'toggleVisibility'])->name('admin.profiles.toggle-visibility');

    // User management routes (only for super admins)
    Route::middleware('role:superadmin')->group(function () {
        Route::get('users', [UserManagementController::class, 'index'])->name('admin.users.index');
        Route::patch('users/{user}/role', [UserManagementController::class, 'updateRole'])->name('admin.users.update-role');
        Route::delete('users/{user}', [UserManagementController::class, 'destroy'])->name('admin.users.destroy');
    });
});