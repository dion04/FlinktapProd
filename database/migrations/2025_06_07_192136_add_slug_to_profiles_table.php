<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->string('slug')->nullable()->after('display_name');
        });

        // Update existing profiles to generate slugs
        $this->generateSlugsForExistingProfiles();

        // Make slug column required and unique after generating slugs
        Schema::table('profiles', function (Blueprint $table) {
            $table->string('slug')->nullable(false)->unique()->change();
        });
    }

    /**
     * Generate slugs for existing profiles.
     */
    private function generateSlugsForExistingProfiles(): void
    {
        $profiles = \App\Models\Profile::whereNull('slug')->get();

        foreach ($profiles as $profile) {
            $profile->slug = \App\Models\Profile::generateUniqueSlug($profile->display_name);
            $profile->save();
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->dropColumn('slug');
        });
    }
};
