<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ResolveCodeBatch;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BatchController extends Controller
{
    public function index(Request $request)
    {
        $query = ResolveCodeBatch::with(['creator', 'resolveCodes']);

        // Handle search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('prefix', 'like', "%{$search}%")
                    ->orWhereHas('creator', function ($creatorQuery) use ($search) {
                        $creatorQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }

        $batches = $query->latest()->paginate(20)->appends($request->query());

        return Inertia::render('admin/batches', [
            'batches' => $batches,
            'filters' => [
                'search' => $request->search ?? '',
            ],
        ]);
    }

    public function show(ResolveCodeBatch $batch)
    {
        $batch->load(['creator', 'resolveCodes.user']);

        return Inertia::render('admin/batch-detail', [
            'batch' => $batch,
        ]);
    }

    public function destroy(ResolveCodeBatch $batch)
    {
        $batch->delete();
        return redirect()->route('admin.batches.index')->with('success', 'Batch deleted successfully!');
    }
}
