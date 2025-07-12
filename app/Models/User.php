<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */


    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'github_id',
        'github_token',
        'github_refresh_token',
        'google_id',
        'google_token',
        'google_refresh_token',
        'apple_id',
        'apple_token',
        'apple_refresh_token',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Check if user has a password set (not OAuth-only user)
     */
    public function hasPassword(): bool
    {
        return !is_null($this->password);
    }

    /**
     * Check if user is OAuth-only (no password set)
     */
    public function isOAuthOnly(): bool
    {
        return is_null($this->password);
    }
    public function resolveCodes()
    {
        return $this->hasMany(ResolveCode::class);
    }

    /**
     * Get the user's profiles.
     */
    public function profiles()
    {
        return $this->hasMany(Profile::class);
    }

    /**
     * Get the user's profile (backward compatibility).
     */
    public function profile()
    {
        return $this->hasOne(Profile::class);
    }

    /**
     * Check if user has a specific role
     */
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    /**
     * Check if user is a super admin
     */
    public function isSuperAdmin(): bool
    {
        return $this->role === 'superadmin';
    }

    /**
     * Check if user is an admin (includes super admin)
     */
    public function isAdmin(): bool
    {
        return in_array($this->role, ['admin', 'superadmin']);
    }

    /**
     * Check if user is a regular user
     */
    public function isUser(): bool
    {
        return $this->role === 'user';
    }

    /**
     * Check if user can access admin routes
     */
    public function canAccessAdmin(): bool
    {
        return $this->isAdmin();
    }

    /**
     * Check if user can manage admins
     */
    public function canManageAdmins(): bool
    {
        return $this->isSuperAdmin();
    }
}
