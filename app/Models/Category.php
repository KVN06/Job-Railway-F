<?php

namespace App\Models;

use App\Models\Classified;
use App\Models\Concerns\AppliesApiScopes;
use App\Models\JobOffer;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;
    use AppliesApiScopes;

    protected $fillable = ['name', 'description'];

    protected array $allowIncluded = ['jobOffers', 'classifieds'];

    protected array $allowFilter = ['name', 'description'];

    protected array $allowSort = ['name', 'description', 'created_at'];

    public function jobOffers()
    {
        return $this->morphedByMany(JobOffer::class, 'categorizable')->withTimestamps();
    }

    public function classifieds()
    {
        return $this->morphedByMany(Classified::class, 'categorizable')->withTimestamps();
    }
}
