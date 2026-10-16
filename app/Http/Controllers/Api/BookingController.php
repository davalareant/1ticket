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
            'trip_type' => 'nullable|in:one_way,round_trip',
            'return_flight_id' => 'nullable|exists:flights,id',
            'return_cabin_class' => 'nullable|in:economy,business',
            'passengers' => 'required|array|min:1|max:5',
            'passengers.*.title' => 'required|string|in:Tn,Ny,Nn',
            'passengers.*.full_name' => 'required|string|max:100',
            'passengers.*.id_number' => 'required|string|max:20',
            'passengers.*.seat_number' => 'nullable|string|max:4',
            'passengers.*.return_seat_number' => 'nullable|string|max:4',
            'contact_name' => 'required|string|max:100',
            'contact_email' => 'required|email|max:150',
            'contact_phone' => 'required|string|max:20',
        ]);

        $user = $request->user();
        $passengerCount = count($validated['passengers']);
        $cabinClass = $validated['cabin_class'];
        $tripType = $validated['trip_type'] ?? 'one_way';
        $returnCabinClass = $validated['return_cabin_class'] ?? $cabinClass;

        $booking = DB::transaction(function () use ($request, $validated, $user, $passengerCount, $cabinClass, $tripType, $returnCabinClass) {
            // Lock outbound flight row to prevent race conditions on seats
            $flight = Flight::where('id', $validated['flight_id'])->lockForUpdate()->firstOrFail();

            $fare = FlightFare::where('flight_id', $flight->id)
                ->where('cabin_class', $cabinClass)
                ->firstOrFail();

            $takenSeats = $flight->getTakenSeatNumbers($cabinClass);
            $seatsLeft = $fare->seats_total - $flight->getSeatsTakenCount($cabinClass);

            if ($seatsLeft < $passengerCount) {
                throw ValidationException::withMessages([
                    'flight_id' => ['Maaf, kursi yang tersedia pada penerbangan pergi tidak mencukupi.'],
                ]);
            }

            // Check if any requested seat is already taken or duplicate within request
            $requestedSeats = [];
            foreach ($validated['passengers'] as $p) {
                if (!empty($p['seat_number'])) {
                    $seatNum = strtoupper(trim($p['seat_number']));
                    if (in_array($seatNum, $takenSeats)) {
                        throw ValidationException::withMessages([
                            'seat_number' => ["Kursi {$seatNum} pada penerbangan pergi sudah dipilih. Silakan pilih kursi lain."],
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

            // If round trip, validate return flight
            $returnFlight = null;
            $returnUnitPrice = null;
            if ($tripType === 'round_trip' && !empty($validated['return_flight_id'])) {
                $returnFlight = Flight::where('id', $validated['return_flight_id'])->lockForUpdate()->firstOrFail();
                $returnFare = FlightFare::where('flight_id', $returnFlight->id)
                    ->where('cabin_class', $returnCabinClass)
                    ->firstOrFail();

                $returnTakenSeats = $returnFlight->getTakenSeatNumbers($returnCabinClass);
                $returnSeatsLeft = $returnFare->seats_total - $returnFlight->getSeatsTakenCount($returnCabinClass);

                if ($returnSeatsLeft < $passengerCount) {
                    throw ValidationException::withMessages([
                        'return_flight_id' => ['Maaf, kursi yang tersedia pada penerbangan pulang tidak mencukupi.'],
                    ]);
                }

                $requestedReturnSeats = [];
                foreach ($validated['passengers'] as $p) {
                    if (!empty($p['return_seat_number'])) {
                        $retSeatNum = strtoupper(trim($p['return_seat_number']));
                        if (in_array($retSeatNum, $returnTakenSeats)) {
                            throw ValidationException::withMessages([
                                'return_seat_number' => ["Kursi pulang {$retSeatNum} sudah dipilih. Silakan pilih kursi lain."],
                            ]);
                        }
                        if (in_array($retSeatNum, $requestedReturnSeats)) {
                            throw ValidationException::withMessages([
                                'return_seat_number' => ["Kursi pulang {$retSeatNum} dipilih lebih dari satu kali."],
                            ]);
                        }
                        $requestedReturnSeats[] = $retSeatNum;
                    }
                }

                $returnUnitPrice = $returnFare->price;
            }

            // Generate unique booking code e.g. 1T8K2QZ
            do {
                $bookingCode = '1T' . strtoupper(Str::random(5));
            } while (Booking::where('booking_code', $bookingCode)->exists());

            $unitPrice = $fare->price;
            $adminFee = 5000;
            $subtotal = ($unitPrice * $passengerCount) + (($returnUnitPrice ?? 0) * $passengerCount);

            // Calculate voucher discount
            $discountAmount = 0;
            $voucherCode = null;
            if (!empty($request->voucher_code)) {
                $code = strtoupper(trim($request->voucher_code));
                $voucher = DB::table('vouchers')
                    ->where('code', $code)
                    ->where('is_active', true)
                    ->first();

                if ($voucher && $subtotal >= $voucher->min_spend) {
                    $voucherCode = $voucher->code;
                    if ($voucher->discount_type === 'percent') {
                        $discount = (int) floor(($subtotal * $voucher->discount_value) / 100);
                        $discountAmount = $voucher->max_discount ? min($discount, $voucher->max_discount) : $discount;
                    } else {
                        $discountAmount = min($voucher->discount_value, $subtotal);
                    }
                    // Increment used count
                    DB::table('vouchers')->where('id', $voucher->id)->increment('used_count');
                }
            }

            // Calculate addons total
            $addonsTotal = 0;
            $addonsData = $request->input('addons', []);
            if (!empty($addonsData)) {
                // Baggage
                if (!empty($addonsData['baggage_kg'])) {
                    $kg = (int) $addonsData['baggage_kg'];
                    if ($kg === 10) $addonsTotal += 120000;
                    elseif ($kg === 20) $addonsTotal += 230000;
                    elseif ($kg === 30) $addonsTotal += 340000;
                }
                // Meals
                if (!empty($addonsData['meals']) && is_array($addonsData['meals'])) {
                    foreach ($addonsData['meals'] as $meal) {
                        $addonsTotal += (int) ($meal['price'] ?? 0);
                    }
                }
                // Insurance
                if (!empty($addonsData['insurance'])) {
                    $addonsTotal += (35000 * $passengerCount);
                }
            }

            $totalAmount = max(0, $subtotal + $adminFee + $addonsTotal - $discountAmount);
            $expiresAt = now()->addMinutes(15);

            $booking = Booking::create([
                'booking_code' => $bookingCode,
                'user_id' => $user->id,
                'flight_id' => $flight->id,
                'cabin_class' => $cabinClass,
                'trip_type' => $tripType,
                'return_flight_id' => $returnFlight ? $returnFlight->id : null,
                'return_unit_price' => $returnUnitPrice,
                'return_cabin_class' => $returnFlight ? $returnCabinClass : null,
                'passenger_count' => $passengerCount,
                'unit_price' => $unitPrice,
                'admin_fee' => $adminFee,
                'total_amount' => $totalAmount,
                'voucher_code' => $voucherCode,
                'discount_amount' => $discountAmount,
                'addons_total' => $addonsTotal,
                'addons_data' => $addonsData,
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
                    'return_seat_number' => !empty($p['return_seat_number']) ? strtoupper(trim($p['return_seat_number'])) : null,
                ]);
            }

            return $booking;
        });

        $booking->load([
            'flight.airline',
            'flight.originAirport',
            'flight.destinationAirport',
            'returnFlight.airline',
            'returnFlight.originAirport',
            'returnFlight.destinationAirport',
            'passengers',
            'payments.paymentMethod',
        ]);

        return response()->json([
            'message' => 'Pesanan berhasil dibuat. Kursi Anda ditahan selama 15 menit.',
            'booking' => $booking,
        ], 201);
    }

    public function checkIn(Request $request, $code)
    {
        $booking = Booking::where('booking_code', $code)
            ->where('user_id', $request->user()->id)
            ->with(['flight', 'returnFlight', 'passengers'])
            ->firstOrFail();

        if ($booking->status !== 'paid') {
            return response()->json([
                'message' => 'Hanya pesanan yang sudah lunas yang dapat melakukan check-in online.',
            ], 422);
        }

        $checkInType = $request->input('flight_type', 'outbound'); // 'outbound' or 'return'

        if ($checkInType === 'return' && $booking->return_flight_id) {
            $retFlight = $booking->returnFlight;
            $retCabin = $booking->return_cabin_class ?? $booking->cabin_class;
            $takenSeats = $retFlight->getTakenSeatNumbers($retCabin);
            $rows = $retCabin === 'business' ? range(1, 4) : range(5, 20);
            $cols = $retCabin === 'business' ? ['A', 'C', 'D', 'F'] : ['A', 'B', 'C', 'D', 'E', 'F'];

            foreach ($booking->passengers as $passenger) {
                if (empty($passenger->return_seat_number)) {
                    foreach ($rows as $r) {
                        foreach ($cols as $c) {
                            $candidate = "{$r}{$c}";
                            if (!in_array($candidate, $takenSeats)) {
                                $passenger->return_seat_number = $candidate;
                                $passenger->save();
                                $takenSeats[] = $candidate;
                                break 2;
                            }
                        }
                    }
                }
            }

            $booking->return_check_in_at = now();
            $booking->save();
        } else {
            // Outbound check-in
            $takenSeats = $booking->flight->getTakenSeatNumbers($booking->cabin_class);
            $rows = $booking->cabin_class === 'business' ? range(1, 4) : range(5, 20);
            $cols = $booking->cabin_class === 'business' ? ['A', 'C', 'D', 'F'] : ['A', 'B', 'C', 'D', 'E', 'F'];

            foreach ($booking->passengers as $passenger) {
                if (empty($passenger->seat_number)) {
                    foreach ($rows as $r) {
                        foreach ($cols as $c) {
                            $candidate = "{$r}{$c}";
                            if (!in_array($candidate, $takenSeats)) {
                                $passenger->seat_number = $candidate;
                                $passenger->save();
                                $takenSeats[] = $candidate;
                                break 2;
                            }
                        }
                    }
                }
            }

            $booking->check_in_at = now();
            $booking->boarding_pass_issued = true;
            $booking->save();
        }

        $booking->load([
            'flight.airline',
            'flight.originAirport',
            'flight.destinationAirport',
            'returnFlight.airline',
            'returnFlight.originAirport',
            'returnFlight.destinationAirport',
            'passengers',
            'payments.paymentMethod',
        ]);

        return response()->json([
            'message' => 'Check-in online berhasil! Boarding pass resmi telah diterbitkan.',
            'booking' => $booking,
        ]);
    }

    public function index(Request $request)
    {
        $bookings = Booking::where('user_id', $request->user()->id)
            ->with([
                'flight.airline',
                'flight.originAirport',
                'flight.destinationAirport',
                'returnFlight.airline',
                'returnFlight.originAirport',
                'returnFlight.destinationAirport',
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
                'returnFlight.airline',
                'returnFlight.originAirport',
                'returnFlight.destinationAirport',
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
