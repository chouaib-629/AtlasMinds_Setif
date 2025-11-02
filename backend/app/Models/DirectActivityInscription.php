<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DirectActivityInscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'direct_activity_id',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'status' => 'string',
        ];
    }

    /**
     * Get the user who registered
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the direct activity for this inscription
     */
    public function directActivity(): BelongsTo
    {
        return $this->belongsTo(DirectActivity::class);
    }
}
