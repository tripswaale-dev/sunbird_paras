<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreBlogRequest;
use App\Http\Requests\Admin\UpdateBlogRequest;
use App\Http\Resources\AdminBlogResource;
use App\Http\Responses\ApiResponse;
use App\Models\Blog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'is_active' => ['nullable', 'boolean'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $perPage = $validated['per_page'] ?? 15;

        $query = Blog::query()
            ->orderByDesc('published_at')
            ->orderBy('id');

        if (array_key_exists('is_active', $validated)) {
            $query->where('is_active', $validated['is_active']);
        }

        if (! empty($validated['search'])) {
            $search = $validated['search'];
            $query->where(function ($builder) use ($search) {
                $builder->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%")
                    ->orWhere('author', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        $paginator = $query->paginate($perPage)->withQueryString();

        return ApiResponse::success(
            AdminBlogResource::collection($paginator->getCollection())->resolve(),
            [
                'current_page' => $paginator->currentPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'last_page' => $paginator->lastPage(),
            ]
        );
    }

    public function show(int $id): JsonResponse
    {
        $blog = Blog::findOrFail($id);

        return ApiResponse::success(
            (new AdminBlogResource($blog))->resolve()
        );
    }

    public function store(StoreBlogRequest $request): JsonResponse
    {
        $blog = Blog::create($request->validated());

        return ApiResponse::success(
            (new AdminBlogResource($blog))->resolve(),
            null,
            201
        );
    }

    public function update(UpdateBlogRequest $request, int $id): JsonResponse
    {
        $blog = Blog::findOrFail($id);
        $blog->update($request->validated());

        return ApiResponse::success(
            (new AdminBlogResource($blog->fresh()))->resolve()
        );
    }

    public function destroy(int $id): JsonResponse
    {
        $blog = Blog::findOrFail($id);
        $blog->delete();

        return ApiResponse::success(['message' => 'Blog deleted successfully.']);
    }
}
