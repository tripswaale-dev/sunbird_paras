<?php

namespace Database\Seeders;

use App\Models\DestinationCategory;
use Illuminate\Database\Seeder;

class DestinationCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'code' => DestinationCategory::CODE_POPULAR,
                'title' => 'Popular Destinations',
                'section_slug' => 'popular-destinations',
                'package_category' => null,
                'hero_image' => '/images/destinations/ladakh.jpg',
                'hero_title' => 'Popular Destinations',
                'hero_subtitle' => 'Handpicked experiences for every kind of traveller',
                'listing_path' => '/popular-destinations',
                'sort_order' => 1,
            ],
            [
                'code' => DestinationCategory::CODE_HILLS,
                'title' => 'Hill Stations',
                'section_slug' => 'gateway-to-the-hills',
                'package_category' => null,
                'hero_image' => '/hills/lifestyle.png',
                'hero_title' => 'Gateway to the Hills',
                'hero_subtitle' => 'Escape to the serene and majestic mountains',
                'listing_path' => '/gateway-to-the-hills',
                'sort_order' => 2,
            ],
            [
                'code' => DestinationCategory::CODE_BEACHES,
                'title' => 'Beaches',
                'section_slug' => null,
                'package_category' => 'Beaches',
                'hero_image' => '/images/india/goa.jpg',
                'hero_title' => 'Beaches',
                'hero_subtitle' => 'Sun, sand, and sea — India\'s finest coastal getaways',
                'listing_path' => '/packages',
                'sort_order' => 3,
            ],
            [
                'code' => DestinationCategory::CODE_SPIRITUAL,
                'title' => 'Spiritual',
                'section_slug' => 'spiritual-destinations',
                'package_category' => null,
                'hero_image' => '/images/spiritual/kedarnath.jpg',
                'hero_title' => 'Spiritual Destinations',
                'hero_subtitle' => 'Sacred journeys and soulful experiences across India',
                'listing_path' => '/spiritual-destinations',
                'sort_order' => 4,
            ],
            [
                'code' => DestinationCategory::CODE_WILDLIFE,
                'title' => 'Wildlife',
                'section_slug' => 'explore-wild-india',
                'package_category' => null,
                'hero_image' => '/images/wildlife/tiger.jpg',
                'hero_title' => 'Explore the WILD',
                'hero_subtitle' => 'Handpicked wildlife experiences for every kind of traveller',
                'listing_path' => '/explore-wild-india',
                'sort_order' => 5,
            ],
            [
                'code' => DestinationCategory::CODE_INTERNATIONAL,
                'title' => 'International',
                'section_slug' => 'across-boundaries',
                'package_category' => null,
                'hero_image' => '/images/international/maldives.jpg',
                'hero_title' => 'Across Boundaries',
                'hero_subtitle' => 'International packages curated for best experiences',
                'listing_path' => '/across-boundaries',
                'sort_order' => 6,
            ],
        ];

        foreach ($categories as $category) {
            DestinationCategory::updateOrCreate(
                ['code' => $category['code']],
                array_merge($category, ['is_active' => true])
            );
        }
    }
}
