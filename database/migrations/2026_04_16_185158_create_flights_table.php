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
    Schema::create('flights', function (Blueprint $table) {
        $table->id();
        $table->string('flight_number')->unique();
        
        $table->foreignId('departure_airport_id')->constrained('airports')->onDelete('cascade');
        $table->foreignId('arrival_airport_id')->constrained('airports')->onDelete('cascade');
        
        $table->dateTime('departure_time');
       
        
        $table->foreignId('aircraft_id')->constrained('aircrafts'); 
        $table->dateTime('arrival_time');
        $table->integer('base_price');
        $table->integer('available_seats');
        $table->string('status')->default('scheduled');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flights');
    }
};
