<?php

namespace Database\Seeders;

use App\Models\Package;
use App\Models\PackageDetail;
use App\Models\Section;
use App\Models\SectionPackage;
use Database\Seeders\Support\DurationParser;
use Illuminate\Database\Seeder;

/**
 * Seeds the five Popular Destinations packages matching live sunbirdvacations.com.
 */
class PopularDestinationsSeeder extends Seeder
{
    public function run(): void
    {
        $section = Section::where('slug', 'popular-destinations')->first();

        if (! $section) {
            $this->call(SectionSeeder::class);
            $section = Section::where('slug', 'popular-destinations')->first();
        }

        if (! $section) {
            return;
        }

        $packages = [
            [
                'slug' => 'essence-of-nepal',
                'title' => 'Essence of Nepal',
                'location' => 'Nepal',
                'price' => 28500,
                'duration' => '5N / 6D',
                'category' => 'International',
                'image' => '/images/international/nepal.jpg',
                'inclusions' => ['Accommodation', 'Meals', 'Sightseeing', 'Transfers'],
                'overview' => 'Ancient temples, Himalayan panoramas, peaceful lakes and untamed jungle come together in this introduction to Nepal. Essence of Nepal blends the cultural charm of Kathmandu, the natural beauty of Pokhara, and the wildlife of Chitwan.',
            ],
            [
                'slug' => 'spiti-valley',
                'title' => 'Spiti Valley',
                'location' => 'Himachal Pradesh',
                'price' => 42000,
                'duration' => '10N / 11D',
                'category' => 'Mountains',
                'image' => '/images/destinations/spiti.jpg',
                'inclusions' => ['Accommodation', 'Meals', 'Sightseeing', 'Transfers'],
                'overview' => 'From the lush valleys of Kinnaur and the ancient monasteries of Tabo and Key to the pristine waters of Chandratal Lake, this thoughtfully curated expedition offers the perfect blend of adventure, culture, and high-altitude beauty.',
            ],
            [
                'slug' => 'explore-arunachal',
                'title' => 'Explore Arunachal',
                'location' => 'Arunachal Pradesh',
                'price' => 33700,
                'duration' => '6N / 7D',
                'category' => 'Mountains',
                'image' => '/images/hills/northeast.jpg',
                'inclusions' => ['Accommodation', 'Meals', 'Permits', 'Transfers'],
                'overview' => 'Journey into the Eastern most Himalayas of India where winding mountain roads lead to ancient monasteries, high-altitude lakes, dramatic waterfalls, and snow-covered passes. Arunachal brings together culture, nature, and adventure.',
            ],
            [
                'slug' => 'tirthan-valley',
                'title' => 'Tirthan Valley',
                'location' => 'Himachal Pradesh',
                'price' => 21400,
                'duration' => '4N / 5D',
                'category' => 'Mountains',
                'image' => '/images/hills/himalayas.jpg',
                'inclusions' => ['Accommodation', 'Meals', 'Trekking', 'Transfers'],
                'overview' => 'Escape into a quieter side of Himachal, where wooden cottages sit beside mountain streams, pine forests surround tiny villages, and the pace of life slows down. Tirthan Valley is a refreshing offbeat Himalayan getaway.',
            ],
            [
                'slug' => 'heavenly-kashmir',
                'title' => 'Heavenly Kashmir',
                'location' => 'Jammu & Kashmir',
                'price' => 29000,
                'duration' => '6N / 7D',
                'category' => 'Mountains',
                'image' => '/images/india/kashmir.jpg',
                'inclusions' => ['Accommodation', 'Meals', 'Houseboat', 'Transfers'],
                'overview' => 'Experience the heaven on earth with serene lakes, snow-capped peaks, Mughal gardens, and houseboat stays. Heavenly Kashmir is a classic introduction to the valley\'s beauty and culture.',
            ],
        ];

        foreach ($packages as $order => $data) {
            $package = $this->createPackage($data);

            SectionPackage::updateOrCreate(
                [
                    'section_id' => $section->id,
                    'package_id' => $package->id,
                ],
                [
                    'display_order' => $order,
                    'is_featured' => $order < 5,
                ]
            );
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
                'overview' => $data['overview'],
                'destinations' => [$data['location']],
                'inclusions' => $data['inclusions'],
                'exclusions' => ['Flights', 'Personal expenses'],
                'highlights' => ['Expert local support', 'Curated stays', 'Transparent inclusions'],
            ]
        );

        return $package;
    }
}
