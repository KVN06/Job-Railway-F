<?php

namespace App\Policies;

use App\Models\JobOffer;
use App\Models\User;

class JobOfferPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, JobOffer $jobOffer): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->isCompany() && $user->company !== null;
    }

    public function update(User $user, JobOffer $jobOffer): bool
    {
        return $user->isCompany()
            && $user->company
            && $jobOffer->company_id === $user->company->id;
    }

    public function delete(User $user, JobOffer $jobOffer): bool
    {
        return $this->update($user, $jobOffer);
    }
}
