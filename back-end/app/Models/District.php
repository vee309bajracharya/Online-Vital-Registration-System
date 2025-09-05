<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class District extends Model
{
    protected $fillable=['name'];

    public function municipalities(){
        return $this->hasMany(Municipality::class); //one-to-many relationship
    }
}
