<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Education extends Model
{
    use HasFactory;

    protected $table = 'educations';

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
        'duration',
        'level',
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
     * Get the admin that created this education activity
     */
    public function admin(): BelongsTo
    {
        return $this->belongsTo(Admin::class);
    }

    /**
     * Get all inscriptions for this education activity
     */
    public function inscriptions(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(EducationInscription::class);
    }
}
