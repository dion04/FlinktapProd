<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        // Handle search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Handle role filter
        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        $users = $query->latest()->paginate(20)->appends($request->query());

        return Inertia::render('admin/user-management', [
            'users' => $users,
            'filters' => [
                'search' => $request->search ?? '',
                'role' => $request->role ?? '',
            ],
        ]);
    }

    public function updateRole(Request $request, User $user)
    {
        // Only super admins can manage roles
        if (!auth()->user()->isSuperAdmin()) {
            abort(403, 'Only super admins can manage user roles.');
        }

        $request->validate([
            'role' => 'required|in:user,admin,superadmin',
        ]);

        // Prevent removing the last super admin
        if ($user->isSuperAdmin() && $request->role !== 'superadmin') {
            $superAdminCount = User::where('role', 'superadmin')->count();
            if ($superAdminCount <= 1) {
                return back()->withErrors(['role' => 'Cannot remove the last super admin.']);
            }
        }

        // Prevent users from changing their own role
        if ($user->id === auth()->id()) {
            return back()->withErrors(['role' => 'You cannot change your own role.']);
        }

        $user->update(['role' => $request->role]);

        return back()->with('success', "User role updated to {$request->role}.");
    }

    public function destroy(User $user)
    {
        // Only super admins can delete users
        if (!auth()->user()->isSuperAdmin()) {
            abort(403, 'Only super admins can delete users.');
        }

        // Prevent deleting self
        if ($user->id === auth()->id()) {
            return back()->withErrors(['delete' => 'You cannot delete your own account.']);
        }

        // Prevent deleting the last super admin
        if ($user->isSuperAdmin()) {
            $superAdminCount = User::where('role', 'superadmin')->count();
            if ($superAdminCount <= 1) {
                return back()->withErrors(['delete' => 'Cannot delete the last super admin.']);
            }
        }

        $user->delete();

        return back()->with('success', 'User deleted successfully.');
    }
}
