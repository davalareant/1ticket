<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('booking_passengers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained('bookings')->onDelete('cascade');
            $table->string('title', 10);
            $table->string('full_name', 100);
            $table->string('id_number', 20);
            $table->string('seat_number', 4)->nullable();
            $table->string('ticket_number', 16)->nullable()->unique();
            $table->timestamps();

            $table->index(['booking_id'], 'idx_passengers_booking');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('booking_passengers');
    }
};
