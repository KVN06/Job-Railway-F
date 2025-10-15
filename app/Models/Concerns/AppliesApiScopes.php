<?php

namespace App\Models\Concerns;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

/**
 * Shared API query scopes for include/filter/sort helpers.
 */
trait AppliesApiScopes
{
    /**
     * @param  Builder  $query
     * @return Builder
     */
    public function scopeIncluded(Builder $query): Builder
    {
        $includes = array_filter(explode(',', (string) request('included')));

        if (empty($this->allowIncluded ?? []) || empty($includes)) {
            return $query;
        }

        $allowed = array_values(array_intersect($includes, $this->allowIncluded));

        if (! empty($allowed)) {
            $query->with($allowed);
        }

        return $query;
    }

    /**
     * @param  Builder  $query
     * @return Builder
     */
    public function scopeFilter(Builder $query): Builder
    {
        $filters = (array) request('filter', []);

        if (empty($this->allowFilter ?? []) || empty($filters)) {
            return $query;
        }

        foreach ($filters as $column => $value) {
            if ($value === null || $value === '' || ! in_array($column, $this->allowFilter, true)) {
                continue;
            }

            $query->where($column, 'LIKE', '%' . $value . '%');
        }

        return $query;
    }

    /**
     * @param  Builder  $query
     * @return Builder
     */
    public function scopeSort(Builder $query): Builder
    {
        $sortFields = array_filter(explode(',', (string) request('sort')));

        if (empty($this->allowSort ?? []) || empty($sortFields)) {
            return $query;
        }

        foreach ($sortFields as $sortField) {
            $direction = str_starts_with($sortField, '-') ? 'desc' : 'asc';
            $column = ltrim($sortField, '-');

            if (in_array($column, $this->allowSort, true)) {
                $query->orderBy($column, $direction);
            }
        }

        return $query;
    }

    /**
     * @param  Builder  $query
     * @return Collection|LengthAwarePaginator
     */
    public function scopeGetOrPaginate(Builder $query)
    {
        $perPage = (int) request('perPage');

        if ($perPage > 0) {
            return $query->paginate($perPage)->appends(request()->query());
        }

        return $query->get();
    }
}
