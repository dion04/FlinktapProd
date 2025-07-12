<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ResolveCode;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ResolveCodeAdminController extends Controller
{
    public function index(Request $request)
    {
        $query = ResolveCode::with(['user', 'creator']);

        // Handle search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                    ->orWhere('type', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('creator', function ($creatorQuery) use ($search) {
                        $creatorQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }

        $codes = $query->latest()->paginate(20)->appends($request->query());

        return Inertia::render('admin/resolve-codes', [
            'codes' => $codes,
            'filters' => [
                'search' => $request->search ?? '',
            ],
        ]);
    }
    public function store(Request $request)
    {
        $request->validate([
            'codes' => 'required|array|min:1',
            'codes.*' => 'required|string|unique:resolve_codes,code',
            'prefix' => 'nullable|string|max:10',
        ]);

        // Create a batch record
        $batch = \App\Models\ResolveCodeBatch::create([
            'name' => $request->prefix ? "{$request->prefix} Batch - " . now()->format('M d, Y H:i') : 'Batch - ' . now()->format('M d, Y H:i'),
            'prefix' => $request->prefix,
            'count' => count($request->codes),
            'created_by' => auth()->id(),
        ]);

        foreach ($request->codes as $code) {
            ResolveCode::create([
                'code' => $code,
                'status' => 'available',
                'type' => 'nfc',
                'created_by' => auth()->id(),
                'batch_id' => $batch->id,
            ]);
        }

        return redirect()->route('admin.resolve-codes.index')->with('success', "Batch '{$batch->name}' with {$batch->count} codes created successfully!");
    }

    public function destroy($id)
    {
        $ids = explode(',', $id);
        ResolveCode::whereIn('id', $ids)->delete();
        return response()->json(['success' => true]);
    }

    /**
     * Mark one or more resolve codes as copied.
     */
    public function markAsCopied(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:resolve_codes,id',
        ]);

        $codes = ResolveCode::whereIn('id', $request->ids)->get();

        foreach ($codes as $code) {
            $code->markAsCopied();
        }

        return response()->json([
            'success' => true,
            'message' => count($codes) . ' codes marked as copied',
            'codes' => $codes,
        ]);
    }
}