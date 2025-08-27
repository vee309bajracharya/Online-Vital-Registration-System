<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    //register new user
    public function register(Request $request){

        //validate the request data
        $request->validate([
            'name'=> 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        //create a new user
        $user = User::create([
            'name'=> $request->name,
            'email'=> $request->email,
            'password'=> Hash::make($request->password),
        ]);

        // sanctum token generate
        $token = $user->createToken('auth_token')->plainTextToken;

        //return token and user data
        return response()->json([
            'message' => 'User registered successfully',
            'access_token' => $token,
            'token_type' => 'Bearer',
        ],201); // 201 Created
    }

    //login user
    public function login(Request $request){

        //login request validation
        $credentials = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required',
        ]);

        //attempt to authenticate the user
        if(!Auth::attempt($credentials)){
            return response()->json([
                'message'=> 'Invalid credentials'
            ],401); // 401 Unauthorized
        }

        //retreive the authenticated user
        $user = $request->user();

        //new token generate
        $token = $user->createToken('auth_token')->plainTextToken;

        //return token and user data
        return response()->json([
            'message' => 'Logged in successfully',
            'access_token' => $token,
            'token_type' => 'Bearer',
        ],200); // 200 OK
    }

    //logout user
    public function logout(Request $request){
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'message' => 'Logged out successfully'
        ],200); // 200 OK
    }
}
