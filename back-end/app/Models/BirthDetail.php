<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BirthDetail extends Model
{
    protected $fillable = [
        'child_id',
        'birth_place_en',
        'birth_place_np',
    ];

    public function child(){
        return $this->belongsTo(Child::class);
    }
}
