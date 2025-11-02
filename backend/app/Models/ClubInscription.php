<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClubInscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'club_id',
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
     * Get the club activity for this inscription
     */
    public function club(): BelongsTo
    {
        return $this->belongsTo(Club::class);
    }
}
