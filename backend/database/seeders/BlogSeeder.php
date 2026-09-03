<?php

namespace Database\Seeders;

use App\Models\Blog;
use Illuminate\Database\Seeder;

class BlogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $contentBlocks = [
            [
                'type' => 'heading',
                'text' => 'How Sunbird Vacations began',
            ],
            [
                'type' => 'paragraph',
                'text' => 'Two years ago, Sunbird Vacations was born from a simple dream—to transform a passion for travel into meaningful experiences for others. What started as an idea has now grown into a travel company built on trust, personalized service, and the joy of helping people explore the world with confidence.',
            ],
            [
                'type' => 'paragraph',
                'text' => "Hi, I'm Shwetangi, the founder of Sunbird Vacations. Like many travelers, I have always believed that every journey has the power to teach, inspire, and create lifelong memories. From wandering through peaceful mountain villages and exploring vibrant cities to witnessing breathtaking sunsets by the sea, travel has always been more than just a hobby for me—it has been a way of life.",
            ],
            [
                'type' => 'image',
                'image' => '/images/destinations/ladakh.jpg',
                'alt' => 'Mountain landscape in Ladakh',
                'caption' => 'Thoughtfully planned journeys across India.',
            ],
            [
                'type' => 'subheading',
                'text' => 'Designed with care',
            ],
            [
                'type' => 'paragraph',
                'text' => "During my own travels, I realized that planning a holiday isn't always easy. Finding the right hotels, trustworthy local partners, seamless transportation, and well-crafted itineraries can often become overwhelming. That's when I decided to create Sunbird Vacations—a company that doesn't just book trips but designs experiences with care, attention to detail, and a personal touch.",
            ],
            [
                'type' => 'paragraph',
                'text' => "At Sunbird Vacations, we believe that travel isn't always about perfect plans—it's about unforgettable experiences. While we meticulously plan every journey, unexpected situations like weather changes, traffic, flight delays, or local restrictions can sometimes arise. What truly matters is knowing that you're never alone.",
            ],
            [
                'type' => 'paragraph',
                'text' => "Welcome to Sunbird Vacations—where every journey is thoughtfully planned and every traveller returns home with memories to cherish for a lifetime.",
            ],
        ];

        Blog::updateOrCreate(
            ['slug' => 'story-behind-sunbird-vacations'],
            [
                'title' => 'The Story Behind Sunbird Vacations',
                'excerpt' => '"Travel isn\'t just about reaching a destination. It\'s about collecting stories, creating memories, and discovering a part of yourself along the way."',
                'content_blocks' => $contentBlocks,
                'content' => collect($contentBlocks)
                    ->filter(fn (array $block) => in_array($block['type'], ['heading', 'subheading', 'paragraph'], true))
                    ->pluck('text')
                    ->implode("\n\n"),
                'author' => 'Shwetangi',
                'category' => 'Story',
                'image' => '/images/destinations/ladakh.jpg',
                'published_at' => '2026-07-13 00:00:00',
                'read_time_label' => '3 min read',
                'is_active' => true,
            ]
        );
    }
}
