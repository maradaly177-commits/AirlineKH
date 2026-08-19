<?php

namespace App\Services\AI\Tools;

use App\Models\Booking;
use Illuminate\Database\Eloquent\Model;

class GetBookingInfoTool
{
    public function definition(): array
    {
        return [
            'type' => 'function',

            'function' => [
                'name' => 'get_booking_info',

                'description' =>
                    'Get booking information belonging to the authenticated user.',

                'parameters' => [
                    'type' => 'object',

                    'properties' => [
                        'booking_id' => [
                            'type' => 'integer',
                            'description' =>
                                'Booking ID.',
                        ],
                    ],

                    'required' => [
                        'booking_id',
                    ],
                ],
            ],
        ];
    }

    public function execute(
        array $arguments,
        ?Model $user
    ): array {

        if (!$user) {
            return [
                'success' => false,
                'message' =>
                    'User must be authenticated.',
            ];
        }

        $booking = Booking::where(
            'id',
            $arguments['booking_id']
        )
        ->where(
            'user_id',
            $user->id
        )
        ->first();

        if (!$booking) {
            return [
                'success' => false,
                'message' =>
                    'Booking not found or does not belong to the authenticated user.',
            ];
        }

        return [
            'success' => true,

            'booking' => [
                'id' => $booking->id,
                'status' => $booking->status ?? null,
                'amount' => $booking->amount ?? null,
                'created_at' => $booking->created_at,
            ],
        ];
    }
}