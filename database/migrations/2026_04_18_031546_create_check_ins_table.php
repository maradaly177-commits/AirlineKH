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
    Schema::create('check_ins', function (Blueprint $table) {
        $table->id();
        $table->foreignId('ticket_id')->constrained()->cascadeOnDelete(); // Quan hệ 1-1
        $table->string('boarding_gate')->nullable();
        $table->timestamp('boarding_time')->nullable();
        $table->string('qr_code_url')->nullable();
        $table->boolean('is_boarded')->default(false);
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('check_ins');
    }
};
