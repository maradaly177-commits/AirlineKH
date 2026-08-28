<?php

namespace App\Services\AI\Tools;

use App\Models\Airport;

class GetAirportInfoTool
{
    public function definition(): array
    {
        return [
            'name' => 'get_airport_info',

            'description' =>
                'Lấy thông tin sân bay từ database SkyLink.',

            'parameters' => [
                'type' => 'OBJECT',

                'properties' => [
                    'code' => [
                        'type' => 'STRING',
                        'description' =>
                            'Mã sân bay IATA, ví dụ HAN, SGN, DAD.',
                    ],
                ],

                'required' => [
                    'code',
                ],
            ],
        ];
    }

    public function execute(array $arguments): array
    {
        $code = strtoupper(
            trim((string) ($arguments['code'] ?? ''))
        );

        if ($code === '') {
            return [
                'success' => false,
                'message' => 'Airport code is required.',
            ];
        }

        $airport = Airport::where(
            'code',
            $code
        )->first();

        if (!$airport) {
            return [
                'success' => false,
                'message' => 'Airport not found in database.',
            ];
        }

        return [
            'success' => true,

            'airport' => [
                'id' => $airport->id,
                'code' => $airport->code,
                'name' => $airport->name,
                'city' => $airport->city ?? null,
                'country' => $airport->country ?? null,
            ],
        ];
    }
}