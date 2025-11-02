<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Livestream extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'stream_url',
        'is_live',
        'event_id',
        'admin_id',
    ];

    protected function casts(): array
    {
        return [
            'is_live' => 'boolean',
        ];
    }

    /**
     * Get the event this livestream belongs to
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    /**
     * Get the admin who created this livestream
     */
    public function admin(): BelongsTo
    {
        return $this->belongsTo(Admin::class);
    }
}
