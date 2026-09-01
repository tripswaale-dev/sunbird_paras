<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSectionPackageRequest;
use App\Http\Requests\Admin\UpdateSectionPackageRequest;
use App\Http\Resources\AdminSectionPackageResource;
use App\Http\Responses\ApiResponse;
use App\Models\Package;
use App\Models\Section;
use App\Models\SectionPackage;
use Illuminate\Http\JsonResponse;

class SectionPackageController extends Controller
{
    public function index(Section $section): JsonResponse
    {
        $packages = $section->packages()
            ->orderByPivot('display_order')
            ->orderBy('packages.id')
            ->get();

        return ApiResponse::success(
            AdminSectionPackageResource::collection($packages)->resolve()
        );
    }

    public function store(StoreSectionPackageRequest $request, Section $section): JsonResponse
    {
        $validated = $request->validated();

        SectionPackage::create([
            'section_id' => $section->id,
            'package_id' => $validated['package_id'],
            'display_order' => $validated['display_order'],
            'is_featured' => $validated['is_featured'] ?? false,
        ]);

        $package = $section->packages()
            ->where('packages.id', $validated['package_id'])
            ->first();

        return ApiResponse::success(
            (new AdminSectionPackageResource($package))->resolve(),
            null,
            201
        );
    }

    public function update(UpdateSectionPackageRequest $request, Section $section, Package $package): JsonResponse
    {
        $assignment = SectionPackage::query()
            ->where('section_id', $section->id)
            ->where('package_id', $package->id)
            ->firstOrFail();

        $assignment->update($request->validated());

        $packageModel = $section->packages()
            ->where('packages.id', $package->id)
            ->first();

        return ApiResponse::success(
            (new AdminSectionPackageResource($packageModel))->resolve()
        );
    }

    public function destroy(Section $section, Package $package): JsonResponse
    {
        $assignment = SectionPackage::query()
            ->where('section_id', $section->id)
            ->where('package_id', $package->id)
            ->firstOrFail();

        $assignment->delete();

        return ApiResponse::success([
            'message' => 'Package removed from section successfully.',
        ]);
    }
}
