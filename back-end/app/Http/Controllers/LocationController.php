<?php

namespace App\Http\Controllers;

use App\Models\District;
use App\Models\Municipality;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function districts(){
        return response()->json(District::orderBy('name')->get());
    }

    public function municipalities($district_id){
        $district = District::find($district_id);
        return response()->json($district->municipalities()->orderBy('name')->get());
    }

    public function wards($municipalityId){
        $municipality = Municipality::findOrFail($municipalityId);
        $wards = range(1, $municipality->ward_count);
        return response()->json($wards);
    }
}
