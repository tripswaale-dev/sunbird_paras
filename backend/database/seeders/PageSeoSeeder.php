<?php

namespace Database\Seeders;

use App\Models\PageSeo;
use Illuminate\Database\Seeder;

class PageSeoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $records = [
            PageSeo::PAGE_KEY_HOME => [
                'meta_title' => 'Sunbird Vacations — Your dream vacays start here!',
                'meta_description' => 'Sunbird Vacations offers premium travel experiences across India and beyond. Explore breathtaking destinations, curated tour packages, and unforgettable adventures.',
            ],
            PageSeo::PAGE_KEY_GALLERY => [
                'meta_title' => 'Gallery',
                'meta_description' => 'Explore our curated collection of stunning travel moments and beautiful destinations.',
            ],
            PageSeo::PAGE_KEY_PACKAGES => [
                'meta_title' => 'Tour Packages | Sunbird Vacations',
                'meta_description' => 'Explore our premium tour packages to beautiful destinations including Kashmir, Kerala, Ladakh, and more.',
            ],
            PageSeo::PAGE_KEY_SEARCH => [
                'meta_title' => 'Search Results | Sunbird Vacations',
                'meta_description' => 'Search for your next dream vacation package across India and beyond.',
            ],
            PageSeo::PAGE_KEY_BLOGS => [
                'meta_title' => 'Travel Blogs | Sunbird Vacations',
                'meta_description' => 'Read the latest travel tips, destination guides, and stories from Sunbird Vacations.',
            ],
            PageSeo::PAGE_KEY_ABOUT => [
                'meta_title' => 'About Us | Sunbird Vacations',
                'meta_description' => 'Learn about Sunbird Vacations and our passion for crafting premium travel experiences across India and beyond.',
            ],
            PageSeo::PAGE_KEY_CONTACT => [
                'meta_title' => 'Contact Us | Sunbird Vacations',
                'meta_description' => 'Get in touch with our travel experts to plan your dream vacation. We are here to answer your questions and design your perfect itinerary.',
            ],
            PageSeo::PAGE_KEY_PAYMENT_POLICY => [
                'meta_title' => 'Payment Policy | Sunbird Vacations',
                'meta_description' => 'Learn about our payment policies and terms for your bookings with Sunbird Vacations.',
            ],
            PageSeo::PAGE_KEY_CANCELLATION_POLICY => [
                'meta_title' => 'Cancellation & Refund Policy | Sunbird Vacations',
                'meta_description' => 'Learn about our cancellation, refund, and payment policies for your bookings with Sunbird Vacations.',
            ],
        ];

        foreach ($records as $pageKey => $seo) {
            PageSeo::updateOrCreate(
                ['page_key' => $pageKey],
                array_merge($seo, [
                    'canonical_url' => null,
                    'og_image' => null,
                    'is_indexable' => true,
                ])
            );
        }
    }
}
