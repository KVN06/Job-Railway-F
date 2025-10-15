<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Company;
use App\Models\JobOffer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ManageJobOffersTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_job_offer_creation(): void
    {
        $response = $this->get(route('job-offers.create'));

        $response->assertRedirect(route('login'));
    }

    public function test_unemployed_user_cannot_create_job_offer(): void
    {
        $user = User::factory()->create([
            'type' => 'unemployed',
        ]);

        $response = $this->actingAs($user)->post(route('job-offers.store'), [
            'title' => 'Backend Developer',
            'description' => 'Great role for experienced developers.',
        ]);

        $response->assertForbidden();
        $this->assertDatabaseCount('job_offers', 0);
    }

    public function test_company_user_can_create_job_offer(): void
    {
        $user = User::factory()->create([
            'type' => 'company',
        ]);

        $company = Company::factory()->create([
            'user_id' => $user->id,
        ]);

        $category = Category::factory()->create();

        $payload = [
            'title' => 'Backend Developer',
            'description' => 'Great role for experienced developers.',
            'salary' => 65000,
            'location' => 'Remote',
            'categories' => [$category->id],
        ];

        $response = $this->actingAs($user)->post(route('job-offers.store'), $payload);

        $response->assertRedirect(route('job-offers.index'));

        $this->assertDatabaseHas('job_offers', [
            'title' => 'Backend Developer',
            'company_id' => $company->id,
            'offer_type' => 'contract',
            'status' => 'active',
        ]);

        $jobOffer = JobOffer::where('title', 'Backend Developer')->first();

        $this->assertNotNull($jobOffer);
        $this->assertSame('contract', $jobOffer->offer_type);
        $this->assertSame('active', $jobOffer->status);
        $this->assertTrue($jobOffer->categories()->where('categories.id', $category->id)->exists());
    }
}
