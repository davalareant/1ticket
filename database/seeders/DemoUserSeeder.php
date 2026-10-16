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
                'password' => Hash::make('password'),
            ]
        );
    }
}
