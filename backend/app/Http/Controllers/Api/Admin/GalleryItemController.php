<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreGalleryItemRequest;
use App\Http\Requests\Admin\UpdateGalleryItemRequest;
use App\Http\Resources\AdminGalleryItemResource;
use App\Http\Responses\ApiResponse;
use App\Models\GalleryItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class GalleryItemController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'category' => ['nullable', 'string', Rule::in(GalleryItem::CATEGORY_CODES)],
            'is_active' => ['nullable', 'boolean'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $perPage = $validated['per_page'] ?? 15;

        $query = GalleryItem::query()
            ->orderBy('sort_order')
            ->orderBy('id');

        if (array_key_exists('is_active', $validated)) {
            $query->where('is_active', $validated['is_active']);
        }

        if (! empty($validated['category'])) {
            $query->where('category', $validated['category']);
        }

        if (! empty($validated['search'])) {
            $search = $validated['search'];
            $query->where(function ($builder) use ($search) {
                $builder->where('title', 'like', "%{$search}%")
                    ->orWhere('subtitle', 'like', "%{$search}%")
                    ->orWhere('external_id', 'like', "%{$search}%");
            });
        }

        $paginator = $query->paginate($perPage)->withQueryString();

        return ApiResponse::success(
            AdminGalleryItemResource::collection($paginator->getCollection())->resolve(),
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
        $item = GalleryItem::findOrFail($id);

        return ApiResponse::success(
            (new AdminGalleryItemResource($item))->resolve()
        );
    }

    public function store(StoreGalleryItemRequest $request): JsonResponse
    {
        $item = GalleryItem::create($request->validated());

        return ApiResponse::success(
            (new AdminGalleryItemResource($item))->resolve(),
            null,
            201
        );
    }

    public function update(UpdateGalleryItemRequest $request, int $id): JsonResponse
    {
        $item = GalleryItem::findOrFail($id);
        $item->update($request->validated());

        return ApiResponse::success(
            (new AdminGalleryItemResource($item->fresh()))->resolve()
        );
    }

    public function destroy(int $id): JsonResponse
    {
        $item = GalleryItem::findOrFail($id);
        $item->delete();

        return ApiResponse::success(['message' => 'Gallery item deleted successfully.']);
    }
}
