<?php

namespace App\Http\Controllers;

use App\Models\Child;
use App\Models\Registration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class OfficerCertificateController extends Controller
{
    // get the pending certificates based on officer's function and location
    public function getPendingCertificates(Request $request){
        $user = $request->user();
        $officerProfile = $user->officerProfile;

        if(!$officerProfile){
            return response()->json([
                'error'=> 'Officer profile not found'
            ],404);
        }

        try {
            //get certificates based on matching officer's jurisdiction
            $certificates = Child::whereHas('registrations',function($query){
                $query->where('status','PENDING');
            })
            ->whereHas('address', function($query) use ($officerProfile){
                $query->where('ward_number', $officerProfile->ward_number);
            })
            ->with(['parent_details', 'birth_details', 'address', 'registrations', 'grandfathers'])
            ->get();

            return response()->json([
                'message'=> 'Pending certificates reterived successfully',
                'data'=> $certificates,
                'officer_info'=> [
                    'function' => $officerProfile->function,
                    'municipality'=> $officerProfile->municipality->name,
                    'ward'=> $officerProfile->ward_number,
                ]
                ],200);

        } catch (\Exception $e) {
            Log::error('Error fetching pending certificates: '. $e->getMessage());
            return response()->json([
                'error'=> 'Failed to fetch certificates'
            ],500);
        }
    }

    // approve a certificate
    public function approveCertificate(Request $request, $id){
        $user = $request->user();
        $officerProfile = $user->officerProfile;

        try {
            $child = Child::with(['registrations','address'])->findOrFail($id);
            $registration = $child->registrations;

            //verify officer
            if($child->address->ward_number != $officerProfile->ward_number){
                return response()->json([
                    'error'=> 'Not authorized for this certificate'
                ],404);
            }

            if($registration->status !== 'PENDING'){
                return response()->json([
                    'error'=> 'Certificate already approved'
                ],400);
            }

            $registration->update([
                'status'=> 'APPROVED',
                'approved_by'=> $user->id,
                'approved_at'=> now(),
            ]);

            return response()->json([
                'message'=>'Certificate approved successfully',
                'data'=>$child->load(['registrations'])
            ],200);

        } catch (\Exception $e) {
            Log::error('Error approving certificate : '. $e->getMessage());
            return response()->json([
                'error'=> 'Failed to approve certificate'
            ],500);
        }
    }

    //reject a certificate
    public function rejectCertificate(Request $request, $id){
        $request->validate([
            'rejection_reason' => 'required|string|max:100'
        ]);

        $user = $request->user();
        $officerProfile = $user->officerProfile;

        try {
            $child = Child::with(['registrations','address'])->findOrFail($id);
            $registration = $child->registrations;

            // verify officer
            if($child->address->ward_number != $officerProfile->ward_number){
                return response()->json([
                    'error'=> 'Not authorized for this certificate'
                ],403);
            }

            if($registration->status !== 'PENDING'){
                return response()->json([
                    'error'=> 'Certificate already rejected'
                ],400);
            }

            $registration->update([
                'status'=> 'REJECTED',
                'rejection_reason' => $request->rejection_reason,
                'rejected_by'=> $user->id,
                'rejected_at'=> now(),
            ]);

            return response()->json([
                'message'=> 'Certificate rejected',
                'data'=> $child->load(['registrations'])
            ],200);


        } catch (\Exception $e) {
            Log::error('Error rejecting certificate: '. $e->getMessage());
            return response()->json([
                'error'=> 'Failed to reject certificate'
            ],500);
        }
    }

    //officer statistics
    public function getOfficerStatistics(Request $request){
        $user = $request->user();
        $officerProfile = $user->officerProfile;

        try {
            $stats = [
                'pending'=> Registration::query()
                    ->where('status','PENDING')
                    ->whereHas('child.address', function($query) use ($officerProfile){
                    $query->where('ward_number', $officerProfile->ward_number);
                })->count(),

                'approved'=> Registration::query()
                        ->where('status', 'APPROVED')
                        ->where('approved_by', $user->id)
                        ->count(),
                
                'rejected'=> Registration::query()
                        ->where('status', 'REJECTED')
                        ->where('rejected_by', $user->id)
                        ->count(),
            ];

            return response()->json([
                'message'=> 'Statistics retrieved successfully',
                'data'=> $stats
            ],200);
        } catch (\Exception $e) {
            Log::error('Failed to fetch statistics' . $e->getMessage());
            return response()->json([
                'error'=> 'Failed to fetch statistics'
            ],500);

        }
    }

    //certificates list
    public function getAllCertificates(Request $request){
        $user = $request->user();
        $officerProfile = $user->officerProfile;

        try {
            $certificates = Child::whereHas('address', function($query) use ($officerProfile){
                $query->where('ward_number', $officerProfile->ward_number);
            })
            ->with(['parent_details', 'birth_details', 'address', 'registrations', 'grandfathers'])
            ->get();

            return response()->json([
                'message'=> 'Certificates retrived successfully',
                'data'=> $certificates,
                'officer_info'=>[
                        'function'=> $officerProfile->function,
                        'municipality'=> $officerProfile->municipality->name,
                        'ward'=> $officerProfile->ward_number,
                ]
                ],200);
        } catch (\Exception $e) {
            Log::error('Error fetching certificates : '. $e->getMessage());
            return response()->json([
                'error'=> 'Failed to fetch certificates'
            ],500);
        }
    }


}
