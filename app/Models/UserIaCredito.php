<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $ip_address
 * @property int $creditos_disponibles
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property bool $has_credits
 */
class UserIaCredito extends Model
{
    protected $fillable = [
        'user_id',
        'creditos_disponibles',
    ];

    protected function casts(): array
    {
        return [
            'creditos_disponibles' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Accessor
    protected function hasCredits(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->creditos_disponibles > 0,
        );
    }
}
