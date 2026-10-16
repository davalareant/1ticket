<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BookingPassenger;
use App\Models\Flight;
use App\Models\FlightFare;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'flight_id' => 'required|exists:flights,id',
            'cabin_class' => 'required|in:economy,business',
            'passengers' => 'required|array|min:1|max:5',
            'passengers.*.title' => 'required|string|in:Tn,Ny,Nn',
            'passengers.*.full_name' => 'required|string|max:100',
            'passengers.*.id_number' => 'required|string|max:20',
            'passengers.*.seat_number' => 'nullable|string|max:4',
            'contact_name' => 'required|string|max:100',
            'contact_email' => 'required|email|max:150',
            'contact_phone' => 'required|string|max:20',
        ]);

        $user = $request->user();
        $passengerCount = count($validated['passengers']);
        $cabinClass = $validated['cabin_class'];

        $booking = DB::transaction(function () use ($validated, $user, $passengerCount, $cabinClass) {
            // Lock flight row to prevent race conditions on seats
            $flight = Flight::where('id', $validated['flight_id'])->lockForUpdate()->firstOrFail();

            $fare = FlightFare::where('flight_id', $flight->id)
                ->where('cabin_class', $cabinClass)
                ->firstOrFail();

            $takenSeats = $flight->getTakenSeatNumbers($cabinClass);
            $seatsLeft = $fare->seats_total - $flight->getSeatsTakenCount($cabinClass);

            if ($seatsLeft < $passengerCount) {
                throw ValidationException::withMessages([
                    'flight_id' => ['Maaf, kursi yang tersedia tidak mencukupi untuk jumlah penumpang yang diminta.'],
                ]);
            }

            // Check if any requested seat is already taken or duplicate within request
            $requestedSeats = [];
            foreach ($validated['passengers'] as $p) {
                if (!empty($p['seat_number'])) {
                    $seatNum = strtoupper(trim($p['seat_number']));
                    if (in_array($seatNum, $takenSeats)) {
                        throw ValidationException::withMessages([
                            'seat_number' => ["Kursi {$seatNum} sudah dipilih oleh penumpang lain. Silakan pilih kursi lain."],
                        ]);
                    }
                    if (in_array($seatNum, $requestedSeats)) {
                        throw ValidationException::withMessages([
                            'seat_number' => ["Kursi {$seatNum} dipilih lebih dari satu kali."],
                        ]);
                    }
                    $requestedSeats[] = $seatNum;
                }
            }

            // Generate unique booking code e.g. 1T8K2QZ
            do {
                $bookingCode = '1T' . strtoupper(Str::random(5));
            } while (Booking::where('booking_code', $bookingCode)->exists());

            $unitPrice = $fare->price;
            $adminFee = 5000;
            $totalAmount = ($unitPrice * $passengerCount) + $adminFee;
            $expiresAt = now()->addMinutes(15);

            $booking = Booking::create([
                'booking_code' => $bookingCode,
                'user_id' => $user->id,
                'flight_id' => $flight->id,
                'cabin_class' => $cabinClass,
                'passenger_count' => $passengerCount,
                'unit_price' => $unitPrice,
                'admin_fee' => $adminFee,
                'total_amount' => $totalAmount,
                'contact_name' => $validated['contact_name'],
                'contact_email' => $validated['contact_email'],
                'contact_phone' => $validated['contact_phone'],
                'status' => 'pending_payment',
                'expires_at' => $expiresAt,
            ]);

            foreach ($validated['passengers'] as $p) {
                BookingPassenger::create([
                    'booking_id' => $booking->id,
                    'title' => $p['title'],
                    'full_name' => $p['full_name'],
                    'id_number' => $p['id_number'],
                    'seat_number' => !empty($p['seat_number']) ? strtoupper(trim($p['seat_number'])) : null,
                ]);
            }

            return $booking;
        });

        $booking->load([
            'flight.airline',
            'flight.originAirport',
            'flight.destinationAirport',
            'passengers',
            'payments.paymentMethod',
        ]);

        return response()->json([
            'message' => 'Pesanan berhasil dibuat. Kursi Anda ditahan selama 15 menit.',
            'booking' => $booking,
        ], 201);
    }

    public function index(Request $request)
    {
        $bookings = Booking::where('user_id', $request->user()->id)
            ->with([
                'flight.airline',
                'flight.originAirport',
                'flight.destinationAirport',
                'passengers',
                'payments.paymentMethod',
            ])
            ->orderBy('created_at', 'desc')
            ->get();

        foreach ($bookings as $b) {
            $b->checkAndExpire();
        }

        return response()->json($bookings);
    }

    public function show(Request $request, $code)
    {
        $booking = Booking::where('booking_code', $code)
            ->where('user_id', $request->user()->id)
            ->with([
                'flight.airline',
                'flight.originAirport',
                'flight.destinationAirport',
                'passengers',
                'payments.paymentMethod',
            ])
            ->firstOrFail();

        $booking->checkAndExpire();

        return response()->json($booking);
    }

    public function cancel(Request $request, $code)
    {
        $booking = Booking::where('booking_code', $code)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $booking->checkAndExpire();

        if ($booking->status !== 'pending_payment') {
            return response()->json([
                'message' => 'Hanya pesanan yang berstatus Menunggu Pembayaran yang dapat dibatalkan.',
            ], 400);
        }

        $booking->status = 'cancelled';
        $booking->save();

        $booking->payments()->where('status', 'pending')->update(['status' => 'failed']);

        return response()->json([
            'message' => 'Pesanan berhasil dibatalkan.',
            'booking' => $booking,
        ]);
    }
}
