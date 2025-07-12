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
            // Drop the existing foreign key constraint
            $table->dropForeign(['resolve_code_id']);

            // Recreate with cascade delete
            $table->foreign('resolve_code_id')
                ->references('id')
                ->on('resolve_codes')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            // Drop the cascade foreign key
            $table->dropForeign(['resolve_code_id']);

            // Recreate the original constraint
            $table->foreign('resolve_code_id')
                ->references('id')
                ->on('resolve_codes')
                ->onDelete('restrict');
        });
    }
};
