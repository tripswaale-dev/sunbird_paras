<?php

use App\Http\Controllers\Api\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Api\Admin\PackageDetailController as AdminPackageDetailController;
use App\Http\Controllers\Api\Admin\PackageItineraryDayController as AdminPackageItineraryDayController;
use App\Http\Controllers\Api\Admin\PackageFaqController as AdminPackageFaqController;
use App\Http\Controllers\Api\Admin\PackageImageController as AdminPackageImageController;
use App\Http\Controllers\Api\Admin\PackageSeoController as AdminPackageSeoController;
use App\Http\Controllers\Api\Admin\PackageController as AdminPackageController;
use App\Http\Controllers\Api\Admin\SectionStatController as AdminSectionStatController;
use App\Http\Controllers\Api\Admin\SectionCategoryController as AdminSectionCategoryController;
use App\Http\Controllers\Api\Admin\SectionPackageController as AdminSectionPackageController;
use App\Http\Controllers\Api\Admin\SectionController as AdminSectionController;
use App\Http\Controllers\Api\Admin\SectionSeoController as AdminSectionSeoController;
use App\Http\Controllers\Api\PackageController;
use App\Http\Controllers\Api\RobotsController;
use App\Http\Controllers\Api\SectionController;
use App\Http\Controllers\Api\SitemapController;
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

Route::get('/sitemap.xml', SitemapController::class);
Route::get('/robots.txt', RobotsController::class);

Route::get('/sections', [SectionController::class, 'index']);
Route::get('/sections/{section:slug}', [SectionController::class, 'show']);
Route::get('/sections/{section:slug}/packages', [SectionController::class, 'packages']);
Route::get('/packages', [PackageController::class, 'index']);
Route::get('/packages/{package:slug}', [PackageController::class, 'show']);

