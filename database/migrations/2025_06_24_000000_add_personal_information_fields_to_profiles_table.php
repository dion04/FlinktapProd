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
            // Add new fields after display_name
            $table->string('first_name')->nullable()->after('display_name');
            $table->string('last_name')->nullable()->after('first_name');
            $table->string('email')->nullable()->after('phone_number');
            $table->string('location')->nullable()->after('email');
            $table->string('company_name')->nullable()->after('bio');
            $table->string('position')->nullable()->after('company_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->dropColumn([
                'first_name',
                'last_name',
                'email',
                'location',
                'company_name',
                'position',
            ]);
        });
    }
};
