<?php

namespace App\Services\AI\Tools;

use App\Models\Flight;
use Carbon\Carbon;

class SearchFlightTool
{
    public function definition(): array
    {
        return [
            'type' => 'function',

            'function' => [
                'name' => 'search_flight',

                'description' =>
                    'Search available flights by origin airport, destination airport and departure date.',

                'parameters' => [
                    'type' => 'object',

                    'properties' => [
                        'origin' => [
                            'type' => 'string',
                            'description' => 'Origin airport IATA code, for example HAN.',
                        ],

                        'destination' => [
                            'type' => 'string',
                            'description' => 'Destination airport IATA code, for example SGN.',
                        ],

                        'date' => [
                            'type' => 'string',
                            'description' => 'Departure date in YYYY-MM-DD format.',
                        ],

                        'max_price' => [
                            'type' => 'number',
                            'description' => 'Optional maximum ticket price.',
                        ],
                    ],

                    'required' => [
                        'origin',
                        'destination',
                        'date',
                    ],

                    'additionalProperties' => false,
                ],
            ],
        ];
    }

    public function execute(array $arguments): array
    {
        $origin = strtoupper(trim($arguments['origin'] ?? ''));
        $destination = strtoupper(trim($arguments['destination'] ?? ''));
        $date = $arguments['date'] ?? null;
        $maxPrice = $arguments['max_price'] ?? null;

        if (!$origin || !$destination || !$date) {
            return [
                'success' => false,
                'message' => 'Origin, destination and date are required.',
            ];
        }

        try {
            Carbon::createFromFormat('Y-m-d', $date);
        } catch (\Throwable) {
            return [
                'success' => false,
                'message' => 'Invalid date format. Use YYYY-MM-DD.',
            ];
        }

        $query = Flight::with([
            'departureAirport',
            'arrivalAirport',
            'aircraft',
        ])
        ->whereHas('departureAirport', function ($query) use ($origin) {
            $query->where('code', $origin);
        })
        ->whereHas('arrivalAirport', function ($query) use ($destination) {
            $query->where('code', $destination);
        })
        ->whereDate('departure_time', $date)
        ->where('available_seats', '>', 0)
        ->where('status', '!=', 'cancelled');

        if ($maxPrice !== null) {
            $query->where('base_price', '<=', (float) $maxPrice);
        }

        $flights = $query
            ->orderBy('departure_time')
            ->get();

        return [
            'success' => true,

            'count' => $flights->count(),

            'flights' => $flights->map(function ($flight) {
                return [
                    'id' => $flight->id,

                    'flight_number' =>
                        $flight->flight_number,

                    'origin' =>
                        $flight->departureAirport?->code,

                    'destination' =>
                        $flight->arrivalAirport?->code,

                    'departure_time' =>
                        $flight->departure_time?->format('Y-m-d H:i:s'),

                    'arrival_time' =>
                        $flight->arrival_time?->format('Y-m-d H:i:s'),

                    'base_price' =>
                        $flight->base_price,

                    'available_seats' =>
                        $flight->available_seats,

                    'status' =>
                        $flight->status,
                ];
            })->values()->toArray(),
        ];
    }
}