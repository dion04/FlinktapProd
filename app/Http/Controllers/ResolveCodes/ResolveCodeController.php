<?php


namespace App\Http\Controllers\ResolveCodes;

use App\Http\Controllers\Controller;
use App\Models\ResolveCode;


use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ResolveCodeController extends Controller
{    /**
     * Handle the incoming request.
     */
    public function __invoke(string $code)
    {
        $resolveCode = ResolveCode::where('code', $code)->first();

        if (!$resolveCode) {
            return Inertia::render('NotFound', [
                'message' => 'The code you entered was not found.',
            ]);
        }

        // If the resolve code is already assigned
        if ($resolveCode->isAssigned()) {
            // If the resolve code has a profile, show the profile
            if ($resolveCode->profile) {
                return redirect()->route('profile.show', $resolveCode->profile->slug);
            }

            // If assigned but no profile exists (orphaned code), reset it to available
            // This handles cases where the profile was deleted but the code wasn't reset
            $resolveCode->checkAndFixOrphanedState();

            // Now treat it as an available code
            // If user is authenticated, redirect to profile creation
            if (Auth::check()) {
                return redirect()->route('profile.create', ['code' => $code]);
            }

            // If not authenticated, redirect to register
            return redirect()->route('register', ['code' => $code]);
        }

        // Code is available - check if user is authenticated
        if (Auth::check()) {
            // Don't assign the code yet, just redirect to profile creation
            // The code will be assigned when the profile is actually created
            return redirect()->route('profile.create', ['code' => $code]);
        }

        // User is not authenticated - redirect to login with the code
        // They can choose to login or register from there
        return redirect()->route('register', ['code' => $code]);
    }
}