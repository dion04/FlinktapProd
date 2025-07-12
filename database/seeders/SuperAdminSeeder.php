<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if a superadmin already exists
        $existingSuperAdmin = User::where('role', 'superadmin')->first();

        if (!$existingSuperAdmin) {
            User::create([
                'name' => 'Super Administrator',
                'email' => 'superadmin@flinktap.com',
                'email_verified_at' => now(),
                'password' => Hash::make('superadmin123'), // Change this in production!
                'role' => 'superadmin',
            ]);

            $this->command->info('Super Administrator user created successfully!');
            $this->command->info('Email: superadmin@flinktap.com');
            $this->command->info('Password: superadmin123 (Please change this in production!)');
        } else {
            $this->command->info('Super Administrator user already exists.');
        }
    }
}
