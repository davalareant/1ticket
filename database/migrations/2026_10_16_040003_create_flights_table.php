<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('flights', function (Blueprint $table) {
            $table->id();
            $table->foreignId('airline_id')->constrained('airlines')->onDelete('cascade');
            $table->string('flight_number', 10);
            $table->foreignId('origin_airport_id')->constrained('airports')->onDelete('cascade');
            $table->foreignId('destination_airport_id')->constrained('airports')->onDelete('cascade');
            $table->dateTime('departure_at');
            $table->dateTime('arrival_at');
            $table->timestamps();

            $table->index(['origin_airport_id', 'destination_airport_id', 'departure_at'], 'idx_flights_search');
            $table->unique(['airline_id', 'flight_number', 'departure_at'], 'uq_flights_schedule');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('flights');
    }
};
