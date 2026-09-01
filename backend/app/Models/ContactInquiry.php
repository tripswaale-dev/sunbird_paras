<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactInquiry extends Model
{
    public const SUBJECT_GENERAL = 'general';

    public const SUBJECT_BOOKING = 'booking';

    public const SUBJECT_CUSTOM = 'custom';

    public const SUBJECT_SUPPORT = 'support';

    public const SUBJECTS = [
        self::SUBJECT_GENERAL,
        self::SUBJECT_BOOKING,
        self::SUBJECT_CUSTOM,
        self::SUBJECT_SUPPORT,
    ];

    protected $fillable = [
        'first_name',
        'last_name',
        'phone',
        'subject',
        'message',
        'ip_address',
        'user_agent',
    ];
}
