<?php

namespace App\Services\AI\Tools;

use App\Models\Flight;
use App\Models\Airport;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Throwable;

class SearchFlightTool
{
    /**
     * Tự động chuyển đổi tên thành phố, viết tắt (HN, SG, Sài Gòn...) sang mã IATA chuẩn
     */
    public function resolveAirportCode(string $input): string
    {
        $inputTrim = trim($input);
        if ($inputTrim === '') return '';

        $inputClean = mb_strtolower($inputTrim, 'UTF-8');

        $dict = [
            'han' => 'HAN', 'hà nội' => 'HAN', 'ha noi' => 'HAN', 'nội bài' => 'HAN', 'noi bai' => 'HAN', 'hn' => 'HAN',
            'sgn' => 'SGN', 'hồ chí minh' => 'SGN', 'ho chi minh' => 'SGN', 'tphcm' => 'SGN', 'tp.hcm' => 'SGN', 'tp hcm' => 'SGN', 'sài gòn' => 'SGN', 'sai gon' => 'SGN', 'tân sơn nhất' => 'SGN', 'tan son nhat' => 'SGN', 'sg' => 'SGN',
            'dad' => 'DAD', 'đà nẵng' => 'DAD', 'da nang' => 'DAD', 'dn' => 'DAD',
            'cxr' => 'CXR', 'cam ranh' => 'CXR', 'nha trang' => 'CXR',
            'pqc' => 'PQC', 'phú quốc' => 'PQC', 'phu quoc' => 'PQC',
            'hph' => 'HPH', 'hải phòng' => 'HPH', 'hai phong' => 'HPH', 'cát bi' => 'HPH', 'cat bi' => 'HPH',
            'hui' => 'HUI', 'huế' => 'HUI', 'hue' => 'HUI', 'phú bài' => 'HUI', 'phu bai' => 'HUI',
            'dli' => 'DLI', 'đà lạt' => 'DLI', 'da lat' => 'DLI', 'liên khương' => 'DLI', 'lien khuong' => 'DLI',
            'vca' => 'VCA', 'cần thơ' => 'VCA', 'can tho' => 'VCA',
            'uih' => 'UIH', 'quy nhơn' => 'UIH', 'quy nhon' => 'UIH', 'phù cát' => 'UIH', 'phu cat' => 'UIH',
            'vii' => 'VII', 'vinh' => 'VII',
            'thd' => 'THD', 'thanh hóa' => 'THD', 'thanh hoa' => 'THD', 'thọ xuân' => 'THD', 'tho xuan' => 'THD',
            'vdh' => 'VDH', 'đồng hới' => 'VDH', 'dong hoi' => 'VDH',
            'vdo' => 'VDO', 'vân đồn' => 'VDO', 'van don' => 'VDO', 'quảng ninh' => 'VDO', 'quang ninh' => 'VDO',
            'pxu' => 'PXU', 'pleiku' => 'PXU', 'gia lai' => 'PXU',
            'tbb' => 'TBB', 'tuy hòa' => 'TBB', 'tuy hoa' => 'TBB', 'phú yên' => 'TBB', 'phu yen' => 'TBB',
            'bmv' => 'BMV', 'buôn ma thuột' => 'BMV', 'buon ma thuot' => 'BMV', 'đắk lắk' => 'BMV', 'dak lak' => 'BMV',
            'vcs' => 'VCS', 'côn đảo' => 'VCS', 'con dao' => 'VCS',
            'din' => 'DIN', 'điện biên' => 'DIN', 'dien bien' => 'DIN',
            'vkg' => 'VKG', 'rạch giá' => 'VKG', 'rach gia' => 'VKG', 'kiên giang' => 'VKG', 'kien giang' => 'VKG',
            'cah' => 'CAH', 'cà mau' => 'CAH', 'ca mau' => 'CAH',

            // Quốc tế phổ biến
            'bkk' => 'BKK', 'bangkok' => 'BKK', 'băng cốc' => 'BKK', 'suvarnabhumi' => 'BKK', 'thái lan' => 'BKK', 'thai lan' => 'BKK',
            'dmk' => 'DMK', 'don mueang' => 'DMK',
            'sin' => 'SIN', 'singapore' => 'SIN', 'changi' => 'SIN',
            'kul' => 'KUL', 'kuala lumpur' => 'KUL', 'malaysia' => 'KUL',
            'nrt' => 'NRT', 'narita' => 'NRT', 'tokyo' => 'NRT', 'nhật bản' => 'NRT', 'nhat ban' => 'NRT',
            'hnd' => 'HND', 'haneda' => 'HND',
            'icn' => 'ICN', 'incheon' => 'ICN', 'seoul' => 'ICN', 'hàn quốc' => 'ICN', 'han quoc' => 'ICN',
            'tpe' => 'TPE', 'taipei' => 'TPE', 'đài bắc' => 'TPE', 'đài loan' => 'TPE',
            'hkg' => 'HKG', 'hong kong' => 'HKG', 'hồng kông' => 'HKG',
            'pnh' => 'PNH', 'phnom penh' => 'PNH', 'campuchia' => 'PNH',
            'rep' => 'REP', 'siem reap' => 'REP', 'sai' => 'SAI',
            'vte' => 'VTE', 'vientiane' => 'VTE', 'viêng chăn' => 'VTE', 'lào' => 'VTE', 'lao' => 'VTE',
            'syd' => 'SYD', 'sydney' => 'SYD', 'úc' => 'SYD', 'australia' => 'SYD',
            'mel' => 'MEL', 'melbourne' => 'MEL',
        ];

        if (isset($dict[$inputClean])) {
            return $dict[$inputClean];
        }

        if (strlen($inputTrim) === 3 && preg_match('/^[A-Za-z]{3}$/', $inputTrim)) {
            return strtoupper($inputTrim);
        }

        try {
            $airport = Airport::where('code', strtoupper($inputTrim))
                ->orWhere('city', 'LIKE', "%{$inputTrim}%")
                ->orWhere('name', 'LIKE', "%{$inputTrim}%")
                ->first();

            if ($airport) {
                return $airport->code;
            }
        } catch (\Throwable $e) {
            // Fallback
        }

        return strtoupper($inputTrim);
    }
    /**
     * Definition dùng để Gemini biết cách gọi tool.
     */
    public function definition(): array
    {
        return [
            'name' => 'search_flight',

            'description' =>
                'Tìm chuyến bay THỰC TẾ trong database SkyLink theo sân bay đi, sân bay đến, ngày bay và khung giờ. ' .
                'Luôn sử dụng dữ liệu trả về từ database, không được tự suy đoán hoặc bịa chuyến bay.',

            'parameters' => [
                'type' => 'OBJECT',

                'properties' => [
                    'origin' => [
                        'type' => 'STRING',
                        'description' =>
                            'Mã IATA sân bay đi. Ví dụ: Hà Nội/Nội Bài = HAN, ' .
                            'Hồ Chí Minh/Sài Gòn/Tân Sơn Nhất = SGN, ' .
                            'Đà Nẵng = DAD, Cam Ranh = CXR, Phú Quốc = PQC, Bangkok = BKK, Singapore = SIN.',
                    ],

                    'destination' => [
                        'type' => 'STRING',
                        'description' =>
                            'Mã IATA sân bay đến. Ví dụ: Hà Nội/Nội Bài = HAN, ' .
                            'Hồ Chí Minh/Sài Gòn/Tân Sơn Nhất = SGN, ' .
                            'Đà Nẵng = DAD, Cam Ranh = CXR, Phú Quốc = PQC, Bangkok = BKK, Singapore = SIN.',
                    ],

                    'date' => [
                        'type' => 'STRING',
                        'description' =>
                            'Ngày bay theo định dạng YYYY-MM-DD. ' .
                            'Ví dụ: ngày mai 28/08/2026 phải truyền 2026-08-28.',
                    ],

                    'max_price' => [
                        'type' => 'NUMBER',
                        'description' =>
                            'Giá vé tối đa nếu người dùng yêu cầu. ' .
                            'Không truyền nếu người dùng không đề cập giá tối đa.',
                    ],

                    'limit' => [
                        'type' => 'INTEGER',
                        'description' =>
                            'Số lượng chuyến bay muốn lấy. ' .
                            'Nếu người dùng yêu cầu "1 chuyến duy nhất", "chuyến rẻ nhất", "chuyến sớm nhất", BẮT BUỘC truyền limit = 1. ' .
                            'Nếu người dùng muốn xem danh sách/tất cả thì truyền 5-10.',
                    ],

                    'sort_by' => [
                        'type' => 'STRING',
                        'description' =>
                            'Tiêu chí sắp xếp: "price_asc" (giá rẻ nhất trước - mặc định), "price_desc" (giá cao nhất trước), "departure_asc" (giờ bay sớm nhất), "departure_desc" (giờ bay muộn nhất).',
                    ],

                    'time_of_day' => [
                        'type' => 'STRING',
                        'description' =>
                            'Khung giờ bay mong muốn: "morning" (buổi sáng trước 12h), "afternoon" (buổi chiều 12h-18h), "evening" (buổi tối/đêm sau 18h).',
                    ],

                    'before_time' => [
                        'type' => 'STRING',
                        'description' =>
                            'Chỉ tìm các chuyến bay cất cánh TRƯỚC giờ này (ví dụ trước 7h sáng -> truyền "07:00").',
                    ],

                    'after_time' => [
                        'type' => 'STRING',
                        'description' =>
                            'Chỉ tìm các chuyến bay cất cánh SAU giờ này (ví dụ sau 18h tối -> truyền "18:00").',
                    ],
                ],

                'required' => [
                    'origin',
                    'destination',
                ],
            ],
        ];
    }

