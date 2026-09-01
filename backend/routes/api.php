<?php

use App\Http\Controllers\Api\PackageController;
use App\Http\Controllers\Api\SectionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => config('app.name'),
        'environment' => config('app.env'),
        'timestamp' => now()->toIso8601String(),
    ]);
});

Route::get('/sections', [SectionController::class, 'index']);
Route::get('/sections/{section:slug}', [SectionController::class, 'show']);
Route::get('/sections/{section:slug}/packages', [SectionController::class, 'packages']);
Route::get('/packages', [PackageController::class, 'index']);
Route::get('/packages/{package:slug}', [PackageController::class, 'show']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
