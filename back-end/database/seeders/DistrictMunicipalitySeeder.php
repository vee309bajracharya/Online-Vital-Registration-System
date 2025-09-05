<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\District;
use App\Models\Municipality;

class DistrictMunicipalitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //seeder for districts and municipalities
        // districts: Bhaktapur, Kathmandu, Lalitpur

        $datas=[
            // for bhaktapur
            [
                'name' => 'Bhaktapur',
                'municipalities' => [
                    ['name'=> 'Suryabinayak', 'type'=> 'municipality', 'ward_count'=> 10],
                    ['name'=> 'Madhyapur Thimi', 'type'=> 'municipality', 'ward_count'=> 9],
                    ['name'=> 'Changunarayan', 'type'=> 'municipality', 'ward_count'=> 9],
                    ['name'=> 'Bhaktapur', 'type'=> 'municipality', 'ward_count'=> 10],
                ],
            ],

            //for lalitpur
            [
                'name' => 'Lalitpur',
                'municipalities' => [
                    ['name'=> 'Lalitpur Metropolitan City', 'type'=> 'metropolitan', 'ward_count'=> 29],
                    ['name'=> 'Godawari Municipality', 'type'=> 'municipality', 'ward_count'=> 14],
                    ['name'=> 'Mahalaxmi Municipality', 'type'=> 'municipality', 'ward_count'=> 10],
                    ['name'=> 'Bagmati Gaunpalika', 'type'=> 'gaunpalika', 'ward_count'=> 7],
                    ['name'=> 'Mahankal Gaunpalika', 'type'=> 'gaunpalika', 'ward_count'=> 6],
                    ['name'=> 'Konjyosom Gaunpalika', 'type'=> 'gaunpalika', 'ward_count'=> 5],
                ],
            ],

            //for kathmandu
            [
                'name' => 'Kathmandu',
                'municipalities' => [
                    ['name'=> 'Kathmandu Metropolitan City', 'type'=> 'metropolitan', 'ward_count'=> 32],
                    ['name'=> 'Budanilkantha Municipality', 'type'=> 'municipality', 'ward_count'=> 13],
                    ['name'=> 'Tarakeshwar Municipality', 'type'=> 'municipality', 'ward_count'=> 11],
                    ['name'=> 'Gokarneshwar Municipality', 'type'=> 'municipality', 'ward_count'=> 9],
                    ['name'=> 'Chandragiri Municipality', 'type'=> 'municipality', 'ward_count'=> 15],
                    ['name'=> 'Tokha Municipality', 'type'=> 'municipality', 'ward_count'=> 11],
                    ['name'=> 'Kageshwari-Manohara Municipality', 'type'=> 'municipality', 'ward_count'=> 9],
                    ['name'=> 'Nagarjun Municipality', 'type'=> 'municipality', 'ward_count'=> 10],
                    ['name'=> 'Kirtipur Municipality', 'type'=> 'municipality', 'ward_count'=> 10],
                    ['name'=> 'Shankharapur Municipality', 'type'=> 'municipality', 'ward_count'=> 9],
                    ['name'=> 'Dakshinkali Municipality', 'type'=> 'municipality', 'ward_count'=> 9],
                ],
            ],
        ];

        foreach($datas as $data){
            $district = District::updateOrCreate(['name'=>$data['name']]);

            foreach($data['municipalities'] as $municipalityData){
                Municipality::updateOrCreate(
                    [
                        'district_id'=>$district->id, 
                        'name'=>$municipalityData['name']
                    ],
                    [
                        'type'=>$municipalityData['type'],
                        'ward_count'=>$municipalityData['ward_count']
                    ]
                );
            }
        }
    }
}
