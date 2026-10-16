<?php

namespace Database\Seeders;

use App\Models\Airline;
use Illuminate\Database\Seeder;

class AirlineSeeder extends Seeder
{
    public function run(): void
    {
        $airlines = [
            [
                'code' => 'NA',
                'name' => 'Nusa Air',
                'brand_color' => '#0E2A47',
            ],
            [
                'code' => 'BW',
                'name' => 'Bayu Wings',
                'brand_color' => '#0284C7',
            ],
            [
                'code' => 'CA',
                'name' => 'Camar Air',
                'brand_color' => '#F26A21',
            ],
            [
                'code' => 'PJ',
                'name' => 'Pelita Jet',
                'brand_color' => '#059669',
            ],
        ];

        foreach ($airlines as $airline) {
            Airline::updateOrCreate(['code' => $airline['code']], $airline);
        }
    }
}
