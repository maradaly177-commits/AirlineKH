<?php

namespace App\Services\AI\Tools;

use App\Models\Seat;

class CheckSeatAvailabilityTool
{
    public function definition(): array
    {
        return [
            'name' => 'check_seat_availability',

            'description' =>
                'Kiểm tra các ghế còn trống của một chuyến bay trong database SkyLink.',

            'parameters' => [
                'type' => 'OBJECT',

                'properties' => [
                    'flight_id' => [
                        'type' => 'INTEGER',
                        'description' => 'ID của chuyến bay.',
                    ],
                ],

                'required' => [
                    'flight_id',
                ],
            ],
        ];
    }

    public function execute(array $arguments): array
    {
        $flightId = (int) ($arguments['flight_id'] ?? 0);

        if (!$flightId) {
            return [
                'success' => false,
                'message' => 'Flight ID is required.',
            ];
        }

        $seats = Seat::where('flight_id', $flightId)
            ->where(function ($query) {
                $query
                    ->whereNull('status')
                    ->orWhere('status', 'available');
            })
            ->get();

        return [
            'success' => true,

            'flight_id' => $flightId,

            'available_seats' =>
                $seats
                    ->pluck('seat_number')
                    ->values()
                    ->toArray(),

            'total_available' =>
                $seats->count(),
        ];
    }
}