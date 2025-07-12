<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Profile;
use App\Models\ProfileVisit;
use Illuminate\Support\Facades\Log;
use Jenssegers\Agent\Agent;

class TrackProfileVisit
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Only track GET requests to profile routes
        if ($request->method() === 'GET' && $request->route() && $request->route()->getName() === 'profile.show') {
            try {
                $profileParam = $request->route('profile');

                // Handle both cases: profile ID or resolved Profile model
                if ($profileParam instanceof Profile) {
                    $profile = $profileParam;
                } else {
                    $profile = Profile::find($profileParam);
                }

                if ($profile) {
                    $this->recordVisit($request, $profile);
                }
            } catch (\Exception $e) {
                Log::error('Error tracking profile visit: ' . $e->getMessage());
            }
        }

        return $response;
    }

    private function recordVisit(Request $request, Profile $profile)
    {
        $agent = new Agent();
        $userAgent = $request->userAgent();

        // Get device information
        $device = $agent->device();
        $platform = $agent->platform();
        $browser = $agent->browser();

        // Determine device type
        $deviceType = 'desktop';
        if ($agent->isMobile()) {
            $deviceType = 'mobile';
        } elseif ($agent->isTablet()) {
            $deviceType = 'tablet';
        }

        // Get location from IP (basic implementation)
        $ip = $this->getClientIp($request);
        $location = $this->getLocationFromIp($ip);
        ProfileVisit::create([
            'profile_id' => $profile->id,
            'ip_address' => $ip,
            'user_agent' => $userAgent,
            'referer' => $request->header('referer'),
            'country' => $location['country'] ?? null,
            'city' => $location['city'] ?? null,
            'device_info' => [
                'device_type' => $deviceType,
                'device_name' => $device ?: 'Unknown',
                'platform' => $platform ?: 'Unknown',
                'browser' => $browser ?: 'Unknown',
            ],
            'visited_at' => now(),
        ]);
    }

    private function getClientIp(Request $request): string
    {
        $ipKeys = ['HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP', 'HTTP_CLIENT_IP', 'REMOTE_ADDR'];

        foreach ($ipKeys as $key) {
            if (!empty($_SERVER[$key])) {
                $ips = explode(',', $_SERVER[$key]);
                $ip = trim($ips[0]);
                if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                    return $ip;
                }
            }
        }

        return $request->ip() ?? '127.0.0.1';
    }

    private function getLocationFromIp(string $ip): array
    {
        // For development, return mock data
        if ($ip === '127.0.0.1' || filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false) {
            return [
                'country' => 'Local',
                'city' => 'Development'
            ];
        }

        // In production, you would integrate with a service like:
        // - ipapi.co
        // - ipstack.com
        // - freegeoip.app
        // For now, return null to avoid external API calls
        return [];
    }

    private function extractDomain(?string $url): ?string
    {
        if (!$url) {
            return null;
        }

        $parsed = parse_url($url);
        return $parsed['host'] ?? null;
    }
}
