<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Vouchers table
        Schema::create('vouchers', function (Blueprint $table) {
            $table->id();
            $table->string('code', 30)->unique();
            $table->string('name', 100);
            $table->text('description')->nullable();
            $table->enum('discount_type', ['percent', 'fixed']);
            $table->integer('discount_value');
            $table->integer('min_spend')->default(0);
            $table->integer('max_discount')->nullable();
            $table->integer('quota')->default(100);
            $table->integer('used_count')->default(0);
            $table->boolean('is_active')->default(true);
            $table->dateTime('expires_at')->nullable();
            $table->timestamps();
        });

        // 2. Add columns to bookings
        Schema::table('bookings', function (Blueprint $table) {
            $table->string('voucher_code', 30)->nullable()->after('status');
            $table->integer('discount_amount')->default(0)->after('voucher_code');
            $table->integer('addons_total')->default(0)->after('discount_amount');
            $table->json('addons_data')->nullable()->after('addons_total');
            $table->dateTime('check_in_at')->nullable()->after('paid_at');
            $table->boolean('boarding_pass_issued')->default(false)->after('check_in_at');
        });

        // 3. Add points_balance to users
        Schema::table('users', function (Blueprint $table) {
            $table->integer('points_balance')->default(50000)->after('phone');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('points_balance');
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn([
                'voucher_code',
                'discount_amount',
                'addons_total',
                'addons_data',
                'check_in_at',
                'boarding_pass_issued',
            ]);
        });

        Schema::dropIfExists('vouchers');
    }
};
