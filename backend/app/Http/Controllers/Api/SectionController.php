<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PackageSummaryResource;
use App\Http\Resources\SectionCategoryResource;
use App\Http\Resources\SectionDetailResource;
use App\Http\Resources\SectionResource;
use App\Http\Responses\ApiResponse;
use App\Models\Section;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SectionController extends Controller
{
    public function index(): JsonResponse
    {
        $sections = Section::query()
            ->active()
            ->orderBy('sort_order')
            ->get();

        return ApiResponse::success(
            SectionResource::collection($sections)->resolve()
        );
    }

    public function show(Section $section): JsonResponse
    {
        $payload = Cache::remember(
            "api.section.detail.{$section->slug}",
            now()->addSeconds(45),
            function () use ($section) {
                $section->load([
                    'categories' => fn ($query) => $query->active()->orderBy('sort_order'),
                    'stats',
                    'activePackages' => fn ($query) => $query->with('detail:id,package_id,inclusions'),
                ]);

                return (new SectionDetailResource($section))->resolve();
            }
        );

        return ApiResponse::success($payload);
    }

    public function packages(Request $request, Section $section): JsonResponse
    {
        $validated = $request->validate([
            'category' => ['nullable', 'string', 'max:100'],
        ]);

        $categoryKey = $validated['category'] ?? '_all';
        $cacheKey = "api.section.packages.{$section->slug}.{$categoryKey}";

        $payload = Cache::remember($cacheKey, now()->addSeconds(45), function () use ($section, $validated) {
            $section->load([
                'categories' => fn ($query) => $query->active()->orderBy('sort_order'),
            ]);

            $packagesQuery = $section->activePackages()
                ->with('detail:id,package_id,inclusions');

            if (! empty($validated['category'])) {
                $packagesQuery->whereRaw(
                    'COALESCE(section_packages.listing_category, packages.category) = ?',
                    [$validated['category']]
                );
            }

            $packages = $packagesQuery->get();

            return [
                'section' => (new SectionResource($section))->resolve(),
                'categories' => SectionCategoryResource::collection($section->categories)->resolve(),
                'packages' => PackageSummaryResource::collection($packages)->resolve(),
            ];
        });

        return ApiResponse::success($payload);
    }
}
