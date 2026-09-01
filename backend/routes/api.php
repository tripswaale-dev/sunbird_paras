<?php

use App\Http\Controllers\Api\Admin\CustomerPromiseItemController as AdminCustomerPromiseItemController;
use App\Http\Controllers\Api\Admin\HomepageHeroController as AdminHomepageHeroController;
use App\Http\Controllers\Api\Admin\DestinationCategoryController as AdminDestinationCategoryController;
use App\Http\Controllers\Api\Admin\ContactInquiryController as AdminContactInquiryController;
use App\Http\Controllers\Api\Admin\BlogController as AdminBlogController;
use App\Http\Controllers\Api\Admin\GalleryItemController as AdminGalleryItemController;
use App\Http\Controllers\Api\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Api\Admin\PackageDetailController as AdminPackageDetailController;
use App\Http\Controllers\Api\Admin\PackageItineraryDayController as AdminPackageItineraryDayController;
use App\Http\Controllers\Api\Admin\PackageFaqController as AdminPackageFaqController;
use App\Http\Controllers\Api\Admin\PackageImageController as AdminPackageImageController;
use App\Http\Controllers\Api\Admin\PageContentController as AdminPageContentController;
use App\Http\Controllers\Api\Admin\PageSeoController as AdminPageSeoController;
use App\Http\Controllers\Api\Admin\PackageSeoController as AdminPackageSeoController;
use App\Http\Controllers\Api\Admin\PackageController as AdminPackageController;
use App\Http\Controllers\Api\Admin\SectionStatController as AdminSectionStatController;
use App\Http\Controllers\Api\Admin\SectionCategoryController as AdminSectionCategoryController;
use App\Http\Controllers\Api\Admin\SectionPackageController as AdminSectionPackageController;
use App\Http\Controllers\Api\Admin\SectionController as AdminSectionController;
use App\Http\Controllers\Api\Admin\SectionSeoController as AdminSectionSeoController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\HomepageController;
use App\Http\Controllers\Api\DestinationsController;
use App\Http\Controllers\Api\ContactInquiryController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\PackageController;
use App\Http\Controllers\Api\PageContentController;
use App\Http\Controllers\Api\PageSeoController;
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
Route::get('/blogs', [BlogController::class, 'index']);
Route::get('/blogs/{blog:slug}', [BlogController::class, 'show']);
Route::get('/gallery', [GalleryController::class, 'index']);
Route::get('/homepage', [HomepageController::class, 'show']);
Route::get('/destinations', [DestinationsController::class, 'index']);
Route::get('/page-seo/{pageKey}', [PageSeoController::class, 'show']);
Route::get('/page-content/{pageKey}', [PageContentController::class, 'show']);

Route::post('/contact-inquiries', [ContactInquiryController::class, 'store'])
    ->middleware('throttle:10,1');

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

    Route::get('/blogs', [AdminBlogController::class, 'index']);
    Route::post('/blogs', [AdminBlogController::class, 'store']);
    Route::get('/blogs/{id}', [AdminBlogController::class, 'show'])->whereNumber('id');
    Route::put('/blogs/{id}', [AdminBlogController::class, 'update'])->whereNumber('id');
    Route::patch('/blogs/{id}', [AdminBlogController::class, 'update'])->whereNumber('id');
    Route::delete('/blogs/{id}', [AdminBlogController::class, 'destroy'])->whereNumber('id');

    Route::get('/gallery-items', [AdminGalleryItemController::class, 'index']);
    Route::post('/gallery-items', [AdminGalleryItemController::class, 'store']);
    Route::get('/gallery-items/{id}', [AdminGalleryItemController::class, 'show'])->whereNumber('id');
    Route::put('/gallery-items/{id}', [AdminGalleryItemController::class, 'update'])->whereNumber('id');
    Route::patch('/gallery-items/{id}', [AdminGalleryItemController::class, 'update'])->whereNumber('id');
    Route::delete('/gallery-items/{id}', [AdminGalleryItemController::class, 'destroy'])->whereNumber('id');

    Route::get('/page-seo/{pageKey}', [AdminPageSeoController::class, 'show']);
    Route::put('/page-seo/{pageKey}', [AdminPageSeoController::class, 'update']);
    Route::patch('/page-seo/{pageKey}', [AdminPageSeoController::class, 'update']);

    Route::get('/page-content/{pageKey}', [AdminPageContentController::class, 'show']);
    Route::put('/page-content/{pageKey}', [AdminPageContentController::class, 'update']);
    Route::patch('/page-content/{pageKey}', [AdminPageContentController::class, 'update']);

    Route::get('/homepage-hero', [AdminHomepageHeroController::class, 'show']);
    Route::put('/homepage-hero', [AdminHomepageHeroController::class, 'update']);
    Route::patch('/homepage-hero', [AdminHomepageHeroController::class, 'update']);

    Route::get('/customer-promise-items', [AdminCustomerPromiseItemController::class, 'index']);
    Route::get('/customer-promise-items/{customerPromiseItem}', [AdminCustomerPromiseItemController::class, 'show'])->whereNumber('customerPromiseItem');
    Route::put('/customer-promise-items/{customerPromiseItem}', [AdminCustomerPromiseItemController::class, 'update'])->whereNumber('customerPromiseItem');
    Route::patch('/customer-promise-items/{customerPromiseItem}', [AdminCustomerPromiseItemController::class, 'update'])->whereNumber('customerPromiseItem');

    Route::get('/destination-categories', [AdminDestinationCategoryController::class, 'index']);
    Route::get('/destination-categories/{destinationCategory:code}', [AdminDestinationCategoryController::class, 'show']);
    Route::put('/destination-categories/{destinationCategory:code}', [AdminDestinationCategoryController::class, 'update']);
    Route::patch('/destination-categories/{destinationCategory:code}', [AdminDestinationCategoryController::class, 'update']);

    Route::get('/contact-inquiries', [AdminContactInquiryController::class, 'index']);
    Route::get('/contact-inquiries/{id}', [AdminContactInquiryController::class, 'show'])->whereNumber('id');
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
