<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\JobOffer;

class UpdateJobOfferRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();
        /** @var JobOffer $jobOffer */
        $jobOffer = $this->route('jobOffer');

        if (!$user || !$jobOffer) {
            return false;
        }

        return $user->isCompany()
            && $user->company
            && $jobOffer->company_id === $user->company->id;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'required', 'string'],
            'salary' => ['nullable', 'numeric', 'min:0'],
            'location' => ['nullable', 'string', 'max:255'],
            'geolocation' => ['nullable', 'string', 'max:255'],
            'offer_type' => ['sometimes', 'nullable', 'in:contract,classified'],
            'status' => ['sometimes', 'nullable', 'in:active,inactive,draft,archived'],
            'categories' => ['nullable', 'array'],
            'categories.*' => ['integer', 'exists:categories,id'],
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('salary')) {
            $this->merge([
                'salary' => $this->sanitizeNumber($this->input('salary')),
            ]);
        }

        if ($this->has('offer_type') && ! $this->filled('offer_type')) {
            $this->merge(['offer_type' => null]);
        }

        if ($this->has('status') && ! $this->filled('status')) {
            $this->merge(['status' => null]);
        }
    }

    private function sanitizeNumber(mixed $value): ?float
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (is_numeric($value)) {
            return (float) $value;
        }

        $normalized = preg_replace('/[^\d\.,-]/', '', (string) $value);
        $normalized = str_replace(',', '.', $normalized);

        return is_numeric($normalized) ? (float) $normalized : null;
    }
}
