<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdatePageContentRequest;
use App\Http\Resources\AdminPageContentResource;
use App\Http\Responses\ApiResponse;
use App\Models\PageContent;
use Illuminate\Http\JsonResponse;

class PageContentController extends Controller
{
    public function show(string $pageKey): JsonResponse
    {
        $pageContent = $this->resolvePageContent($pageKey);

        return ApiResponse::success(
            (new AdminPageContentResource($pageContent))->resolve()
        );
    }

    public function update(UpdatePageContentRequest $request, string $pageKey): JsonResponse
    {
        $pageContent = $this->resolvePageContent($pageKey);
        $pageContent->update($request->validated());

        return ApiResponse::success(
            (new AdminPageContentResource($pageContent->fresh()))->resolve()
        );
    }

    private function resolvePageContent(string $pageKey): PageContent
    {
        if (! in_array($pageKey, PageContent::ALLOWED_PAGE_KEYS, true)) {
            abort(404);
        }

        return PageContent::query()
            ->where('page_key', $pageKey)
            ->firstOrFail();
    }
}
