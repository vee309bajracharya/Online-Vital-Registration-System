<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Registration extends Model
{
    protected $fillable = [
        'child_id',
        'user_id',
        'informant_name_en',
        'informant_name_np',
        'citizenship_number_en',
        'citizenship_number_np',
        'status',
        'submitted_at',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
    ];

    public function child(){
        return $this->belongsTo(Child::class);
    }

    public function user(){
        return $this->belongsTo(User::class);
    }
}
