<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePackageRequest;
use App\Http\Requests\Admin\UpdatePackageRequest;
use App\Http\Resources\AdminPackageResource;
use App\Http\Responses\ApiResponse;
use App\Models\Package;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PackageController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'category' => ['nullable', 'string', 'max:100'],
            'is_active' => ['nullable', 'boolean'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $perPage = $validated['per_page'] ?? 15;

        $query = Package::query()->orderBy('title');

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
                    ->orWhere('location', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        $paginator = $query->paginate($perPage)->withQueryString();

        return ApiResponse::success(
            AdminPackageResource::collection($paginator->getCollection())->resolve(),
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
        $package = Package::findOrFail($id);

        return ApiResponse::success(
            (new AdminPackageResource($package))->resolve()
        );
    }

    public function store(StorePackageRequest $request): JsonResponse
    {
        $package = Package::create($request->validated());

        return ApiResponse::success(
            (new AdminPackageResource($package))->resolve(),
            null,
            201
        );
    }

    public function update(UpdatePackageRequest $request, int $id): JsonResponse
    {
        $package = Package::findOrFail($id);
        $package->update($request->validated());

        return ApiResponse::success(
            (new AdminPackageResource($package->fresh()))->resolve()
        );
    }

    public function destroy(int $id): JsonResponse
    {
        $package = Package::findOrFail($id);

        // Related rows (section assignments, detail, itinerary, FAQs, images)
        // cascade via foreign keys — hard delete is intentional for admin.
        $package->delete();

        return ApiResponse::success(['message' => 'Package deleted successfully.']);
    }
}
