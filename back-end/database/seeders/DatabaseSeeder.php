<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\AdminSeeder;
use Database\Seeders\OfficerSeeder;
use Database\Seeders\DistrictMunicipalitySeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            DistrictMunicipalitySeeder::class,
            OfficerSeeder::class,
            AdminSeeder::class,
        ]);
    }
}
