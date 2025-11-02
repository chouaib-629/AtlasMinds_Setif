<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DirectActivity extends Model
{
    use HasFactory;

    protected $table = 'direct_activities';

    protected $fillable = [
        'title',
        'description',
        'category',
        'date',
        'time',
        'location',
        'attendance_type',
        'organizer',
        'organizer_contact',
        'admin_id',
        'center_id',
        'center_name',
        'price',
        'has_price',
        'participants',
        'capacity',
        'image_url',
        'is_featured',
        'is_active',
        'status',
        'votes',
        'target_audience',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'datetime',
            'price' => 'decimal:2',
            'has_price' => 'boolean',
            'participants' => 'integer',
            'capacity' => 'integer',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the admin that created this direct activity
     */
    public function admin(): BelongsTo
    {
        return $this->belongsTo(Admin::class);
    }

    /**
     * Get all inscriptions for this direct activity
     */
    public function inscriptions(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(DirectActivityInscription::class);
    }
}
