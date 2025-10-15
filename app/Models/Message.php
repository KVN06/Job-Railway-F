<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

class Message extends Model
{
    public function Sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function Receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }















    
    protected $allowIncluded = ['sender', 'receiver']; 
    protected $allowFilter = ['sender_id', 'receiver_id', 'content', 'sent_at'];
    protected $allowSort = ['sender_id', 'receiver_id', 'content', 'sent_at'];

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
}
