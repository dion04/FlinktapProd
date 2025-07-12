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
        Schema::table('profiles', function (Blueprint $table) {
            // Add the new theme column
            $table->string('theme')->default('light')->after('is_public');
        });

        // Update existing records
        DB::statement("UPDATE profiles SET theme = CASE WHEN dark_theme = 1 THEN 'dark' ELSE 'light' END");

        Schema::table('profiles', function (Blueprint $table) {
            // Drop the old dark_theme column
            $table->dropColumn('dark_theme');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            // Add back the dark_theme column
            $table->boolean('dark_theme')->default(false)->after('is_public');
        });

        // Copy theme values back to dark_theme
        DB::statement("UPDATE profiles SET dark_theme = CASE WHEN theme = 'dark' THEN 1 ELSE 0 END");

        Schema::table('profiles', function (Blueprint $table) {
            // Drop the theme column
            $table->dropColumn('theme');
        });
    }
};
