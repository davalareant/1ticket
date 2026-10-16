<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class VoucherController extends Controller
{
    public function validateVoucher(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'subtotal' => 'required|numeric|min:0',
        ]);

        $code = strtoupper(trim($request->code));
        $subtotal = (int) $request->subtotal;

        $voucher = DB::table('vouchers')
            ->where('code', $code)
            ->where('is_active', true)
            ->first();

        if (!$voucher) {
            return response()->json([
                'success' => false,
                'message' => 'Kode voucher tidak valid atau sudah tidak berlaku.',
            ], 422);
        }

        if ($voucher->expires_at && Carbon::parse($voucher->expires_at)->isPast()) {
            return response()->json([
                'success' => false,
                'message' => 'Masa berlaku voucher ini telah berakhir.',
            ], 422);
        }

        if ($voucher->quota <= $voucher->used_count) {
            return response()->json([
                'success' => false,
                'message' => 'Kuota penggunaan voucher ini telah habis.',
            ], 422);
        }

        if ($subtotal < $voucher->min_spend) {
            return response()->json([
                'success' => false,
                'message' => 'Minimum transaksi untuk menggunakan voucher ini adalah Rp' . number_format($voucher->min_spend, 0, ',', '.'),
            ], 422);
        }

        // Calculate discount
        if ($voucher->discount_type === 'percent') {
            $discount = (int) floor(($subtotal * $voucher->discount_value) / 100);
            if ($voucher->max_discount && $discount > $voucher->max_discount) {
                $discount = $voucher->max_discount;
            }
        } else {
            $discount = min($voucher->discount_value, $subtotal);
        }

        return response()->json([
            'success' => true,
            'message' => 'Voucher berhasil diterapkan!',
            'voucher' => [
                'code' => $voucher->code,
                'name' => $voucher->name,
                'description' => $voucher->description,
                'discount_amount' => $discount,
            ],
        ]);
    }
}