    /**
     * Thực thi tìm chuyến bay từ database.
     */
    public function execute(array $arguments): array
    {
        Log::info('========== SearchFlightTool START ==========');

        Log::info('SearchFlightTool INPUT', [
            'arguments' => $arguments,
        ]);

        /*
        |--------------------------------------------------------------------------
        | 1. Normalize arguments
        |--------------------------------------------------------------------------
        */

        $rawOrigin = $arguments['origin']
            ?? $arguments['departure_airport']
            ?? $arguments['departure']
            ?? $arguments['from']
            ?? $arguments['from_city']
            ?? $arguments['departure_city']
            ?? '';

        $rawDestination = $arguments['destination']
            ?? $arguments['arrival_airport']
            ?? $arguments['arrival']
            ?? $arguments['to']
            ?? $arguments['to_city']
            ?? $arguments['arrival_city']
            ?? '';

        $origin = $this->resolveAirportCode((string) $rawOrigin);
        $destination = $this->resolveAirportCode((string) $rawDestination);

        $rawDate = trim((string) (
            $arguments['date']
            ?? $arguments['departure_date']
            ?? $arguments['flight_date']
            ?? $arguments['fly_date']
            ?? $arguments['depart_date']
            ?? $arguments['day']
            ?? ''
        ));

        $hasSpecificDate = true;
        // Tự động phân giải các từ khóa ngày nếu có
        $rawDateLower = mb_strtolower($rawDate);
        if ($rawDateLower === 'tomorrow' || $rawDateLower === 'ngày mai' || $rawDateLower === 'mai') {
            $date = date('Y-m-d', strtotime('+1 day'));
        } elseif ($rawDateLower === 'today' || $rawDateLower === 'hôm nay' || $rawDateLower === 'nay') {
            $date = date('Y-m-d');
        } elseif ($rawDate === '') {
            $date = '';
            $hasSpecificDate = false;
        } else {
            $date = $rawDate;
        }

        $maxPrice = $arguments['max_price'] ?? null;
        $limit = isset($arguments['limit']) ? max(1, min(20, (int) $arguments['limit'])) : 10;
        $sortBy = trim((string) ($arguments['sort_by'] ?? 'price_asc'));
        $timeOfDay = strtolower(trim((string) ($arguments['time_of_day'] ?? '')));
        $beforeTime = trim((string) ($arguments['before_time'] ?? ''));
        $afterTime = trim((string) ($arguments['after_time'] ?? ''));

        Log::info('SearchFlightTool NORMALIZED INPUT', [
            'origin' => $origin,
            'destination' => $destination,
            'date' => $date,
            'max_price' => $maxPrice,
            'limit' => $limit,
            'sort_by' => $sortBy,
            'time_of_day' => $timeOfDay,
            'before_time' => $beforeTime,
            'after_time' => $afterTime,
        ]);

        /*
        |--------------------------------------------------------------------------
        | 2. Validate origin / destination
        |--------------------------------------------------------------------------
        */

        if ($origin === '') {
            Log::warning('SearchFlightTool ERROR: origin is empty');

            return [
                'success' => false,
                'type' => 'validation_error',
                'message' => 'Sân bay đi chưa được xác định.',
                'flights' => [],
            ];
        }

        if ($destination === '') {
            Log::warning('SearchFlightTool ERROR: destination is empty');

            return [
                'success' => false,
                'type' => 'validation_error',
                'message' => 'Sân bay đến chưa được xác định.',
                'flights' => [],
            ];
        }

        /*
        |--------------------------------------------------------------------------
        | 3. Date is REQUIRED
        |--------------------------------------------------------------------------
        */

        if ($date === '' && $hasSpecificDate) {
            Log::warning('SearchFlightTool ERROR: date is empty');

            return [
                'success' => false,
                'type' => 'validation_error',
                'message' =>
                    'Ngày bay là bắt buộc. Hãy xác định ngày bay trước khi tìm chuyến.',
                'flights' => [],
            ];
        }

        /*
        |--------------------------------------------------------------------------
        | 4. Validate date format
        |--------------------------------------------------------------------------
        */

        if ($hasSpecificDate) {
            try {
                $parsedDate = Carbon::createFromFormat(
                    'Y-m-d',
                    $date
                );

                /*
                 * createFromFormat đôi khi chấp nhận ngày không hợp lệ
                 * theo cách không mong muốn, nên kiểm tra lại format.
                 */
                if ($parsedDate->format('Y-m-d') !== $date) {
                    throw new \Exception('Invalid date');
                }
            } catch (Throwable $e) {

                Log::warning('SearchFlightTool ERROR: invalid date', [
                    'date' => $date,
                    'error' => $e->getMessage(),
                ]);

                return [
                    'success' => false,
                    'type' => 'validation_error',
                    'message' =>
                        'Ngày bay không hợp lệ. Định dạng phải là YYYY-MM-DD.',
                    'flights' => [],
                ];
            }
        }

        /*
        |--------------------------------------------------------------------------
        | 5. Validate max price
        |--------------------------------------------------------------------------
        */

        if ($maxPrice !== null) {
            if (!is_numeric($maxPrice)) {

                Log::warning(
                    'SearchFlightTool ERROR: invalid max_price',
                    [
                        'max_price' => $maxPrice,
                    ]
                );

                return [
                    'success' => false,
                    'type' => 'validation_error',
                    'message' =>
                        'Giá tối đa không hợp lệ.',
                    'flights' => [],
                ];
            }

            $maxPrice = (float) $maxPrice;
        }

        /*
        |--------------------------------------------------------------------------
        | 6. Build query
        |--------------------------------------------------------------------------
        */

        try {

            $query = Flight::with([
                'departureAirport',
                'arrivalAirport',
                'aircraft',
            ])

            /*
             * IMPORTANT:
             *
             * Nếu bảng airports của bạn dùng:
             *
             *     code
             *
             * thì giữ nguyên.
             *
             * Nếu dùng:
             *
             *     iata_code
             *
             * thì đổi code thành iata_code.
             */

            ->whereHas(
                'departureAirport',
                function ($q) use ($origin) {

                    $q->where(
                        'code',
                        $origin
                    );

                    // Nếu DB dùng iata_code:
                    // $q->where('iata_code', $origin);
                }
            )

            ->whereHas(
                'arrivalAirport',
                function ($q) use ($destination) {

                    $q->where(
                        'code',
                        $destination
                    );

                    // Nếu DB dùng iata_code:
                    // $q->where('iata_code', $destination);
                }
            )

            /*
             * Chỉ lấy chuyến còn ghế.
             */
            ->where(
                'available_seats',
                '>',
                0
            )

            /*
             * Không lấy chuyến cancelled.
             */
            ->where(
                'status',
                '!=',
                'cancelled'
            )

            /*
             * QUAN TRỌNG:
             *
             * User hỏi ngày nào thì chỉ tìm đúng ngày đó. Nếu không truyền ngày, lấy từ hôm nay trở đi.
             */
            ->when($hasSpecificDate, function ($query) use ($date) {
                return $query->whereDate('departure_time', $date);
            }, function ($query) {
                return $query->where('departure_time', '>=', \Carbon\Carbon::now());
            });

            /*
            |--------------------------------------------------------------------------
            | 7. Filter price
            |--------------------------------------------------------------------------
            */

            if ($maxPrice !== null) {
                $query->where('base_price', '<=', $maxPrice);
            }

            if ($beforeTime !== '') {
                $query->whereTime('departure_time', '<=', $beforeTime);
            }

            if ($afterTime !== '') {
                $query->whereTime('departure_time', '>=', $afterTime);
            }

            if ($timeOfDay === 'morning' || $timeOfDay === 'sáng' || $timeOfDay === 'buổi sáng') {
                $query->whereTime('departure_time', '<', '12:00:00');
            } elseif ($timeOfDay === 'afternoon' || $timeOfDay === 'chiều' || $timeOfDay === 'buổi chiều') {
                $query->whereTime('departure_time', '>=', '12:00:00')
                      ->whereTime('departure_time', '<', '18:00:00');
            } elseif ($timeOfDay === 'evening' || $timeOfDay === 'tối' || $timeOfDay === 'buổi tối' || $timeOfDay === 'night' || $timeOfDay === 'đêm') {
                $query->whereTime('departure_time', '>=', '18:00:00');
            }

            /*
            |--------------------------------------------------------------------------
            | 8. Log SQL để debug
            |--------------------------------------------------------------------------
            */

            Log::info('SearchFlightTool SQL', [
                'sql' => $query->toSql(),
                'bindings' => $query->getBindings(),
            ]);

            /*
            |--------------------------------------------------------------------------
            | 9. Execute query
            |--------------------------------------------------------------------------
            */

            match ($sortBy) {
                'departure_asc' => $query->orderBy('departure_time', 'asc'),
                'departure_desc' => $query->orderBy('departure_time', 'desc'),
                'price_desc' => $query->orderBy('base_price', 'desc'),
                default => $query->orderBy('base_price', 'asc'),
            };

            $flights = $query
                ->take($limit)
                ->get();

            /*
            |--------------------------------------------------------------------------
            | 10. Log DB result
            |--------------------------------------------------------------------------
            */

            Log::info('SearchFlightTool RESULT', [
                'count' => $flights->count(),

                'flights' => $flights->map(
                    function ($flight) {
                        $durationMinutes = null;

                        if ($flight->departure_time && $flight->arrival_time) {
                            $durationMinutes = (int) $flight->departure_time->diffInMinutes($flight->arrival_time);
                        }

                        return [
                            'id' =>
                                $flight->id,

                            'flight_number' =>
                                $flight->flight_number,

                            'origin' =>
                                $flight
                                    ->departureAirport
                                    ?->code,

                            'destination' =>
                                $flight
                                    ->arrivalAirport
                                    ?->code,

                            'departure_time' =>
                                $flight->departure_time
                                    ?->format(
                                        'Y-m-d H:i:s'
                                    ),

                            'arrival_time' =>
                                $flight->arrival_time
                                    ?->format(
                                        'Y-m-d H:i:s'
                                    ),

                            'duration_minutes' =>
                                $durationMinutes,

                            'base_price' =>
                                $flight->base_price,

                            'available_seats' =>
                                $flight->available_seats,

                            'status' =>
                                $flight->status,
                        ];
                    }
                )->values()->toArray(),
            ]);

            /*
            |--------------------------------------------------------------------------
            | 11. No flights
            |--------------------------------------------------------------------------
            */

            if ($flights->isEmpty()) {

                Log::info(
                    'SearchFlightTool: NO FLIGHTS FOUND',
                    [
                        'origin' => $origin,
                        'destination' => $destination,
                        'date' => $date,
                        'max_price' => $maxPrice,
                    ]
                );

                return [
                    'success' => true,
                    'type' => 'no_flights',
                    'count' => 0,

                    'search' => [
                        'origin' => $origin,
                        'destination' => $destination,
                        'date' => $date,
                        'max_price' => $maxPrice,
                    ],

                    'message' =>
                        "Không tìm thấy chuyến bay phù hợp trong database " .
                        "cho {$origin} → {$destination} ngày {$date}.",

                    'flights' => [],
                ];
            }

            /*
            |--------------------------------------------------------------------------
            | 12. Convert result
            |--------------------------------------------------------------------------
            */

            $flightData = $flights
                ->map(
                    function ($flight) {
                        $durationMinutes = null;

                        if ($flight->departure_time && $flight->arrival_time) {
                            $durationMinutes = (int) $flight->departure_time->diffInMinutes($flight->arrival_time);
                        }

                        return [

                            'id' =>
                                $flight->id,

                            'flight_number' =>
                                $flight->flight_number,

                            'origin' =>
                                $flight
                                    ->departureAirport
                                    ?->code,

                            'destination' =>
                                $flight
                                    ->arrivalAirport
                                    ?->code,

                            'departure_time' =>
                                $flight->departure_time
                                    ?->format(
                                        'Y-m-d H:i:s'
                                    ),

                            'arrival_time' =>
                                $flight->arrival_time
                                    ?->format(
                                        'Y-m-d H:i:s'
                                    ),

                            'duration_minutes' =>
                                $durationMinutes,

                            'base_price' =>
                                $flight->base_price,

                            'available_seats' =>
                                $flight->available_seats,

                            'status' =>
                                $flight->status,
                        ];
                    }
                )
                ->values()
                ->toArray();

            /*
            |--------------------------------------------------------------------------
            | 13. Return successful DB result
            |--------------------------------------------------------------------------
            */

            Log::info(
                'SearchFlightTool: FLIGHTS FOUND',
                [
                    'origin' => $origin,
                    'destination' => $destination,
                    'date' => $date,
                    'count' => count($flightData),
                ]
            );

            Log::info('========== SearchFlightTool END ==========');

            return [
                'success' => true,

                'type' => 'flights_found',

                'count' => count($flightData),

                'search' => [
                    'origin' => $origin,
                    'destination' => $destination,
                    'date' => $date,
                    'max_price' => $maxPrice,
                ],

                'message' =>
                    "Đã tìm thấy " .
                    count($flightData) .
                    " chuyến bay trong database.",

                'flights' => $flightData,
            ];

        } catch (Throwable $e) {

            /*
            |--------------------------------------------------------------------------
            | 14. Database / unexpected error
            |--------------------------------------------------------------------------
            */

            Log::error(
                'SearchFlightTool DATABASE ERROR',
                [
                    'origin' => $origin,
                    'destination' => $destination,
                    'date' => $date,
                    'max_price' => $maxPrice,

                    'error' =>
                        $e->getMessage(),

                    'file' =>
                        $e->getFile(),

                    'line' =>
                        $e->getLine(),

                    'trace' =>
                        $e->getTraceAsString(),
                ]
            );

            return [
                'success' => false,

                'type' => 'database_error',

                'message' =>
                    'Không thể truy vấn dữ liệu chuyến bay từ database lúc này.',

                'flights' => [],
            ];
        }
    }
}