<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('section_packages', function (Blueprint $table) {
            $table->string('listing_category', 100)->nullable()->after('is_featured');
        });

        $assignments = DB::table('section_packages')->get(['id', 'section_id', 'package_id']);

        foreach ($assignments as $assignment) {
            $packageCategory = DB::table('packages')
                ->where('id', $assignment->package_id)
                ->value('category');

            if (! is_string($packageCategory) || trim($packageCategory) === '') {
                continue;
            }

            $trimmed = trim($packageCategory);

            $matchesSectionTab = DB::table('section_categories')
                ->where('section_id', $assignment->section_id)
                ->where(function ($query) use ($trimmed) {
                    $query->where('filter_value', $trimmed)
                        ->orWhere('title', $trimmed);
                })
                ->exists();

            if ($matchesSectionTab) {
                DB::table('section_packages')
                    ->where('id', $assignment->id)
                    ->update(['listing_category' => $trimmed]);
            }
        }
    }

    public function down(): void
    {
        Schema::table('section_packages', function (Blueprint $table) {
            $table->dropColumn('listing_category');
        });
    }
};
