<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'demo@1tiket.test'],
            [
                'name' => 'Budi Santoso',
                'phone' => '081234567890',
                'role' => 'customer',
                'password' => Hash::make('password'),
            ]
        );

        User::updateOrCreate(
            ['email' => 'admin@1tiket.com'],
            [
                'name' => 'Administrator 1Tiket',
                'phone' => '081299998888',
                'role' => 'admin',
                'password' => Hash::make('admin123'),
            ]
        );
    }
}
