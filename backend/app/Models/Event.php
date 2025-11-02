<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'type',
        'attendance_type',
        'date',
        'location',
        'admin_id',
        'price',
        'has_price',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'datetime',
            'price' => 'decimal:2',
            'has_price' => 'boolean',
        ];
    }

    /**
     * Get the admin that created this event
     */
    public function admin(): BelongsTo
    {
        return $this->belongsTo(Admin::class);
    }

    /**
     * Get all payments for this event
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Get all inscriptions for this event
     */
    public function inscriptions(): HasMany
    {
        return $this->hasMany(EventInscription::class);
    }

    /**
     * Get all chats for this event
     */
    public function chats(): HasMany
    {
        return $this->hasMany(Chat::class);
    }

    /**
     * Get all livestreams for this event
     */
    public function livestreams(): HasMany
    {
        return $this->hasMany(Livestream::class);
    }
}
