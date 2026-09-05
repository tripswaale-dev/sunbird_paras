<?php

namespace Database\Seeders;

use App\Models\Package;
use App\Models\PackageDetail;
use App\Models\Section;
use App\Models\SectionCategory;
use App\Models\SectionPackage;
use App\Models\SectionStat;
use Database\Seeders\Support\DurationParser;
use Illuminate\Database\Seeder;

class MinimalSectionSampleSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(SectionSeeder::class);

        $samples = [
            [
                'section' => 'popular-destinations',
                'package' => [
                    'slug' => 'spiti-valley',
                    'title' => 'Spiti Valley',
                    'location' => 'Himachal Pradesh',
                    'price' => 28999,
                    'duration' => '7 Nights / 8 Days',
                    'category' => 'Mountains',
                    'tag' => null,
                    'image' => '/images/destinations/spiti.jpg',
                    'inclusions' => ['Accommodation', 'Meals', 'Sightseeing', 'Transfers'],
                ],
                'stat' => ['value' => '2+', 'label' => 'years of experience'],
            ],
            [
                'section' => 'travel-your-way',
                'package' => [
                    'slug' => 'udaipur-getaway',
                    'title' => 'Udaipur Getaway',
                    'location' => 'Rajasthan',
                    'price' => 7999,
                    'duration' => '2 Nights / 3 Days',
                    'category' => 'Pocket Friendly',
                    'tag' => null,
                    'image' => '/images/destinations/jaipur.jpg',
                    'inclusions' => ['Accommodation', 'Meals', 'Sightseeing'],
                ],
                'category' => [
                    'title' => 'Pocket-Friendly',
                    'filter_value' => 'Pocket Friendly',
                    'image' => '/images/destinations/jaipur.jpg',
                    'is_featured' => true,
                ],
            ],
            [
                'section' => 'across-boundaries',
                'package' => [
                    'slug' => 'mesmerizing-sri-lanka',
                    'title' => 'Mesmerizing Sri Lanka',
                    'location' => 'SRI LANKA',
                    'price' => 35999,
                    'duration' => '3 Nights / 4 Days',
                    'category' => 'All International',
                    'tag' => null,
                    'image' => '/images/international/srilanka.jpg',
                    'inclusions' => ['Accommodation', 'Meals', 'Sightseeing', 'Transfers'],
                ],
            ],
            [
                'section' => 'gateway-to-the-hills',
                'package' => [
                    'slug' => 'shimla-manali-tour',
                    'title' => 'Shimla Manali Tour',
                    'location' => 'Himachal Pradesh',
                    'price' => 12999,
                    'duration' => '5 Nights / 6 Days',
                    'category' => 'Northern Himalayas',
                    'tag' => null,
                    'image' => '/images/hills/himalayas.jpg',
                    'inclusions' => ['Accommodation', 'Meals', 'Sightseeing', 'Transfers'],
                ],
                'category' => [
                    'title' => 'Northern Himalayas',
                    'filter_value' => 'Northern Himalayas',
                    'image' => '/images/hills/himalayas.jpg',
                    'is_featured' => false,
                ],
            ],
            [
                'section' => 'best-of-india',
                'package' => [
                    'slug' => 'golden-triangle',
                    'title' => 'Golden Triangle',
                    'location' => 'Delhi · Agra · Jaipur',
                    'price' => 18999,
                    'duration' => '5 Nights / 6 Days',
                    'category' => 'North',
                    'tag' => null,
                    'image' => '/images/india/rajasthan.jpg',
                    'inclusions' => ['Accommodation', 'Meals', 'Sightseeing', 'Transfers'],
                ],
            ],
            [
                'section' => 'spiritual-destinations',
                'package' => [
                    'slug' => 'char-dham-yatra',
                    'title' => 'Char Dham Yatra',
                    'location' => 'Uttarakhand, India',
                    'price' => 28999,
                    'duration' => '9 Nights / 10 Days',
                    'category' => 'Pilgrimage',
                    'tag' => 'Pilgrimage',
                    'image' => '/images/spiritual/chardham.jpg',
                    'inclusions' => ['Accommodation', 'Meals', 'Transfers', 'Darshan'],
                ],
            ],
            [
                'section' => 'explore-wild-india',
                'package' => [
                    'slug' => 'royal-ranthambore',
                    'title' => 'Royal Ranthambore',
                    'location' => 'RAJASTHAN',
                    'price' => 18999,
                    'duration' => '3 Nights / 4 Days',
                    'category' => 'Tiger Safari',
                    'tag' => null,
                    'image' => '/images/wildlife/tiger.jpg',
                    'inclusions' => ['Accommodation', 'Meals', 'Safari', 'Transfers'],
                ],
            ],
        ];

        foreach ($samples as $sample) {
            $section = Section::where('slug', $sample['section'])->first();

            if (! $section) {
                continue;
            }

            $package = $this->createPackage($sample['package']);

            SectionPackage::updateOrCreate(
                [
                    'section_id' => $section->id,
                    'package_id' => $package->id,
                ],
                [
                    'display_order' => 0,
                    'is_featured' => true,
                ]
            );

            if (isset($sample['category'])) {
                SectionCategory::updateOrCreate(
                    [
                        'section_id' => $section->id,
                        'title' => $sample['category']['title'],
                    ],
                    array_merge($sample['category'], [
                        'sort_order' => 0,
                        'is_active' => true,
                    ])
                );
            }

            if (isset($sample['stat'])) {
                SectionStat::updateOrCreate(
                    [
                        'section_id' => $section->id,
                        'label' => $sample['stat']['label'],
                    ],
                    [
                        'value' => $sample['stat']['value'],
                        'sort_order' => 0,
                    ]
                );
            }
        }
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
                'tag' => $data['tag'],
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
