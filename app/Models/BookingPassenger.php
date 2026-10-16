<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookingPassenger extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'title',
        'full_name',
        'id_number',
        'seat_number',
        'ticket_number',
        'return_seat_number',
        'return_ticket_number',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
}
