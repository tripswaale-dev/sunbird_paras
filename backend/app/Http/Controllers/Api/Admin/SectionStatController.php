<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSectionStatRequest;
use App\Http\Requests\Admin\UpdateSectionStatRequest;
use App\Http\Resources\AdminSectionStatResource;
use App\Http\Responses\ApiResponse;
use App\Models\Section;
use App\Models\SectionStat;
use Illuminate\Http\JsonResponse;

class SectionStatController extends Controller
{
    public function index(Section $section): JsonResponse
    {
        $stats = $section->stats()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        return ApiResponse::success(
            AdminSectionStatResource::collection($stats)->resolve()
        );
    }

    public function store(StoreSectionStatRequest $request, Section $section): JsonResponse
    {
        $validated = $request->validated();

        $stat = SectionStat::create([
            'section_id' => $section->id,
            'value' => $validated['value'],
            'label' => $validated['label'],
            'sort_order' => $validated['sort_order'],
        ]);

        return ApiResponse::success(
            (new AdminSectionStatResource($stat))->resolve(),
            null,
            201
        );
    }

    public function show(Section $section, int $stat): JsonResponse
    {
        $statModel = $this->findStatForSection($section, $stat);

        return ApiResponse::success(
            (new AdminSectionStatResource($statModel))->resolve()
        );
    }

    public function update(UpdateSectionStatRequest $request, Section $section, int $stat): JsonResponse
    {
        $statModel = $this->findStatForSection($section, $stat);
        $statModel->update($request->validated());

        return ApiResponse::success(
            (new AdminSectionStatResource($statModel->fresh()))->resolve()
        );
    }

    public function destroy(Section $section, int $stat): JsonResponse
    {
        $statModel = $this->findStatForSection($section, $stat);
        $statModel->delete();

        return ApiResponse::success([
            'message' => 'Section stat deleted successfully.',
        ]);
    }

    private function findStatForSection(Section $section, int $statId): SectionStat
    {
        return $section->stats()->where('id', $statId)->firstOrFail();
    }
}
