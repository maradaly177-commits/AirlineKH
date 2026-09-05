<?php

namespace App\Services\AI\RAG;

class DocumentSearchService
{
    public function __construct(
        protected EmbeddingService $embeddingService,
        protected QdrantService $qdrantService
    ) {
    }

    public function search(
        string $question,
        int $limit = 5
    ): array {
        try {
            $vector =
                $this->embeddingService->embed($question);

            return $this->qdrantService->search(
                $vector,
                $limit
            );
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('RAG search failed, using local fallback: ' . $e->getMessage());
            return $this->localFallbackSearch($question, $limit);
        }
    }

    private function getFallbackDocuments(): array
    {
        return [
            [
                'category' => 'baggage',
                'title' => 'Baggage policy',
                'text' => 'Hành lý xách tay: 7kg miễn phí kèm vé. Hạng Economy Standard có sẵn 20kg ký gửi; Hạng Business có 30kg ký gửi; Hạng Saver không có sẵn. Mua thêm hành lý: Các gói 15kg, 20kg, 25kg, 30kg có thể chọn trực tiếp tại Bước chọn dịch vụ (Services).',
            ],
            [
                'category' => 'reschedule',
                'title' => 'Flight change policy',
                'text' => 'Thay đổi ngày bay/giờ bay: Hỗ trợ đổi trước giờ bay tối thiểu 3 tiếng, phí đổi 350.000đ/chặng + chênh lệch giá vé (nếu có). Sai tên đệm: Hỗ trợ chỉnh sửa lỗi chính tả/tên đệm miễn phí hoặc phí nhỏ 100.000đ khi liên hệ CSKH.',
            ],
            [
                'category' => 'refund',
                'title' => 'Cancellation and refund policy',
                'text' => 'Hủy vé & Hoàn tiền: Hạng Thương gia (Business) được hoàn tiền (trừ phí theo quy định); Hạng Siêu tiết kiệm không áp dụng hoàn vé. Chuyến bay delay/hủy: Hãng hỗ trợ đổi sang chuyến bay kế tiếp miễn phí hoặc bồi thường/hoàn tiền theo quy định.',
            ],
            [
                'category' => 'check-in',
                'title' => 'Check-in policy',
                'text' => 'Check-in Online: Mở trước 24 giờ và đóng trước 60 phút so với giờ khởi hành trên website/app SkyLink. Bay nội địa: cần CCCD/Hộ chiếu/Giấy khai sinh (cho trẻ em) còn hiệu lực. Bay quốc tế: Hộ chiếu BẮT BUỘC còn hạn ít nhất 6 tháng.',
            ],
            [
                'category' => 'airport',
                'title' => 'Airport information',
                'text' => 'Các mã sân bay phổ biến: Hà Nội = HAN, TP.HCM / Sài Gòn = SGN, Đà Nẵng = DAD, Nha Trang = CXR, Phú Quốc = PQC, Hải Phòng = HPH, Huế = HUI, Đà Lạt = DLI, Cần Thơ = VCA, Bangkok = BKK, Singapore = SIN, Tokyo = NRT/HND, Seoul = ICN.',
            ],
            [
                'category' => 'inflight-services',
                'title' => 'In-flight services & Meals',
                'text' => 'Suất ăn nóng, đồ uống và suất ăn chay (Vegetarian) có thể đặt trước tại Bước chọn dịch vụ trước giờ bay ít nhất 24 giờ. Trẻ sơ sinh (dưới 2 tuổi): 10% giá vé người lớn (ngồi chung); Trẻ em (từ 2 đến dưới 12 tuổi): 75% giá vé người lớn.',
            ],
        ];
    }

    private function localFallbackSearch(string $question, int $limit): array
    {
        $documents = $this->getFallbackDocuments();
        $results = [];

        // Simple tokenization
        $keywords = array_filter(
            preg_split('/[\s,\.\?\!\-\:\;]+/u', mb_strtolower($question)),
            fn($kw) => mb_strlen($kw) > 2
        );

        if (empty($keywords)) {
            $keywords = array_filter(explode(' ', mb_strtolower($question)));
        }

        foreach ($documents as $i => $doc) {
            $score = 0;
            $textToSearch = mb_strtolower($doc['category'] . ' ' . $doc['title'] . ' ' . $doc['text']);
            
            foreach ($keywords as $kw) {
                if (str_contains($textToSearch, $kw)) {
                    $score += 1.0;
                }
            }

            if (str_contains($textToSearch, mb_strtolower($question))) {
                $score += 5.0;
            }

            if ($score > 0) {
                $results[] = [
                    'id' => abs(crc32($doc['category'] . '-' . $i)),
                    'score' => $score / (count($keywords) ?: 1),
                    'payload' => [
                        'category' => $doc['category'],
                        'title' => $doc['title'],
                        'text' => $doc['text'],
                        'source' => 'built-in-airline-policy',
                    ]
                ];
            }
        }

        // If no keyword matches, add all documents with low score
        if (empty($results)) {
            foreach ($documents as $i => $doc) {
                $results[] = [
                    'id' => abs(crc32($doc['category'] . '-' . $i)),
                    'score' => 0.1,
                    'payload' => [
                        'category' => $doc['category'],
                        'title' => $doc['title'],
                        'text' => $doc['text'],
                        'source' => 'built-in-airline-policy',
                    ]
                ];
            }
        }

        usort($results, fn($a, $b) => $b['score'] <=> $a['score']);
        return array_slice($results, 0, $limit);
    }
}