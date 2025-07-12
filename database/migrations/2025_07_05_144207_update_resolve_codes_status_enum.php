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
        // First, update any existing 'available' status values to 'unassigned' 
        // to prevent constraint violations during the enum change
        DB::table('resolve_codes')
            ->where('status', 'available')
            ->update(['status' => 'unassigned']);

        // Use raw SQL to modify the enum since Laravel doesn't support direct enum modification
        DB::statement("ALTER TABLE resolve_codes MODIFY COLUMN status ENUM('unassigned', 'assigned', 'available') DEFAULT 'unassigned'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // First, update any 'available' status values to 'unassigned' to prevent constraint violations
        DB::table('resolve_codes')
            ->where('status', 'available')
            ->update(['status' => 'unassigned']);

        // Revert the enum to the original values
        DB::statement("ALTER TABLE resolve_codes MODIFY COLUMN status ENUM('unassigned', 'assigned') DEFAULT 'unassigned'");
    }
};
