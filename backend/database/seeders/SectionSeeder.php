<?php

namespace Database\Seeders;

use App\Models\Section;
use Illuminate\Database\Seeder;

class SectionSeeder extends Seeder
{
    public function run(): void
    {
        $sections = [
            [
                'slug' => 'popular-destinations',
                'title' => 'Popular Destinations',
                'subtitle' => 'Handpicked experiences for every kind of traveller',
                'view_all_path' => '/popular-destinations',
                'sort_order' => 1,
                'hero_image' => '/images/destinations/ladakh.jpg',
            ],
            [
                'slug' => 'travel-your-way',
                'title' => 'Travel Your Way',
                'subtitle' => null,
                'view_all_path' => '/travelyourway',
                'sort_order' => 2,
                'hero_image' => '/images/hero/travel-your-way.png',
            ],
            [
                'slug' => 'across-boundaries',
                'title' => 'Across Boundaries',
                'subtitle' => 'International packages curated for best experiences',
                'view_all_path' => '/across-boundaries',
                'sort_order' => 3,
                'hero_image' => '/images/international/maldives.jpg',
            ],
            [
                'slug' => 'gateway-to-the-hills',
                'title' => 'Gateway to the Hills',
                'subtitle' => 'Escape to the serene and majestic mountains',
                'view_all_path' => '/gateway-to-the-hills',
                'sort_order' => 4,
                'hero_image' => '/hills/lifestyle.png',
            ],
            [
                'slug' => 'best-of-india',
                'title' => 'Best of India',
                'subtitle' => "Discover India's diverse landscapes and experiences",
                'view_all_path' => '/best-of-india',
                'sort_order' => 5,
                'hero_image' => '/images/india/rajasthan.jpg',
            ],
            [
                'slug' => 'spiritual-destinations',
                'title' => 'Spiritual Destinations',
                'subtitle' => 'Sacred journeys and soulful experiences across India',
                'view_all_path' => '/spiritual-destinations',
                'sort_order' => 6,
                'hero_image' => '/images/spiritual/kedarnath.jpg',
            ],
            [
                'slug' => 'explore-wild-india',
                'title' => 'Explore the WILD',
                'subtitle' => 'Handpicked wildlife experiences for every kind of traveller',
                'view_all_path' => '/explore-wild-india',
                'sort_order' => 7,
                'hero_image' => '/images/wildlife/tiger.jpg',
            ],
        ];

        foreach ($sections as $section) {
            Section::updateOrCreate(
                ['slug' => $section['slug']],
                array_merge($section, [
                    'is_active' => true,
                    'is_indexable' => true,
                ])
            );
        }
    }
}
