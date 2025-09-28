<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class EnsurePhoneIsVerified
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */

        public function handle(Request $request, Closure $next): Response{
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized - User not authenticated.',
                'error' => 'no_user'
            ], 401);
        }
    
        
        // Check if phone is verified
        if (is_null($user->phone_verified_at)) {
            return response()->json([
                'message' => 'Phone number not verified. Please verify your phone number to access this resource.',
                'error' => 'phone_not_verified',
                'phone_verified_at' => $user->phone_verified_at
            ], 403);
        }
        
        return $next($request);
    }

}
