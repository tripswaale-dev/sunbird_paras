<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\GalleryItemResource;
use App\Http\Responses\ApiResponse;
use App\Models\GalleryItem;
use Illuminate\Http\JsonResponse;

class GalleryController extends Controller
{
    public function index(): JsonResponse
    {
        $items = GalleryItem::query()
            ->active()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        return ApiResponse::success([
            'categories' => GalleryItem::categoryCodes(),
            'items' => GalleryItemResource::collection($items)->resolve(),
        ]);
    }
}
