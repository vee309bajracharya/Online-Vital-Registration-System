<?php

namespace App\Http\Controllers;

use App\Mail\PhoneOtpMail;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\PhoneVerification;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class PhoneVerificationController extends Controller
{
    // request OTP (send otp to registered user's email via Mailtrap)
    public function requestOtp(Request $request)
    {
        try {
            $request->validate([
                'phone_number' => 'required|string|max:10',
            ]);

            $user = $request->user();
            $phone = $request->phone_number;

            // avoid frequent requests
            $last = PhoneVerification::where('user_id', $user->id)
                ->where('phone_number', $phone)
                ->latest()->first();

            if ($last && $last->created_at->diffInSeconds(now()) < 60) {
                return response()->json(['message' => 'OTP already sent recently. Please wait before requesting again.'], 429);
            }

            //generate otp
            $otp = random_int(100000, 999999);
            $otpHash = Hash::make((string) $otp);
            $expiresAt = Carbon::now()->addMinutes(5);

            // save to database
            PhoneVerification::create([
                'user_id' => $user->id,
                'phone_number' => $phone,
                'otp_hash' => $otpHash,
                'expires_at' => $expiresAt,
            ]);

            Mail::to($user->email)->send(new PhoneOtpMail($otp, $phone));

            return response()->json([
                'message' => 'OTP sent successfully to your registered email.',
                'expires_at' => $expiresAt->toDateTimeString(),
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ], 500);
        }



    }

    //verify otp
    public function verifyOtp(Request $request)
    {
        try {
            $request->validate([
                'phone_number' => 'required|string|max:10',
                'otp' => 'required|digits:6',
            ]);

            $user = $request->user();
            $phone = $request->phone_number;
            $otp = $request->otp;

            $record = PhoneVerification::where('user_id', $user->id)
                ->where('phone_number', $phone)
                ->whereNull('used_at')
                ->where('expires_at', '>', Carbon::now())
                ->latest()
                ->first();

            if (!$record) {
                return response()->json([
                    'message' => 'OTP not found or expired. Please request a new OTP.'
                ], 404);
            }

            if (!Hash::check($otp, $record->otp_hash)) {
                return response()->json([
                    'message' => 'Invalid OTP'
                ], 422);
            }

            $record->used_at = Carbon::now();
            $record->save();

            //update user's phone_verified_at
            $user->phone_number = $phone;
            $user->phone_verified_at = Carbon::now();
            $user->save();

            return response()->json([
                'message' => 'Phone number verified successfully.'
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ], 500);
        }

    }
}
