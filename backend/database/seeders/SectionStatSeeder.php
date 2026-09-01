<?php

namespace Database\Seeders;

use App\Models\Section;
use App\Models\SectionStat;
use Illuminate\Database\Seeder;

class SectionStatSeeder extends Seeder
{
    public function run(): void
    {
        $section = Section::where('slug', 'popular-destinations')->first();

        if (! $section) {
            return;
        }

        $stats = [
            ['value' => '2+', 'label' => 'years of experience'],
            ['value' => '90+', 'label' => 'happy travellers'],
            ['value' => '50+', 'label' => 'curated travel packages'],
            ['value' => '15+', 'label' => 'destinations covered'],
        ];

        foreach ($stats as $order => $stat) {
            SectionStat::updateOrCreate(
                [
                    'section_id' => $section->id,
                    'value' => $stat['value'],
                    'label' => $stat['label'],
                ],
                ['sort_order' => $order]
            );
        }
    }
}
