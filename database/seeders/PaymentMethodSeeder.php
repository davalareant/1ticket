<?php

namespace Database\Seeders;

use App\Models\PaymentMethod;
use Illuminate\Database\Seeder;

class PaymentMethodSeeder extends Seeder
{
    public function run(): void
    {
        $methods = [
            [
                'code' => 'qris',
                'name' => 'QRIS (Semua E-Wallet / Bank)',
                'type' => 'qris',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'code' => 'gopay',
                'name' => 'GoPay',
                'type' => 'ewallet',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'code' => 'ovo',
                'name' => 'OVO',
                'type' => 'ewallet',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'code' => 'dana',
                'name' => 'DANA',
                'type' => 'ewallet',
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'code' => 'shopeepay',
                'name' => 'ShopeePay',
                'type' => 'ewallet',
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'code' => 'bca_va',
                'name' => 'BCA Virtual Account',
                'type' => 'bank_transfer',
                'is_active' => true,
                'sort_order' => 6,
            ],
            [
                'code' => 'bni_va',
                'name' => 'BNI Virtual Account',
                'type' => 'bank_transfer',
                'is_active' => true,
                'sort_order' => 7,
            ],
            [
                'code' => 'bri_va',
                'name' => 'BRI Virtual Account',
                'type' => 'bank_transfer',
                'is_active' => true,
                'sort_order' => 8,
            ],
            [
                'code' => 'mandiri_va',
                'name' => 'Mandiri Virtual Account (Livin)',
                'type' => 'bank_transfer',
                'is_active' => true,
                'sort_order' => 9,
            ],
        ];

        foreach ($methods as $method) {
            PaymentMethod::updateOrCreate(['code' => $method['code']], $method);
        }
    }
}
