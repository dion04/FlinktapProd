<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class CreateTestUsersCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:create-test-users';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create test users with different roles for RBAC testing';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $testUsers = [
            [
                'name' => 'Regular User',
                'email' => 'user@flinktap.com',
                'password' => 'password123',
                'role' => 'user'
            ],
            [
                'name' => 'Admin User',
                'email' => 'admin@flinktap.com',
                'password' => 'password123',
                'role' => 'admin'
            ]
        ];

        foreach ($testUsers as $userData) {
            $existing = User::where('email', $userData['email'])->first();

            if ($existing) {
                $this->warn("User with email {$userData['email']} already exists. Skipping...");
                continue;
            }

            $user = User::create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'email_verified_at' => now(),
                'password' => Hash::make($userData['password']),
                'role' => $userData['role'],
            ]);

            $this->info("Created {$userData['role']} user: {$user->name} ({$user->email})");
        }

        $this->info("\nTest user credentials:");
        $this->info("Regular User: user@flinktap.com / password123");
        $this->info("Admin User: admin@flinktap.com / password123");
        $this->info("Super Admin: superadmin@flinktap.com / superadmin123");

        return 0;
    }
}
