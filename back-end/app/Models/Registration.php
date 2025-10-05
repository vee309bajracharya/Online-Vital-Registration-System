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
        'registration_number',
        'registration_type',
        'rejection_reason',
        'approved_by',
        'rejected_by',
        'approved_at',
        'rejected_at',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'approved_at'=> 'datetime',
        'rejected_at'=> 'datetime',
    ];

    protected static function boot(){
        parent::boot();
        static::creating(function ($registration){
            //unique 12digit reg. number
            do{
                $number = str_pad(mt_rand(0,999999999999),12,'0', STR_PAD_LEFT);
            }while(self::where('registration_number',$number)->exists());
            $registration->registration_number = $number;
        });
    }

    public function child(){
        return $this->belongsTo(Child::class);
    }

    public function user(){
        return $this->belongsTo(User::class);
    }
}
