<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class CreateSuperAdminCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:create-superadmin {--email=superadmin@flinktap.com} {--password=superadmin123} {--name=Super Administrator}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a superadmin user for the application';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->option('email');
        $password = $this->option('password');
        $name = $this->option('name');

        // Check if a superadmin already exists
        $existingSuperAdmin = User::where('role', 'superadmin')->first();

        if ($existingSuperAdmin) {
            $this->error('A Super Administrator user already exists.');
            $this->info("Existing Super Admin: {$existingSuperAdmin->name} ({$existingSuperAdmin->email})");
            return 1;
        }

        // Check if email is already taken
        $existingUser = User::where('email', $email)->first();
        if ($existingUser) {
            $this->error("A user with email {$email} already exists.");
            return 1;
        }

        // Create the superadmin user
        $user = User::create([
            'name' => $name,
            'email' => $email,
            'email_verified_at' => now(),
            'password' => Hash::make($password),
            'role' => 'superadmin',
        ]);

        $this->info('Super Administrator user created successfully!');
        $this->info("Name: {$user->name}");
        $this->info("Email: {$user->email}");
        $this->info("Password: {$password}");
        $this->warn('Please change the password after first login in production!');

        return 0;
    }
}
