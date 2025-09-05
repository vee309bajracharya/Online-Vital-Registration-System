<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'ADMIN_EMAIL'], // unique field to avoid duplicates
            [
                'name' => 'Admin',
                'email' => 'ADMIN_EMAIL',
                'password' => Hash::make(env('ADMIN_PASSWORD')),
                'role' => 'ADMIN',
            ]
        );
    }
}
