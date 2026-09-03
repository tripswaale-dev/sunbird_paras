<?php

namespace Database\Seeders\Data;

/**
 * Canonical package seed data transcribed from frontend listing *Data.ts files.
 * Homepage-only fields (location, tag) merged from section-specific homepage files.
 */
class PackageSeedData
{
    public static function all(): array
    {
        $packages = array_merge(
            self::popularPackages(),
            self::travelPackages(),
            self::acrossBoundariesPackages(),
            self::hillPackages(),
            self::bestOfIndiaPackages(),
            self::spiritualPackages(),
            self::wildlifePackages(),
        );

        // Detail-only package from packages.ts (not in section listings)
        $packages[] = self::kashmirParadisePackage();

        return $packages;
    }

    public static function amenitiesBySlug(): array
    {
        $map = [];
        foreach (self::all() as $package) {
            if (! empty($package['amenities'])) {
                $map[$package['slug']] = $package['amenities'];
            }
        }

        return $map;
    }

    private static function base(string $slug, array $data): array
    {
        return array_merge([
            'slug' => $slug,
            'is_active' => true,
            'is_indexable' => true,
            'pax' => 2,
            'location' => null,
            'tag' => null,
            'subtitle' => null,
            'amenities' => [],
        ], $data);
    }

    private static function popularPackages(): array
    {
        $items = [
            ['spiti-valley', 'Spiti Valley', 'Mountains', '7 Nights / 8 Days', 28999, '/images/destinations/spiti.jpg', ['Accommodation', 'Meals', 'Sightseeing', 'Transfers']],
            ['heavenly-kashmir', 'Heavenly Kashmir', 'Mountains', '6 Nights / 7 Days', 24999, '/images/india/kashmir.jpg', ['Accommodation', 'Meals', 'Houseboat', 'Transfers']],
            ['secret-himachal', 'Secret Himachal', 'Mountains', '5 Nights / 6 Days', 19999, '/images/hills/himalayas.jpg', ['Accommodation', 'Meals', 'Sightseeing']],
            ['garhwal-escape', 'Garhwal Escape', 'Mountains', '5 Nights / 6 Days', 18999, '/images/spiritual/kedarnath.jpg', ['Accommodation', 'Meals', 'Sightseeing', 'Transfers']],
            ['colors-of-rajasthan', 'Colors of Rajasthan', 'Heritage', '7 Nights / 8 Days', 26999, '/images/india/rajasthan.jpg', ['Accommodation', 'Meals', 'Guide', 'Sightseeing']],
            ['andaman-escape', 'Andaman Escape', 'Beaches', '5 Nights / 6 Days', 34999, '/images/destinations/andaman.jpg', ['Accommodation', 'Meals', 'Ferry', 'Sightseeing']],
            ['misty-kerala', 'Misty Kerala', 'Beaches', '6 Nights / 7 Days', 21999, '/images/india/kerala.jpg', ['Accommodation', 'Meals', 'Houseboat', 'Transfers']],
            ['assam-and-meghalaya', 'Assam & Meghalaya', 'Mountains', '6 Nights / 7 Days', 29999, '/images/hills/northeast.jpg', ['Accommodation', 'Meals', 'Sightseeing', 'Transfers']],
            ['arunachal-the-last-frontier', 'Arunachal - The Last Frontier', 'Mountains', '7 Nights / 8 Days', 32999, '/images/hills/northeast.jpg', ['Accommodation', 'Meals', 'Permits', 'Transfers']],
            ['tirthan-valley', 'Tirthan Valley', 'Mountains', '4 Nights / 5 Days', 15999, '/images/hills/himalayas.jpg', ['Accommodation', 'Meals', 'Trekking', 'Transfers']],
            ['essence-of-nepal', 'Essence of Nepal', 'International', '6 Nights / 7 Days', 31999, '/images/international/nepal.jpg', ['Accommodation', 'Meals', 'Sightseeing', 'Transfers']],
            ['goa-waterfall-trail', 'Goa Waterfall Trail', 'Beaches', '4 Nights / 5 Days', 14999, '/images/india/goa.jpg', ['Accommodation', 'Breakfast', 'Sightseeing', 'Transfers']],
        ];

        return array_map(fn ($i) => self::base($i[0], [
            'title' => $i[1],
            'category' => $i[2],
            'duration' => $i[3],
            'price' => $i[4],
            'image' => $i[5],
            'amenities' => $i[6],
        ]), $items);
    }

