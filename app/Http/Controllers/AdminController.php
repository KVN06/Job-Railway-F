<?php

namespace App\Http\Controllers;

use App\Models\Classified;
use App\Models\JobOffer;
use App\Models\Training;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function dashboard()
    {
        $stats = [
            'classifiedsCount' => Classified::count(),
            'jobOffersCount' => JobOffer::count(),
            'trainingsCount' => Training::count(),
            'usersCount' => User::count(),
        ];

        return view('admin.dashboard', $stats);
    }

    public function classifieds()
{
    $classifieds = Classified::with(['company.user', 'unemployed.user', 'categories'])
                            ->latest()
                            ->paginate(10);
    return view('admin.classifieds.index', compact('classifieds'));
}

    public function jobOffers()
    {
        $jobOffers = JobOffer::with(['categories', 'company'])
                            ->latest()
                            ->paginate(10);
        return view('admin.job-offers.index', compact('jobOffers'));
    }

    public function trainings()
{
    $trainings = Training::latest()->paginate(10);
    return view('admin.trainings.index', compact('trainings'));
}

    public function users()
    {
        $users = User::where('type', '!=', 'admin')
                    ->latest()
                    ->paginate(10);
        return view('admin.users.index', compact('users'));
    }
}   