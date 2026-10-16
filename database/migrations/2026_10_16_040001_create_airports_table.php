<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('airports', function (Blueprint $table) {
            $table->id();
            $table->char('iata_code', 3)->unique();
            $table->string('name', 150);
            $table->string('city', 100);
            $table->string('timezone', 40)->default('Asia/Jakarta');
            $table->decimal('latitude', 9, 6);
            $table->decimal('longitude', 9, 6);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('airports');
    }
};
