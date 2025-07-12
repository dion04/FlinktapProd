<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProfileVisit extends Model
{
    use HasFactory;

    protected $fillable = [
        'profile_id',
        'ip_address',
        'user_agent',
        'referer',
        'country',
        'city',
        'device_info',
        'visited_at',
    ];

    protected $casts = [
        'device_info' => 'array',
        'visited_at' => 'datetime',
    ];

    /**
     * Get the profile that was visited
     */
    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class);
    }
}
