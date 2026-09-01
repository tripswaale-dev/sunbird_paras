<?php

namespace Database\Seeders;

use App\Models\GalleryItem;
use Database\Seeders\Data\GallerySeedData;
use Illuminate\Database\Seeder;

class GallerySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (GallerySeedData::items() as $item) {
            GalleryItem::updateOrCreate(
                ['external_id' => $item['external_id']],
                $item
            );
        }
    }
}
