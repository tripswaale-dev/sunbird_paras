<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdatePageSeoRequest;
use App\Http\Resources\PageSeoResource;
use App\Http\Responses\ApiResponse;
use App\Models\PageSeo;
use Illuminate\Http\JsonResponse;

class PageSeoController extends Controller
{
    public function show(string $pageKey): JsonResponse
    {
        $pageSeo = $this->resolvePageSeo($pageKey);

        return ApiResponse::success(
            (new PageSeoResource($pageSeo))->resolve()
        );
    }

    public function update(UpdatePageSeoRequest $request, string $pageKey): JsonResponse
    {
        $pageSeo = $this->resolvePageSeo($pageKey);
        $pageSeo->update($request->validated());

        return ApiResponse::success(
            (new PageSeoResource($pageSeo->fresh()))->resolve()
        );
    }

    private function resolvePageSeo(string $pageKey): PageSeo
    {
        if (! in_array($pageKey, PageSeo::ALLOWED_PAGE_KEYS, true)) {
            abort(404);
        }

        return PageSeo::query()
            ->where('page_key', $pageKey)
            ->firstOrFail();
    }
}
