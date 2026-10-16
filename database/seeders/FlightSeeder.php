<?php

namespace Database\Seeders;

use App\Models\Airline;
use App\Models\Airport;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FlightSeeder extends Seeder
{
    public function run(): void
    {
        $airlines = Airline::all()->keyBy('code');
        $airports = Airport::all()->keyBy('iata_code');

        if ($airlines->isEmpty() || $airports->isEmpty()) {
            return;
        }

        // Popular routes with duration in minutes and base price
        $routes = [
            // Major trunk routes (high frequency)
            ['origin' => 'CGK', 'dest' => 'DPS', 'duration' => 110, 'base_eco' => 850000, 'daily' => 5],
            ['origin' => 'DPS', 'dest' => 'CGK', 'duration' => 110, 'base_eco' => 850000, 'daily' => 5],
            ['origin' => 'CGK', 'dest' => 'SUB', 'duration' => 90,  'base_eco' => 750000, 'daily' => 4],
            ['origin' => 'SUB', 'dest' => 'CGK', 'duration' => 90,  'base_eco' => 750000, 'daily' => 4],
            ['origin' => 'CGK', 'dest' => 'KNO', 'duration' => 135, 'base_eco' => 1100000, 'daily' => 4],
            ['origin' => 'KNO', 'dest' => 'CGK', 'duration' => 135, 'base_eco' => 1100000, 'daily' => 4],
            ['origin' => 'SUB', 'dest' => 'UPG', 'duration' => 95,  'base_eco' => 890000, 'daily' => 3],
            ['origin' => 'UPG', 'dest' => 'SUB', 'duration' => 95,  'base_eco' => 890000, 'daily' => 3],
            ['origin' => 'CGK', 'dest' => 'UPG', 'duration' => 140, 'base_eco' => 1250000, 'daily' => 3],
            ['origin' => 'UPG', 'dest' => 'CGK', 'duration' => 140, 'base_eco' => 1250000, 'daily' => 3],
            ['origin' => 'CGK', 'dest' => 'JOG', 'duration' => 70,  'base_eco' => 620000, 'daily' => 3],
            ['origin' => 'JOG', 'dest' => 'CGK', 'duration' => 70,  'base_eco' => 620000, 'daily' => 3],
            ['origin' => 'CGK', 'dest' => 'BPN', 'duration' => 130, 'base_eco' => 1150000, 'daily' => 3],
            ['origin' => 'BPN', 'dest' => 'CGK', 'duration' => 130, 'base_eco' => 1150000, 'daily' => 3],
            ['origin' => 'CGK', 'dest' => 'PLM', 'duration' => 65,  'base_eco' => 580000, 'daily' => 2],
            ['origin' => 'PLM', 'dest' => 'CGK', 'duration' => 65,  'base_eco' => 580000, 'daily' => 2],
            ['origin' => 'CGK', 'dest' => 'PKU', 'duration' => 100, 'base_eco' => 920000, 'daily' => 2],
            ['origin' => 'PKU', 'dest' => 'CGK', 'duration' => 100, 'base_eco' => 920000, 'daily' => 2],
            ['origin' => 'CGK', 'dest' => 'BTH', 'duration' => 105, 'base_eco' => 950000, 'daily' => 2],
            ['origin' => 'BTH', 'dest' => 'CGK', 'duration' => 105, 'base_eco' => 950000, 'daily' => 2],
            ['origin' => 'SUB', 'dest' => 'DPS', 'duration' => 55,  'base_eco' => 490000, 'daily' => 3],
            ['origin' => 'DPS', 'dest' => 'SUB', 'duration' => 55,  'base_eco' => 490000, 'daily' => 3],
            ['origin' => 'DPS', 'dest' => 'LOP', 'duration' => 40,  'base_eco' => 380000, 'daily' => 2],
            ['origin' => 'LOP', 'dest' => 'DPS', 'duration' => 40,  'base_eco' => 380000, 'daily' => 2],
            ['origin' => 'CGK', 'dest' => 'LOP', 'duration' => 120, 'base_eco' => 780000, 'daily' => 3],
            ['origin' => 'LOP', 'dest' => 'CGK', 'duration' => 120, 'base_eco' => 780000, 'daily' => 3],
            ['origin' => 'CGK', 'dest' => 'YIA', 'duration' => 70,  'base_eco' => 620000, 'daily' => 3],
            ['origin' => 'YIA', 'dest' => 'CGK', 'duration' => 70,  'base_eco' => 620000, 'daily' => 3],
            ['origin' => 'CGK', 'dest' => 'LBJ', 'duration' => 145, 'base_eco' => 1450000, 'daily' => 3],
            ['origin' => 'LBJ', 'dest' => 'CGK', 'duration' => 145, 'base_eco' => 1450000, 'daily' => 3],
            ['origin' => 'CGK', 'dest' => 'SOQ', 'duration' => 240, 'base_eco' => 2350000, 'daily' => 2],
            ['origin' => 'SOQ', 'dest' => 'CGK', 'duration' => 240, 'base_eco' => 2350000, 'daily' => 2],
            ['origin' => 'UPG', 'dest' => 'MDC', 'duration' => 105, 'base_eco' => 980000, 'daily' => 2],
        ];

        $airlineList = $airlines->values();
        $departureSlots = [
            // slot times in local hours
            ['hour' => 6,  'minute' => 0,  'factor' => 0.95],
            ['hour' => 9,  'minute' => 30, 'factor' => 1.05],
            ['hour' => 13, 'minute' => 15, 'factor' => 1.00],
            ['hour' => 16, 'minute' => 45, 'factor' => 1.10],
            ['hour' => 19, 'minute' => 30, 'factor' => 0.90],
        ];

        $today = Carbon::today('UTC');
        $now = Carbon::now('UTC');

        $flightBatch = [];
        $fareBatch = [];
        $flightCounter = (int) (DB::table('flights')->max('id') ?? 0) + 1;

        // Pre-create sequences
        foreach ($routes as $routeIndex => $r) {
            $origin = $airports[$r['origin']] ?? null;
            $dest = $airports[$r['dest']] ?? null;

            if (!$origin || !$dest) {
                continue;
            }

            // Skip if this route already has scheduled flights
            $alreadyExists = DB::table('flights')
                ->where('origin_airport_id', $origin->id)
                ->where('destination_airport_id', $dest->id)
                ->exists();
            if ($alreadyExists) {
                continue;
            }

            // Timezone offset for origin airport to calculate accurate UTC departure
            $originTz = new \DateTimeZone($origin->timezone);

            for ($day = 0; $day < 60; $day++) {
                $currentDay = $today->copy()->addDays($day);

                $dailyCount = min($r['daily'], count($departureSlots));
                for ($slot = 0; $slot < $dailyCount; $slot++) {
                    $airline = $airlineList[($routeIndex + $slot + $day) % $airlineList->count()];
                    $timeSlot = $departureSlots[$slot];

                    // Local departure time
                    $localDep = Carbon::create(
                        $currentDay->year,
                        $currentDay->month,
                        $currentDay->day,
                        $timeSlot['hour'],
                        $timeSlot['minute'],
                        0,
                        $origin->timezone
                    );

                    // Convert to UTC
                    $depUtc = $localDep->copy()->setTimezone('UTC');
                    $arrUtc = $depUtc->copy()->addMinutes($r['duration']);

                    $flightNum = $airline->code . (100 + ($routeIndex * 10) + $slot + 1);

                    $flightBatch[] = [
                        'id' => $flightCounter,
                        'airline_id' => $airline->id,
                        'flight_number' => $flightNum,
                        'origin_airport_id' => $origin->id,
                        'destination_airport_id' => $dest->id,
                        'departure_at' => $depUtc->format('Y-m-d H:i:s'),
                        'arrival_at' => $arrUtc->format('Y-m-d H:i:s'),
                        'created_at' => $now->format('Y-m-d H:i:s'),
                        'updated_at' => $now->format('Y-m-d H:i:s'),
                    ];

                    // Economy price: round to nearest 10,000
                    $ecoPrice = round(($r['base_eco'] * $timeSlot['factor']) / 10000) * 10000;
                    // Business price ~2.2x to 2.5x economy
                    $bizPrice = round(($ecoPrice * 2.3) / 50000) * 50000;

                    $fareBatch[] = [
                        'flight_id' => $flightCounter,
                        'cabin_class' => 'economy',
                        'price' => (int) $ecoPrice,
                        'seats_total' => 120,
                        'created_at' => $now->format('Y-m-d H:i:s'),
                        'updated_at' => $now->format('Y-m-d H:i:s'),
                    ];

                    $fareBatch[] = [
                        'flight_id' => $flightCounter,
                        'cabin_class' => 'business',
                        'price' => (int) $bizPrice,
                        'seats_total' => 16,
                        'created_at' => $now->format('Y-m-d H:i:s'),
                        'updated_at' => $now->format('Y-m-d H:i:s'),
                    ];

                    $flightCounter++;

                    // Chunk inserts to keep memory low and speed fast
                    if (count($flightBatch) >= 500) {
                        DB::table('flights')->insert($flightBatch);
                        DB::table('flight_fares')->insert($fareBatch);
                        $flightBatch = [];
                        $fareBatch = [];
                    }
                }
            }
        }

        if (!empty($flightBatch)) {
            DB::table('flights')->insert($flightBatch);
            DB::table('flight_fares')->insert($fareBatch);
        }
    }
}
