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
        Schema::create('resolve_codes', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->enum('status', ['unassigned', 'assigned'])->default('unassigned');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('type')->default('nfc'); // For future extensibility (nfc, qr, etc.)
            $table->timestamp('assigned_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resolve_codes');
    }
};