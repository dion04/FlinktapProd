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
        Schema::create('profile_visits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profile_id')->constrained('profiles')->onDelete('cascade');
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->string('referer')->nullable();
            $table->string('country')->nullable();
            $table->string('city')->nullable();
            $table->json('device_info')->nullable(); // Device type, browser, OS
            $table->timestamp('visited_at');
            $table->timestamps();

            $table->index(['profile_id', 'visited_at']);
            $table->index(['ip_address', 'profile_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profile_visits');
    }
};
