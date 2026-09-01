<?php

namespace Database\Seeders;

use App\Models\CustomerPromiseItem;
use Illuminate\Database\Seeder;

class CustomerPromiseItemSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            [
                'id' => 1,
                'title' => 'We Listen',
                'description' => 'Facing an issue on your trip? Reach us out anytime. We are all ears.',
                'icon' => CustomerPromiseItem::ICON_HEADPHONES,
                'sort_order' => 1,
            ],
            [
                'id' => 2,
                'title' => 'We Act Fast',
                'description' => 'Our team works immediately to resolve the problem.',
                'icon' => CustomerPromiseItem::ICON_ALARM_CLOCK,
                'sort_order' => 2,
            ],
            [
                'id' => 3,
                'title' => 'We Take Responsibility',
                'description' => 'If the issue is from our end, we take full responsibility and make it right.',
                'icon' => CustomerPromiseItem::ICON_HANDSHAKE,
                'sort_order' => 3,
            ],
            [
                'id' => 4,
                'title' => 'We Stay with You',
                'description' => 'From start to end, we are with you at every step of your journey.',
                'icon' => CustomerPromiseItem::ICON_USERS,
                'sort_order' => 4,
            ],
        ];

        foreach ($items as $item) {
            CustomerPromiseItem::updateOrCreate(
                ['id' => $item['id']],
                array_merge($item, ['is_active' => true])
            );
        }
    }
}
