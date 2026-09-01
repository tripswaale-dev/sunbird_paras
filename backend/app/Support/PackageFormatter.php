<?php

namespace App\Support;

class PackageFormatter
{
    public static function durationFormatted(int $nights, int $days): string
    {
        return "{$nights} Nights / {$days} Days";
    }

    public static function durationShort(int $nights, int $days): string
    {
        return "{$nights}N / {$days}D";
    }
}
