<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Aircraft extends Model
{
    use HasFactory;

    
    protected $table = 'aircrafts'; 

    protected $fillable = ['tail_number', 'model', 'status'];

    public function seats()
    {
        return $this->hasMany(Seat::class);
    }
}