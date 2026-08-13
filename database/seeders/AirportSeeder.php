<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Airport; 

class AirportSeeder extends Seeder
{
    public function run(): void
    {
        $airports = [
            // Sửa 'iata_code' thành 'code', và bỏ cột 'country' đi
            ['code' => 'HAN', 'name' => 'Sân bay Quốc tế Nội Bài', 'city' => 'Hà Nội'],
            ['code' => 'SGN', 'name' => 'Sân bay Quốc tế Tân Sơn Nhất', 'city' => 'Hồ Chí Minh'],
            ['code' => 'DAD', 'name' => 'Sân bay Quốc tế Đà Nẵng', 'city' => 'Đà Nẵng'],
            ['code' => 'PQC', 'name' => 'Sân bay Quốc tế Phú Quốc', 'city' => 'Phú Quốc'],
            ['code' => 'CXR', 'name' => 'Sân bay Quốc tế Cam Ranh', 'city' => 'Nha Trang'],
        ];

        // Duyệt mảng và insert vào Database
        foreach ($airports as $airport) {
            Airport::create($airport);
        }
    }
}