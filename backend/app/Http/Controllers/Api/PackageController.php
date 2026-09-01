<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PackageDetailResource;
use App\Http\Resources\PackageSummaryResource;
use App\Http\Responses\ApiResponse;
use App\Models\Package;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PackageController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category' => ['nullable', 'string', 'max:100'],
            'search' => ['nullable', 'string', 'max:100'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $perPage = $validated['per_page'] ?? 15;

        $query = Package::query()
            ->active()
            ->with('detail:id,package_id,inclusions')
            ->orderBy('title');

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
            PackageSummaryResource::collection($paginator->getCollection())->resolve(),
            [
                'current_page' => $paginator->currentPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'last_page' => $paginator->lastPage(),
            ]
        );
    }

    public function show(Package $package): JsonResponse
    {
        $package->load([
            'detail',
            'itineraryDays',
            'faqs',
            'images',
        ]);

        return ApiResponse::success(
            (new PackageDetailResource($package))->resolve()
        );
    }
}
