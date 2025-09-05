<?php

namespace App\Models;

use App\Models\User;
use App\Models\District;
use App\Models\Municipality;
use Illuminate\Database\Eloquent\Model;

class OfficerProfile extends Model
{
    protected $fillable=[
        'user_id',
        'employee_id',
        'function',
        'district_id',
        'municipality_id',
        'ward_number',
        'status',
        'created_by',
    ];

    public function user(){
        return $this->belongsTo(User::class); //many-to-one relationship
    }

    public function district(){
        return $this->belongsTo(District::class);
    }

    public function municipality(){
        return $this->belongsTo(Municipality::class);
    }
}
