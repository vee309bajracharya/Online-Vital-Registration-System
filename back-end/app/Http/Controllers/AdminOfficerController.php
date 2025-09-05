<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Municipality;
use Illuminate\Http\Request;
use App\Models\OfficerProfile;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class AdminOfficerController extends Controller
{
    //list all officers
    public function index()
    {
        $officers = OfficerProfile::with(['user', 'district', 'municipality'])->get();
        return response()->json($officers);
    }

    //show single officer
    public function show($id){
        $officer = OfficerProfile::with(['user', 'district', 'municipality'])->findOrFail($id);
        return response()->json(['message'=> $officer],200);
    }

    //create officer
    public function store(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|string|unique:officer_profiles,employee_id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'function' => ['required', Rule::in(['birth', 'death', 'migration'])],
            'district_id' => 'required|exists:districts,id',
            'municipality_id' => 'required|exists:municipalities,id',
            'ward_number' => 'required|integer|min:1',
        ]);

        $mun = Municipality::findOrFail($request->municipality_id);
        //validate ward_number
        if ($request->ward_number < 1 || $request->ward_number > $mun->ward_count) {
            return response()->json(['message' => 'Invalid ward number for the selected municipality.'], 422);
        }

        //unique function, municipality, ward_number
        $exists = OfficerProfile::where('function', $request->function)
            ->where('municipality_id', $request->municipality_id)
            ->where('ward_number', $request->ward_number)
            ->exists();
        if ($exists) {
            return response()->json(['message' => 'An officer for this function already assigned to the selected municipality & ward'], 422);
        }

        DB::beginTransaction();
        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => bcrypt($request->password),
                'role' => 'OFFICER',
            ]);
            $profile = OfficerProfile::create([
                'user_id' => $user->id,
                'employee_id' => $request->employee_id,
                'function' => $request->function,
                'district_id' => $request->district_id,
                'municipality_id' => $request->municipality_id,
                'ward_number' => $request->ward_number,
                'created_by' => auth()->user()->id,
            ]);
            DB::commit();
            return response()->json(['message' => 'Officer Created', 'officer' => $profile->load('user', 'district', 'municipality')], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error creating officer', 'error' => $e->getMessage()], 500);
        }

    }

    // update and delete officer (managed by admin only)

    //update officer
    public function update(Request $request, $id){
        $officer = OfficerProfile::with('user')->findOrFail($id);
        $request->validate([
            'employee_id' => ['sometimes', 'string', Rule::unique('officer_profiles')->ignore($officer->id)],
            'name' => 'sometimes|string|max:255',
            'email' => ['sometimes', 'email', Rule::unique('users', 'email')->ignore($officer->user_id)],
            'password' => 'sometimes|string|min:8|nullable',
            'function' => ['sometimes', Rule::in(['birth', 'death', 'migration'])],
            'district_id' => 'sometimes|exists:districts,id',
            'municipality_id' => 'sometimes|exists:municipalities,id',
            'ward_number' => 'sometimes|integer|min:1',
        ]);
        if (!$request->has(['name', 'email', 'password', 'employee_id', 'function', 'district_id', 'municipality_id', 'ward_number'])) {
            return response()->json(['message' => 'Invalid request payload'], 422);
        }
        

        DB::beginTransaction();
        try {
            //update officer user
            $officer->user->update([
                'name' => $request->name ?? $officer->user->name,
                'email' => $request->email ?? $officer->user->email,
                'password' => $request->password ? bcrypt($request->password) : $officer->user->password,
            ]);
            // Validate ward if changed
            if ($request->has('municipality_id') && $request->has('ward_number')) {
                $mun = Municipality::findOrFail($request->municipality_id);
                if ($request->ward_number < 1 || $request->ward_number > $mun->ward_count) {
                    return response()->json(['message' => 'Invalid ward number for the selected municipality.'], 422);
                }

                $exists = OfficerProfile::where('function', $request->function ?? $officer->function)
                    ->where('municipality_id', $request->municipality_id)
                    ->where('ward_number', $request->ward_number)
                    ->where('id', '!=', $officer->id)
                    ->exists();
                if ($exists) {
                    return response()->json(['message' => 'Another officer already assigned for this function in the same ward.'], 422);
                }
            }

            //update profile
            $officer->update($request->only([
                'employee_id', 'function', 'district_id', 'municipality_id', 'ward_number'
            ]));
            DB::commit();
            return response()->json(['message'=> 'Officer updated successfully', 'officer'=>$officer->load('user','district','municipality')],200);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['message'=>'Error updating officer', 'error'=>$e->getMessage()], 500); 
        }
    }

    //delete officer
    public function destroy($id){
        $officer = OfficerProfile::with('user')->findOrFail($id);

        DB::beginTransaction();
        try {
            $officer->user->delete();
            $officer->delete();
            DB::commit();
            return response()->json(['message'=>'Officer deleted successfully'],200);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['message'=>'Error deleting officer', 'error'=>$e->getMessage()], 500);
        }
    }
}
