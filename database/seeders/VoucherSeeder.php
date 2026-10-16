<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class VoucherSeeder extends Seeder
{
    public function run(): void
    {
        $vouchers = [
            [
                'code' => 'TERBANGHEMAT',
                'name' => 'Diskon Spesial Jelajah Nusantara 10%',
                'description' => 'Potongan 10% hingga Rp150.000 untuk seluruh rute domestik tanpa batas minimum pemesanan.',
                'discount_type' => 'percent',
                'discount_value' => 10,
                'min_spend' => 300000,
                'max_discount' => 150000,
                'quota' => 200,
                'used_count' => 12,
                'is_active' => true,
                'expires_at' => Carbon::now()->addMonths(6),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'LIBURANSERU',
                'name' => 'Potongan Langsung Liburan Seru',
                'description' => 'Potongan langsung Rp100.000 untuk penerbangan keluarga dan wisata.',
                'discount_type' => 'fixed',
                'discount_value' => 100000,
                'min_spend' => 700000,
                'max_discount' => 100000,
                'quota' => 150,
                'used_count' => 5,
                'is_active' => true,
                'expires_at' => Carbon::now()->addMonths(6),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'SATUTIKET',
                'name' => 'Diskon Pelanggan Baru 1Tiket',
                'description' => 'Potongan 15% maksimal Rp75.000 untuk pemesanan pertama.',
                'discount_type' => 'percent',
                'discount_value' => 15,
                'min_spend' => 250000,
                'max_discount' => 75000,
                'quota' => 500,
                'used_count' => 34,
                'is_active' => true,
                'expires_at' => Carbon::now()->addMonths(6),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('vouchers')->insert($vouchers);
    }
}
