<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BoardingPass extends Model
{
    use HasFactory;

    protected $fillable = ['ticket_id', 'qr_code_url', 'gate'];

    // Thuộc về 1 Vé (Quan hệ 1-1)
    public function ticket() 
    {
        return $this->belongsTo(Ticket::class);
    }
}