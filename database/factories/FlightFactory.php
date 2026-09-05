<?php

namespace Database\Factories;

use App\Models\Flight;
use App\Models\Airport;
use App\Models\Aircraft; // QUAN TRỌNG: Phải import Model này
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

class FlightFactory extends Factory
{
    protected $model = Flight::class;

    public function definition(): array
    {
        // 1. Lấy ngẫu nhiên 2 Sân bay KHÁC NHAU
        $airports = Airport::inRandomOrder()->take(2)->get();
        
        // Fail-safe: Nếu chưa seed Airport thì lấy tạm ID 1 và 2
        $departure_id = $airports->first()->id ?? 1;
        $arrival_id = $airports->last()->id ?? 2;

        // 2. Lấy ngẫu nhiên 1 Máy bay (Bắt buộc theo ERD mới)
        $aircraft = Aircraft::inRandomOrder()->first();
        // Nếu chưa có máy bay nào, ta có thể tạo nhanh 1 cái (hoặc mặc định ID 1)
        $aircraft_id = $aircraft->id ?? 1;

        // 3. Logic thời gian (Đặt khoảng từ 01/09/2026 đến 31/10/2026)
        $departureTime = Carbon::instance(fake()->dateTimeBetween('2026-09-01', '2026-10-31'));
        $arrivalTime = (clone $departureTime)->addHours(rand(1, 4));

        return [
            'flight_number' => fake()->randomElement(['VN', 'VJ', 'QH', 'VU']) . fake()->numberBetween(100, 9999),
            
            'departure_airport_id' => $departure_id,
            'arrival_airport_id' => $arrival_id,
            'aircraft_id' => $aircraft_id, 
            
            'departure_time' => $departureTime,
            'arrival_time' => $arrivalTime,
            
            'base_price' => fake()->numberBetween(5, 50) * 100000,
            
            
            'status' => fake()->randomElement([1, 1, 1, 1, 2]), 
            'available_seats' => 180,
            
        ];
    }
}