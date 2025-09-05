<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {

        //Districts
        Schema::create('districts', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });

        //Municipalities
        Schema::create('municipalities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('district_id')->constrained('districts')->cascadeOnDelete();
            $table->string('name');
            $table->string('type')->nullable(); //e.g., Metropolitan, Sub-Metropolitan, Municipality
            $table->unsignedSmallInteger('ward_count')->default(1);
            $table->timestamps();
            $table->unique(['district_id','name']);
        });

        //Officer Profiles -> Birth, Death and Migration officers
        Schema::create('officer_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete(); // link to users table
            $table->string('employee_id')->unique();
            $table->enum('function',['birth','death','migration']); // specific duties
            $table->foreignId('district_id')->constrained('districts')->cascadeOnDelete();
            $table->foreignId('municipality_id')->constrained('municipalities')->cascadeOnDelete();
            $table->unsignedSmallInteger('ward_number')->default(1);
            $table->enum('status',['active','suspended'])->default('active');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->unique(['function','municipality_id','ward_number'],'unique_function_municipality_ward');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('districts');
        Schema::dropIfExists('municipalities');
        Schema::dropIfExists('officer_profiles');
    }
};
