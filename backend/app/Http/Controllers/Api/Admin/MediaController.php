<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreMediaUploadRequest;
use App\Http\Responses\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    private const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    public function store(StoreMediaUploadRequest $request): JsonResponse
    {
        $file = $request->file('file');
        $extension = strtolower((string) ($file->guessExtension() ?: $file->getClientOriginalExtension() ?: 'jpg'));

        if (! in_array($extension, self::ALLOWED_EXTENSIONS, true)) {
            $extension = 'jpg';
        }

        $directory = app()->environment('testing')
            ? 'uploads/testing'
            : 'uploads/'.now()->format('Y/m');

        $originalName = $file->getClientOriginalName();
        $mimeType = $file->getMimeType();
        $filename = Str::uuid()->toString().'.'.$extension;
        $absoluteDirectory = public_path($directory);

        File::ensureDirectoryExists($absoluteDirectory);
        $file->move($absoluteDirectory, $filename);

        $path = '/'.$directory.'/'.$filename;

        return ApiResponse::success([
            'path' => $path,
            'url' => rtrim((string) config('app.url'), '/').$path,
            'original_name' => $originalName,
            'mime_type' => $mimeType,
        ], null, 201);
    }
}
