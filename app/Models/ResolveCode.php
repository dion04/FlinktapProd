<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ResolveCode extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'code',
        'status',
        'user_id',
        'type',
        'assigned_at',
        'created_by',
        'batch_id',
        'copied_at',
    ];/**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'assigned_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'copied_at' => 'datetime',
    ];/**
     * Get the user that owns the resolve code.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }    /**
         * Get the user who created the resolve code.
         */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the batch this resolve code belongs to.
     */
    public function batch(): BelongsTo
    {
        return $this->belongsTo(ResolveCodeBatch::class, 'batch_id');
    }

    /**
     * Get the profile associated with this resolve code.
     */
    public function profile()
    {
        return $this->hasOne(Profile::class);
    }

    /**
     * Assign the resolve code to a user.
     */
    public function assignToUser(User $user): self
    {
        $this->update([
            'user_id' => $user->id,
            'status' => 'assigned',
            'assigned_at' => now(),
        ]);

        return $this;
    }    /**
         * Determine if the resolve code is assigned to a user.
         */
    public function isAssigned(): bool
    {
        return $this->status === 'assigned' && $this->user_id !== null;
    }    /**
         * Override delete to handle profile cascade deletion.
         */
    public function delete()
    {
        // Delete associated profile first (including its visits)
        if ($this->profile) {
            // Delete profile visits first
            $this->profile->visits()->delete();
            // Then delete the profile
            $this->profile->delete();
        }
        // Store batch reference before deletion
        $batch = $this->batch;
        $batchId = $this->batch_id;

        // Remove this code from the batch completely by setting batch_id to null
        if ($batchId) {
            $this->batch_id = null;
            $this->save();
        }

        // Then perform the soft delete on the resolve code
        $result = parent::delete();

        // Update batch count after the resolve code is deleted
        if ($batch) {
            $batch->updateCount();
        }

        return $result;
    }    /**
         * Override forceDelete to handle profile cascade deletion.
         */
    public function forceDelete()
    {
        // Delete associated profile first (including its visits)
        if ($this->profile) {
            // Delete profile visits first
            $this->profile->visits()->forceDelete();
            // Then delete the profile
            $this->profile->forceDelete();
        }
        // Store batch reference before deletion
        $batch = $this->batch;
        $batchId = $this->batch_id;

        // Remove this code from the batch completely by setting batch_id to null
        if ($batchId) {
            $this->batch_id = null;
            $this->save();
        }

        // Then perform the force delete on the resolve code
        $result = parent::forceDelete();

        // Update batch count after the resolve code is deleted
        if ($batch) {
            $batch->updateCount();
        }

        return $result;
    }

    /**
     * Mark this resolve code as copied.
     */
    public function markAsCopied()
    {
        $this->update([
            'copied_at' => now(),
        ]);

        return $this;
    }

    /**
     * Determine if the resolve code has been copied.
     */
    public function hasBeenCopied(): bool
    {
        return $this->copied_at !== null;
    }

    /**
     * Check if this resolve code is orphaned (assigned but has no profile)
     * and fix it by resetting to available status.
     */
    public function checkAndFixOrphanedState(): bool
    {
        if ($this->isAssigned() && !$this->profile) {
            $this->update([
                'status' => 'available',
                'user_id' => null,
                'assigned_at' => null,
            ]);
            return true; // Was orphaned and fixed
        }
        return false; // Was not orphaned
    }
}