<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update old theme names to new theme names
        DB::table('profiles')
            ->where('theme', 'minimal')
            ->update(['theme' => 'light-minimal']);

        DB::table('profiles')
            ->where('theme', 'gradient')
            ->update(['theme' => 'dark-minimal']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Reverse the changes
        DB::table('profiles')
            ->where('theme', 'light-minimal')
            ->update(['theme' => 'minimal']);

        DB::table('profiles')
            ->where('theme', 'dark-minimal')
            ->update(['theme' => 'gradient']);
    }
};
