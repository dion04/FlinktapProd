<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\ResolveCodeBatch;

class UpdateBatchCounts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'batch:update-counts';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update batch counts to reflect only active (non-deleted) resolve codes';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking and updating batch counts...');

        $batches = ResolveCodeBatch::all();

        foreach ($batches as $batch) {
            $activeCodes = $batch->activeResolveCodes()->count();
            $allCodes = $batch->resolveCodes()->count();
            $deletedCodes = $batch->resolveCodes()->onlyTrashed()->count();

            $this->line("Batch {$batch->id}: {$batch->name}");
            $this->line("  - Stored count: {$batch->count}");
            $this->line("  - Active codes: {$activeCodes}");
            $this->line("  - All codes (including deleted): {$allCodes}");
            $this->line("  - Deleted codes: {$deletedCodes}");

            if ($batch->count != $activeCodes) {
                $this->warn("  - Count mismatch detected! Updating...");
                $oldCount = $batch->count;
                $batch->updateCount();
                $batch->refresh();
                $this->info("  - Updated: {$oldCount} -> {$batch->count}");
            } else {
                $this->info("  - Count is correct");
            }

            $this->line('');
        }

        $this->info('Done!');
    }
}
