<?php

use App\Http\Controllers\Api\RobotsController;
use App\Http\Controllers\Api\SitemapController;
use Illuminate\Support\Facades\Route;

Route::get('/sitemap.xml', SitemapController::class);
Route::get('/robots.txt', RobotsController::class);
