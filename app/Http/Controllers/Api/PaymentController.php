<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\PaymentMethod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    public function methods()
    {
        $methods = PaymentMethod::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return response()->json($methods);
    }

    public function pay(Request $request, $code)
    {
        $validated = $request->validate([
            'payment_method_id' => 'required|exists:payment_methods,id',
        ]);

        $booking = Booking::where('booking_code', $code)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $booking->checkAndExpire();

        if ($booking->status !== 'pending_payment') {
            return response()->json([
                'message' => 'Pesanan ini tidak dapat dibayar karena statusnya: ' . $booking->status,
            ], 400);
        }

        $paymentMethod = PaymentMethod::findOrFail($validated['payment_method_id']);

        // Cancel previous pending payment attempts for this booking
        $booking->payments()->where('status', 'pending')->update(['status' => 'failed']);

        // Generate realistic dummy reference codes
        if ($paymentMethod->type === 'bank_transfer') {
            // Virtual account e.g. 8808 + 12 digits
            $refCode = '8808' . mt_rand(100000000000, 999999999999);
        } elseif ($paymentMethod->type === 'ewallet') {
            $refCode = 'EWL-' . strtoupper(Str::random(10));
        } else {
            // QRIS
            $refCode = '00020101021226' . strtoupper(Str::random(16)) . '1TIKET';
        }

        $payment = Payment::create([
            'booking_id' => $booking->id,
            'payment_method_id' => $paymentMethod->id,
            'reference_code' => $refCode,
            'amount' => $booking->total_amount,
            'status' => 'pending',
            'expires_at' => $booking->expires_at,
        ]);

        $payment->load('paymentMethod');

        return response()->json([
            'message' => 'Instruksi pembayaran dibuat.',
            'payment' => $payment,
            'booking' => $booking,
        ], 201);
    }

    public function simulate(Request $request, $reference)
    {
        $validated = $request->validate([
            'action' => 'required|in:success,failed',
        ]);

        $payment = Payment::where('reference_code', $reference)
            ->with(['booking.passengers', 'booking.flight', 'paymentMethod'])
            ->firstOrFail();

        $booking = $payment->booking;

        if ($booking->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Akses ditolak.'], 403);
        }

        $booking->checkAndExpire();

        if ($booking->status === 'expired') {
            $payment->status = 'expired';
            $payment->save();

            return response()->json([
                'message' => 'Waktu pembayaran telah habis (kedaluwarsa).',
                'booking' => $booking,
                'payment' => $payment,
            ], 400);
        }

        if ($validated['action'] === 'success') {
            DB::transaction(function () use ($payment, $booking) {
                $now = now();

                $payment->status = 'success';
                $payment->paid_at = $now;
                $payment->save();

                $booking->status = 'paid';
                $booking->paid_at = $now;
                $booking->save();

                // Auto assign seats for any passenger who didn't pick one
                $flight = $booking->flight;
                $cabin = $booking->cabin_class;

                $takenSeats = $flight->getTakenSeatNumbers($cabin);

                if ($cabin === 'business') {
                    $rows = [1, 2, 3, 4];
                    $cols = ['A', 'C', 'D', 'F'];
                } else {
                    $rows = range(5, 24);
                    $cols = ['A', 'B', 'C', 'D', 'E', 'F'];
                }

                $availableSeats = [];
                foreach ($rows as $r) {
                    foreach ($cols as $c) {
                        $s = $r . $c;
                        if (!in_array($s, $takenSeats)) {
                            $availableSeats[] = $s;
                        }
                    }
                }

                $seatIdx = 0;
                foreach ($booking->passengers as $p) {
                    if (empty($p->seat_number) && isset($availableSeats[$seatIdx])) {
                        $p->seat_number = $availableSeats[$seatIdx];
                        $seatIdx++;
                    }

                    // Generate ticket number e.g. 1T-20261016-000123
                    if (empty($p->ticket_number)) {
                        $p->ticket_number = '1T-' . $p->booking_id . mt_rand(1000, 9999) . '-' . $p->id;
                    }

                    $p->save();
                }
            });

            $booking->load([
                'flight.airline',
                'flight.originAirport',
                'flight.destinationAirport',
                'passengers',
                'payments.paymentMethod',
            ]);

            return response()->json([
                'message' => 'Simulasi pembayaran BERHASIL. E-ticket telah diterbitkan.',
                'status' => 'success',
                'booking' => $booking,
                'payment' => $payment,
            ]);
        } else {
            $payment->status = 'failed';
            $payment->save();

            return response()->json([
                'message' => 'Simulasi pembayaran GAGAL. Anda dapat memilih metode pembayaran lain.',
                'status' => 'failed',
                'booking' => $booking,
                'payment' => $payment,
            ]);
        }
    }
}
