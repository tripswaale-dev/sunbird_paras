<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSectionSeoRequest;
use App\Http\Resources\AdminSectionSeoResource;
use App\Http\Responses\ApiResponse;
use App\Models\Section;
use Illuminate\Http\JsonResponse;

class SectionSeoController extends Controller
{
    public function show(Section $section): JsonResponse
    {
        return ApiResponse::success(
            (new AdminSectionSeoResource($section))->resolve()
        );
    }

    public function update(UpdateSectionSeoRequest $request, Section $section): JsonResponse
    {
        $section->update($request->validated());

        return ApiResponse::success(
            (new AdminSectionSeoResource($section->fresh()))->resolve()
        );
    }
}
