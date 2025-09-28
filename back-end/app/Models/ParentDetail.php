<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ParentDetail extends Model
{
    protected $fillable = [
        'child_id',
        'parent_type', // 'father', 'mother', 'guardian'
        'full_name_en',
        'full_name_np',
        'citizenship_number_en',
        'citizenship_number_np',
    ];

    public function child()
    {
        return $this->belongsTo(Child::class);
    }

}
