<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_code',
        'user_id',
        'flight_id',
        'cabin_class',
        'passenger_count',
        'unit_price',
        'admin_fee',
        'total_amount',
        'contact_name',
        'contact_email',
        'contact_phone',
        'status',
        'expires_at',
        'paid_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'paid_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function flight()
    {
        return $this->belongsTo(Flight::class);
    }

    public function passengers()
    {
        return $this->hasMany(BookingPassenger::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function checkAndExpire(): bool
    {
        if ($this->status === 'pending_payment' && $this->expires_at && $this->expires_at->isPast()) {
            $this->status = 'expired';
            $this->save();

            // Also expire pending payments
            $this->payments()->where('status', 'pending')->update(['status' => 'expired']);
            return true;
        }

        return false;
    }
}
