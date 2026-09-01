<?php

namespace Database\Seeders\Support;

class DurationParser
{
    /**
     * Parse duration strings from frontend static data.
     *
     * Supports:
     * - "7 Nights / 8 Days"
     * - "6N / 7D"
     */
    public static function parse(string $duration): array
    {
        if (preg_match('/(\d+)\s*N(?:ights?)?\s*\/\s*(\d+)\s*D(?:ays?)?/i', $duration, $matches)) {
            return [
                'nights' => (int) $matches[1],
                'days' => (int) $matches[2],
            ];
        }

        if (preg_match('/(\d+)\s*Nights?\s*\/\s*(\d+)\s*Days?/i', $duration, $matches)) {
            return [
                'nights' => (int) $matches[1],
                'days' => (int) $matches[2],
            ];
        }

        return ['nights' => 0, 'days' => 0];
    }
}
