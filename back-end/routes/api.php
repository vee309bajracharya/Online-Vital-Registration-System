<?php

use App\Http\Controllers\AdminOfficerController;
use App\Http\Controllers\BirthDetailController;
use App\Http\Controllers\OfficerCertificateController;
use App\Http\Controllers\PhoneVerificationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;

//citizen auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

//officer auth routes
Route::post('/login-officer', [AuthController::class, 'loginOfficer']);
Route::post('/logout-officer', [AuthController::class, 'logoutOfficer'])->middleware('auth:sanctum');

//admin auth route
Route::post('/login-admin', [AuthController::class, 'loginAdmin']);
Route::post('/logout-admin', [AuthController::class, 'logoutAdmin'])->middleware('auth:sanctum');



//protected routes (requires token authentication)
Route::middleware('auth:sanctum')->group(function () {

    // user
    Route::get('/user/profile', [UserController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    //phone number otp verification routes (for USER)
    Route::middleware('role:USER')->group(function () {
        Route::post('/phone/otp/request', [PhoneVerificationController::class, 'requestOtp']);
        Route::post('/phone/otp/verify', [PhoneVerificationController::class, 'verifyOtp']);
    });

    //birth certificate related routes (for USER)
    Route::middleware(['role:USER','phone.verified'])->group(function () {
        Route::post('/birth-certificate/new', [BirthDetailController::class, 'store']);
        Route::get('/birth-certificates', [BirthDetailController::class, 'index']);
        Route::get('/birth-certificates/{id}', [BirthDetailController::class, 'show']);
        Route::put('/birth-certificates/{id}', [BirthDetailController::class, 'update']);
        Route::delete('/birth-certificates/{id}', [BirthDetailController::class, 'destroy']);
    });

    // officer mgmt (used by Admin only)
    Route::middleware('role:ADMIN')->group(function () {
        Route::get('/all-officers', [AdminOfficerController::class, 'index']);
        Route::get('/officer/{id}', [AdminOfficerController::class, 'show']);
        Route::post('/officers', [AdminOfficerController::class, 'store']);
        Route::put('/officers/{id}', [AdminOfficerController::class, 'update']);
        Route::delete('/officers/{id}', [AdminOfficerController::class, 'destroy']);
    });

    //certificates mgmt routes for officer
    Route::middleware('role:OFFICER')->group(function(){
        Route::get('/officer/certificates/pending', [OfficerCertificateController::class, 'getPendingCertificates']);
    });


});
