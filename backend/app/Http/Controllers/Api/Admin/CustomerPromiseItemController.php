<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateCustomerPromiseItemRequest;
use App\Http\Resources\AdminCustomerPromiseItemResource;
use App\Http\Responses\ApiResponse;
use App\Models\CustomerPromiseItem;
use Illuminate\Http\JsonResponse;

class CustomerPromiseItemController extends Controller
{
    public function index(): JsonResponse
    {
        $items = CustomerPromiseItem::query()
            ->orderBy('sort_order')
            ->get();

        return ApiResponse::success(
            AdminCustomerPromiseItemResource::collection($items)->resolve()
        );
    }

    public function show(CustomerPromiseItem $customerPromiseItem): JsonResponse
    {
        return ApiResponse::success(
            (new AdminCustomerPromiseItemResource($customerPromiseItem))->resolve()
        );
    }

    public function update(
        UpdateCustomerPromiseItemRequest $request,
        CustomerPromiseItem $customerPromiseItem
    ): JsonResponse {
        $customerPromiseItem->update($request->validated());

        return ApiResponse::success(
            (new AdminCustomerPromiseItemResource($customerPromiseItem->fresh()))->resolve()
        );
    }
}
