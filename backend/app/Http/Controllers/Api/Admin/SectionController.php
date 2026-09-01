<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSectionRequest;
use App\Http\Requests\Admin\UpdateSectionRequest;
use App\Http\Resources\AdminSectionResource;
use App\Http\Responses\ApiResponse;
use App\Models\Section;
use Illuminate\Http\JsonResponse;

class SectionController extends Controller
{
    public function index(): JsonResponse
    {
        $sections = Section::query()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        return ApiResponse::success(
            AdminSectionResource::collection($sections)->resolve()
        );
    }

    public function show(int $id): JsonResponse
    {
        $section = Section::findOrFail($id);

        return ApiResponse::success(
            (new AdminSectionResource($section))->resolve()
        );
    }

    public function store(StoreSectionRequest $request): JsonResponse
    {
        $section = Section::create($request->validated());

        return ApiResponse::success(
            (new AdminSectionResource($section))->resolve(),
            null,
            201
        );
    }

    public function update(UpdateSectionRequest $request, int $id): JsonResponse
    {
        $section = Section::findOrFail($id);
        $section->update($request->validated());

        return ApiResponse::success(
            (new AdminSectionResource($section->fresh()))->resolve()
        );
    }

    public function destroy(int $id): JsonResponse
    {
        $section = Section::findOrFail($id);

        if ($section->sectionPackages()->exists()
            || $section->categories()->exists()
            || $section->stats()->exists()) {
            return ApiResponse::error(
                'Cannot delete section with existing packages, categories, or stats. Deactivate the section instead.',
                409
            );
        }

        $section->delete();

        return ApiResponse::success(['message' => 'Section deleted successfully.']);
    }
}
