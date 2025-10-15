<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreJobOfferRequest;
use App\Http\Requests\UpdateJobOfferRequest;
use App\Models\Category;
use App\Models\JobOffer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class JobOfferController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth')->except(['index', 'show']);
        $this->authorizeResource(JobOffer::class, 'jobOffer', [
            'except' => ['index', 'show'],
        ]);
    }

    public function index(Request $request) {
        $query = JobOffer::with(['company', 'categories']);

        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('location')) {
            $query->where('location', $request->location);
        }

        if ($request->filled('category')) {
            $query->whereHas('categories', function($q) use ($request) {
                $q->where('categories.id', $request->category);
            });
        }

        $jobOffers = $query->latest()->paginate(10);
        $categories = Category::all();

        return view('job-offers.index', compact('jobOffers', 'categories'));
    }

    public function create()
    {
        $this->authorize('create', JobOffer::class);

        $categories = Category::all();
        return view('job-offers.create', compact('categories'));
    }

    public function store(StoreJobOfferRequest $request)
    {
        $validated = $request->validated();
        $company = $request->user()->company;

        $jobOffer = DB::transaction(function () use ($company, $validated) {
            $categories = $validated['categories'] ?? [];
            unset($validated['categories']);

            $jobOffer = $company->jobOffers()->create($validated);

            if (!empty($categories)) {
                $jobOffer->categories()->sync($categories);
            }

            return $jobOffer;
        });

        return redirect()->route('job-offers.index')
                         ->with('success', 'Oferta laboral creada exitosamente.');
    }

    public function show(JobOffer $jobOffer)
    {
        $jobOffer->load(['company', 'categories']);
        $isFavorite = false;

        if (Auth::check() && Auth::user()->type === 'unemployed') {
            $isFavorite = Auth::user()->unemployed->favoriteJobOffers()->where('favoritable_id', $jobOffer->id)->exists();
        }

        return view('job-offers.show', compact('jobOffer', 'isFavorite'));
    }

    public function edit(JobOffer $jobOffer)
    {
        $categories = Category::all();
        return view('job-offers.edit', compact('jobOffer', 'categories'));
    }

    public function update(UpdateJobOfferRequest $request, JobOffer $jobOffer)
    {
        $validated = $request->validated();
        $categories = $validated['categories'] ?? null;
        unset($validated['categories']);

        $jobOffer->update($validated);

        if ($categories !== null) {
            $jobOffer->categories()->sync($categories);
        }

        return redirect()->route('job-offers.show', $jobOffer)
                         ->with('success', 'Oferta laboral actualizada exitosamente.');
    }

    public function destroy(JobOffer $jobOffer)
    {
        $jobOffer->delete();

        return redirect()->route('job-offers.index')
                         ->with('success', 'Oferta laboral eliminada exitosamente.');
    }
}
