<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePackageFaqRequest;
use App\Http\Requests\Admin\UpdatePackageFaqRequest;
use App\Http\Resources\AdminPackageFaqResource;
use App\Http\Responses\ApiResponse;
use App\Models\Package;
use App\Models\PackageFaq;
use Illuminate\Http\JsonResponse;

class PackageFaqController extends Controller
{
    public function index(int $id): JsonResponse
    {
        $package = Package::findOrFail($id);

        $faqs = $package->faqs()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        return ApiResponse::success(
            AdminPackageFaqResource::collection($faqs)->resolve()
        );
    }

    public function store(StorePackageFaqRequest $request, int $id): JsonResponse
    {
        $package = Package::findOrFail($id);
        $validated = $request->validated();

        $faq = PackageFaq::create([
            'package_id' => $package->id,
            'question' => $validated['question'],
            'answer' => $validated['answer'],
            'sort_order' => $validated['sort_order'],
        ]);

        return ApiResponse::success(
            (new AdminPackageFaqResource($faq))->resolve(),
            null,
            201
        );
    }

    public function show(int $id, int $faq): JsonResponse
    {
        $package = Package::findOrFail($id);
        $faqModel = $this->findFaqForPackage($package, $faq);

        return ApiResponse::success(
            (new AdminPackageFaqResource($faqModel))->resolve()
        );
    }

    public function update(UpdatePackageFaqRequest $request, int $id, int $faq): JsonResponse
    {
        $package = Package::findOrFail($id);
        $faqModel = $this->findFaqForPackage($package, $faq);
        $faqModel->update($request->validated());

        return ApiResponse::success(
            (new AdminPackageFaqResource($faqModel->fresh()))->resolve()
        );
    }

    public function destroy(int $id, int $faq): JsonResponse
    {
        $package = Package::findOrFail($id);
        $faqModel = $this->findFaqForPackage($package, $faq);
        $faqModel->delete();

        return ApiResponse::success([
            'message' => 'Package FAQ deleted successfully.',
        ]);
    }

    private function findFaqForPackage(Package $package, int $faqId): PackageFaq
    {
        return $package->faqs()->where('id', $faqId)->firstOrFail();
    }
}
