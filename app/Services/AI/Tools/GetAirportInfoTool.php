<?php

namespace App\Services\AI\Tools;

use App\Models\Airport;

class GetAirportInfoTool
{
    public function definition(): array
    {
        return [
            'type' => 'function',

            'function' => [
                'name' => 'get_airport_info',

                'description' =>
                    'Get information about an airport.',

                'parameters' => [
                    'type' => 'object',

                    'properties' => [
                        'code' => [
                            'type' => 'string',
                            'description' =>
                                'Airport IATA code such as HAN, SGN or DAD.',
                        ],
                    ],

                    'required' => [
                        'code',
                    ],
                ],
            ],
        ];
    }

    public function execute(array $arguments): array
    {
        $airport = Airport::where(
            'code',
            strtoupper($arguments['code'])
        )->first();

        if (!$airport) {
            return [
                'success' => false,
                'message' => 'Airport not found.',
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