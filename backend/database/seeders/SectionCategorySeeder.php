<?php

namespace Database\Seeders;

use App\Models\Section;
use App\Models\SectionCategory;
use Illuminate\Database\Seeder;

class SectionCategorySeeder extends Seeder
{
    public function run(): void
    {
        $this->seedTravelYourWay();
        $this->seedGatewayToTheHills();
        $this->seedListingFilterTabs();
    }

    private function seedTravelYourWay(): void
    {
        $section = Section::where('slug', 'travel-your-way')->first();
        if (! $section) {
            return;
        }

        $categories = [
            ['title' => 'Pocket-Friendly', 'filter_value' => 'Pocket Friendly', 'image' => '/images/destinations/jaipur.jpg', 'is_featured' => false],
            ['title' => 'Adventure & Thrill', 'filter_value' => 'Adventure & Thrill', 'image' => '/images/destinations/spiti.jpg', 'is_featured' => false],
            ['title' => 'Off-Beat', 'filter_value' => 'Off Beat', 'image' => '/images/destinations/ladakh.jpg', 'is_featured' => false],
            ['title' => 'Couple Packages', 'filter_value' => 'Couple Getaways', 'image' => '/images/destinations/andaman.jpg', 'is_featured' => false],
        ];

        foreach ($categories as $order => $cat) {
            SectionCategory::updateOrCreate(
                [
                    'section_id' => $section->id,
                    'title' => $cat['title'],
                    'filter_value' => $cat['filter_value'],
                ],
                array_merge($cat, ['sort_order' => $order, 'is_active' => true])
            );
        }
    }

    private function seedGatewayToTheHills(): void
    {
        $section = Section::where('slug', 'gateway-to-the-hills')->first();
        if (! $section) {
            return;
        }

        $categories = [
            ['title' => 'Northern Himalayas', 'filter_value' => 'Northern Himalayas', 'image' => '/images/hills/himalayas.jpg', 'is_featured' => false],
            ['title' => 'North-East', 'filter_value' => 'North-East', 'image' => '/images/hills/northeast.jpg', 'is_featured' => false],
            ['title' => 'Southern Hill Escapes', 'filter_value' => 'Southern Hill Escape', 'image' => '/images/hills/southern-hills.jpg', 'is_featured' => true],
        ];

        foreach ($categories as $order => $cat) {
            SectionCategory::updateOrCreate(
                [
                    'section_id' => $section->id,
                    'title' => $cat['title'],
                    'filter_value' => $cat['filter_value'],
                ],
                array_merge($cat, ['sort_order' => $order, 'is_active' => true])
            );
        }
    }

    private function seedListingFilterTabs(): void
    {
        $filterTabs = [
            'popular-destinations' => [
                ['All Destinations', null],
                ['Mountains', 'Mountains'],
                ['Beaches', 'Beaches'],
                ['Heritage', 'Heritage'],
            ],
            'across-boundaries' => [
                ['All International', 'All International'],
                ['Beach Escapes', 'Beach Escapes'],
                ['Desert Safaris', 'Desert Safaris'],
            ],
            'best-of-india' => [
                ['All of India', null],
                ['North', 'North'],
                ['South', 'South'],
                ['West', 'West'],
                ['East', 'East'],
            ],
            'spiritual-destinations' => [
                ['All Spiritual', null],
                ['Pilgrimage', 'Pilgrimage'],
                ['Temple Tours', 'Temple Tours'],
                ['Retreats', 'Retreats'],
            ],
            'explore-wild-india' => [
                ['All Wildlife', null],
                ['Tiger Safari', 'Tiger Safari'],
                ['Nature Walks', 'Nature Walks'],
                ['Bird Watching', 'Bird Watching'],
            ],
        ];

        foreach ($filterTabs as $sectionSlug => $tabs) {
            $section = Section::where('slug', $sectionSlug)->first();
            if (! $section) {
                continue;
            }

            $baseOrder = 100;

            foreach ($tabs as $index => [$title, $filterValue]) {
                SectionCategory::updateOrCreate(
                    [
                        'section_id' => $section->id,
                        'title' => $title,
                        'filter_value' => $filterValue,
                        'image' => null,
                    ],
                    [
                        'is_featured' => false,
                        'sort_order' => $baseOrder + $index,
                        'is_active' => true,
                    ]
                );
            }
        }
    }
}
