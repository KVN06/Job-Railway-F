<?php

namespace App\Models;

use App\Models\Concerns\AppliesApiScopes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Unemployed extends Model
{
    use HasFactory;
    use AppliesApiScopes;

    protected $fillable = [
        'user_id',
        'profession',
        'experience',
        'location',
    ];

    protected array $allowIncluded = ['user'];

    protected array $allowFilter = ['profession', 'experience', 'location'];

    protected array $allowSort = ['profession', 'experience', 'location', 'created_at'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function jobApplications(): HasMany
    {
        return $this->hasMany(JobApplication::class);
    }

    public function portfolios(): HasMany
    {
        return $this->hasMany(Portfolio::class);
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    public function favoriteJobOffers(): MorphToMany
    {
        return $this->morphedByMany(JobOffer::class, 'favoritable', 'favorites')->withTimestamps();
    }

    public function favoriteClassifieds(): MorphToMany
    {
        return $this->morphedByMany(Classified::class, 'favoritable', 'favorites')->withTimestamps();
    }

    public function trainingUsers(): HasMany
    {
        return $this->hasMany(TrainingUser::class);
    }
}
