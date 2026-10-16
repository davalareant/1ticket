<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Airline;
use App\Models\Airport;
use App\Models\Booking;
use App\Models\Flight;
use App\Models\FlightFare;
use App\Models\User;
use App\Models\Voucher;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * Pastikan hanya pengguna dengan role admin yang dapat mengakses
     */
    private function checkAdmin(Request $request)
    {
        if (!$request->user() || $request->user()->role !== 'admin') {
            abort(response()->json([
                'success' => false,
                'message' => 'Akses ditolak. Halaman ini hanya untuk Administrator.',
            ], 403));
        }
    }

    /**
     * Dashboard Analytics / Stats
     */
    public function stats(Request $request)
    {
        $this->checkAdmin($request);

        $totalRevenue = (int) Booking::where('status', 'paid')->sum('total_amount');
        $totalBookings = Booking::count();
        $paidBookings = Booking::where('status', 'paid')->count();
        $pendingBookings = Booking::where('status', 'pending_payment')->count();
        $activeFlights = Flight::where('departure_at', '>=', now()->subHours(2))->count();
        $totalVouchers = Voucher::where('is_active', true)->count();
        $totalCustomers = User::where('role', '!=', 'admin')->count();

        $recentBookings = Booking::with([
            'user:id,name,email',
            'flight.airline:id,code,name,brand_color',
            'flight.originAirport:id,city,iata_code',
            'flight.destinationAirport:id,city,iata_code',
            'returnFlight.airline:id,code,name,brand_color',
            'passengers:id,booking_id,full_name,seat_number,return_seat_number',
        ])
            ->latest()
            ->take(8)
            ->get();

        return response()->json([
            'success' => true,
            'stats' => [
                'total_revenue' => $totalRevenue,
                'total_bookings' => $totalBookings,
                'paid_bookings' => $paidBookings,
                'pending_bookings' => $pendingBookings,
                'active_flights' => $activeFlights,
                'total_vouchers' => $totalVouchers,
                'total_customers' => $totalCustomers,
            ],
            'recent_bookings' => $recentBookings,
        ]);
    }

    /**
     * Metadata Maskapai & Bandara untuk Form
     */
    public function getMeta(Request $request)
    {
        $this->checkAdmin($request);

        $airlines = Airline::orderBy('name')->get();
        $airports = Airport::orderBy('city')->get();

        return response()->json([
            'airlines' => $airlines,
            'airports' => $airports,
        ]);
    }

    /**
     * Manajemen Penerbangan (Flights)
     */
    public function getFlights(Request $request)
    {
        $this->checkAdmin($request);

        $flights = Flight::with([
            'airline',
            'originAirport',
            'destinationAirport',
            'fares',
        ])
            ->orderBy('departure_at', 'desc')
            ->get()
            ->map(function ($f) {
                $economyFare = $f->fares->firstWhere('cabin_class', 'economy');
                $businessFare = $f->fares->firstWhere('cabin_class', 'business');

                return [
                    'id' => $f->id,
                    'flight_number' => $f->flight_number,
                    'airline' => $f->airline,
                    'origin_airport' => $f->originAirport,
                    'destination_airport' => $f->destinationAirport,
                    'departure_at' => $f->departure_at ? $f->departure_at->format('Y-m-d H:i:s') : null,
                    'arrival_at' => $f->arrival_at ? $f->arrival_at->format('Y-m-d H:i:s') : null,
                    'economy_price' => $economyFare ? $economyFare->price : 0,
                    'economy_seats' => $economyFare ? $economyFare->seats_total : 0,
                    'business_price' => $businessFare ? $businessFare->price : null,
                    'business_seats' => $businessFare ? $businessFare->seats_total : null,
                    'bookings_count' => $f->bookings()->count(),
                ];
            });

        return response()->json($flights);
    }

    public function storeFlight(Request $request)
    {
        $this->checkAdmin($request);

        $validated = $request->validate([
            'airline_id' => 'required|exists:airlines,id',
            'flight_number' => 'required|string|max:10',
            'origin_airport_id' => 'required|exists:airports,id|different:destination_airport_id',
            'destination_airport_id' => 'required|exists:airports,id',
            'departure_at' => 'required|date',
            'arrival_at' => 'required|date|after:departure_at',
            'economy_price' => 'required|numeric|min:50000',
            'economy_seats' => 'required|integer|min:10|max:300',
            'business_price' => 'nullable|numeric|min:100000',
            'business_seats' => 'nullable|integer|min:0|max:100',
        ]);

        return DB::transaction(function () use ($validated) {
            $flight = Flight::create([
                'airline_id' => $validated['airline_id'],
                'flight_number' => strtoupper(trim($validated['flight_number'])),
                'origin_airport_id' => $validated['origin_airport_id'],
                'destination_airport_id' => $validated['destination_airport_id'],
                'departure_at' => Carbon::parse($validated['departure_at']),
                'arrival_at' => Carbon::parse($validated['arrival_at']),
            ]);

            // Create economy fare
            FlightFare::create([
                'flight_id' => $flight->id,
                'cabin_class' => 'economy',
                'price' => (int) $validated['economy_price'],
                'seats_total' => (int) $validated['economy_seats'],
            ]);

            // Create business fare if provided
            if (!empty($validated['business_price']) && !empty($validated['business_seats'])) {
                FlightFare::create([
                    'flight_id' => $flight->id,
                    'cabin_class' => 'business',
                    'price' => (int) $validated['business_price'],
                    'seats_total' => (int) $validated['business_seats'],
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Penerbangan baru berhasil ditambahkan.',
                'flight' => $flight->load(['airline', 'originAirport', 'destinationAirport', 'fares']),
            ], 201);
        });
    }

    public function updateFlight(Request $request, $id)
    {
        $this->checkAdmin($request);

        $flight = Flight::findOrFail($id);

        $validated = $request->validate([
            'flight_number' => 'sometimes|string|max:10',
            'departure_at' => 'sometimes|date',
            'arrival_at' => 'sometimes|date',
            'economy_price' => 'sometimes|numeric|min:50000',
            'business_price' => 'nullable|numeric',
        ]);

        return DB::transaction(function () use ($flight, $validated) {
            if (isset($validated['flight_number'])) {
                $flight->flight_number = strtoupper(trim($validated['flight_number']));
            }
            if (isset($validated['departure_at'])) {
                $flight->departure_at = Carbon::parse($validated['departure_at']);
            }
            if (isset($validated['arrival_at'])) {
                $flight->arrival_at = Carbon::parse($validated['arrival_at']);
            }
            $flight->save();

            if (isset($validated['economy_price'])) {
                FlightFare::updateOrCreate(
                    ['flight_id' => $flight->id, 'cabin_class' => 'economy'],
                    ['price' => (int) $validated['economy_price']]
                );
            }

            if (isset($validated['business_price']) && $validated['business_price'] > 0) {
                FlightFare::updateOrCreate(
                    ['flight_id' => $flight->id, 'cabin_class' => 'business'],
                    ['price' => (int) $validated['business_price'], 'seats_total' => 16]
                );
            }

            return response()->json([
                'success' => true,
                'message' => 'Jadwal dan tarif penerbangan berhasil diperbarui.',
                'flight' => $flight->load(['airline', 'originAirport', 'destinationAirport', 'fares']),
            ]);
        });
    }

    public function deleteFlight(Request $request, $id)
    {
        $this->checkAdmin($request);

        $flight = Flight::findOrFail($id);
        $flight->delete();

        return response()->json([
            'success' => true,
            'message' => 'Penerbangan berhasil dihapus.',
        ]);
    }

    /**
     * Manajemen Kupon Promo & Voucher
     */
    public function getVouchers(Request $request)
    {
        $this->checkAdmin($request);

        $vouchers = Voucher::orderBy('created_at', 'desc')->get();
        return response()->json($vouchers);
    }

    public function storeVoucher(Request $request)
    {
        $this->checkAdmin($request);

        $input = $request->all();
        if (empty($input['expires_at'])) unset($input['expires_at']);
        if (empty($input['min_spend'])) $input['min_spend'] = 0;
        if (empty($input['max_discount'])) $input['max_discount'] = 0;
        $request->merge($input);

        $validated = $request->validate([
            'code' => 'required|string|max:30|unique:vouchers,code',
            'name' => 'required|string|max:150',
            'description' => 'nullable|string',
            'discount_type' => 'required|in:percent,fixed',
            'discount_value' => 'required|numeric|min:1',
            'min_spend' => 'nullable|numeric|min:0',
            'max_discount' => 'nullable|numeric|min:0',
            'quota' => 'required|integer|min:1',
            'expires_at' => 'nullable|date',
            'is_active' => 'nullable|boolean',
        ]);

        $voucher = Voucher::create([
            'code' => strtoupper(trim($validated['code'])),
            'name' => trim($validated['name']),
            'description' => $validated['description'] ?? '',
            'discount_type' => $validated['discount_type'],
            'discount_value' => (int) $validated['discount_value'],
            'min_spend' => (int) ($validated['min_spend'] ?? 0),
            'max_discount' => (int) ($validated['max_discount'] ?? 0),
            'quota' => (int) $validated['quota'],
            'used_count' => 0,
            'is_active' => $request->boolean('is_active', true),
            'expires_at' => !empty($validated['expires_at']) ? Carbon::parse($validated['expires_at']) : null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Kupon promo baru berhasil dibuat.',
            'voucher' => $voucher,
        ], 201);
    }

    public function updateVoucher(Request $request, $id)
    {
        $this->checkAdmin($request);

        $voucher = Voucher::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:150',
            'discount_type' => 'sometimes|in:percent,fixed',
            'discount_value' => 'sometimes|numeric|min:1',
            'min_spend' => 'sometimes|numeric|min:0',
            'max_discount' => 'sometimes|numeric|min:0',
            'quota' => 'sometimes|integer|min:1',
            'is_active' => 'sometimes|boolean',
            'expires_at' => 'nullable|date',
        ]);

        if (isset($validated['name'])) $voucher->name = trim($validated['name']);
        if (isset($validated['discount_type'])) $voucher->discount_type = $validated['discount_type'];
        if (isset($validated['discount_value'])) $voucher->discount_value = (int) $validated['discount_value'];
        if (isset($validated['min_spend'])) $voucher->min_spend = (int) $validated['min_spend'];
        if (isset($validated['max_discount'])) $voucher->max_discount = (int) $validated['max_discount'];
        if (isset($validated['quota'])) $voucher->quota = (int) $validated['quota'];
        if (array_key_exists('is_active', $validated)) $voucher->is_active = (bool) $validated['is_active'];
        if (array_key_exists('expires_at', $validated)) {
            $voucher->expires_at = !empty($validated['expires_at']) ? Carbon::parse($validated['expires_at']) : null;
        }

        $voucher->save();

        return response()->json([
            'success' => true,
            'message' => 'Kupon promo berhasil diperbarui.',
            'voucher' => $voucher,
        ]);
    }

    public function deleteVoucher(Request $request, $id)
    {
        $this->checkAdmin($request);

        $voucher = Voucher::findOrFail($id);
        $voucher->delete();

        return response()->json([
            'success' => true,
            'message' => 'Kupon promo berhasil dihapus.',
        ]);
    }

    /**
     * Manajemen Pesanan Seluruh Pengguna
     */
    public function getBookings(Request $request)
    {
        $this->checkAdmin($request);

        $query = Booking::with([
            'user:id,name,email,phone',
            'flight.airline',
            'flight.originAirport',
            'flight.destinationAirport',
            'returnFlight.airline',
            'returnFlight.originAirport',
            'returnFlight.destinationAirport',
            'passengers',
            'payment.paymentMethod',
        ]);

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('search') && !empty($request->search)) {
            $search = trim($request->search);
            $query->where(function ($q) use ($search) {
                $q->where('booking_code', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($u) use ($search) {
                      $u->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                  })
                  ->orWhereHas('passengers', function ($p) use ($search) {
                      $p->where('full_name', 'like', "%{$search}%");
                  });
            });
        }

        $bookings = $query->orderBy('created_at', 'desc')->get();

        return response()->json($bookings);
    }

    public function updateBookingStatus(Request $request, $kode)
    {
        $this->checkAdmin($request);

        $request->validate([
            'status' => 'required|in:paid,pending_payment,cancelled,expired',
        ]);

        $booking = Booking::where('booking_code', $kode)->firstOrFail();
        $booking->status = $request->status;

        if ($request->status === 'paid' && !$booking->paid_at) {
            $booking->paid_at = now();
        }

        $booking->save();

        return response()->json([
            'success' => true,
            'message' => 'Status pesanan berhasil diperbarui.',
            'booking' => $booking,
        ]);
    }
}
