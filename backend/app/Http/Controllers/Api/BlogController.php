<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BlogDetailResource;
use App\Http\Resources\BlogSummaryResource;
use App\Http\Responses\ApiResponse;
use App\Models\Blog;
use Illuminate\Http\JsonResponse;

class BlogController extends Controller
{
    public function index(): JsonResponse
    {
        $blogs = Blog::query()
            ->active()
            ->orderByDesc('published_at')
            ->get();

        return ApiResponse::success(
            BlogSummaryResource::collection($blogs)->resolve()
        );
    }

    public function show(Blog $blog): JsonResponse
    {
        return ApiResponse::success(
            (new BlogDetailResource($blog))->resolve()
        );
    }
}
