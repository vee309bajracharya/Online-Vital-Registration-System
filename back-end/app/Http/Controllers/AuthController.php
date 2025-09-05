<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    //===citizen auth====
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
            'role'=> 'USER', //default role
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
            'user'=>$user,
        ],200); // 200 OK
    }

    //logout user
    public function logout(Request $request){
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'message' => 'Logged out successfully'
        ],200); // 200 OK
    }

// ====================================================

    //===officer auth====
    public function loginOfficer(Request $request)
    {
        $request->validate([
            'login'=> 'required|string', //employee_id or email
            'password'=> 'required|string',
        ]);

        //find officer through email or employee_id
        $user = User::where('email', $request->login)
                ->orWhereHas('officerProfile', function($query) use ($request) {
                $query->where('employee_id', $request->login);
        })->first();
        
        if(!$user || $user->role !== 'OFFICER' || !Hash::check($request->password, $user->password)){
            return response()->json([
                'message' => 'Invalid officer credentials'
            ],401); // 401 Unauthorized
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Officer Logged in success',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user'=> $user,
        ],200); // 200 OK
        
    }

    public function logoutOfficer(Request $request){
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'message'=> 'Officer Logout success'
        ],200);
    }

// ====================================================

    //===admin auth====
    public function loginAdmin(Request $request){
        $credientals =  $request->validate([
            'email'=> 'required|string|email',
            'password'=>'required|string',
        ]);

        $user = User::where('email', $credientals['email'])->first();

        if(!$user || $user->role !== 'ADMIN' || !Hash::check($credientals['password'], $user->password)){
            return response()->json([
                'message'=> 'Invalid admin credentials',
            ],401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'message'=> 'Admin login success',
            'access_token'=> $token,
            'token_type'=> 'Bearer',
            'user'=> $user,
        ],200);
    }

    public function logoutAdmin(Request $request){
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'message'=> 'Admin Logout success'
        ],200);
    }

}
