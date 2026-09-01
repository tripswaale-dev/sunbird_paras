<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateDestinationCategoryRequest;
use App\Http\Resources\AdminDestinationCategoryResource;
use App\Http\Responses\ApiResponse;
use App\Models\DestinationCategory;
use Illuminate\Http\JsonResponse;

class DestinationCategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = DestinationCategory::query()
            ->orderBy('sort_order')
            ->get();

        return ApiResponse::success(
            AdminDestinationCategoryResource::collection($categories)->resolve()
        );
    }

    public function show(DestinationCategory $destinationCategory): JsonResponse
    {
        return ApiResponse::success(
            (new AdminDestinationCategoryResource($destinationCategory))->resolve()
        );
    }

    public function update(
        UpdateDestinationCategoryRequest $request,
        DestinationCategory $destinationCategory
    ): JsonResponse {
        $destinationCategory->update($request->validated());

        return ApiResponse::success(
            (new AdminDestinationCategoryResource($destinationCategory->fresh()))->resolve()
        );
    }
}
