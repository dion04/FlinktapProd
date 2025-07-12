<?php


namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Http\Request;

class SocialiteController extends Controller
{
    /**
     * Redirect the user to the provider's authentication page.
     *
     * @param string $provider
     * @return \Illuminate\Http\RedirectResponse
     */
    public function redirectToProvider($provider)
    {
        return Socialite::driver($provider)->redirect();
    }

    /**
     * Handle the callback from OAuth provider.
     *
     * @param string $provider
     * @return \Illuminate\Http\RedirectResponse
     */
    public function handleProviderCallback($provider)
    {
        try {
            $socialUser = Socialite::driver($provider)->user();
        } catch (\Exception $e) {
            return redirect()->route('login')
                ->withErrors(['error' => 'Unable to authenticate with ' . ucfirst($provider)]);
        }

        // Check if user already exists with this email but not linked to this provider
        $existingUser = User::where('email', $socialUser->email)
            ->whereNull($provider . '_id')
            ->first();

        if ($existingUser) {
            // Link the social account to the existing user
            $existingUser->update([
                $provider . '_id' => $socialUser->id,
                $provider . '_token' => $socialUser->token,
                $provider . '_refresh_token' => $socialUser->refreshToken ?? '',
            ]);

            Auth::login($existingUser);
            return redirect('/dashboard');
        }

        // Find or create user
        $user = User::updateOrCreate(
            [$provider . '_id' => $socialUser->id],
            [
                'name' => $socialUser->name ?? $socialUser->nickname ?? $socialUser->login ?? ucfirst($provider) . ' User',
                'email' => $socialUser->email,
                $provider . '_token' => $socialUser->token,
                $provider . '_refresh_token' => $socialUser->refreshToken ?? '',
                'password' => null, // OAuth users don't need a password
            ]
        );

        Auth::login($user);

        return redirect('/dashboard');
    }
}