<?php

namespace Database\Seeders;

use App\Models\HomepageHero;
use Illuminate\Database\Seeder;

class HomepageHeroSeeder extends Seeder
{
    public function run(): void
    {
        HomepageHero::updateOrCreate(
            ['id' => HomepageHero::SINGLETON_ID],
            [
                'background_video' => '/bg1.mp4',
                'chips' => [
                    ['icon' => HomepageHero::ICON_MOUNTAIN, 'label' => 'Mountains'],
                    ['icon' => HomepageHero::ICON_UMBRELLA, 'label' => 'Beaches'],
                    ['icon' => HomepageHero::ICON_TREE_PINE, 'label' => 'Nature'],
                ],
                'featured_chip' => [
                    'icon' => HomepageHero::ICON_MAP_PIN,
                    'label' => 'Trending in India',
                ],
                'is_active' => true,
            ]
        );
    }
}
