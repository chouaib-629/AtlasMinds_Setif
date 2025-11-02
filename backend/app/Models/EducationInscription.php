<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EducationInscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'education_id',
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
     * Get the education activity for this inscription
     */
    public function education(): BelongsTo
    {
        return $this->belongsTo(Education::class);
    }
}
