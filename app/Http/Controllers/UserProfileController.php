<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Models\ResolveCode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserProfileController extends Controller
{    /**
     * Show the profile creation form.
     */
    public function create(Request $request)
    {
        // Require a code parameter
        if (!$request->has('code') || empty($request->query('code'))) {
            return Inertia::render('errors/NoCodeProvided', [
                'message' => 'A resolve code is required to create a profile.',
                'redirectUrl' => route('dashboard'),
                'redirectText' => 'Go to Dashboard'
            ]);
        }

        $resolveCode = ResolveCode::where('code', $request->query('code'))
            ->where(function ($query) {
                $query->whereIn('status', ['unassigned', 'available'])
                    ->orWhere(function ($subQuery) {
                        $subQuery->where('status', 'assigned')
                            ->where('user_id', Auth::id());
                    });
            })
            ->first();

        if (!$resolveCode) {
            return redirect()->route('dashboard')->with('error', 'Invalid or expired resolve code.');
        }

        if ($resolveCode->profile) {
            return redirect()->route('profile.show', $resolveCode->profile->slug)
                ->with('info', 'Profile already exists for this resolve code.');
        }

        return Inertia::render('auth/profile-creation', [
            'code' => $request->query('code'),
            'resolveCode' => $resolveCode,
        ]);
    }

    /**
     * Store the created profile.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'resolve_code' => 'required|string|exists:resolve_codes,code',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'bio' => 'nullable|string|max:500',
            'company_name' => 'nullable|string|max:255',
            'position' => 'nullable|string|max:255',
            'avatar_url' => 'nullable|url|max:255',
            'banner_url' => 'nullable|url|max:255',
            'website_url' => 'nullable|url|max:255',
            'twitter_username' => 'nullable|string|max:50',
            'instagram_username' => 'nullable|string|max:50',
            'linkedin_username' => 'nullable|string|max:50',
            'github_username' => 'nullable|string|max:50',
            'facebook_username' => 'nullable|string|max:50',
            'youtube_url' => 'nullable|url|max:255',
            'tiktok_username' => 'nullable|string|max:50',
            'discord_username' => 'nullable|string|max:50',
            'twitch_username' => 'nullable|string|max:50',
            'phone_number' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'location' => 'nullable|string|max:255',
            'custom_links' => 'nullable|array',
            'custom_links.*.name' => 'required_with:custom_links|string|max:50',
            'custom_links.*.url' => 'required_with:custom_links|url|max:255',
            'services' => 'nullable|array',
            'services.*.id' => 'required_with:services|string|max:50',
            'services.*.name' => 'required_with:services|string|max:100',
            'is_public' => 'boolean',
            'theme' => 'nullable|string|in:light,dark,dark-minimal,light-minimal',
        ]);
        $resolveCode = ResolveCode::where('code', $validated['resolve_code'])
            ->where(function ($query) {
                $query->whereIn('status', ['unassigned', 'available'])
                    ->orWhere(function ($subQuery) {
                        $subQuery->where('status', 'assigned')
                            ->where('user_id', Auth::id());
                    });
            })
            ->first();

        if (!$resolveCode) {
            return back()->withErrors(['resolve_code' => 'Invalid or expired resolve code.']);
        }
        if ($resolveCode->profile) {
            return redirect()->route('profile.show', $resolveCode->profile->slug)
                ->with('info', 'Profile already exists for this resolve code.');
        }


        if (in_array($resolveCode->status, ['unassigned', 'available'])) {
            $resolveCode->assignToUser(Auth::user());
        }
        $profile = Profile::create([
            'user_id' => Auth::id(),
            'resolve_code_id' => $resolveCode->id,
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'bio' => $validated['bio'],
            'company_name' => $validated['company_name'] ?? null,
            'position' => $validated['position'] ?? null,
            'avatar_url' => $validated['avatar_url'],
            'banner_url' => $validated['banner_url'],
            'website_url' => $validated['website_url'],
            'twitter_username' => $validated['twitter_username'],
            'instagram_username' => $validated['instagram_username'],
            'linkedin_username' => $validated['linkedin_username'],
            'github_username' => $validated['github_username'],
            'facebook_username' => $validated['facebook_username'],
            'youtube_url' => $validated['youtube_url'],
            'tiktok_username' => $validated['tiktok_username'],
            'discord_username' => $validated['discord_username'],
            'twitch_username' => $validated['twitch_username'],
            'phone_number' => $validated['phone_number'],
            'email' => $validated['email'],
            'location' => $validated['location'] ?? null,
            'custom_links' => $validated['custom_links'] ?? [],
            'services' => $validated['services'] ?? [],
            'is_public' => $validated['is_public'] ?? true,
            'theme' => $validated['theme'] ?? 'light',
        ]);
        return redirect()->route('profile.show', $profile->slug)
            ->with('success', 'Profile created successfully!');
    }

    /**
     * Display the specified profile.
     */
    public function show(Profile $profile)
    {

        if (!$profile->is_public && $profile->user_id !== Auth::id()) {
            abort(404);
        }

        $profile->load(['user', 'resolveCode']);

        return Inertia::render('Profile/Show', [
            'profile' => $profile,
        ]);
    }    /**
         * Show the form for editing the specified profile.
         */
    public function edit(Profile $profile)
    {
        // Allow admins and superadmins to edit any profile
        $user = Auth::user();
        if ($profile->user_id !== Auth::id() && !$user->isAdmin()) {
            abort(403);
        }

        return Inertia::render('Profile/Edit', [
            'profile' => $profile,
            'isAdminEdit' => $profile->user_id !== Auth::id() && $user->isAdmin(),
        ]);
    }    /**
         * Update the specified profile.
         */
    public function update(Request $request, Profile $profile)
    {
        // Allow admins and superadmins to update any profile
        $user = Auth::user();
        if ($profile->user_id !== Auth::id() && !$user->isAdmin()) {
            abort(403);
        }
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'bio' => 'nullable|string|max:500',
            'company_name' => 'nullable|string|max:255',
            'position' => 'nullable|string|max:255',
            'avatar_url' => 'nullable|url|max:255',
            'banner_url' => 'nullable|url|max:255',
            'website_url' => 'nullable|url|max:255',
            'twitter_username' => 'nullable|string|max:50',
            'instagram_username' => 'nullable|string|max:50',
            'linkedin_username' => 'nullable|string|max:50',
            'github_username' => 'nullable|string|max:50',
            'facebook_username' => 'nullable|string|max:50',
            'youtube_url' => 'nullable|url|max:255',
            'tiktok_username' => 'nullable|string|max:50',
            'discord_username' => 'nullable|string|max:50',
            'twitch_username' => 'nullable|string|max:50',
            'phone_number' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'location' => 'nullable|string|max:255',
            'custom_links' => 'nullable|array',
            'custom_links.*.name' => 'required_with:custom_links|string|max:50',
            'custom_links.*.url' => 'required_with:custom_links|url|max:255',
            'services' => 'nullable|array',
            'services.*.id' => 'required_with:services|string|max:50',
            'services.*.name' => 'required_with:services|string|max:100',
            'is_public' => 'boolean',
            'theme' => 'nullable|string|in:light,dark,dark-minimal,light-minimal',
        ]);
        $profile->update($validated);

        return redirect()->route('profile.show', $profile->slug)
            ->with('success', 'Profile updated successfully!');
    }    /**
         * Remove the specified profile from storage.
         */
    public function destroy(Profile $profile)
    {
        // Allow admins and superadmins to delete any profile
        $user = Auth::user();
        if ($profile->user_id !== Auth::id() && !$user->isAdmin()) {
            abort(403);
        }

        $profile->delete();

        return redirect()->route('dashboard')
            ->with('success', 'Profile deleted successfully!');
    }

    /**
     * Show the contact support page.
     */
    public function contactSupport()
    {
        return Inertia::render('ContactSupport');
    }
}
