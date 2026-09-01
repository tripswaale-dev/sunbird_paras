<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DestinationCategorySummaryResource;
use App\Http\Resources\PackageSummaryResource;
use App\Http\Responses\ApiResponse;
use App\Models\DestinationCategory;
use App\Models\Package;
use App\Models\Section;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class DestinationsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category' => ['nullable', 'string', 'max:100'],
        ]);

        $categories = DestinationCategory::query()
            ->active()
            ->orderBy('sort_order')
            ->get();

        $activeCategory = $this->resolveActiveCategory(
            $categories,
            $validated['category'] ?? null
        );

        $packages = $this->resolvePackages($activeCategory);

        return ApiResponse::success([
            'categories' => DestinationCategorySummaryResource::collection($categories)->resolve(),
            'activeCategory' => $activeCategory->code,
            'heroImage' => $activeCategory->hero_image,
            'heroTitle' => $activeCategory->hero_title,
            'heroSubtitle' => $activeCategory->hero_subtitle,
            'listingPath' => $activeCategory->listing_path,
            'packages' => PackageSummaryResource::collection($packages)->resolve(),
        ]);
    }

    private function resolveActiveCategory(Collection $activeCategories, ?string $requestedCode): DestinationCategory
    {
        if ($requestedCode !== null) {
            $match = $activeCategories->firstWhere('code', $requestedCode);

            if ($match !== null) {
                return $match;
            }
        }

        return $activeCategories->first()
            ?? abort(404);
    }

    private function resolvePackages(DestinationCategory $category): Collection
    {
        if (filled($category->section_slug)) {
            $section = Section::query()
                ->where('slug', $category->section_slug)
                ->first();

            if ($section === null) {
                return collect();
            }

            $query = $section->activePackages()
                ->with('detail:id,package_id,inclusions');

            if (filled($category->package_category)) {
                $query->where('packages.category', $category->package_category);
            }

            return $query->get();
        }

        if (filled($category->package_category)) {
            return Package::query()
                ->active()
                ->where('category', $category->package_category)
                ->with('detail:id,package_id,inclusions')
                ->orderBy('title')
                ->get();
        }

        return collect();
    }
}
