<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('airlines', function (Blueprint $table) {
            $table->id();
            $table->string('code', 3)->unique();
            $table->string('name', 100);
            $table->string('brand_color', 7)->default('#0E2A47');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('airlines');
    }
};
