<?php

namespace Database\Seeders;

use App\Models\Airport;
use Illuminate\Database\Seeder;

class AirportSeeder extends Seeder
{
    public function run(): void
    {
        $airports = [
            [
                'iata_code' => 'CGK',
                'name' => 'Bandara Internasional Soekarno-Hatta',
                'city' => 'Jakarta',
                'timezone' => 'Asia/Jakarta',
                'latitude' => -6.127500,
                'longitude' => 106.653700,
            ],
            [
                'iata_code' => 'DPS',
                'name' => 'Bandara Internasional I Gusti Ngurah Rai',
                'city' => 'Denpasar (Bali)',
                'timezone' => 'Asia/Makassar',
                'latitude' => -8.748200,
                'longitude' => 115.167200,
            ],
            [
                'iata_code' => 'SUB',
                'name' => 'Bandara Internasional Juanda',
                'city' => 'Surabaya',
                'timezone' => 'Asia/Jakarta',
                'latitude' => -7.379800,
                'longitude' => 112.787500,
            ],
            [
                'iata_code' => 'KNO',
                'name' => 'Bandara Internasional Kualanamu',
                'city' => 'Medan',
                'timezone' => 'Asia/Jakarta',
                'latitude' => 3.642200,
                'longitude' => 98.885300,
            ],
            [
                'iata_code' => 'UPG',
                'name' => 'Bandara Internasional Sultan Hasanuddin',
                'city' => 'Makassar',
                'timezone' => 'Asia/Makassar',
                'latitude' => -5.061700,
                'longitude' => 119.554000,
            ],
            [
                'iata_code' => 'JOG',
                'name' => 'Bandara Internasional Yogyakarta',
                'city' => 'Yogyakarta',
                'timezone' => 'Asia/Jakarta',
                'latitude' => -7.788200,
                'longitude' => 110.431800,
            ],
            [
                'iata_code' => 'BPN',
                'name' => 'Bandara Internasional Sultan Aji Muhammad Sulaiman Sepinggan',
                'city' => 'Balikpapan',
                'timezone' => 'Asia/Makassar',
                'latitude' => -1.268300,
                'longitude' => 116.894400,
            ],
            [
                'iata_code' => 'PLM',
                'name' => 'Bandara Internasional Sultan Mahmud Badaruddin II',
                'city' => 'Palembang',
                'timezone' => 'Asia/Jakarta',
                'latitude' => -2.898600,
                'longitude' => 104.700300,
            ],
            [
                'iata_code' => 'PKU',
                'name' => 'Bandara Internasional Sultan Syarif Kasim II',
                'city' => 'Pekanbaru',
                'timezone' => 'Asia/Jakarta',
                'latitude' => 0.460800,
                'longitude' => 101.444700,
            ],
            [
                'iata_code' => 'BDO',
                'name' => 'Bandara Husein Sastranegara',
                'city' => 'Bandung',
                'timezone' => 'Asia/Jakarta',
                'latitude' => -6.900600,
                'longitude' => 107.576100,
            ],
            [
                'iata_code' => 'SRG',
                'name' => 'Bandara Internasional Jenderal Ahmad Yani',
                'city' => 'Semarang',
                'timezone' => 'Asia/Jakarta',
                'latitude' => -6.974400,
                'longitude' => 110.375600,
            ],
            [
                'iata_code' => 'MDC',
                'name' => 'Bandara Internasional Sam Ratulangi',
                'city' => 'Manado',
                'timezone' => 'Asia/Makassar',
                'latitude' => 1.549200,
                'longitude' => 124.926100,
            ],
            [
                'iata_code' => 'PDG',
                'name' => 'Bandara Internasional Minangkabau',
                'city' => 'Padang',
                'timezone' => 'Asia/Jakarta',
                'latitude' => -0.786900,
                'longitude' => 100.280600,
            ],
            [
                'iata_code' => 'BTH',
                'name' => 'Bandara Internasional Hang Nadim',
                'city' => 'Batam',
                'timezone' => 'Asia/Jakarta',
                'latitude' => 1.121100,
                'longitude' => 104.118900,
            ],
            [
                'iata_code' => 'LOP',
                'name' => 'Bandara Internasional Lombok Zainuddin Abdul Madjid',
                'city' => 'Lombok (Praya)',
                'timezone' => 'Asia/Makassar',
                'latitude' => -8.758900,
                'longitude' => 116.275800,
            ],
            [
                'iata_code' => 'YIA',
                'name' => 'Bandara Internasional Yogyakarta (Kulon Progo)',
                'city' => 'Yogyakarta',
                'timezone' => 'Asia/Jakarta',
                'latitude' => -7.907200,
                'longitude' => 110.054400,
            ],
            [
                'iata_code' => 'LBJ',
                'name' => 'Bandara Komodo Labuan Bajo',
                'city' => 'Labuan Bajo',
                'timezone' => 'Asia/Makassar',
                'latitude' => -8.487900,
                'longitude' => 119.888700,
            ],
            [
                'iata_code' => 'SOQ',
                'name' => 'Bandara Domine Eduard Osok (Raja Ampat)',
                'city' => 'Sorong (Raja Ampat)',
                'timezone' => 'Asia/Jayapura',
                'latitude' => -0.891100,
                'longitude' => 131.287200,
            ],
        ];

        foreach ($airports as $airport) {
            Airport::updateOrCreate(['iata_code' => $airport['iata_code']], $airport);
        }
    }
}
