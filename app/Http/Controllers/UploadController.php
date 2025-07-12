<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    /**
     * Upload an image file and return the URL
     */
    public function uploadImage(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB max
            'type' => 'required|in:avatar,banner',
        ]);

        try {
            $file = $request->file('file');
            $type = $request->input('type');

            // Generate a unique filename
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();

            // Store the file in the public disk under uploads/{type} directory
            $path = $file->storeAs("uploads/{$type}", $filename, 'public');

            // Get the public URL
            $url = Storage::disk('public')->url($path);

            return response()->json([
                'success' => true,
                'url' => $url,
                'path' => $path,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload image: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete an uploaded image
     */
    public function deleteImage(Request $request): JsonResponse
    {
        $request->validate([
            'path' => 'required|string',
        ]);

        try {
            $path = $request->input('path');

            // Ensure the path is within the uploads directory
            if (!str_starts_with($path, 'uploads/')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid file path',
                ], 400);
            }

            // Delete the file
            if (Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
            }

            return response()->json([
                'success' => true,
                'message' => 'Image deleted successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete image: ' . $e->getMessage(),
            ], 500);
        }
    }
}
