<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePackageImageRequest;
use App\Http\Requests\Admin\UpdatePackageImageRequest;
use App\Http\Resources\AdminPackageImageResource;
use App\Http\Responses\ApiResponse;
use App\Models\Package;
use App\Models\PackageImage;
use Illuminate\Http\JsonResponse;

class PackageImageController extends Controller
{
    public function index(int $id): JsonResponse
    {
        $package = Package::findOrFail($id);

        $images = $package->images()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        return ApiResponse::success(
            AdminPackageImageResource::collection($images)->resolve()
        );
    }

    public function store(StorePackageImageRequest $request, int $id): JsonResponse
    {
        $package = Package::findOrFail($id);
        $validated = $request->validated();

        $image = PackageImage::create([
            'package_id' => $package->id,
            'path' => $validated['path'],
            'type' => $validated['type'],
            'alt_text' => $validated['alt_text'] ?? null,
            'sort_order' => $validated['sort_order'],
        ]);

        return ApiResponse::success(
            (new AdminPackageImageResource($image))->resolve(),
            null,
            201
        );
    }

    public function show(int $id, int $image): JsonResponse
    {
        $package = Package::findOrFail($id);
        $imageModel = $this->findImageForPackage($package, $image);

        return ApiResponse::success(
            (new AdminPackageImageResource($imageModel))->resolve()
        );
    }

    public function update(UpdatePackageImageRequest $request, int $id, int $image): JsonResponse
    {
        $package = Package::findOrFail($id);
        $imageModel = $this->findImageForPackage($package, $image);
        $imageModel->update($request->validated());

        return ApiResponse::success(
            (new AdminPackageImageResource($imageModel->fresh()))->resolve()
        );
    }

    public function destroy(int $id, int $image): JsonResponse
    {
        $package = Package::findOrFail($id);
        $imageModel = $this->findImageForPackage($package, $image);
        $imageModel->delete();

        return ApiResponse::success([
            'message' => 'Package image deleted successfully.',
        ]);
    }

    private function findImageForPackage(Package $package, int $imageId): PackageImage
    {
        return $package->images()->where('id', $imageId)->firstOrFail();
    }
}
