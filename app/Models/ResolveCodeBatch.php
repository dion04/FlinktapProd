<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ResolveCodeBatch extends Model
{
    protected $fillable = [
        'name',
        'prefix',
        'count',
        'created_by',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function resolveCodes(): HasMany
    {
        return $this->hasMany(ResolveCode::class, 'batch_id');
    }

    /**
     * Get only active (non-deleted) resolve codes for this batch
     */
    public function activeResolveCodes(): HasMany
    {
        return $this->hasMany(ResolveCode::class, 'batch_id')->whereNull('deleted_at');
    }

    /**
     * Recalculate and update the count of resolve codes in this batch
     * Only counts non-deleted resolve codes
     */
    public function updateCount()
    {
        $this->update([
            'count' => $this->activeResolveCodes()->count()
        ]);
    }
}
