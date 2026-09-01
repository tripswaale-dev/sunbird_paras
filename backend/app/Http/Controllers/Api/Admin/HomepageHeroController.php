<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateHomepageHeroRequest;
use App\Http\Resources\AdminHomepageHeroResource;
use App\Http\Responses\ApiResponse;
use App\Models\HomepageHero;
use Illuminate\Http\JsonResponse;

class HomepageHeroController extends Controller
{
    public function show(): JsonResponse
    {
        return ApiResponse::success(
            (new AdminHomepageHeroResource($this->resolveHero()))->resolve()
        );
    }

    public function update(UpdateHomepageHeroRequest $request): JsonResponse
    {
        $hero = $this->resolveHero();
        $hero->update($request->validated());

        return ApiResponse::success(
            (new AdminHomepageHeroResource($hero->fresh()))->resolve()
        );
    }

    private function resolveHero(): HomepageHero
    {
        return HomepageHero::query()
            ->where('id', HomepageHero::SINGLETON_ID)
            ->firstOrFail();
    }
}
