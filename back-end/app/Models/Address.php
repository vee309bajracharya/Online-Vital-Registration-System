<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $fillable = [
        'child_id',
        'province_en',
        'province_np',
        'district_en',
        'district_np',
        'municipality_en',
        'municipality_np',
        'ward_number',
    ];

    public function child()
    {
        return $this->belongsTo(Child::class);
    }
}
