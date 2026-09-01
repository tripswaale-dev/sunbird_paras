<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('package_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('package_id')->unique()->constrained('packages')->cascadeOnDelete();
            $table->text('overview')->nullable();
            $table->json('destinations')->nullable();
            $table->json('sightseeing')->nullable();
            $table->json('inclusions')->nullable();
            $table->json('exclusions')->nullable();
            $table->json('highlights')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('package_details');
    }
};
