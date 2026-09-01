<?php

namespace Database\Seeders;

use App\Models\Package;
use App\Models\Section;
use App\Models\SectionPackage;
use Database\Seeders\Data\PackageSeedData;
use Illuminate\Database\Seeder;

class SectionPackageSeeder extends Seeder
{
    public function run(): void
    {
        foreach (PackageSeedData::sectionAssignments() as $sectionSlug => $packageSlugs) {
            $section = Section::where('slug', $sectionSlug)->first();

            if (! $section) {
                continue;
            }

            foreach ($packageSlugs as $order => $packageSlug) {
                $package = Package::where('slug', $packageSlug)->first();

                if (! $package) {
                    continue;
                }

                SectionPackage::updateOrCreate(
                    [
                        'section_id' => $section->id,
                        'package_id' => $package->id,
                    ],
                    [
                        'display_order' => $order,
                        'is_featured' => false,
                    ]
                );
            }
        }
    }
}
