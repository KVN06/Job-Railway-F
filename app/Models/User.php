<?php

namespace App\Models;

use App\Models\Company;
use App\Models\Message;
use App\Models\Notification;
use App\Models\Unemployed;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{

    public function company()
    {
        return $this->hasOne(Company::class);
    }

    public function Unemployed()
    {
        return $this->hasOne(Unemployed::class);
    }

    public function Notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function SentMessages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function ReceivedMessages()
    {
        return $this->hasMany(Message::class, 'receiver_id');
    }

    public function isCompany(): bool
    {
        return $this->type === 'company';
    }

    public function isUnemployed(): bool
    {
        return $this->type === 'unemployed';
    }


















    protected $allowIncluded = [];
    protected $allowFilter = ['name', 'email', 'type'];
    protected $allowSort = ['name', 'email', 'type'];

    public function scopeIncluded(Builder $query)
    {
        if (empty($this->allowIncluded) || empty(request('included'))) {
            return;
        }
        $relations  = explode(',', request('included'));
        $allowIncluded = collect($this->allowIncluded);
        foreach ($relations as $key => $relationship) {
            if (!$allowIncluded->contains($relationship)) {
                unset($relations[$key]);
            }
        }
        $query->with($relations);
    }

    public function scopeFilter(Builder $query)
    {
        if (empty($this->allowFilter) || empty(request('filter'))) {
            return;
        }
        $filters = request('filter');
        $allowFilter = collect($this->allowFilter);
        foreach ($filters as $filter => $value) {
            if ($allowFilter->contains($filter)) {
                $query->where($filter, 'LIKE', '%' . $value . '%');
            }
        }
    }


        public function scopeSort(Builder $query)
    {
    if (empty($this->allowSort) || empty(request('sort'))) {
            return;
        }
        $sortFields = explode(',', request('sort'));
        $allowSort = collect($this->allowSort);
        foreach ($sortFields as $sortField) {
            $direction = 'asc';
            if(substr($sortField, 0,1)=='-'){
                $direction = 'desc';
                $sortField = substr($sortField,1);
            }
            if ($allowSort->contains($sortField)) {
                $query->orderBy($sortField, $direction);
            }
        }
    }


    public function scopeGetOrPaginate(Builder $query)
    {
        if (request('perPage')) {
            $perPage = intval(request('perPage'));
            if($perPage){
                return $query->paginate($perPage);
            }
            }
            return $query->get();
    }


















    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'type',
        'notify_email',
        'notify_platform',
        'dark_mode',
        'language',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'notify_email' => 'boolean',
        'notify_platform' => 'boolean',
        'dark_mode' => 'boolean',
    ];

    public function getTypeLabelAttribute(): string
    {
        return match ($this->type) {
            'company' => 'Empresa',
            'unemployed' => 'Cesante',
            default => 'Usuario',
        };
    }

    public function getThemePreferenceAttribute(): string
    {
        return $this->dark_mode ? 'dark' : 'light';
    }
    public function sendPasswordResetNotification($token): void
    {
        $this->notifyNow(new \Illuminate\Auth\Notifications\ResetPassword($token));
    }
}
