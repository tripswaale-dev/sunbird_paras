<?php

namespace Database\Seeders;

use App\Models\Package;
use Database\Seeders\Data\PackageSeedData;
use Database\Seeders\Support\DurationParser;
use Illuminate\Database\Seeder;

class PackageSeeder extends Seeder
{
    public function run(): void
    {
        $seen = [];

        foreach (PackageSeedData::all() as $item) {
            if (isset($seen[$item['slug']])) {
                continue;
            }

            $seen[$item['slug']] = true;
            $duration = DurationParser::parse($item['duration']);

            Package::updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'title' => $item['title'],
                    'subtitle' => $item['subtitle'],
                    'location' => $item['location'],
                    'price' => $item['price'],
                    'duration_nights' => $duration['nights'],
                    'duration_days' => $duration['days'],
                    'category' => $item['category'],
                    'tag' => $item['tag'],
                    'image' => $item['image'],
                    'pax' => $item['pax'],
                    'is_active' => $item['is_active'],
                    'is_indexable' => $item['is_indexable'],
                ]
            );
        }
    }
}
