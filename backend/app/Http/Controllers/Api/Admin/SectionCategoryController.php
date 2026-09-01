<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSectionCategoryRequest;
use App\Http\Requests\Admin\UpdateSectionCategoryRequest;
use App\Http\Resources\AdminSectionCategoryResource;
use App\Http\Responses\ApiResponse;
use App\Models\Section;
use App\Models\SectionCategory;
use Illuminate\Http\JsonResponse;

class SectionCategoryController extends Controller
{
    public function index(Section $section): JsonResponse
    {
        $categories = $section->categories()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        return ApiResponse::success(
            AdminSectionCategoryResource::collection($categories)->resolve()
        );
    }

    public function store(StoreSectionCategoryRequest $request, Section $section): JsonResponse
    {
        $validated = $request->validated();

        $category = SectionCategory::create([
            'section_id' => $section->id,
            'title' => $validated['title'],
            'filter_value' => $validated['filter_value'] ?? null,
            'image' => $validated['image'] ?? null,
            'sort_order' => $validated['sort_order'],
            'is_featured' => $validated['is_featured'] ?? false,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return ApiResponse::success(
            (new AdminSectionCategoryResource($category))->resolve(),
            null,
            201
        );
    }

    public function show(Section $section, int $category): JsonResponse
    {
        $categoryModel = $this->findCategoryForSection($section, $category);

        return ApiResponse::success(
            (new AdminSectionCategoryResource($categoryModel))->resolve()
        );
    }

    public function update(UpdateSectionCategoryRequest $request, Section $section, int $category): JsonResponse
    {
        $categoryModel = $this->findCategoryForSection($section, $category);
        $categoryModel->update($request->validated());

        return ApiResponse::success(
            (new AdminSectionCategoryResource($categoryModel->fresh()))->resolve()
        );
    }

    public function destroy(Section $section, int $category): JsonResponse
    {
        $categoryModel = $this->findCategoryForSection($section, $category);
        $categoryModel->delete();

        return ApiResponse::success([
            'message' => 'Section category deleted successfully.',
        ]);
    }

    private function findCategoryForSection(Section $section, int $categoryId): SectionCategory
    {
        return $section->categories()->where('id', $categoryId)->firstOrFail();
    }
}
