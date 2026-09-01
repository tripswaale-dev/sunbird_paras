<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePackageItineraryDayRequest;
use App\Http\Requests\Admin\UpdatePackageItineraryDayRequest;
use App\Http\Resources\AdminPackageItineraryDayResource;
use App\Http\Responses\ApiResponse;
use App\Models\Package;
use App\Models\PackageItineraryDay;
use Illuminate\Http\JsonResponse;

class PackageItineraryDayController extends Controller
{
    public function index(int $id): JsonResponse
    {
        $package = Package::findOrFail($id);

        $days = $package->itineraryDays()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        return ApiResponse::success(
            AdminPackageItineraryDayResource::collection($days)->resolve()
        );
    }

    public function store(StorePackageItineraryDayRequest $request, int $id): JsonResponse
    {
        $package = Package::findOrFail($id);
        $validated = $request->validated();

        $day = PackageItineraryDay::create([
            'package_id' => $package->id,
            'day' => $validated['day'],
            'title' => $validated['title'],
            'description' => $validated['description'],
            'stay_information' => $validated['stay_information'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'images' => $validated['images'] ?? null,
            'sort_order' => $validated['sort_order'],
        ]);

        return ApiResponse::success(
            (new AdminPackageItineraryDayResource($day))->resolve(),
            null,
            201
        );
    }

    public function show(int $id, int $itinerary): JsonResponse
    {
        $package = Package::findOrFail($id);
        $day = $this->findItineraryForPackage($package, $itinerary);

        return ApiResponse::success(
            (new AdminPackageItineraryDayResource($day))->resolve()
        );
    }

    public function update(UpdatePackageItineraryDayRequest $request, int $id, int $itinerary): JsonResponse
    {
        $package = Package::findOrFail($id);
        $day = $this->findItineraryForPackage($package, $itinerary);
        $day->update($request->validated());

        return ApiResponse::success(
            (new AdminPackageItineraryDayResource($day->fresh()))->resolve()
        );
    }

    public function destroy(int $id, int $itinerary): JsonResponse
    {
        $package = Package::findOrFail($id);
        $day = $this->findItineraryForPackage($package, $itinerary);
        $day->delete();

        return ApiResponse::success([
            'message' => 'Package itinerary day deleted successfully.',
        ]);
    }

    private function findItineraryForPackage(Package $package, int $itineraryId): PackageItineraryDay
    {
        return $package->itineraryDays()->where('id', $itineraryId)->firstOrFail();
    }
}
