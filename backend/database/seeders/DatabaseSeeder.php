<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            SectionSeeder::class,
            PackageSeeder::class,
            SectionPackageSeeder::class,
            SectionCategorySeeder::class,
            SectionStatSeeder::class,
            PackageDetailSeeder::class,
            BlogSeeder::class,
            GallerySeeder::class,
            DestinationCategorySeeder::class,
            PageSeoSeeder::class,
            PageContentSeeder::class,
            HomepageHeroSeeder::class,
            CustomerPromiseItemSeeder::class,
            AdminSeeder::class,
        ]);
    }
}
