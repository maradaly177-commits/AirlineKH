<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seats', function (Blueprint $table) {

    $table->id();

    $table->foreignId('aircraft_id')
    ->constrained('aircrafts')
    ->cascadeOnDelete();

    $table->string('seat_number');

    $table->string('seat_class')->default('economy');

    $table->string('status')->default('available');

    $table->timestamps();

    $table->unique(['aircraft_id', 'seat_number']);
});
    }

    public function down(): void
    {
        Schema::dropIfExists('seats');
    }
};