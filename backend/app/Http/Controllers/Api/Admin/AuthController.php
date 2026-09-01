<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\LoginRequest;
use App\Http\Resources\AdminUserResource;
use App\Http\Responses\ApiResponse;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->validated('email'))->first();

        if (! $user || ! Hash::check($request->validated('password'), $user->password)) {
            return ApiResponse::error('Invalid credentials.', 401);
        }

        if (! $user->isAdmin()) {
            return ApiResponse::error('You are not authorized to access the admin area.', 403);
        }

        $token = $user->createToken('admin-api')->plainTextToken;

        return ApiResponse::success([
            'token' => $token,
            'user' => (new AdminUserResource($user))->resolve(),
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return ApiResponse::success(
            (new AdminUserResource($request->user()))->resolve()
        );
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return ApiResponse::success(['message' => 'Logged out successfully.']);
    }
}
