<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use Illuminate\Http\Request;

class AirportController extends Controller
{
    public function index(Request $request)
    {
        $q = trim($request->get('q', ''));

        $airports = Airport::query()
            ->when($q, function ($query, $q) {
                $query->where('iata_code', 'like', "%{$q}%")
                      ->orWhere('city', 'like', "%{$q}%")
                      ->orWhere('name', 'like', "%{$q}%");
            })
            ->orderBy('city')
            ->get();

        return response()->json($airports);
    }
}