    private static function travelPackages(): array
    {
        $items = [
            ['pkg-1', 'Udaipur Getaway', 'Pocket Friendly', '2 Nights / 3 Days', 7999, '/images/destinations/jaipur.jpg', ['Accommodation', 'Meals', 'Sightseeing']],
            ['pkg-2', 'Coorg Weekend', 'Adventure & Thrill', '2 Nights / 3 Days', 7999, '/images/hills/southern-hills.jpg', ['Accommodation', 'Meals', 'Sightseeing']],
            ['pkg-3', 'Spiti Valley Circuit', 'Off Beat', '7 Nights / 8 Days', 28999, '/images/destinations/spiti.jpg', ['Accommodation', 'Meals', 'Sightseeing']],
            ['pkg-4', 'Andaman Couple Retreat', 'Couple Getaways', '5 Nights / 6 Days', 34999, '/images/destinations/andaman.jpg', ['Accommodation', 'Meals', 'Sightseeing']],
        ];

        return array_map(fn ($i) => self::base($i[0], [
            'title' => $i[1],
            'category' => $i[2],
            'duration' => $i[3],
            'price' => $i[4],
            'image' => $i[5],
            'amenities' => $i[6],
        ]), $items);
    }

    private static function acrossBoundariesPackages(): array
    {
        $items = [
            ['intl-1', 'Mesmerizing Sri Lanka', 'All International', '3 Nights / 4 Days', 35999, '/images/international/srilanka.jpg', 'SRI LANKA', ['Accommodation', 'Meals', 'Sightseeing', 'Transfers']],
            ['intl-2', 'Highlights of Nepal', 'All International', '4 Nights / 5 Days', 25999, '/images/international/nepal.jpg', 'NEPAL', ['Accommodation', 'Meals', 'Sightseeing']],
            ['intl-3', 'Maldives Gateway', 'Beach Escapes', '4 Nights / 5 Days', 65999, '/images/international/maldives.jpg', 'MALDIVES', ['Accommodation', 'Meals', 'Water Sports', 'Transfers']],
            ['intl-4', 'Dubai Desert Safari', 'Desert Safaris', '4 Nights / 5 Days', 48999, '/images/international/dubai.jpg', 'DUBAI', ['Accommodation', 'Breakfast', 'Sightseeing', 'Desert Safari']],
            ['intl-5', 'Bali Retreat', 'Beach Escapes', '5 Nights / 6 Days', 47500, '/images/international/bali.jpg', 'BALI', ['Accommodation', 'Meals', 'Sightseeing', 'Transfers']],
        ];

        return array_map(fn ($i) => self::base($i[0], [
            'title' => $i[1],
            'category' => $i[2],
            'duration' => $i[3],
            'price' => $i[4],
            'image' => $i[5],
            'location' => $i[6],
            'amenities' => $i[7],
        ]), $items);
    }

    private static function hillPackages(): array
    {
        $items = [
            ['hill-1', 'Shimla Manali Tour', 'Northern Himalayas', '5 Nights / 6 Days', 12999, '/images/hills/himalayas.jpg', ['Accommodation', 'Meals', 'Sightseeing', 'Transfers']],
            ['hill-2', 'Darjeeling & Gangtok', 'North-East', '4 Nights / 5 Days', 15999, '/images/hills/northeast.jpg', ['Accommodation', 'Meals', 'Sightseeing', 'Transfers']],
            ['hill-3', 'Munnar & Ooty Escape', 'Southern Hill Escape', '4 Nights / 5 Days', 14500, '/images/hills/southern-hills.jpg', ['Accommodation', 'Meals', 'Sightseeing', 'Transfers']],
        ];

        return array_map(fn ($i) => self::base($i[0], [
            'title' => $i[1],
            'category' => $i[2],
            'duration' => $i[3],
            'price' => $i[4],
            'image' => $i[5],
            'amenities' => $i[6],
        ]), $items);
    }

