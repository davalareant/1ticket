<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'description',
        'discount_type',
        'discount_value',
        'min_spend',
        'max_discount',
        'quota',
        'used_count',
        'is_active',
        'expires_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'discount_value' => 'integer',
        'min_spend' => 'integer',
        'max_discount' => 'integer',
        'quota' => 'integer',
        'used_count' => 'integer',
        'expires_at' => 'datetime',
    ];
}
