<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Municipality;
use App\Models\OfficerProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class OfficerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $municipalities = Municipality::with('district')->get();

        foreach ($municipalities as $municipality) {
            for($ward=1; $ward<=$municipality->ward_count;$ward++){
                foreach(['birth','death','migration'] as $function){

                    //unique employee_id
                    $employeeId = strtoupper(substr($municipality->name,0,3)) . "-W{$ward}-" . strtoupper(substr($function, 0, 2));

                    //prevent duplication
                    if(OfficerProfile::where('employee_id',$employeeId)->exists()){
                        continue;
                    }

                    //user creation
                    $user = User::create([
                        'name'=> ucfirst($function) . " Officer Ward {$ward}",
                        'email'=> strtolower($employeeId) . '@gov.np',
                        'password'=> Hash::make(env('OFFICER_PASSWORD')),
                        'role'=>'OFFICER',
                    ]);

                    //officer profile creation
                    OfficerProfile::create([
                        'user_id'=> $user->id,
                        'employee_id'=> $employeeId,
                        'function'=> $function,
                        'district_id'=> $municipality->district->id,
                        'municipality_id'=> $municipality->id,
                        'ward_number'=>$ward,
                        'created_by'=>1, //super admin id = 1
                    ]);
                }
            }
        }
    }
}
