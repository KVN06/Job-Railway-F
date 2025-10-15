<?php

namespace App\Models;

use App\Models\Concerns\AppliesApiScopes;
use App\Models\Unemployed;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
    use HasFactory;
    use AppliesApiScopes;

    protected $fillable = ['unemployed_id', 'favoritable_id', 'favoritable_type'];

    protected array $allowIncluded = ['unemployed', 'favoritable'];

    protected array $allowFilter = ['unemployed_id', 'favoritable_id', 'favoritable_type'];

    protected array $allowSort = ['unemployed_id', 'favoritable_id', 'favoritable_type', 'created_at'];

    public function unemployed()
    {
        return $this->belongsTo(Unemployed::class);
    }

    public function favoritable()
    {
        return $this->morphTo();
    }
}
