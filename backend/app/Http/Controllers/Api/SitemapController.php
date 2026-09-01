<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\SitemapGenerator;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function __invoke(SitemapGenerator $generator): Response
    {
        return response($generator->toXml(), 200, [
            'Content-Type' => 'application/xml; charset=UTF-8',
        ]);
    }
}
