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
    Schema::create('boarding_passes', function (Blueprint $table) {
        $table->id();
        $table->foreignId('ticket_id')->unique()->constrained()->onDelete('cascade'); // UNIQUE = 1-1
        $table->string('qr_code_url')->nullable();
        $table->string('gate', 10); // Cổng số mấy
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('boarding_passes');
    }
};
