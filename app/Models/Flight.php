<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Flight extends Model
{
    use HasFactory;

    protected $fillable = [
        'airline_id',
        'flight_number',
        'origin_airport_id',
        'destination_airport_id',
        'departure_at',
        'arrival_at',
    ];

    protected $casts = [
        'departure_at' => 'datetime',
        'arrival_at' => 'datetime',
    ];

    public function airline()
    {
        return $this->belongsTo(Airline::class);
    }

    public function originAirport()
    {
        return $this->belongsTo(Airport::class, 'origin_airport_id');
    }

    public function destinationAirport()
    {
        return $this->belongsTo(Airport::class, 'destination_airport_id');
    }

    public function fares()
    {
        return $this->hasMany(FlightFare::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function getSeatsTakenCount(string $cabinClass): int
    {
        return BookingPassenger::whereHas('booking', function ($query) use ($cabinClass) {
            $query->where('flight_id', $this->id)
                ->where('cabin_class', $cabinClass)
                ->where(function ($q) {
                    $q->where('status', 'paid')
                      ->orWhere(function ($sub) {
                          $sub->where('status', 'pending_payment')
                              ->where('expires_at', '>', now());
                      });
                });
        })->count();
    }

    public function getTakenSeatNumbers(string $cabinClass): array
    {
        return BookingPassenger::whereHas('booking', function ($query) use ($cabinClass) {
            $query->where('flight_id', $this->id)
                ->where('cabin_class', $cabinClass)
                ->where(function ($q) {
                    $q->where('status', 'paid')
                      ->orWhere(function ($sub) {
                          $sub->where('status', 'pending_payment')
                              ->where('expires_at', '>', now());
                      });
                });
        })
        ->whereNotNull('seat_number')
        ->pluck('seat_number')
        ->all();
    }
}
