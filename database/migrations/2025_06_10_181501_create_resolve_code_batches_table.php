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
        Schema::create('resolve_code_batches', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable(); // Optional name for the batch
            $table->string('prefix')->nullable(); // The prefix used for this batch
            $table->integer('count'); // Number of codes in this batch
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resolve_code_batches');
    }
};
