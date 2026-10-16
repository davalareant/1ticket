<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_code', 8)->unique();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('flight_id')->constrained('flights')->onDelete('cascade');
            $table->enum('cabin_class', ['economy', 'business']);
            $table->unsignedTinyInteger('passenger_count');
            $table->integer('unit_price');
            $table->integer('admin_fee')->default(5000);
            $table->integer('total_amount');
            $table->string('contact_name', 100);
            $table->string('contact_email', 150);
            $table->string('contact_phone', 20);
            $table->enum('status', ['pending_payment', 'paid', 'expired', 'cancelled'])->default('pending_payment');
            $table->dateTime('expires_at');
            $table->dateTime('paid_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'created_at'], 'idx_bookings_user');
            $table->index(['flight_id', 'status'], 'idx_bookings_flight_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
