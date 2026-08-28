<?php

namespace App\Services\AI\Tools;

use App\Models\Booking;
use Illuminate\Database\Eloquent\Model;

class GetBookingInfoTool
{
    public function definition(): array
    {
        return [
            'name' => 'get_booking_info',

            'description' =>
                'Lấy thông tin booking của người dùng đang đăng nhập từ database SkyLink.',

            'parameters' => [
                'type' => 'OBJECT',

                'properties' => [
                    'booking_id' => [
                        'type' => 'INTEGER',
                        'description' =>
                            'ID của booking cần kiểm tra.',
                    ],
                ],

                'required' => [
                    'booking_id',
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
                    'User must be authenticated to view booking information.',
            ];
        }

        $bookingId =
            (int) ($arguments['booking_id'] ?? 0);

        if (!$bookingId) {
            return [
                'success' => false,
                'message' => 'Booking ID is required.',
            ];
        }

        $booking = Booking::where(
            'id',
            $bookingId
        )
        ->where(
            'user_id',
            $user->getKey()
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
                'created_at' => $booking->created_at?->toDateTimeString(),
            ],
        ];
    }
}