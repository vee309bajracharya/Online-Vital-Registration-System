<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        //if no user is authenticated
        if(!$user){
            return response()->json(['message'=>'Unauthorized'],401);
        }

        //check if user role is in the allowed roles
        if(!in_array($user->role, $roles)){
            return response()->json(['message'=>'Forbidden - No Permissions'],403);
        }

        return $next($request);
    }
}
