<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PageSeoResource;
use App\Http\Responses\ApiResponse;
use App\Models\PageSeo;
use Illuminate\Http\JsonResponse;

class PageSeoController extends Controller
{
    public function show(string $pageKey): JsonResponse
    {
        if (! in_array($pageKey, PageSeo::ALLOWED_PAGE_KEYS, true)) {
            abort(404);
        }

        $pageSeo = PageSeo::query()
            ->where('page_key', $pageKey)
            ->firstOrFail();

        return ApiResponse::success(
            (new PageSeoResource($pageSeo))->resolve()
        );
    }
}
