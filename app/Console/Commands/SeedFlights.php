<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Flight;
use App\Models\Airport;
use Carbon\Carbon;

class SeedFlights extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'flights:seed {count=100 : Số lượng chuyến bay ngẫu nhiên cần tạo} {--full : Phủ kín lịch trình cho TẤT CẢ các chặng bay mỗi ngày trong tháng 9 và 10}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Tạo dữ liệu chuyến bay mẫu phục vụ thử nghiệm hệ thống';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if ($this->option('full')) {
            return $this->seedFullCoverage();
        }

        $count = (int) $this->argument('count');
        $this->info("Đang tạo ngẫu nhiên {$count} chuyến bay mới...");

        try {
            Flight::factory($count)->create();
            $this->info("Đã tạo thành công {$count} chuyến bay mới!");
        } catch (\Throwable $e) {
            $this->error("Lỗi khi tạo chuyến bay: " . $e->getMessage());
            return 1;
        }

        return 0;
    }

    /**
     * Phủ kín lịch bay toàn bộ các chặng bay mỗi ngày từ 01/09/2026 đến 31/10/2026
     */
    private function seedFullCoverage()
    {
        $airports = Airport::all();
        if ($airports->count() < 2) {
            $this->error("Không có đủ dữ liệu sân bay để tạo chặng bay.");
            return 1;
        }

        $start = Carbon::create(2026, 9, 1);
        $end = Carbon::create(2026, 10, 31);
        $totalDays = $start->diffInDays($end) + 1;

        $this->info("Đang tạo phủ kín lịch bay cho TẤT CẢ các ngày từ 01/09/2026 đến 31/10/2026 ({$totalDays} ngày)...");
        $this->info("Có tất cả " . ($airports->count() * ($airports->count() - 1)) . " chặng bay khác nhau.");

        $flightCount = 0;
        
        // Dùng Database Transaction để tối ưu hiệu năng ghi của SQL DB
        \Illuminate\Support\Facades\DB::beginTransaction();

        try {
            for ($date = clone $start; $date->lte($end); $date->addDay()) {
                foreach ($airports as $dep) {
                    foreach ($airports as $arr) {
                        if ($dep->id === $arr->id) {
                            continue;
                        }

                        // Flight 1: Buổi sáng
                        $depTime1 = (clone $date)->setTime(rand(6, 11), rand(0, 59), 0);
                        $arrTime1 = (clone $depTime1)->addHours(rand(1, 3));

                        Flight::factory()->create([
                            'departure_airport_id' => $dep->id,
                            'arrival_airport_id' => $arr->id,
                            'departure_time' => $depTime1,
                            'arrival_time' => $arrTime1,
                        ]);

                        // Flight 2: Buổi chiều / tối
                        $depTime2 = (clone $date)->setTime(rand(13, 21), rand(0, 59), 0);
                        $arrTime2 = (clone $depTime2)->addHours(rand(1, 3));

                        Flight::factory()->create([
                            'departure_airport_id' => $dep->id,
                            'arrival_airport_id' => $arr->id,
                            'departure_time' => $depTime2,
                            'arrival_time' => $arrTime2,
                        ]);

                        $flightCount += 2;
                    }
                }
            }

            \Illuminate\Support\Facades\DB::commit();
            $this->info("Thành công! Đã tạo {$flightCount} chuyến bay. Mỗi chặng bay ngày nào cũng có ít nhất 2 chuyến!");
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\DB::rollBack();
            $this->error("Lỗi khi tạo lịch phủ kín: " . $e->getMessage());
            return 1;
        }

        return 0;
    }
}
