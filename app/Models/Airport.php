<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Airport extends Model
{
    use HasFactory;

    protected $fillable = ['code', 'name', 'city'];

    // 1 Sân bay có nhiều Chuyến bay CẤT CÁNH (1-n)
    public function departingFlights() 
    {
        return $this->hasMany(Flight::class, 'departure_airport_id');
    }

    // 1 Sân bay có nhiều Chuyến bay HẠ CÁNH (1-n)
    public function arrivingFlights() 
    {
        return $this->hasMany(Flight::class, 'arrival_airport_id');
    }
}