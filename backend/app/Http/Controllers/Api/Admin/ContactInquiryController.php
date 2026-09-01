<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AdminContactInquiryResource;
use App\Http\Responses\ApiResponse;
use App\Models\ContactInquiry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ContactInquiryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'subject' => ['nullable', 'string', Rule::in(ContactInquiry::SUBJECTS)],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $perPage = $validated['per_page'] ?? 15;

        $query = ContactInquiry::query()
            ->orderByDesc('created_at')
            ->orderByDesc('id');

        if (! empty($validated['subject'])) {
            $query->where('subject', $validated['subject']);
        }

        if (! empty($validated['search'])) {
            $search = $validated['search'];
            $query->where(function ($builder) use ($search) {
                $builder->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('message', 'like', "%{$search}%");
            });
        }

        $paginator = $query->paginate($perPage)->withQueryString();

        return ApiResponse::success(
            AdminContactInquiryResource::collection($paginator->getCollection())->resolve(),
            [
                'current_page' => $paginator->currentPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'last_page' => $paginator->lastPage(),
            ]
        );
    }

    public function show(int $id): JsonResponse
    {
        $inquiry = ContactInquiry::findOrFail($id);

        return ApiResponse::success(
            (new AdminContactInquiryResource($inquiry))->resolve()
        );
    }
}
