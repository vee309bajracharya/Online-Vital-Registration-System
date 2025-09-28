<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Grandfather extends Model
{
    protected $fillable=[
        'child_id',
        'grandfather_name_en',
        'grandfather_name_np',
    ];

    public function child(){
        return $this->belongsTo(Child::class);
    }
}
