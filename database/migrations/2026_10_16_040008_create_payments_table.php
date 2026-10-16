<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained('bookings')->onDelete('cascade');
            $table->foreignId('payment_method_id')->constrained('payment_methods')->onDelete('cascade');
            $table->string('reference_code', 40)->unique();
            $table->integer('amount');
            $table->enum('status', ['pending', 'success', 'failed', 'expired'])->default('pending');
            $table->dateTime('expires_at');
            $table->dateTime('paid_at')->nullable();
            $table->timestamps();

            $table->index(['booking_id', 'status'], 'idx_payments_booking');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
