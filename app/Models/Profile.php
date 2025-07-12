<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Profile extends Model
{
    protected $fillable = [
        'user_id',
        'resolve_code_id',
        'first_name',
        'last_name',
        'slug',
        'bio',
        'company_name',
        'position',
        'avatar_url',
        'banner_url',
        'website_url',
        'twitter_username',
        'instagram_username',
        'linkedin_username',
        'github_username',
        'facebook_username',
        'youtube_url',
        'tiktok_username',
        'discord_username',
        'twitch_username',
        'phone_number',
        'email',
        'location',
        'custom_links',
        'services',
        'is_public',
        'theme',
    ];

    protected $casts = [
        'custom_links' => 'array',
        'services' => 'array',
        'is_public' => 'boolean',
    ];

    /**
     * Get the user that owns the profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the resolve code associated with the profile.
     */
    public function resolveCode(): BelongsTo
    {
        return $this->belongsTo(ResolveCode::class);
    }

    /**
     * Get the visits for this profile.
     */
    public function visits(): HasMany
    {
        return $this->hasMany(ProfileVisit::class);
    }

    /**
     * Get visit count for this profile.
     */
    public function getVisitCountAttribute(): int
    {
        return $this->visits()->count();
    }

    /**
     * Get unique visitor count for this profile.
     */
    public function getUniqueVisitorsCountAttribute(): int
    {
        return $this->visits()->distinct('ip_address')->count('ip_address');
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * Generate a unique slug from the first and last name.
     */
    public static function generateUniqueSlug(string $firstName, string $lastName, ?int $excludeId = null): string
    {
        $fullName = "{$firstName} {$lastName}";
        $baseSlug = Str::slug($fullName);
        $slug = $baseSlug;
        $counter = 1;

        while (static::slugExists($slug, $excludeId)) {
            $slug = $baseSlug . $counter;
            $counter++;
        }

        return $slug;
    }

    /**
     * Check if a slug already exists.
     */
    protected static function slugExists(string $slug, ?int $excludeId = null): bool
    {
        $query = static::where('slug', $slug);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($profile) {
            if (empty($profile->slug)) {
                $profile->slug = static::generateUniqueSlug($profile->first_name, $profile->last_name);
            }
        });

        static::updating(function ($profile) {
            if ($profile->isDirty('first_name') || $profile->isDirty('last_name')) {
                $profile->slug = static::generateUniqueSlug($profile->first_name, $profile->last_name, $profile->id);
            }
        });
    }
}
