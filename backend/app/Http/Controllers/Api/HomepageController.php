<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CustomerPromiseItemResource;
use App\Http\Resources\HomepageHeroResource;
use App\Http\Responses\ApiResponse;
use App\Models\CustomerPromiseItem;
use App\Models\HomepageHero;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class HomepageController extends Controller
{
    public function show(): JsonResponse
    {
        $payload = Cache::remember('api.homepage.show', now()->addSeconds(45), function () {
            $hero = HomepageHero::query()
                ->where('id', HomepageHero::SINGLETON_ID)
                ->where('is_active', true)
                ->firstOrFail();

            $promises = CustomerPromiseItem::query()
                ->active()
                ->orderBy('sort_order')
                ->get();

            return [
                'hero' => (new HomepageHeroResource($hero))->resolve(),
                'customerPromises' => CustomerPromiseItemResource::collection($promises)->resolve(),
            ];
        });

        return ApiResponse::success($payload);
    }
}
