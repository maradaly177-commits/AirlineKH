<?php

namespace App\Console\Commands;

use App\Services\AI\RAG\EmbeddingService;
use App\Services\AI\RAG\QdrantService;
use Illuminate\Console\Command;

class SeedAIKnowledge extends Command
{
    protected $signature = 'ai:knowledge:seed {--fresh : Delete and recreate the Qdrant collection first}';

    protected $description = 'Create the airline knowledge collection and index policy documents in Qdrant';

    public function handle(
        EmbeddingService $embeddingService,
        QdrantService $qdrantService
    ): int {
        if ($this->option('fresh')) {
            $qdrantService->deleteCollection();
        }

        if (!$qdrantService->collectionExists()) {
            $qdrantService->createCollection(768);
            $this->info('Created the airline knowledge collection.');
        }

        $documents = $this->documents();
        $points = [];

        foreach ($documents as $document) {
            foreach ($this->chunks($document['content']) as $index => $content) {
                $this->line("Embedding {$document['category']} chunk ".($index + 1).'...');

                $points[] = [
                    'id' => abs(crc32($document['category'].'-'.$index)),
                    'vector' => $embeddingService->embed($content),
                    'payload' => [
                        'category' => $document['category'],
                        'title' => $document['title'],
                        'text' => $content,
                        'source' => 'built-in-airline-policy',
                    ],
                ];
            }
        }

        $qdrantService->upsert($points);
        $this->info('Indexed '.count($points).' knowledge chunks.');

        return self::SUCCESS;
    }

    private function chunks(string $content, int $size = 900): array
    {
        $chunks = [];
        $content = trim($content);
        $length = mb_strlen($content);

        for ($offset = 0; $offset < $length; $offset += $size) {
            $chunk = trim(mb_substr($content, $offset, $size));

            if ($chunk !== '') {
                $chunks[] = $chunk;
            }
        }

        return $chunks;
    }

    private function documents(): array
    {
        return [
            [
                'category' => 'baggage',
                'title' => 'Baggage policy',
                'content' => 'Hành lý xách tay phải tuân theo giới hạn kích thước và trọng lượng của từng hạng vé. Hành lý ký gửi được áp dụng theo điều kiện vé và có thể mua thêm trước chuyến bay. Hành khách cần kiểm tra vật phẩm bị hạn chế hoặc cấm vận chuyển trước khi làm thủ tục.',
            ],
            [
                'category' => 'reschedule',
                'title' => 'Flight change policy',
                'content' => 'Hành khách có thể yêu cầu đổi chuyến trước giờ khởi hành theo điều kiện vé. Việc đổi chuyến phụ thuộc vào chỗ còn trống và có thể phát sinh phí đổi cùng chênh lệch giá vé. Hệ thống chỉ xác nhận sau khi thanh toán phần phí được yêu cầu.',
            ],
            [
                'category' => 'refund',
                'title' => 'Cancellation and refund policy',
                'content' => 'Yêu cầu hủy vé và hoàn tiền phải tuân theo trạng thái booking và điều kiện của loại vé. Vé đã thanh toán có thể chịu phí hủy. Số tiền hoàn thực tế được xác định sau khi hệ thống kiểm tra booking và phương thức thanh toán.',
            ],
            [
                'category' => 'check-in',
                'title' => 'Check-in policy',
                'content' => 'Hành khách cần có booking hợp lệ và thông tin vé chính xác để check-in. Thời gian mở và đóng check-in phụ thuộc vào lịch bay. Hành khách nên hoàn tất check-in sớm và có mặt tại sân bay theo thời gian hãng yêu cầu.',
            ],
            [
                'category' => 'airport',
                'title' => 'Airport information',
                'content' => 'Mỗi sân bay được nhận diện bằng mã IATA và có tên sân bay tương ứng trong dữ liệu hệ thống. Khi tìm chuyến bay, cần cung cấp đúng mã sân bay khởi hành và sân bay đến để tránh nhầm lẫn.',
            ],
            [
                'category' => 'inflight-services',
                'title' => 'In-flight services',
                'content' => 'Dịch vụ trên chuyến bay có thể bao gồm hành lý mua thêm, suất ăn và ưu tiên làm thủ tục. Giá dịch vụ được lấy từ dữ liệu hệ thống tại thời điểm đặt và có thể thay đổi theo từng chuyến bay.',
            ],
        ];
    }
}