<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Child extends Model
{
    protected $fillable = [
        'full_name_en',
        'full_name_np',
        'gender',
        'dob_en',
        'dob_np',
    ];


    public function parent_details(){
        return $this->hasMany(ParentDetail::class); //one-to-many relationship
    }

    public function birth_details(){
        return $this->hasOne(BirthDetail::class); //one-to-one relationship
    }

    public function address(){
        return $this->hasOne(Address::class); //one-to-one relationship
    }

    public function registrations(){
        return $this->hasOne(Registration::class); //one-to-one relationship
    }

    public function grandfathers(){
        return $this->hasOne(Grandfather::class); //one-to-one relationship
    }
    
}
