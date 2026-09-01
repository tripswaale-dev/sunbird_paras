<?php

namespace App\Support;

use App\Models\Package;
use App\Models\Section;
use Illuminate\Support\Collection;

class SitemapGenerator
{
    private const STATIC_PATHS = [
        '/' => ['changefreq' => 'weekly', 'priority' => '1.0'],
        '/about' => ['changefreq' => 'monthly', 'priority' => '0.5'],
        '/contact' => ['changefreq' => 'monthly', 'priority' => '0.5'],
        '/packages' => ['changefreq' => 'weekly', 'priority' => '0.8'],
        '/destinations' => ['changefreq' => 'weekly', 'priority' => '0.7'],
        '/gallery' => ['changefreq' => 'monthly', 'priority' => '0.5'],
        '/blogs' => ['changefreq' => 'weekly', 'priority' => '0.6'],
        '/payment-policy' => ['changefreq' => 'yearly', 'priority' => '0.3'],
        '/cancellation-policy' => ['changefreq' => 'yearly', 'priority' => '0.3'],
    ];

    public function entries(): Collection
    {
        $baseUrl = config('frontend.url');
        $entries = collect();

        foreach (self::STATIC_PATHS as $path => $meta) {
            $entries->push($this->entry(
                $path === '/' ? $baseUrl.'/' : $baseUrl.$path,
                null,
                $meta['changefreq'],
                $meta['priority']
            ));
        }

        Section::query()
            ->active()
            ->where('is_indexable', true)
            ->orderBy('sort_order')
            ->get(['view_all_path', 'canonical_url', 'updated_at'])
            ->each(function (Section $section) use ($entries, $baseUrl) {
                $loc = filled($section->canonical_url)
                    ? $section->canonical_url
                    : $baseUrl.$section->view_all_path;

                $entries->push($this->entry(
                    $loc,
                    $section->updated_at?->toDateString(),
                    'weekly',
                    '0.8'
                ));
            });

        Package::query()
            ->active()
            ->where('is_indexable', true)
            ->orderBy('slug')
            ->get(['slug', 'canonical_url', 'updated_at'])
            ->each(function (Package $package) use ($entries, $baseUrl) {
                $loc = filled($package->canonical_url)
                    ? $package->canonical_url
                    : $baseUrl.'/packages/'.$package->slug;

                $entries->push($this->entry(
                    $loc,
                    $package->updated_at?->toDateString(),
                    'weekly',
                    '0.8'
                ));
            });

        return $entries
            ->unique(fn (array $entry) => $entry['loc'])
            ->values();
    }

    public function toXml(): string
    {
        $lines = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ];

        foreach ($this->entries() as $entry) {
            $lines[] = '  <url>';
            $lines[] = '    <loc>'.htmlspecialchars($entry['loc'], ENT_XML1 | ENT_QUOTES, 'UTF-8').'</loc>';

            if ($entry['lastmod'] !== null) {
                $lines[] = '    <lastmod>'.htmlspecialchars($entry['lastmod'], ENT_XML1 | ENT_QUOTES, 'UTF-8').'</lastmod>';
            }

            $lines[] = '    <changefreq>'.htmlspecialchars($entry['changefreq'], ENT_XML1 | ENT_QUOTES, 'UTF-8').'</changefreq>';
            $lines[] = '    <priority>'.htmlspecialchars($entry['priority'], ENT_XML1 | ENT_QUOTES, 'UTF-8').'</priority>';
            $lines[] = '  </url>';
        }

        $lines[] = '</urlset>';

        return implode("\n", $lines);
    }

    private function entry(string $loc, ?string $lastmod, string $changefreq, string $priority): array
    {
        return [
            'loc' => $loc,
            'lastmod' => $lastmod,
            'changefreq' => $changefreq,
            'priority' => $priority,
        ];
    }
}
