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
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('resolve_code_id')->constrained('resolve_codes')->onDelete('cascade');
            $table->string('display_name');
            $table->text('bio')->nullable();
            $table->string('avatar_url')->nullable();
            $table->string('website_url')->nullable();
            $table->string('twitter_username')->nullable();
            $table->string('instagram_username')->nullable();
            $table->string('linkedin_username')->nullable();
            $table->string('github_username')->nullable();
            $table->string('youtube_url')->nullable();
            $table->string('tiktok_username')->nullable();
            $table->string('discord_username')->nullable();
            $table->string('twitch_username')->nullable();
            $table->string('phone_number')->nullable();
            $table->json('custom_links')->nullable(); // For additional custom social links
            $table->boolean('is_public')->default(true);
            $table->timestamps();

            // Ensure one profile per user
            $table->unique('user_id');
            // Ensure one profile per resolve code
            $table->unique('resolve_code_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
