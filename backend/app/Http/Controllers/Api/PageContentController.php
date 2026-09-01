<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PageContentResource;
use App\Http\Responses\ApiResponse;
use App\Models\PageContent;
use Illuminate\Http\JsonResponse;

class PageContentController extends Controller
{
    public function show(string $pageKey): JsonResponse
    {
        if (! in_array($pageKey, PageContent::ALLOWED_PAGE_KEYS, true)) {
            abort(404);
        }

        $pageContent = PageContent::query()
            ->where('page_key', $pageKey)
            ->where('is_active', true)
            ->firstOrFail();

        return ApiResponse::success(
            (new PageContentResource($pageContent))->resolve()
        );
    }
}
