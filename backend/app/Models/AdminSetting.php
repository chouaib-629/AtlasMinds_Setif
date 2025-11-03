<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdminSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'admin_id',
        'timezone',
        'language',
        'date_format',
        'notification_settings',
        'system_settings',
        'security_settings',
    ];

    protected $casts = [
        'notification_settings' => 'array',
        'system_settings' => 'array',
        'security_settings' => 'array',
    ];

    /**
     * Get the admin that owns the settings
     */
    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }
}

