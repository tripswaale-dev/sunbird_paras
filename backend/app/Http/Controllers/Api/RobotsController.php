<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Response;

class RobotsController extends Controller
{
    public function __invoke(): Response
    {
        $sitemapUrl = rtrim(config('app.url'), '/').'/api/sitemap.xml';

        $content = implode("\n", [
            'User-agent: *',
            'Allow: /',
            '',
            'Sitemap: '.$sitemapUrl,
            '',
        ]);

        return response($content, 200, [
            'Content-Type' => 'text/plain; charset=UTF-8',
        ]);
    }
}
