<?php

namespace App\Console\Commands;

use App\Models\Profile;
use Illuminate\Console\Command;

class PopulateProfileSlugs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'profiles:populate-slugs';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Populate slugs for existing profiles that don\'t have them';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $profilesWithoutSlugs = Profile::whereNull('slug')->orWhere('slug', '')->get();

        if ($profilesWithoutSlugs->isEmpty()) {
            $this->info('All profiles already have slugs.');
            return;
        }

        $this->info("Found {$profilesWithoutSlugs->count()} profiles without slugs.");

        foreach ($profilesWithoutSlugs as $profile) {
            $profile->slug = Profile::generateUniqueSlug($profile->display_name, $profile->id);
            $profile->save();

            $this->line("Generated slug '{$profile->slug}' for profile '{$profile->display_name}'");
        }

        $this->info('All profile slugs have been populated.');
    }
}
