<?php

namespace App\Services\AI\Tools;

use App\Models\Seat;

class CheckSeatAvailabilityTool
{
    public function definition(): array
    {
        return [
            'type' => 'function',

            'function' => [
                'name' => 'check_seat_availability',

                'description' =>
                    'Check available seats for a flight.',

                'parameters' => [
                    'type' => 'object',

                    'properties' => [
                        'flight_id' => [
                            'type' => 'integer',
                            'description' =>
                                'Flight ID.',
                        ],
                    ],

                    'required' => [
                        'flight_id',
                    ],
                ],
            ],
        ];
    }

    public function execute(array $arguments): array
    {
        $seats = Seat::where(
            'flight_id',
            $arguments['flight_id']
        )
        ->where(function ($query) {
            $query
                ->whereNull('status')
                ->orWhere('status', 'available');
        })
        ->get();

        return [
            'success' => true,

            'flight_id' =>
                $arguments['flight_id'],

            'available_seats' =>
                $seats->pluck('seat_number')->values(),

            'total_available' =>
                $seats->count(),
        ];
    }
}