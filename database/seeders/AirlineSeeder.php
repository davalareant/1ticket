<?php

namespace Database\Seeders;

use App\Models\Airline;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AirlineSeeder extends Seeder
{
    public function run(): void
    {
        $realAirlines = [
            1 => [
                'code' => 'GA',
                'name' => 'Garuda Indonesia',
                'brand_color' => '#0E2A47',
            ],
            2 => [
                'code' => 'QG',
                'name' => 'Citilink',
                'brand_color' => '#008444',
            ],
            3 => [
                'code' => 'JT',
                'name' => 'Lion Air',
                'brand_color' => '#D32F2F',
            ],
            4 => [
                'code' => 'ID',
                'name' => 'Batik Air',
                'brand_color' => '#880E4F',
            ],
            6 => [
                'code' => 'IP',
                'name' => 'Pelita Air',
                'brand_color' => '#008850',
            ],
            7 => [
                'code' => 'SJ',
                'name' => 'Sriwijaya Air',
                'brand_color' => '#155E75',
            ],
            8 => [
                'code' => 'QZ',
                'name' => 'AirAsia Indonesia',
                'brand_color' => '#E11D48',
            ],
        ];

        foreach ($realAirlines as $id => $airline) {
            DB::table('airlines')->updateOrInsert(
                ['id' => $id],
                array_merge($airline, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ])
            );
        }

        // Pastikan Super Air Jet terhapus jika sebelumnya pernah di-seed
        DB::table('airlines')->where('code', 'IU')->orWhere('name', 'Super Air Jet')->delete();

        // Update flight numbers in flights table to match the new real airline codes
        $flightPrefixes = [
            1 => 'GA',
            2 => 'QG',
            3 => 'JT',
            4 => 'ID',
            6 => 'IP',
            7 => 'SJ',
            8 => 'QZ',
        ];

        foreach ($flightPrefixes as $airlineId => $prefix) {
            // Update flight numbers where airline_id matches
            DB::statement("
                UPDATE flights 
                SET flight_number = CONCAT('{$prefix}', SUBSTRING(flight_number, 3))
                WHERE airline_id = {$airlineId}
            ");
        }
    }
}
