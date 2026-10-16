<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('flight_fares', function (Blueprint $table) {
            $table->id();
            $table->foreignId('flight_id')->constrained('flights')->onDelete('cascade');
            $table->enum('cabin_class', ['economy', 'business']);
            $table->integer('price');
            $table->smallInteger('seats_total');
            $table->timestamps();

            $table->unique(['flight_id', 'cabin_class'], 'uq_fare_per_cabin');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('flight_fares');
    }
};