Route::post('/admin/login', [AdminAuthController::class, 'login'])
    ->middleware('throttle:admin-login');

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/me', [AdminAuthController::class, 'me']);
    Route::post('/logout', [AdminAuthController::class, 'logout']);

    Route::get('/sections/{section}/stats', [AdminSectionStatController::class, 'index'])->whereNumber('section');
    Route::post('/sections/{section}/stats', [AdminSectionStatController::class, 'store'])->whereNumber('section');
    Route::get('/sections/{section}/stats/{stat}', [AdminSectionStatController::class, 'show'])->whereNumber(['section', 'stat']);
    Route::put('/sections/{section}/stats/{stat}', [AdminSectionStatController::class, 'update'])->whereNumber(['section', 'stat']);
    Route::patch('/sections/{section}/stats/{stat}', [AdminSectionStatController::class, 'update'])->whereNumber(['section', 'stat']);
    Route::delete('/sections/{section}/stats/{stat}', [AdminSectionStatController::class, 'destroy'])->whereNumber(['section', 'stat']);

    Route::get('/sections/{section}/categories', [AdminSectionCategoryController::class, 'index'])->whereNumber('section');
    Route::post('/sections/{section}/categories', [AdminSectionCategoryController::class, 'store'])->whereNumber('section');
    Route::get('/sections/{section}/categories/{category}', [AdminSectionCategoryController::class, 'show'])->whereNumber(['section', 'category']);
    Route::put('/sections/{section}/categories/{category}', [AdminSectionCategoryController::class, 'update'])->whereNumber(['section', 'category']);
    Route::patch('/sections/{section}/categories/{category}', [AdminSectionCategoryController::class, 'update'])->whereNumber(['section', 'category']);
    Route::delete('/sections/{section}/categories/{category}', [AdminSectionCategoryController::class, 'destroy'])->whereNumber(['section', 'category']);

    Route::get('/sections/{section}/packages', [AdminSectionPackageController::class, 'index'])->whereNumber('section');
    Route::post('/sections/{section}/packages', [AdminSectionPackageController::class, 'store'])->whereNumber('section');
    Route::patch('/sections/{section}/packages/{package}', [AdminSectionPackageController::class, 'update'])->whereNumber(['section', 'package']);
    Route::delete('/sections/{section}/packages/{package}', [AdminSectionPackageController::class, 'destroy'])->whereNumber(['section', 'package']);

    Route::get('/sections/{section}/seo', [AdminSectionSeoController::class, 'show'])->whereNumber('section');
    Route::put('/sections/{section}/seo', [AdminSectionSeoController::class, 'update'])->whereNumber('section');
    Route::patch('/sections/{section}/seo', [AdminSectionSeoController::class, 'update'])->whereNumber('section');

    Route::get('/sections', [AdminSectionController::class, 'index']);
    Route::post('/sections', [AdminSectionController::class, 'store']);
    Route::get('/sections/{id}', [AdminSectionController::class, 'show'])->whereNumber('id');
    Route::put('/sections/{id}', [AdminSectionController::class, 'update'])->whereNumber('id');
    Route::patch('/sections/{id}', [AdminSectionController::class, 'update'])->whereNumber('id');
    Route::delete('/sections/{id}', [AdminSectionController::class, 'destroy'])->whereNumber('id');

    Route::get('/packages/{id}/detail', [AdminPackageDetailController::class, 'show'])->whereNumber('id');
    Route::post('/packages/{id}/detail', [AdminPackageDetailController::class, 'store'])->whereNumber('id');
    Route::put('/packages/{id}/detail', [AdminPackageDetailController::class, 'update'])->whereNumber('id');
    Route::patch('/packages/{id}/detail', [AdminPackageDetailController::class, 'update'])->whereNumber('id');
    Route::delete('/packages/{id}/detail', [AdminPackageDetailController::class, 'destroy'])->whereNumber('id');

    Route::get('/packages/{id}/itinerary', [AdminPackageItineraryDayController::class, 'index'])->whereNumber('id');
    Route::post('/packages/{id}/itinerary', [AdminPackageItineraryDayController::class, 'store'])->whereNumber('id');
    Route::get('/packages/{id}/itinerary/{itinerary}', [AdminPackageItineraryDayController::class, 'show'])->whereNumber(['id', 'itinerary']);
    Route::put('/packages/{id}/itinerary/{itinerary}', [AdminPackageItineraryDayController::class, 'update'])->whereNumber(['id', 'itinerary']);
    Route::patch('/packages/{id}/itinerary/{itinerary}', [AdminPackageItineraryDayController::class, 'update'])->whereNumber(['id', 'itinerary']);
    Route::delete('/packages/{id}/itinerary/{itinerary}', [AdminPackageItineraryDayController::class, 'destroy'])->whereNumber(['id', 'itinerary']);

    Route::get('/packages/{id}/faqs', [AdminPackageFaqController::class, 'index'])->whereNumber('id');
    Route::post('/packages/{id}/faqs', [AdminPackageFaqController::class, 'store'])->whereNumber('id');
    Route::get('/packages/{id}/faqs/{faq}', [AdminPackageFaqController::class, 'show'])->whereNumber(['id', 'faq']);
    Route::put('/packages/{id}/faqs/{faq}', [AdminPackageFaqController::class, 'update'])->whereNumber(['id', 'faq']);
    Route::patch('/packages/{id}/faqs/{faq}', [AdminPackageFaqController::class, 'update'])->whereNumber(['id', 'faq']);
    Route::delete('/packages/{id}/faqs/{faq}', [AdminPackageFaqController::class, 'destroy'])->whereNumber(['id', 'faq']);

    Route::get('/packages/{id}/images', [AdminPackageImageController::class, 'index'])->whereNumber('id');
    Route::post('/packages/{id}/images', [AdminPackageImageController::class, 'store'])->whereNumber('id');
    Route::get('/packages/{id}/images/{image}', [AdminPackageImageController::class, 'show'])->whereNumber(['id', 'image']);
    Route::put('/packages/{id}/images/{image}', [AdminPackageImageController::class, 'update'])->whereNumber(['id', 'image']);
    Route::patch('/packages/{id}/images/{image}', [AdminPackageImageController::class, 'update'])->whereNumber(['id', 'image']);
    Route::delete('/packages/{id}/images/{image}', [AdminPackageImageController::class, 'destroy'])->whereNumber(['id', 'image']);

    Route::get('/packages/{id}/seo', [AdminPackageSeoController::class, 'show'])->whereNumber('id');
    Route::put('/packages/{id}/seo', [AdminPackageSeoController::class, 'update'])->whereNumber('id');
    Route::patch('/packages/{id}/seo', [AdminPackageSeoController::class, 'update'])->whereNumber('id');

    Route::get('/packages', [AdminPackageController::class, 'index']);
    Route::post('/packages', [AdminPackageController::class, 'store']);
    Route::get('/packages/{id}', [AdminPackageController::class, 'show'])->whereNumber('id');
    Route::put('/packages/{id}', [AdminPackageController::class, 'update'])->whereNumber('id');
    Route::patch('/packages/{id}', [AdminPackageController::class, 'update'])->whereNumber('id');
    Route::delete('/packages/{id}', [AdminPackageController::class, 'destroy'])->whereNumber('id');
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
