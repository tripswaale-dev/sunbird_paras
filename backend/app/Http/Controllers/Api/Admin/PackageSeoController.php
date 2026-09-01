<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdatePackageSeoRequest;
use App\Http\Resources\AdminPackageSeoResource;
use App\Http\Responses\ApiResponse;
use App\Models\Package;
use Illuminate\Http\JsonResponse;

class PackageSeoController extends Controller
{
    public function show(int $id): JsonResponse
    {
        $package = Package::findOrFail($id);

        return ApiResponse::success(
            (new AdminPackageSeoResource($package))->resolve()
        );
    }

    public function update(UpdatePackageSeoRequest $request, int $id): JsonResponse
    {
        $package = Package::findOrFail($id);
        $package->update($request->validated());

        return ApiResponse::success(
            (new AdminPackageSeoResource($package->fresh()))->resolve()
        );
    }
}
