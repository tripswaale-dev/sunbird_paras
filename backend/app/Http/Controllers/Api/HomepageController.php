<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CustomerPromiseItemResource;
use App\Http\Resources\HomepageHeroResource;
use App\Http\Responses\ApiResponse;
use App\Models\CustomerPromiseItem;
use App\Models\HomepageHero;
use Illuminate\Http\JsonResponse;

class HomepageController extends Controller
{
    public function show(): JsonResponse
    {
        $hero = HomepageHero::query()
            ->where('id', HomepageHero::SINGLETON_ID)
            ->where('is_active', true)
            ->firstOrFail();

        $promises = CustomerPromiseItem::query()
            ->active()
            ->orderBy('sort_order')
            ->get();

        return ApiResponse::success([
            'hero' => (new HomepageHeroResource($hero))->resolve(),
            'customerPromises' => CustomerPromiseItemResource::collection($promises)->resolve(),
        ]);
    }
}
