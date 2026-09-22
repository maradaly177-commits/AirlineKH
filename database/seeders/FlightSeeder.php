<?php

namespace Database\Seeders;

use App\Models\Airport;
use App\Models\Flight;
use Illuminate\Database\Seeder;

class FlightSeeder extends Seeder
{
    public function run(): void
    {
        $airports = Airport::all();
        if ($airports->count() < 2) {
            return;
        }

        $dates = ['2026-09-24', '2026-09-25', '2026-09-26', '2026-09-27', '2026-09-28', '2026-09-29', '2026-09-30'];

        $airlinePrefixes = [
            ['prefix' => 'VN', 'aircraft_id' => 1, 'min_price' => 1400000, 'max_price' => 1800000],
            ['prefix' => 'VJ', 'aircraft_id' => 2, 'min_price' => 1100000, 'max_price' => 1400000],
            ['prefix' => 'QH', 'aircraft_id' => 2, 'min_price' => 1300000, 'max_price' => 1600000],
            ['prefix' => 'VU', 'aircraft_id' => 2, 'min_price' => 1200000, 'max_price' => 1500000],
            ['prefix' => 'VN', 'aircraft_id' => 3, 'min_price' => 1350000, 'max_price' => 1700000],
        ];

        $times = [
            ['dep' => '06:30:00', 'arr' => '08:40:00'],
            ['dep' => '09:45:00', 'arr' => '11:55:00'],
            ['dep' => '13:15:00', 'arr' => '15:25:00'],
            ['dep' => '16:50:00', 'arr' => '19:00:00'],
            ['dep' => '20:30:00', 'arr' => '22:40:00'],
        ];

        foreach ($airports as $depAirport) {
            foreach ($airports as $arrAirport) {
                if ($depAirport->id === $arrAirport->id) {
                    continue;
                }

                foreach ($dates as $date) {
                    $existingCount = Flight::where('departure_airport_id', $depAirport->id)
                        ->where('arrival_airport_id', $arrAirport->id)
                        ->whereDate('departure_time', $date)
                        ->count();

                    $needed = 5 - $existingCount;
                    if ($needed <= 0) {
                        continue;
                    }

                    for ($i = 0; $i < $needed; $i++) {
                        $timeSlot = $times[$i % count($times)];
                        $airline = $airlinePrefixes[$i % count($airlinePrefixes)];

                        do {
                            $flightNum = $airline['prefix'] . rand(1000, 9999);
                        } while (Flight::where('flight_number', $flightNum)->exists());

                        Flight::create([
                            'flight_number'        => $flightNum,
                            'departure_airport_id' => $depAirport->id,
                            'arrival_airport_id'   => $arrAirport->id,
                            'departure_time'       => "{$date} {$timeSlot['dep']}",
                            'arrival_time'         => "{$date} {$timeSlot['arr']}",
                            'aircraft_id'          => $airline['aircraft_id'],
                            'base_price'           => rand($airline['min_price'], $airline['max_price']),
                            'available_seats'      => rand(140, 210),
                            'status'               => 'scheduled',
                        ]);
                    }
                }
            }
        }
    }
}