    private static function bestOfIndiaPackages(): array
    {
        $items = [
            ['golden-triangle', 'Golden Triangle', 'North', '5 Nights / 6 Days', 18999, '/images/india/rajasthan.jpg', ['Accommodation', 'Meals', 'Sightseeing', 'Transfers']],
            ['ladakh-explorer', 'Ladakh Explorer', 'North', '6 Nights / 7 Days', 25999, '/images/india/ladakh.jpg', ['Accommodation', 'Meals', 'Sightseeing', 'Transfers']],
            ['heritage-rajasthan', 'Heritage Rajasthan', 'West', '7 Nights / 8 Days', 28999, '/images/india/rajasthan.jpg', ['Accommodation', 'Meals', 'Sightseeing', 'Guide']],
            ['classic-himachal', 'Classic Himachal', 'North', '6 Nights / 7 Days', 22999, '/images/hills/himalayas.jpg', ['Accommodation', 'Meals', 'Sightseeing', 'Transfers']],
            ['sikkim-and-darjeeling', 'Sikkim & Darjeeling', 'East', '6 Nights / 7 Days', 27999, '/images/hills/northeast.jpg', ['Accommodation', 'Meals', 'Sightseeing', 'Transfers']],
            ['western-coastal-trail', 'Western Coastal Trail (Goa & Gokarna)', 'West', '5 Nights / 6 Days', 19999, '/images/india/goa.jpg', ['Accommodation', 'Meals', 'Sightseeing', 'Transfers']],
            ['serene-kerala-with-rameshwaram', 'Serene Kerala with Rameshwaram', 'South', '7 Nights / 8 Days', 31999, '/images/india/kerala.jpg', ['Accommodation', 'Meals', 'Sightseeing', 'Transfers']],
            ['holy-ganges-quest', 'Holy Ganges Quest', 'North', '4 Nights / 5 Days', 15999, '/images/spiritual/varanasi.jpg', ['Accommodation', 'Meals', 'Sightseeing', 'Transfers']],
            ['dunes-and-dynasties', 'Dunes & Dynasties', 'West', '6 Nights / 7 Days', 24999, '/images/india/rajasthan.jpg', ['Accommodation', 'Meals', 'Sightseeing', 'Transfers']],
            ['kerala-coastal-circuit', 'Kerala Coastal Circuit', 'South', '5 Nights / 6 Days', 21999, '/images/india/kerala.jpg', ['Accommodation', 'Meals', 'Sightseeing', 'Transfers']],
            ['southern-odyssey', 'Southern Odyssey (Kerala & Tamil Nadu)', 'South', '8 Nights / 9 Days', 36999, '/images/india/kerala.jpg', ['Accommodation', 'Meals', 'Sightseeing', 'Transfers']],
            ['andaman-island-bliss', 'Andaman Island Bliss', 'South', '6 Nights / 7 Days', 35999, '/images/destinations/andaman.jpg', ['Accommodation', 'Meals', 'Ferry', 'Transfers']],
            ['kashmir-in-bloom', 'Kashmir in Bloom', 'North', '5 Nights / 6 Days', 23999, '/images/india/kashmir.jpg', ['Accommodation', 'Meals', 'Sightseeing', 'Transfers']],
            ['river-retreat-haridwar-rishikesh', 'River Retreat - Haridwar & Rishikesh', 'North', '3 Nights / 4 Days', 12999, '/images/spiritual/chardham.jpg', ['Accommodation', 'Meals', 'Sightseeing', 'Transfers']],
        ];

        return array_map(fn ($i) => self::base($i[0], [
            'title' => $i[1],
            'category' => $i[2],
            'duration' => $i[3],
            'price' => $i[4],
            'image' => $i[5],
            'amenities' => $i[6],
        ]), $items);
    }

