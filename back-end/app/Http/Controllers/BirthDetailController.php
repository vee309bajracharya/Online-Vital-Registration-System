<?php

namespace App\Http\Controllers;

use App\Models\Child;
use App\Models\Address;
use App\Models\BirthDetail;
use App\Models\Grandfather;
use App\Models\ParentDetail;
use App\Models\Registration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BirthDetailController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $userId = auth()->user()->id;

            // Get only the current user's birth certificates
            $children = Child::whereHas('registrations', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })->with(['parent_details', 'birth_details', 'address', 'registrations', 'grandfathers'])->get();

            return response()->json([
                'message' => 'Birth certificates retrieved successfully.',
                'data' => $children
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error retrieving birth certificates: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to retrieve birth certificates.',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Field validations
        $validated = $request->validate([
            // child details
            'full_name_en' => 'required|string|max:255',
            'full_name_np' => 'required|string|max:255',
            'gender' => 'required|in:Male,Female,Other',
            'dob_en' => 'required|date',
            'dob_np' => 'required|string',

            // child birth details
            'birth_place_en' => 'required|string|max:255',
            'birth_place_np' => 'required|string',
            'delivery_type' => 'required|string',

            // grandparent details
            'grandfather_name_en' => 'required|string|max:255',
            'grandfather_name_np' => 'required|string',

            // parent details - ensure exactly 2 parents
            'parents' => 'required|array|size:2',
            'parents.*.full_name_en' => 'required|string|max:255',
            'parents.*.full_name_np' => 'required|string',
            'parents.*.parent_type' => 'required|in:Father,Mother,Guardian',
            'parents.*.citizenship_number_en' => 'required|string|max:100',
            'parents.*.citizenship_number_np' => 'required|string|max:100',

            // address details
            'province_en' => 'required|string',
            'province_np' => 'required|string',
            'district_en' => 'required|string',
            'district_np' => 'required|string',
            'municipality_en' => 'required|string',
            'municipality_np' => 'required|string',
            'ward_number' => 'required|numeric',

            // informant details
            'informant_name_en' => 'required|string|max:255',
            'informant_name_np' => 'required|string',
            'citizenship_number_en' => 'required|string|max:100',
            'citizenship_number_np' => 'required|string|max:100',
        ]);

        // Store the birth details
        DB::beginTransaction();

        try {
            // Create Child
            $child = Child::create([
                'full_name_en' => $validated['full_name_en'],
                'full_name_np' => $validated['full_name_np'],
                'gender' => $validated['gender'],
                'dob_en' => $validated['dob_en'],
                'dob_np' => $validated['dob_np'],
            ]);

            // Birth details
            BirthDetail::create([
                'child_id' => $child->id,
                'birth_place_en' => $validated['birth_place_en'],
                'birth_place_np' => $validated['birth_place_np'],
                'delivery_type' => $validated['delivery_type'],
            ]);

            // Grandfather details
            Grandfather::create([
                'child_id' => $child->id,
                'grandfather_name_en' => $validated['grandfather_name_en'],
                'grandfather_name_np' => $validated['grandfather_name_np'],
            ]);

            // Create parents
            foreach ($validated['parents'] as $index => $parentData) {
                ParentDetail::create([
                    'child_id' => $child->id,
                    'parent_type' => $parentData['parent_type'],
                    'full_name_en' => $parentData['full_name_en'],
                    'full_name_np' => $parentData['full_name_np'],
                    'citizenship_number_en' => $parentData['citizenship_number_en'],
                    'citizenship_number_np' => $parentData['citizenship_number_np'],
                ]);
            }

            // Address
            Address::create([
                'child_id' => $child->id,
                'province_en' => $validated['province_en'],
                'province_np' => $validated['province_np'],
                'district_en' => $validated['district_en'],
                'district_np' => $validated['district_np'],
                'municipality_en' => $validated['municipality_en'],
                'municipality_np' => $validated['municipality_np'],
                'ward_number' => $validated['ward_number'],
            ]);

            // Informant details (Registration)
            $registration = Registration::create([
                'child_id' => $child->id,
                'user_id' => auth()->user()->id,
                'informant_name_en' => $validated['informant_name_en'],
                'informant_name_np' => $validated['informant_name_np'],
                'citizenship_number_en' => $validated['citizenship_number_en'],
                'citizenship_number_np' => $validated['citizenship_number_np'],
                'submitted_at' => now(),
                'status' => 'PENDING', // Default status
            ]);

            DB::commit();

            // Load all relationships for response
            $child->load(['parent_details', 'birth_details', 'address', 'registrations', 'grandfathers']);

            return response()->json([
                'message' => 'Birth details submitted successfully.',
                'data' => $child,
                'registration_id' => $registration->id,
                'status' => 'success'
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'error' => 'Failed to submit birth details.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $userId = auth()->user()->id;

            // Ensure user can only see their own registrations
            $child = Child::whereHas('registrations', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })->with(['parent_details', 'birth_details', 'address', 'registrations', 'grandfathers'])
                ->findOrFail($id);

            return response()->json([
                'message' => 'Birth details retrieved successfully.',
                'data' => $child
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Birth certificate not found or access denied.',
                'details' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        // Only allow updates for PENDING registrations
        try {
            $userId = auth()->user()->id;

            $child = Child::whereHas('registrations', function ($query) use ($userId) {
                $query->where('user_id', $userId)->where('status', 'PENDING');
            })->with(['parent_details', 'birth_details', 'address', 'registrations', 'grandfathers'])
              ->findOrFail($id);

            //validations
            $validated = $request->validate([
                // child details
                'full_name_en' => 'required|string|max:255',
                'full_name_np' => 'required|string',
                'gender' => 'required|in:Male,Female,Other',
                'dob_en' => 'required|date',
                'dob_np' => 'required|string',

                // child birth details
                'birth_place_en' => 'required|string|max:255',
                'birth_place_np' => 'required|string',
                'delivery_type' => 'required|string',

                // grandparent details
                'grandfather_name_en' => 'required|string|max:255',
                'grandfather_name_np' => 'required|string',

                // parent details - ensure exactly 2 parents
                'parents' => 'required|array|size:2',
                'parents.*.full_name_en' => 'required|string|max:255',
                'parents.*.full_name_np' => 'required|string',
                'parents.*.parent_type' => 'required|in:Father,Mother,Guardian',
                'parents.*.citizenship_number_en' => 'required|string|max:100',
                'parents.*.citizenship_number_np' => 'required|string|max:100',

                // address details
                'province_en' => 'required|string',
                'province_np' => 'required|string',
                'district_en' => 'required|string',
                'district_np' => 'required|string',
                'municipality_en' => 'required|string',
                'municipality_np' => 'required|string',
                'ward_number' => 'required|numeric',

                // informant details
                'informant_name_en' => 'required|string|max:255',
                'informant_name_np' => 'required|string',
                'citizenship_number_en' => 'required|string|max:100',
                'citizenship_number_np' => 'required|string|max:100',
            ]);

            DB::beginTransaction();

            //update the records
            $child->update([
                'full_name_en' => $validated['full_name_en'],
                'full_name_np' => $validated['full_name_np'],
                'gender' => $validated['gender'],
                'dob_en' => $validated['dob_en'],
                'dob_np' => $validated['dob_np'],
            ]);
            $child->birth_details->update([
                'birth_place_en' => $validated['birth_place_en'],
                'birth_place_np' => $validated['birth_place_np'],
                'delivery_type' => $validated['delivery_type'],
            ]);
            $child->grandfathers->update([
                'grandfather_name_en' => $validated['grandfather_name_en'],
                'grandfather_name_np' => $validated['grandfather_name_np'],
            ]);
            $parents = $child->parent_details;
            foreach ($validated['parents'] as $index => $parentData) {
                if (isset($parents[$index])) {
                    $parents[$index]->update([
                        'parent_type' => $parentData['parent_type'],
                        'full_name_en' => $parentData['full_name_en'],
                        'full_name_np' => $parentData['full_name_np'],
                        'citizenship_number_en' => $parentData['citizenship_number_en'],
                        'citizenship_number_np' => $parentData['citizenship_number_np'],
                    ]);
                }
            }
            if ($child->address) {
                $child->address->update([
                    'province_en' => $validated['province_en'],
                    'province_np' => $validated['province_np'],
                    'district_en' => $validated['district_en'],
                    'district_np' => $validated['district_np'],
                    'municipality_en' => $validated['municipality_en'],
                    'municipality_np' => $validated['municipality_np'],
                    'ward_number' => $validated['ward_number'],
                ]);
            }
            $child->registrations->update([
                'informant_name_en' => $validated['informant_name_en'],
                'informant_name_np' => $validated['informant_name_np'],
                'citizenship_number_en' => $validated['citizenship_number_en'],
                'citizenship_number_np' => $validated['citizenship_number_np'],
            ]);

            DB::commit();

            $child->load(['parent_details', 'birth_details', 'address', 'registrations', 'grandfathers']);

            return response()->json([
                'message' => 'Birth certificate updated successfully.',
                'data' => $child
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Birth certificate update failed: ' . $e->getMessage());
            return response()->json([
                'error' => 'Unable to update birth certificate.',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $userId = auth()->user()->id;

            // Only allow deletion of PENDING registrations
            $child = Child::whereHas('registrations', function ($query) use ($userId) {
                $query->where('user_id', $userId)->where('status', 'PENDING');
            })->findOrFail($id);

            $child->delete(); // cascade delete related records

            return response()->json([
                'message' => 'Birth certificate deleted successfully.'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Unable to delete birth certificate.',
                'details' => $e->getMessage()
            ], 400);
        }
    }
}