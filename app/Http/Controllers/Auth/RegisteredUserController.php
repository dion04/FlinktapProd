<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\ResolveCode;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/register', [
            'code' => $request->input('code'),
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        if ($request->has('code')) {
            $resolveCode = ResolveCode::where('code', $request->code)
                ->where('status', 'unassigned')
                ->first();

            if ($resolveCode) {
                // Don't assign the code yet, just redirect to profile creation
                // The code will be assigned when the profile is actually created

                event(new Registered($user));
                Auth::login($user);

                // Redirect to profile creation with the code
                return redirect()->route('profile.create', ['code' => $request->code]);
            }
        }

        event(new Registered($user));

        Auth::login($user);

        return to_route('dashboard');
    }
}
