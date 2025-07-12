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
            // First drop the foreign key constraint
            $table->dropForeign(['user_id']);
            // Then drop the unique constraint
            $table->dropUnique(['user_id']);
            // Recreate the foreign key constraint without unique
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            // Drop the foreign key first
            $table->dropForeign(['user_id']);
            // Add the unique constraint back
            $table->unique('user_id');
            // Recreate the foreign key with unique constraint
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }
};
