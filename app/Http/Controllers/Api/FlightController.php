<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use App\Models\Flight;
use App\Models\FlightFare;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FlightController extends Controller
{
    public function search(Request $request)
    {
        $validated = $request->validate([
            'origin' => 'required|string|size:3',
            'destination' => 'required|string|size:3|different:origin',
            'date' => 'required|date_format:Y-m-d',
            'passengers' => 'nullable|integer|min:1|max:5',
            'cabin' => 'nullable|string|in:economy,business',
            'sort' => 'nullable|string|in:price_asc,departure_asc,duration_asc',
            'airline_id' => 'nullable|integer',
            'time_filter' => 'nullable|string|in:pagi,siang,sore,malam',
        ]);

        $originCode = strtoupper($validated['origin']);
        $destCode = strtoupper($validated['destination']);
        $dateStr = $validated['date'];
        $passengers = (int) ($validated['passengers'] ?? 1);
        $cabin = $validated['cabin'] ?? 'economy';

        $originAirport = Airport::where('iata_code', $originCode)->first();
        if (!$originAirport && $originCode === 'YIA') {
            $originAirport = Airport::where('iata_code', 'JOG')->first();
        } elseif (!$originAirport && $originCode === 'JOG') {
            $originAirport = Airport::where('iata_code', 'YIA')->first();
        }

        $destAirport = Airport::where('iata_code', $destCode)->first();
        if (!$destAirport && $destCode === 'YIA') {
            $destAirport = Airport::where('iata_code', 'JOG')->first();
        } elseif (!$destAirport && $destCode === 'JOG') {
            $destAirport = Airport::where('iata_code', 'YIA')->first();
        }

        if (!$originAirport || !$destAirport) {
            return response()->json([
                'origin' => $originAirport ?: ['iata_code' => $originCode, 'city' => $originCode, 'name' => $originCode],
                'destination' => $destAirport ?: ['iata_code' => $destCode, 'city' => $destCode, 'name' => $destCode],
                'date' => $dateStr,
                'passengers' => $passengers,
                'cabin' => $cabin,
                'date_strip' => [],
                'flights' => [],
            ]);
        }

        // Convert the local date at the origin airport to UTC range
        $originTz = $originAirport->timezone ?: 'Asia/Jakarta';
        $localStart = Carbon::createFromFormat('Y-m-d H:i:s', "{$dateStr} 00:00:00", $originTz);
        $localEnd = Carbon::createFromFormat('Y-m-d H:i:s', "{$dateStr} 23:59:59", $originTz);

        $utcStart = $localStart->copy()->setTimezone('UTC');
        $utcEnd = $localEnd->copy()->setTimezone('UTC');

        // Subquery for taken seats
        $nowUtc = Carbon::now('UTC')->toDateTimeString();

        $takenSeatsSub = DB::table('booking_passengers')
            ->join('bookings', 'bookings.id', '=', 'booking_passengers.booking_id')
            ->select('bookings.flight_id', DB::raw('COUNT(*) as taken_count'))
            ->where('bookings.cabin_class', $cabin)
            ->where(function ($query) use ($nowUtc) {
                $query->where('bookings.status', 'paid')
                      ->orWhere(function ($q) use ($nowUtc) {
                          $q->where('bookings.status', 'pending_payment')
                            ->where('bookings.expires_at', '>', $nowUtc);
                      });
            })
            ->groupBy('bookings.flight_id');

        $query = Flight::query()
            ->with(['airline', 'originAirport', 'destinationAirport'])
            ->join('airlines', 'airlines.id', '=', 'flights.airline_id')
            ->join('flight_fares', function ($join) use ($cabin) {
                $join->on('flight_fares.flight_id', '=', 'flights.id')
                     ->where('flight_fares.cabin_class', '=', $cabin);
            })
            ->leftJoinSub($takenSeatsSub, 'taken', function ($join) {
                $join->on('taken.flight_id', '=', 'flights.id');
            })
            ->where('flights.origin_airport_id', $originAirport->id)
            ->where('flights.destination_airport_id', $destAirport->id)
            ->whereBetween('flights.departure_at', [$utcStart, $utcEnd])
            ->select(
                'flights.*',
                'flight_fares.price as fare_price',
                'flight_fares.seats_total as fare_seats_total',
                DB::raw('(flight_fares.seats_total - COALESCE(taken.taken_count, 0)) as seats_left'),
                DB::raw('TIMESTAMPDIFF(MINUTE, flights.departure_at, flights.arrival_at) as duration_minutes')
            )
            ->having('seats_left', '>=', $passengers);

        // Filters
        if (!empty($validated['airline_id'])) {
            $query->where('flights.airline_id', $validated['airline_id']);
        }

        // Sorting
        $sort = $validated['sort'] ?? 'price_asc';
        if ($sort === 'departure_asc') {
            $query->orderBy('flights.departure_at', 'asc');
        } elseif ($sort === 'duration_asc') {
            $query->orderBy('duration_minutes', 'asc');
        } else {
            $query->orderBy('fare_price', 'asc');
        }

        $rawFlights = $query->get();

        // Format flight output with timezone information
        $destTz = $destAirport->timezone ?: 'Asia/Makassar';

        $flights = $rawFlights->map(function ($f) use ($originTz, $destTz) {
            $depCarbon = Carbon::parse($f->departure_at)->setTimezone($originTz);
            $arrCarbon = Carbon::parse($f->arrival_at)->setTimezone($destTz);

            // Time of day bucket (pagi: 04:00-11:00, siang: 11:00-15:00, sore: 15:00-18:30, malam: 18:30-04:00)
            $depHour = (int) $depCarbon->format('G');
            $depMin = (int) $depCarbon->format('i');
            $timeSlot = 'malam';
            if ($depHour >= 4 && $depHour < 11) {
                $timeSlot = 'pagi';
            } elseif ($depHour >= 11 && $depHour < 15) {
                $timeSlot = 'siang';
            } elseif ($depHour >= 15 && ($depHour < 18 || ($depHour == 18 && $depMin <= 30))) {
                $timeSlot = 'sore';
            }

            return [
                'id' => $f->id,
                'flight_number' => $f->flight_number,
                'airline' => [
                    'id' => $f->airline->id,
                    'code' => $f->airline->code,
                    'name' => $f->airline->name,
                    'brand_color' => $f->airline->brand_color,
                ],
                'origin' => [
                    'iata_code' => $f->originAirport->iata_code,
                    'city' => $f->originAirport->city,
                    'name' => $f->originAirport->name,
                    'timezone' => $originTz,
                ],
                'destination' => [
                    'iata_code' => $f->destinationAirport->iata_code,
                    'city' => $f->destinationAirport->city,
                    'name' => $f->destinationAirport->name,
                    'timezone' => $destTz,
                ],
                'departure_at' => $f->departure_at,
                'arrival_at' => $f->arrival_at,
                'local_departure_time' => $depCarbon->format('H:i'),
                'local_arrival_time' => $arrCarbon->format('H:i'),
                'local_departure_date' => $depCarbon->format('Y-m-d'),
                'local_arrival_date' => $arrCarbon->format('Y-m-d'),
                'duration_minutes' => (int) $f->duration_minutes,
                'price' => (int) $f->fare_price,
                'seats_total' => (int) $f->fare_seats_total,
                'seats_left' => (int) $f->seats_left,
                'time_slot' => $timeSlot,
            ];
        });

        // Apply time_filter if requested
        if (!empty($validated['time_filter'])) {
            $flights = $flights->where('time_slot', $validated['time_filter'])->values();
        }

        // Calculate ±3 days date strip (PRD S5)
        $dateStrip = [];
        for ($i = -3; $i <= 3; $i++) {
            $stripDate = Carbon::parse($dateStr)->addDays($i);
            $stripLocalStart = Carbon::createFromFormat('Y-m-d H:i:s', $stripDate->format('Y-m-d') . " 00:00:00", $originTz)->setTimezone('UTC');
            $stripLocalEnd = Carbon::createFromFormat('Y-m-d H:i:s', $stripDate->format('Y-m-d') . " 23:59:59", $originTz)->setTimezone('UTC');

            $minFare = DB::table('flights')
                ->join('flight_fares', function ($join) use ($cabin) {
                    $join->on('flight_fares.flight_id', '=', 'flights.id')
                         ->where('flight_fares.cabin_class', '=', $cabin);
                })
                ->where('flights.origin_airport_id', $originAirport->id)
                ->where('flights.destination_airport_id', $destAirport->id)
                ->whereBetween('flights.departure_at', [$stripLocalStart, $stripLocalEnd])
                ->min('flight_fares.price');

            $dateStrip[] = [
                'date' => $stripDate->format('Y-m-d'),
                'day_name' => $stripDate->locale('id')->isoFormat('dddd'),
                'formatted' => $stripDate->locale('id')->isoFormat('D MMM'),
                'is_selected' => $stripDate->format('Y-m-d') === $dateStr,
                'min_price' => $minFare ? (int) $minFare : null,
            ];
        }

        return response()->json([
            'origin' => $originAirport,
            'destination' => $destAirport,
            'date' => $dateStr,
            'passengers' => $passengers,
            'cabin' => $cabin,
            'date_strip' => $dateStrip,
            'flights' => $flights,
        ]);
    }

    public function seats(Request $request, $id)
    {
        $cabin = $request->get('cabin', 'economy');
        $flight = Flight::with(['airline', 'originAirport', 'destinationAirport', 'fares'])->findOrFail($id);

        $fare = $flight->fares()->where('cabin_class', $cabin)->firstOrFail();
        $takenSeats = $flight->getTakenSeatNumbers($cabin);

        if ($cabin === 'business') {
            $rows = [1, 2, 3, 4];
            $cols = ['A', 'C', 'D', 'F']; // 2-2 pattern
            $pattern = '2-2';
        } else {
            $rows = range(5, 24);
            $cols = ['A', 'B', 'C', 'D', 'E', 'F']; // 3-3 pattern
            $pattern = '3-3';
        }

        return response()->json([
            'flight' => $flight,
            'cabin' => $cabin,
            'rows' => $rows,
            'cols' => $cols,
            'pattern' => $pattern,
            'taken_seats' => $takenSeats,
            'seats_total' => $fare->seats_total,
            'seats_left' => max(0, $fare->seats_total - count($takenSeats)),
            'price' => $fare->price,
        ]);
    }
}
