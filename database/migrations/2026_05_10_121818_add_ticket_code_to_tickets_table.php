<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tickets', function (Blueprint $table) {

            $table->string('ticket_code')
                ->unique()
                ->after('id');

            $table->string('status')
                ->default('active')
                ->after('ticket_code');

        });
    }

    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {

            $table->dropColumn([
                'ticket_code',
                'status'
            ]);

        });
    }
};