    private static function spiritualPackages(): array
    {
        $items = [
            ['char-dham-yatra', 'Char Dham Yatra', 'Pilgrimage', '9 Nights / 10 Days', 28999, '/images/spiritual/chardham.jpg', 'Uttarakhand, India', 'Pilgrimage', ['Accommodation', 'Meals', 'Transfers', 'Darshan']],
            ['do-dham-yatra', 'Do Dham Yatra', 'Pilgrimage', '5 Nights / 6 Days', 18999, '/images/spiritual/kedarnath.jpg', 'Uttarakhand, India', 'Pilgrimage', ['Accommodation', 'Meals', 'Transfers', 'Darshan']],
            ['river-retreat-haridwar-rishikesh', 'River Retreat - Haridwar & Rishikesh', 'Retreats', '3 Nights / 4 Days', 12999, '/images/spiritual/chardham.jpg', 'Uttarakhand, India', 'Retreats', ['Accommodation', 'Meals', 'Sightseeing', 'Transfers']],
            ['coastal-temples-of-gujarat', 'Coastal Temples of Gujarat', 'Temple Tours', '6 Nights / 7 Days', 22999, '/images/india/rajasthan.jpg', 'Gujarat, India', 'Temple Tours', ['Accommodation', 'Meals', 'Transfers', 'Darshan']],
            ['divine-jyotirlinga-darshan', 'Divine Jyotirlinga Darshan', 'Pilgrimage', '7 Nights / 8 Days', 26999, '/images/spiritual/varanasi.jpg', 'Multiple States', 'Pilgrimage', ['Accommodation', 'Meals', 'Transfers', 'Darshan']],
            ['abode-on-hills-vaishnodevi', 'Abode on Hills - Vaishnodevi', 'Pilgrimage', '3 Nights / 4 Days', 11999, '/images/india/kashmir.jpg', 'Jammu & Kashmir', 'Pilgrimage', ['Accommodation', 'Meals', 'Transfers', 'Darshan']],
            ['sacred-triveni-yatra', 'Sacred Triveni Yatra', 'Pilgrimage', '4 Nights / 5 Days', 14999, '/images/spiritual/varanasi.jpg', 'Uttar Pradesh', 'Pilgrimage', ['Accommodation', 'Meals', 'Transfers', 'Darshan']],
            ['krishna-leela-yatra', 'Krishna Leela Yatra', 'Temple Tours', '4 Nights / 5 Days', 13999, '/images/spiritual/varanasi.jpg', 'Uttar Pradesh', 'Temple Tours', ['Accommodation', 'Meals', 'Transfers', 'Darshan']],
            ['jagannathpuri-darshan', 'Jagannathpuri Darshan', 'Temple Tours', '3 Nights / 4 Days', 12500, '/images/india/goa.jpg', 'Odisha, India', 'Temple Tours', ['Accommodation', 'Meals', 'Transfers', 'Darshan']],
        ];

        return array_map(fn ($i) => self::base($i[0], [
            'title' => $i[1],
            'category' => $i[2],
            'duration' => $i[3],
            'price' => $i[4],
            'image' => $i[5],
            'location' => $i[6],
            'tag' => $i[7],
            'amenities' => $i[8],
        ]), $items);
    }

