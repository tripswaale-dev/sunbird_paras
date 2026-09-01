<?php

namespace Database\Seeders;

use App\Models\Package;
use App\Models\PackageDetail;
use App\Models\PackageFaq;
use App\Models\PackageImage;
use App\Models\PackageItineraryDay;
use Database\Seeders\Data\KashmirParadiseDetailData;
use Database\Seeders\Data\PackageSeedData;
use Illuminate\Database\Seeder;

class PackageDetailSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedAmenitiesAsInclusions();
        $this->seedKashmirParadiseFullDetails();
    }

    private function seedAmenitiesAsInclusions(): void
    {
        foreach (PackageSeedData::amenitiesBySlug() as $slug => $amenities) {
            if ($slug === 'kashmir-paradise') {
                continue;
            }

            $package = Package::where('slug', $slug)->first();

            if (! $package) {
                continue;
            }

            PackageDetail::updateOrCreate(
                ['package_id' => $package->id],
                [
                    'overview' => null,
                    'destinations' => null,
                    'sightseeing' => null,
                    'inclusions' => $amenities,
                    'exclusions' => null,
                    'highlights' => null,
                ]
            );
        }
    }

    private function seedKashmirParadiseFullDetails(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();

        if (! $package) {
            return;
        }

        $detail = KashmirParadiseDetailData::detail();

        PackageDetail::updateOrCreate(
            ['package_id' => $package->id],
            [
                'overview' => $detail['overview'],
                'destinations' => $detail['destinations'],
                'sightseeing' => $detail['sightseeing'],
                'inclusions' => $detail['inclusions'],
                'exclusions' => $detail['exclusions'],
                'highlights' => $detail['highlights'],
            ]
        );

        foreach (KashmirParadiseDetailData::itinerary() as $day) {
            PackageItineraryDay::updateOrCreate(
                [
                    'package_id' => $package->id,
                    'day' => $day['day'],
                ],
                [
                    'title' => $day['title'],
                    'description' => $day['description'],
                    'stay_information' => $day['stay_information'],
                    'notes' => $day['notes'] ?? null,
                    'images' => null,
                    'sort_order' => $day['day'],
                ]
            );
        }

        foreach (KashmirParadiseDetailData::faqs() as $index => $faq) {
            PackageFaq::updateOrCreate(
                [
                    'package_id' => $package->id,
                    'question' => $faq['question'],
                ],
                [
                    'answer' => $faq['answer'],
                    'sort_order' => $index,
                ]
            );
        }

        foreach (KashmirParadiseDetailData::images() as $index => $image) {
            PackageImage::updateOrCreate(
                [
                    'package_id' => $package->id,
                    'path' => $image['path'],
                ],
                [
                    'type' => $image['type'],
                    'alt_text' => $image['alt_text'],
                    'sort_order' => $index,
                ]
            );
        }
    }
}
