<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Profile;
use App\Models\ProfileVisit;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardTestDataSeeder extends Seeder
{
    public function run()
    {
        // Get the first user or create one
        $user = User::first();
        if (!$user) {
            $user = User::create([
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
                'role' => 'user'
            ]);
        }

        // Create test profiles for the user
        $profiles = [
            [
                'display_name' => 'John Doe - Developer',
                'bio' => 'Full-stack developer passionate about creating amazing web experiences.',
                'website_url' => 'https://johndoe.dev',
                'twitter_username' => 'johndoe',
                'github_username' => 'johndoedev',
                'phone_number' => '+1234567890',
                'is_public' => true,
            ],
            [
                'display_name' => 'Jane Smith - Designer',
                'bio' => 'UI/UX designer with 5+ years of experience in creating beautiful interfaces.',
                'website_url' => 'https://janesmith.design',
                'instagram_username' => 'janesmith_design',
                'linkedin_username' => 'jane-smith-designer',
                'is_public' => true,
            ],
            [
                'display_name' => 'Mike Johnson - Photographer',
                'bio' => 'Professional photographer specializing in portrait and landscape photography.',
                'website_url' => 'https://mikejohnsonphoto.com',
                'instagram_username' => 'mikejohnsonphoto',
                'youtube_url' => 'https://youtube.com/@mikejohnsonphoto',
                'is_public' => false,
            ]
        ];

        foreach ($profiles as $profileData) {
            // Create a resolve code for this profile
            $resolveCode = \App\Models\ResolveCode::create([
                'code' => 'TEST' . strtoupper(substr(md5(uniqid()), 0, 6)),
                'status' => 'assigned',
                'user_id' => $user->id,
                'type' => 'nfc',
                'assigned_at' => now(),
                'created_by' => $user->id,
            ]);

            $profile = Profile::create([
                'user_id' => $user->id,
                'resolve_code_id' => $resolveCode->id,
                ...$profileData
            ]);

            // Generate test visits for each profile
            $this->generateTestVisits($profile);
        }
    }

    private function generateTestVisits(Profile $profile)
    {
        $devices = ['mobile', 'desktop', 'tablet'];
        $browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];
        $platforms = ['Windows', 'iOS', 'Android', 'macOS', 'Linux'];
        $countries = ['United States', 'Canada', 'UK', 'Germany', 'France', 'Australia', 'Japan'];
        $cities = [
            'United States' => ['New York', 'Los Angeles', 'Chicago', 'Houston'],
            'Canada' => ['Toronto', 'Vancouver', 'Montreal', 'Calgary'],
            'UK' => ['London', 'Manchester', 'Birmingham', 'Liverpool'],
            'Germany' => ['Berlin', 'Munich', 'Hamburg', 'Frankfurt'],
            'France' => ['Paris', 'Lyon', 'Marseille', 'Toulouse'],
            'Australia' => ['Sydney', 'Melbourne', 'Brisbane', 'Perth'],
            'Japan' => ['Tokyo', 'Osaka', 'Kyoto', 'Hiroshima']
        ];
        $referrers = [
            'https://google.com',
            'https://twitter.com',
            'https://facebook.com',
            'https://linkedin.com',
            'https://instagram.com',
            'https://reddit.com',
            null // Direct visits
        ];

        // Generate visits for the past 30 days
        $visitCount = rand(50, 200);
        $ips = [];

        for ($i = 0; $i < $visitCount; $i++) {
            $visitDate = Carbon::now()->subDays(rand(0, 30))->subHours(rand(0, 23))->subMinutes(rand(0, 59));
            $country = $countries[array_rand($countries)];
            $city = $cities[$country][array_rand($cities[$country])];
            $referrerUrl = $referrers[array_rand($referrers)];

            // Generate some recurring IPs to simulate unique visitors
            if (rand(1, 3) === 1 || empty($ips)) {
                $ip = rand(1, 255) . '.' . rand(1, 255) . '.' . rand(1, 255) . '.' . rand(1, 255);
                if (count($ips) < 30) {
                    $ips[] = $ip;
                }
            } else {
                $ip = $ips[array_rand($ips)];
            }
            ProfileVisit::create([
                'profile_id' => $profile->id,
                'ip_address' => $ip,
                'user_agent' => $this->generateUserAgent($browsers[array_rand($browsers)], $platforms[array_rand($platforms)]),
                'referer' => $referrerUrl,
                'country' => $country,
                'city' => $city,
                'device_info' => [
                    'device_type' => $devices[array_rand($devices)],
                    'device_name' => $this->getDeviceName($devices[array_rand($devices)]),
                    'platform' => $platforms[array_rand($platforms)],
                    'browser' => $browsers[array_rand($browsers)],
                ],
                'visited_at' => $visitDate,
                'created_at' => $visitDate,
                'updated_at' => $visitDate,
            ]);
        }
    }

    private function generateUserAgent($browser, $platform)
    {
        $userAgents = [
            'Chrome' => "Mozilla/5.0 ({$platform}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            'Firefox' => "Mozilla/5.0 ({$platform}; rv:120.0) Gecko/20100101 Firefox/120.0",
            'Safari' => "Mozilla/5.0 ({$platform}) AppleWebKit/537.36 (KHTML, like Gecko) Version/17.0 Safari/537.36",
            'Edge' => "Mozilla/5.0 ({$platform}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0"
        ];

        return $userAgents[$browser] ?? $userAgents['Chrome'];
    }

    private function getDeviceName($deviceType)
    {
        $deviceNames = [
            'mobile' => ['iPhone', 'Samsung Galaxy', 'Google Pixel', 'OnePlus'],
            'desktop' => ['Windows PC', 'MacBook Pro', 'iMac', 'Custom PC'],
            'tablet' => ['iPad', 'Samsung Tab', 'Surface Pro', 'Fire Tablet']
        ];

        $names = $deviceNames[$deviceType] ?? $deviceNames['desktop'];
        return $names[array_rand($names)];
    }
}