    private static function wildlifePackages(): array
    {
        $items = [
            ['leopard-land-jawai', 'Leopard Land - Jawai', 'Tiger Safari', '2 Nights / 3 Days', 14999, '/images/wildlife/leopard.jpg', 'JAWAI', ['Accommodation', 'Meals', 'Safari', 'Guide']],
            ['kaziranga-wilderness', 'Kaziranga Wilderness', 'Nature Walks', '3 Nights / 4 Days', 17999, '/images/wildlife/rhino.jpg', 'KAZIRANGA', ['Accommodation', 'Meals', 'Jeep Safari', 'Transfers']],
            ['central-land-of-tigers-kanha-bandhavgarh', 'Central Land of Tigers - Kanha & Bandhavgarh', 'Tiger Safari', '5 Nights / 6 Days', 29999, '/images/wildlife/tiger.jpg', 'MADHYA PRADESH', ['Accommodation', 'Meals', 'Safari', 'Transfers']],
            ['roar-of-gir', 'Roar of Gir', 'Nature Walks', '3 Nights / 4 Days', 16999, '/images/wildlife/leopard.jpg', 'GUJARAT', ['Accommodation', 'Meals', 'Safari', 'Transfers']],
            ['royal-ranthambore', 'Royal Ranthambore', 'Tiger Safari', '3 Nights / 4 Days', 18999, '/images/wildlife/tiger.jpg', 'RAJASTHAN', ['Accommodation', 'Meals', 'Safari', 'Transfers']],
            ['discover-corbett', 'Discover Corbett', 'Nature Walks', '2 Nights / 3 Days', 13999, '/images/wildlife/tiger.jpg', 'UTTARAKHAND', ['Accommodation', 'Meals', 'Safari', 'Transfers']],
        ];

        return array_map(fn ($i) => self::base($i[0], [
            'title' => $i[1],
            'category' => $i[2],
            'duration' => $i[3],
            'price' => $i[4],
            'image' => $i[5],
            'location' => $i[6],
            'amenities' => $i[7],
        ]), $items);
    }

    private static function kashmirParadisePackage(): array
    {
        return self::base('kashmir-paradise', [
            'title' => 'Kashmir Paradise',
            'subtitle' => 'Experience the Heaven on Earth',
            'category' => null,
            'duration' => '6 Nights / 7 Days',
            'price' => 7999,
            'image' => '/images/india/kashmir.jpg',
            'amenities' => [],
        ]);
    }

    /** Section slug => ordered package slugs for homepage display */
    public static function sectionAssignments(): array
    {
        return [
            'popular-destinations' => [
                'pkg-1',
                'spiti-valley', 'heavenly-kashmir', 'secret-himachal', 'garhwal-escape',
                'colors-of-rajasthan', 'andaman-escape', 'misty-kerala', 'assam-and-meghalaya',
                'arunachal-the-last-frontier', 'tirthan-valley', 'essence-of-nepal', 'goa-waterfall-trail',
            ],
            'travel-your-way' => ['pkg-1', 'pkg-2', 'pkg-3', 'pkg-4'],
            'across-boundaries' => ['intl-1', 'intl-2', 'intl-3', 'intl-4', 'intl-5'],
            'gateway-to-the-hills' => ['hill-1', 'hill-2', 'hill-3'],
            'best-of-india' => [
                'pkg-1',
                'golden-triangle', 'ladakh-explorer', 'heritage-rajasthan', 'classic-himachal',
                'sikkim-and-darjeeling', 'western-coastal-trail', 'serene-kerala-with-rameshwaram',
                'holy-ganges-quest', 'dunes-and-dynasties', 'kerala-coastal-circuit', 'southern-odyssey',
                'andaman-island-bliss', 'kashmir-in-bloom', 'river-retreat-haridwar-rishikesh',
            ],
            'spiritual-destinations' => [
                'char-dham-yatra', 'do-dham-yatra', 'river-retreat-haridwar-rishikesh',
                'coastal-temples-of-gujarat', 'divine-jyotirlinga-darshan', 'abode-on-hills-vaishnodevi',
                'sacred-triveni-yatra', 'krishna-leela-yatra', 'jagannathpuri-darshan',
            ],
            'explore-wild-india' => [
                'leopard-land-jawai', 'kaziranga-wilderness', 'central-land-of-tigers-kanha-bandhavgarh',
                'roar-of-gir', 'royal-ranthambore', 'discover-corbett',
            ],
        ];
    }
}
