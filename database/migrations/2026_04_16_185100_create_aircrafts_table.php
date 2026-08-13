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
        // 1. Tạo bảng cha trước (AIRCRAFTS)
        Schema::create('aircrafts', function (Blueprint $table) {
            $table->id();
            $table->string('tail_number')->unique();
            $table->string('model');
            $table->tinyInteger('status')->default(1);
            $table->timestamps();
        });

        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
{
    
    Schema::dropIfExists('aircrafts'); // Xóa cha sau
}
};