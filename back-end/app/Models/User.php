<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\OfficerProfile;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role', //user based roles
        'phone_number',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'phone_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    //convenience helpers
    public function isUser(): bool{
        return strtoupper($this->role) === 'USER';
    }
    public function isOfficer(): bool{
        return strtoupper($this->role) === 'OFFICER';
    }
    public function isAdmin(): bool{
        return strtoupper($this->role) === 'ADMIN';
    }

    //officer profile relation
    public function officerProfile(){
        return $this->hasOne(OfficerProfile::class);
    }

    // Registrations relation (for birth certificates)
    public function registrations()
    {
        return $this->hasMany(Registration::class);
    }
}
