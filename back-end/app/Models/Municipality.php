<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Municipality extends Model
{
    protected $fillable=[
        'district_id',
        'name',
        'type',
        'ward_count',
    ];

    public function district(){
        return $this->belongsTo(District::class); //many-to-one relationship
    }
}
