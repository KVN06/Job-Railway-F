<?php

namespace App\Models;

use App\Models\Concerns\AppliesApiScopes;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class JobOffer extends Model
{
    use HasFactory;
    use AppliesApiScopes;

    protected $fillable = [
        'company_id',
        'title',
        'description',
        'salary',
        'location',
        'geolocation',
        'offer_type',
        'status',
    ];

    protected $casts = [
        'salary' => 'decimal:2',
    ];

    protected array $allowIncluded = ['company', 'categories'];

    protected array $allowFilter = ['title', 'location', 'status', 'offer_type'];

    protected array $allowSort = ['title', 'salary', 'created_at'];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function jobApplications(): HasMany
    {
        return $this->hasMany(JobApplication::class);
    }

    public function applications(): HasMany
    {
        return $this->jobApplications();
    }

    public function categories(): MorphToMany
    {
        return $this->morphToMany(Category::class, 'categorizable')->withTimestamps();
    }

    public function favoritedBy(): MorphToMany
    {
        return $this->morphToMany(Unemployed::class, 'favoritable', 'favorites')
            ->withPivot('added_at')
            ->withTimestamps();
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }

    public function getSalaryFormattedAttribute(): string
    {
        return $this->salary !== null
            ? '$ ' . number_format($this->salary, 2)
            : 'No especificado';
    }
}
