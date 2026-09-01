<?php

namespace App\Providers;

use App\Models\Blog;
use App\Models\Package;
use App\Models\Section;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to the "home" route for your application.
     *
     * Typically, users are redirected here after authentication.
     *
     * @var string
     */
    public const HOME = '/home';

    /**
     * Define your route model bindings, pattern filters, and other route configuration.
     */
    public function boot(): void
    {
        $this->configureRateLimiting();
        $this->configureRouteModelBinding();

        $this->routes(function () {
            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/api.php'));

            Route::middleware('web')
                ->group(base_path('routes/web.php'));
        });
    }

    /**
     * Configure the rate limiters for the application.
     */
    protected function configureRateLimiting(): void
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('admin-login', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip());
        });
    }

    protected function configureRouteModelBinding(): void
    {
        Route::bind('section', function (string $value) {
            if (request()->is('api/admin/*') && ctype_digit($value)) {
                return Section::findOrFail((int) $value);
            }

            return Section::where('slug', $value)->active()->firstOrFail();
        });

        Route::bind('package', function (string $value) {
            if (request()->is('api/admin/sections/*/packages/*') && ctype_digit($value)) {
                return Package::findOrFail((int) $value);
            }

            return Package::where('slug', $value)->active()->firstOrFail();
        });

        Route::bind('blog', function (string $value) {
            return Blog::where('slug', $value)->active()->firstOrFail();
        });
    }
}
