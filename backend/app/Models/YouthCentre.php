<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class YouthCentre extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'image',
        'location',
        'number_of_places',
        'available_formations',
        'available_activities',
        'description',
        'phone_number',
        'email',
        'website',
        'address',
        'wilaya',
        'commune',
        'latitude',
        'longitude',
        'is_active',
    ];

    protected $casts = [
        'available_formations' => 'array',
        'available_activities' => 'array',
        'is_active' => 'boolean',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'number_of_places' => 'integer',
    ];

    /**
     * Get all admins associated with this youth centre
     */
    public function admins()
    {
        return $this->hasMany(Admin::class);
    }
}
