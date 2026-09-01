<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactInquiryRequest;
use App\Http\Responses\ApiResponse;
use App\Models\ContactInquiry;
use Illuminate\Http\JsonResponse;

class ContactInquiryController extends Controller
{
    public function store(StoreContactInquiryRequest $request): JsonResponse
    {
        $inquiry = ContactInquiry::create([
            ...$request->validated(),
            'ip_address' => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 500) ?: null,
        ]);

        return ApiResponse::success([
            'id' => $inquiry->id,
            'message' => 'Thank you for your inquiry. We will get back to you soon.',
        ], null, 201);
    }
}
