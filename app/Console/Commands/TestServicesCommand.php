<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Profile;
use App\Models\User;
use App\Models\ResolveCode;

class TestServicesCommand extends Command
{
    protected $signature = 'test:services';
    protected $description = 'Test the services functionality';

    public function handle()
    {
        // Check if a user exists, if not create one
        $user = User::first() ?? User::factory()->create();

        // Check if a resolve code exists, if not create one
        $resolveCode = ResolveCode::where('status', 'assigned')->where('user_id', $user->id)->first();
        if (!$resolveCode) {
            $resolveCode = ResolveCode::create([
                'code' => 'TEST' . rand(1000, 9999),
                'type' => 'profile',
                'status' => 'assigned',
                'user_id' => $user->id,
            ]);
        }

        // Check if a profile exists, if not create one
        $profile = Profile::where('user_id', $user->id)->first();
        if (!$profile) {
            $profile = Profile::create([
                'user_id' => $user->id,
                'resolve_code_id' => $resolveCode->id,
                'display_name' => 'Test Profile',
                'bio' => 'This is a test profile',
                'is_public' => true,
            ]);
        }

        // Add test services to the profile
        $services = [
            [
                'id' => 'web-dev',
                'name' => 'Web Development',
                'isCustom' => false,
            ],
            [
                'id' => 'custom-123',
                'name' => 'Custom Service',
                'isCustom' => true,
            ],
        ];

        $profile->services = $services;
        $profile->save();

        // Verify that the services were saved
        $freshProfile = Profile::find($profile->id);
        $this->info('Services saved:');
        $this->line(json_encode($freshProfile->services, JSON_PRETTY_PRINT));

        $this->info("Test completed successfully.");
    }
}
