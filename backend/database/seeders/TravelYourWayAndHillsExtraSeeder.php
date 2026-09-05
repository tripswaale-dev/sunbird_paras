<?php

namespace Database\Seeders;

use App\Models\Package;
use App\Models\PackageDetail;
use App\Models\Section;
use App\Models\SectionCategory;
use App\Models\SectionPackage;
use Database\Seeders\Support\DurationParser;
use Illuminate\Database\Seeder;

class TravelYourWayAndHillsExtraSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedTravelYourWay();
        $this->seedGatewayToTheHills();
    }

    private function seedTravelYourWay(): void
    {
        $section = Section::where('slug', 'travel-your-way')->first();

        if (! $section) {
            return;
        }

        $items = [
            [
                'package' => [
                    'slug' => 'coorg-weekend',
                    'title' => 'Coorg Weekend',
                    'location' => 'Karnataka',
                    'price' => 7999,
                    'duration' => '2 Nights / 3 Days',
                    'category' => 'Adventure & Thrill',
                    'image' => '/images/hills/southern-hills.jpg',
                    'inclusions' => ['Accommodation', 'Meals', 'Sightseeing'],
                ],
                'category' => [
                    'title' => 'Adventure & Thrill',
                    'filter_value' => 'Adventure & Thrill',
                    'image' => '/images/destinations/spiti.jpg',
                    'sort_order' => 1,
                ],
            ],
            [
                'package' => [
                    'slug' => 'spiti-valley-circuit',
                    'title' => 'Spiti Valley Circuit',
                    'location' => 'Himachal Pradesh',
                    'price' => 28999,
                    'duration' => '7 Nights / 8 Days',
                    'category' => 'Off Beat',
                    'image' => '/images/destinations/spiti.jpg',
                    'inclusions' => ['Accommodation', 'Meals', 'Sightseeing'],
                ],
                'category' => [
                    'title' => 'Off-Beat',
                    'filter_value' => 'Off Beat',
                    'image' => '/images/destinations/ladakh.jpg',
                    'sort_order' => 2,
                ],
            ],
            [
                'package' => [
                    'slug' => 'andaman-couple-retreat',
                    'title' => 'Andaman Couple Retreat',
                    'location' => 'Andaman',
                    'price' => 34999,
                    'duration' => '5 Nights / 6 Days',
                    'category' => 'Couple Getaways',
                    'image' => '/images/destinations/andaman.jpg',
                    'inclusions' => ['Accommodation', 'Meals', 'Sightseeing'],
                ],
                'category' => [
                    'title' => 'Couple Packages',
                    'filter_value' => 'Couple Getaways',
                    'image' => '/images/destinations/andaman.jpg',
                    'sort_order' => 3,
                ],
            ],
        ];

        foreach ($items as $index => $item) {
            $this->attach($section, $item['package'], $item['category'], $index + 1);
        }
    }

    private function seedGatewayToTheHills(): void
    {
        $section = Section::where('slug', 'gateway-to-the-hills')->first();

        if (! $section) {
            return;
        }

        SectionCategory::where('section_id', $section->id)
            ->where('title', 'Northern Himalayas')
            ->update([
                'is_featured' => false,
                'sort_order' => 0,
            ]);

        $items = [
            [
                'package' => [
                    'slug' => 'darjeeling-gangtok',
                    'title' => 'Darjeeling & Gangtok',
                    'location' => 'Sikkim · West Bengal',
                    'price' => 15999,
                    'duration' => '4 Nights / 5 Days',
                    'category' => 'North-East',
                    'image' => '/images/hills/northeast.jpg',
                    'inclusions' => ['Accommodation', 'Meals', 'Sightseeing', 'Transfers'],
                ],
                'category' => [
                    'title' => 'North-East',
                    'filter_value' => 'North-East',
                    'image' => '/images/hills/northeast.jpg',
                    'sort_order' => 1,
                    'is_featured' => false,
                ],
            ],
            [
                'package' => [
                    'slug' => 'munnar-ooty-escape',
                    'title' => 'Munnar & Ooty Escape',
                    'location' => 'Kerala · Tamil Nadu',
                    'price' => 14500,
                    'duration' => '4 Nights / 5 Days',
                    'category' => 'Southern Hill Escape',
                    'image' => '/images/hills/southern-hills.jpg',
                    'inclusions' => ['Accommodation', 'Meals', 'Sightseeing', 'Transfers'],
                ],
                'category' => [
                    'title' => 'Southern Hill Escapes',
                    'filter_value' => 'Southern Hill Escape',
                    'image' => '/images/hills/southern-hills.jpg',
                    'sort_order' => 2,
                    'is_featured' => true,
                ],
            ],
        ];

        foreach ($items as $index => $item) {
            $this->attach($section, $item['package'], $item['category'], $index + 1);
        }
    }

    private function attach(Section $section, array $packageData, array $categoryData, int $order): void
    {
        $package = $this->createPackage($packageData);

        SectionPackage::updateOrCreate(
            [
                'section_id' => $section->id,
                'package_id' => $package->id,
            ],
            [
                'display_order' => $order,
                'is_featured' => false,
            ]
        );

        SectionCategory::updateOrCreate(
            [
                'section_id' => $section->id,
                'title' => $categoryData['title'],
            ],
            [
                'filter_value' => $categoryData['filter_value'],
                'image' => $categoryData['image'],
                'is_featured' => $categoryData['is_featured'] ?? true,
                'sort_order' => $categoryData['sort_order'],
                'is_active' => true,
            ]
        );
    }

    private function createPackage(array $data): Package
    {
        $duration = DurationParser::parse($data['duration']);

        $package = Package::updateOrCreate(
            ['slug' => $data['slug']],
            [
                'title' => $data['title'],
                'subtitle' => null,
                'location' => $data['location'],
                'price' => $data['price'],
                'duration_nights' => $duration['nights'],
                'duration_days' => $duration['days'],
                'category' => $data['category'],
                'tag' => null,
                'image' => $data['image'],
                'pax' => 2,
                'is_active' => true,
                'is_indexable' => true,
            ]
        );

        PackageDetail::updateOrCreate(
            ['package_id' => $package->id],
            [
                'overview' => $data['title'].' is a carefully planned journey with stays, meals, and guided experiences included.',
                'destinations' => [$data['location']],
                'inclusions' => $data['inclusions'],
                'exclusions' => ['Flights', 'Personal expenses'],
                'highlights' => ['Expert local support', 'Curated stays', 'Transparent inclusions'],
            ]
        );

        return $package;
    }
}
