<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\JobApplication;
use App\Models\JobOffer;
use App\Policies\JobApplicationPolicy;
use App\Policies\JobOfferPolicy;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        JobApplication::class => JobApplicationPolicy::class,
        JobOffer::class => JobOfferPolicy::class,
    ];

    public function boot()
    {
        $this->registerPolicies();
    }
}
