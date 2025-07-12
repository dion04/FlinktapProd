<?php

namespace App\Console\Commands;

use App\Models\ResolveCode;
use App\Models\ResolveCodeBatch;
use App\Models\Profile;
use Illuminate\Console\Command;

class TestResolveCodeDeletion extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:resolve-code-deletion';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test the deletion of a resolve code and its effects on batches';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Testing Resolve Code Deletion and Batch Update');
        $this->line('');

        // Get a batch
        $batch = ResolveCodeBatch::first();
        if (!$batch) {
            $this->error('No batches found to test with.');
            return 1;
        }

        $this->info("Using batch: {$batch->name} (ID: {$batch->id})");
        $this->line("Initial batch count: {$batch->count}");
        $this->line("Initial active codes: {$batch->activeResolveCodes()->count()}");
        $this->line('');

        // Create a test resolve code
        $this->info('Creating a test resolve code...');
        $code = new ResolveCode([
            'code' => 'TEST' . rand(1000, 9999),
            'status' => 'available',
            'batch_id' => $batch->id
        ]);
        $code->save();

        $this->line("Created code: {$code->code} (ID: {$code->id}) in batch {$batch->id}");

        // Update batch count
        $batch->updateCount();
        $batch->refresh();
        $this->line("Batch count after adding: {$batch->count}");
        $this->line("Active codes after adding: {$batch->activeResolveCodes()->count()}");
        $this->line('');

        // Create a profile for this code
        $this->info('Creating a profile associated with this code...');
        $profile = new Profile([
            'display_name' => 'Test Profile ' . rand(100, 999),
            'slug' => 'test-profile-' . rand(100, 999),
            'resolve_code_id' => $code->id,
            'user_id' => 1, // Assuming there's at least one user
        ]);
        $profile->save();
        $this->line("Created profile: {$profile->display_name} (ID: {$profile->id})");
        $this->line('');

        // Now delete the resolve code (this should cascade delete the profile)
        $this->info('Now deleting the resolve code...');
        $code->delete();
        $this->line("Code soft-deleted.");

        // Check if the profile was also deleted
        $profileExists = Profile::find($profile->id);
        $this->line("Was profile cascade deleted? " . ($profileExists ? "No" : "Yes"));

        // Check if the code was removed from the batch
        $deletedCode = ResolveCode::withTrashed()->find($code->id);
        $this->line("Is code still in batch? " . ($deletedCode->batch_id === null ? "No (batch_id is null)" : "Yes (batch_id is {$deletedCode->batch_id})"));

        // Check if the batch count was updated
        $batch->refresh();
        $this->line("Batch count after deletion: {$batch->count}");
        $this->line("Active codes after deletion: {$batch->activeResolveCodes()->count()}");
        $this->line('');

        $this->info('Test completed successfully!');

        return Command::SUCCESS;
    }
}
