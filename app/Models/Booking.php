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
        'trip_type',
        'return_flight_id',
        'return_unit_price',
        'return_cabin_class',
        'return_check_in_at',
        'voucher_code',
        'discount_amount',
        'addons_total',
        'addons_data',
        'expires_at',
        'paid_at',
        'check_in_at',
        'boarding_pass_issued',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'paid_at' => 'datetime',
        'check_in_at' => 'datetime',
        'return_check_in_at' => 'datetime',
        'addons_data' => 'array',
        'boarding_pass_issued' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function flight()
    {
        return $this->belongsTo(Flight::class);
    }

    public function returnFlight()
    {
        return $this->belongsTo(Flight::class, 'return_flight_id');
    }

    public function passengers()
    {
        return $this->hasMany(BookingPassenger::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class)->latestOfMany();
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
