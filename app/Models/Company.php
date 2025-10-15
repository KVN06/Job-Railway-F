<?php

namespace App\Models;

use App\Models\Concerns\AppliesApiScopes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    use HasFactory;
    use AppliesApiScopes;

    protected $fillable = [
        'user_id',
        'name',
        'email',
        'nit',
        'logo',
        'company_name',
        'description',
        'website',
    ];

    protected array $allowIncluded = ['user'];

    protected array $allowFilter = ['name', 'company_name', 'description', 'website'];

    protected array $allowSort = ['name', 'company_name', 'created_at'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function jobOffers(): HasMany
    {
        return $this->hasMany(JobOffer::class);
    }

}
