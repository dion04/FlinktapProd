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
            // Make first_name and last_name required (not nullable)
            $table->string('first_name')->nullable(false)->change();
            $table->string('last_name')->nullable(false)->change();

            // Remove display_name field
            $table->dropColumn('display_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            // Add back display_name field
            $table->string('display_name')->after('resolve_code_id');

            // Make first_name and last_name nullable again
            $table->string('first_name')->nullable()->change();
            $table->string('last_name')->nullable()->change();
        });
    }
};
