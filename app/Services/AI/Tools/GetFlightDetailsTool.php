<?php

namespace App\Services\AI\Tools;

use App\Models\Flight;

class GetFlightDetailsTool
{
    public function definition(): array
    {
        return [
            'type' => 'function',

            'function' => [
                'name' => 'get_flight_details',

                'description' =>
                    'Get detailed information about a specific flight.',

                'parameters' => [
                    'type' => 'object',

                    'properties' => [
                        'flight_id' => [
                            'type' => 'integer',
                            'description' => 'Flight ID.',
                        ],
                    ],

                    'required' => [
                        'flight_id',
                    ],

                    'additionalProperties' => false,
                ],
            ],
        ];
    }

    public function execute(array $arguments): array
    {
        $flight = Flight::with([
            'departureAirport',
            'arrivalAirport',
        ])->find($arguments['flight_id']);

        if (!$flight) {
            return [
                'success' => false,
                'message' => 'Flight not found.',
            ];
        }

        return [
            'success' => true,

            'flight' => [
                'id' => $flight->id,

                'flight_number' =>
                    $flight->flight_number,

                'departure_airport' => [
                    'code' =>
                        $flight->departureAirport?->code,

                    'name' =>
                        $flight->departureAirport?->name,
                ],

                'arrival_airport' => [
                    'code' =>
                        $flight->arrivalAirport?->code,

                    'name' =>
                        $flight->arrivalAirport?->name,
                ],

                'departure_time' =>
                    $flight->departure_time?->format(
                        'Y-m-d H:i:s'
                    ),

                'arrival_time' =>
                    $flight->arrival_time?->format(
                        'Y-m-d H:i:s'
                    ),

                'base_price' =>
                    $flight->base_price,

                'available_seats' =>
                    $flight->available_seats,

                'status' =>
                    $flight->status,
            ],
        ];
    }
}