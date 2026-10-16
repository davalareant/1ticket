<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            if (!Schema::hasColumn('bookings', 'trip_type')) {
                $table->string('trip_type', 20)->default('one_way')->after('booking_code');
            }
            if (!Schema::hasColumn('bookings', 'return_flight_id')) {
                $table->foreignId('return_flight_id')->nullable()->after('flight_id')->constrained('flights')->nullOnDelete();
            }
            if (!Schema::hasColumn('bookings', 'return_unit_price')) {
                $table->integer('return_unit_price')->nullable()->after('unit_price');
            }
            if (!Schema::hasColumn('bookings', 'return_cabin_class')) {
                $table->string('return_cabin_class', 20)->nullable()->after('cabin_class');
            }
            if (!Schema::hasColumn('bookings', 'return_check_in_at')) {
                $table->dateTime('return_check_in_at')->nullable()->after('check_in_at');
            }
        });

        Schema::table('booking_passengers', function (Blueprint $table) {
            if (!Schema::hasColumn('booking_passengers', 'return_seat_number')) {
                $table->string('return_seat_number', 4)->nullable()->after('seat_number');
            }
            if (!Schema::hasColumn('booking_passengers', 'return_ticket_number')) {
                $table->string('return_ticket_number', 16)->nullable()->unique()->after('ticket_number');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('booking_passengers', function (Blueprint $table) {
            $table->dropColumn(['return_seat_number', 'return_ticket_number']);
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->dropForeign(['return_flight_id']);
            $table->dropColumn(['trip_type', 'return_flight_id', 'return_unit_price', 'return_cabin_class', 'return_check_in_at']);
        });
    }
};
