<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePackageDetailRequest;
use App\Http\Requests\Admin\UpdatePackageDetailRequest;
use App\Http\Resources\AdminPackageDetailRecordResource;
use App\Http\Responses\ApiResponse;
use App\Models\Package;
use App\Models\PackageDetail;
use Illuminate\Http\JsonResponse;

class PackageDetailController extends Controller
{
    public function show(int $id): JsonResponse
    {
        $package = Package::findOrFail($id);
        $detail = $package->detail;

        if ($detail === null) {
            abort(404);
        }

        return ApiResponse::success(
            (new AdminPackageDetailRecordResource($detail))->resolve()
        );
    }

    public function store(StorePackageDetailRequest $request, int $id): JsonResponse
    {
        $package = Package::findOrFail($id);

        if ($package->detail()->exists()) {
            return ApiResponse::error(
                'Package detail already exists for this package.',
                422,
                ['package_id' => ['A detail record already exists for this package.']]
            );
        }

        $detail = PackageDetail::create(array_merge(
            ['package_id' => $package->id],
            $request->validated()
        ));

        return ApiResponse::success(
            (new AdminPackageDetailRecordResource($detail))->resolve(),
            null,
            201
        );
    }

    public function update(UpdatePackageDetailRequest $request, int $id): JsonResponse
    {
        $package = Package::findOrFail($id);
        $detail = $package->detail;

        if ($detail === null) {
            abort(404);
        }

        $detail->update($request->validated());

        return ApiResponse::success(
            (new AdminPackageDetailRecordResource($detail->fresh()))->resolve()
        );
    }

    public function destroy(int $id): JsonResponse
    {
        $package = Package::findOrFail($id);
        $detail = $package->detail;

        if ($detail === null) {
            abort(404);
        }

        $detail->delete();

        return ApiResponse::success([
            'message' => 'Package detail deleted successfully.',
        ]);
    }
}
