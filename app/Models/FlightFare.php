<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FlightFare extends Model
{
    use HasFactory;

    protected $fillable = [
        'flight_id',
        'cabin_class',
        'price',
        'seats_total',
    ];

    public function flight()
    {
        return $this->belongsTo(Flight::class);
    }
}
