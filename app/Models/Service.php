<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'price', 'type'];

    // 1 Dịch vụ nằm trong nhiều Đơn hàng (n-n)
    public function bookings() 
    {
        return $this->belongsToMany(Booking::class)
                    ->withPivot('quantity', 'price_at_purchase')
                    ->withTimestamps();
    }
}