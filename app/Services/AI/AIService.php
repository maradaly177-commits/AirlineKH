<?php

namespace App\Services\AI;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class AIService
{
    protected array $apiKeys = [];
    protected string $apiKey;
    protected string $model;
    protected string $baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

    public function __construct()
    {
        $keyString = config('services.gemini.api_key') ?: env('GEMINI_API_KEY');

        // Direct .env file fallback in case of cached config or env issues
        if (empty($keyString) && file_exists(base_path('.env'))) {
            $envLines = @file(base_path('.env'), FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [];
            foreach ($envLines as $line) {
                $trimmed = trim($line);
                if (str_starts_with($trimmed, 'GEMINI_API_KEY=')) {
                    $keyString = trim(substr($trimmed, 15), " \t\n\r\0\x0B\"'");
                    break;
                }
            }
        }

        $keys = array_filter(array_map('trim', explode(',', (string) $keyString)));
        $this->apiKeys = !empty($keys) ? array_values($keys) : [];
        $this->apiKey = $this->apiKeys[0] ?? '';
        $this->model = (string) (config('services.gemini.model') ?: env('GEMINI_MODEL', 'gemini-1.5-flash'));

        if (empty($this->apiKeys)) {
            throw new RuntimeException('GEMINI_API_KEY is not configured.');
        }
    }

    public function systemPrompt(): string
    {
        $today = date('Y-m-d');
        $tomorrow = date('Y-m-d', strtotime('+1 day'));

        return <<<PROMPT
You are SkyAI Assistant, the official virtual assistant for SkyLink Airline Booking.

CURRENT DATE:
Today: {$today}
Tomorrow: {$tomorrow}

IMPORTANT:
- Flight information MUST come from airline database through tools.
- NEVER invent flights, prices, flight numbers, seats or booking information.
- MULTILINGUAL LANGUAGE RULE (CRITICAL): ALWAYS detect the language of the customer's message and reply in the EXACT SAME LANGUAGE (e.g., English, Vietnamese, Khmer ភាសាខ្មែរ, Chinese 中文, Japanese 日本語, Korean 한국어, French, Thai, etc.). If the customer writes in English, answer 100% in natural English. If the customer writes in Khmer, answer 100% in Khmer.
- Be concise, polite, and natural.

AIRPORT CODES:
Hà Nội / Nội Bài = HAN
TP.HCM / Sài Gòn / Tân Sơn Nhất = SGN
Đà Nẵng = DAD
Nha Trang / Cam Ranh = CXR
Phú Quốc = PQC
Hải Phòng / Cát Bi = HPH
Huế / Phú Bài = HUI
Đà Lạt / Liên Khương = DLI
Cần Thơ = VCA
Quy Nhơn / Phù Cát = UIH
Bangkok / Thái Lan = BKK
Singapore = SIN
Tokyo / Nhật Bản = NRT / HND
Seoul / Incheon / Hàn Quốc = ICN

AIRLINE POLICIES & KNOWLEDGE BASE:
1. Hành lý:
   - Hành lý xách tay: 7kg miễn phí kèm vé.
   - Hạng Economy Standard có sẵn 20kg ký gửi; Hạng Business có 30kg ký gửi; Hạng Saver không có sẵn.
   - Mua thêm hành lý: Các gói 15kg, 20kg, 25kg, 30kg có thể chọn trực tiếp tại Bước chọn dịch vụ (Services) với giá ưu đãi rẻ hơn nhiều so với mua tại sân bay.
2. Suất ăn & Chỗ ngồi:
   - Có thể chọn chỗ ngồi ưa thích (cửa sổ, lối đi, hàng đầu) ngay tại Bước chọn ghế (Seat Selection).
   - Suất ăn nóng, đồ uống và suất ăn chay (Vegetarian) có thể đặt trước tại Bước chọn dịch vụ trước giờ bay ít nhất 24 giờ.
3. Giá vé Trẻ em:
   - Trẻ sơ sinh (dưới 2 tuổi): 10% giá vé người lớn (ngồi chung ghế với người lớn).
   - Trẻ em (từ 2 đến dưới 12 tuổi): 75% giá vé người lớn (có ghế riêng).
4. Thanh toán & PNR:
   - Phương thức thanh toán: Thẻ tín dụng/ghi nợ quốc tế (Visa/Mastercard), Ví MoMo, VNPAY-QR, Chuyển khoản ngân hàng.
   - Mã đặt chỗ (PNR): Gửi tức thì qua Email và tin nhắn sau khi thanh toán thành công trong 1-3 phút.
5. Giấy tờ bay & Hộ chiếu:
   - Bay quốc tế (Thái Lan, Singapore...): Hộ chiếu BẮT BUỘC còn hạn ít nhất 6 tháng tính từ ngày nhập cảnh. (Hộ chiếu còn hạn 5 tháng KHÔNG đủ điều kiện xuất cảnh).
   - Bay nội địa: CCCD/Hộ chiếu/Giấy khai sinh (cho trẻ em) còn hiệu lực.
6. Hóa đơn VAT:
   - Khách hàng nhập thông tin công ty (Tên, MST, Địa chỉ) tại bước Thanh toán. Hóa đơn điện tử gửi qua email trong vòng 24h.
7. Thay đổi & Xử lý sự cố:
   - Đổi ngày bay/giờ bay: Hỗ trợ đổi trước giờ bay tối thiểu 3 tiếng, phí đổi 350.000đ/chặng + chênh lệch giá vé (nếu có).
   - Sai tên đệm: Hỗ trợ chỉnh sửa lỗi chính tả/tên đệm miễn phí hoặc phí nhỏ 100.000đ khi liên hệ CSKH.
   - Hủy vé & Hoàn tiền: Hạng Thương gia (Business) được hoàn tiền (trừ phí theo quy định); Hạng Siêu tiết kiệm không áp dụng hoàn vé.
   - Chuyến bay delay/hủy: Hãng hỗ trợ đổi sang chuyến bay kế tiếp miễn phí hoặc bồi thường/hoàn tiền theo Thông tư của Bộ GTVT.
   - Check-in Online: Mở trước 24 giờ và đóng trước 60 phút so với giờ khởi hành trên website/app SkyLink.

TOOL RULES:
1. Flight searches use `search_flight`.
2. "hôm nay" means {$today}.
3. "ngày mai" means {$tomorrow}.
4. "cuối tuần" means this coming Saturday / Sunday.
5. If the user asks for "1 chuyến duy nhất", "chuyến rẻ nhất", "1 chuyến", or a specific number of flights, ALWAYS set `limit: 1` (or the requested number) in `search_flight`.
6. If the user asks for earliest / latest flight, set `sort_by: "departure_asc"` or `"departure_desc"`.
7. If the user asks for flights before/after a specific time (e.g. "trước 7h", "sáng sớm", "buổi tối"), pass `before_time`, `after_time`, or `time_of_day`.
8. Only flight searches query the flights database. For general policy, baggage, booking questions, use the knowledge base above or `search_airline_knowledge`.
9. If no flights are returned by tool, clearly say no matching flight was found in the database.

FLIGHT RESULTS DISPLAY RULE (VERY IMPORTANT):
- When search_flight returns flights, the UI automatically displays Flight Cards with full details (price, time, origin, destination, available seats).
- You MUST NOT list flight details (prices, times, flight numbers) in your text response — this would duplicate information and confuse the user.
- Instead, write ONLY a short intro sentence, for example:
  "Mình tìm được chuyến bay phù hợp với yêu cầu của bạn bên dưới 👇"
- Keep the intro under 2 sentences. Let the Flight Cards do the rest.
PROMPT;
    }

    public function complete(array $messages, array $tools = []): array
    {
        $payload = [
            'systemInstruction' => ['parts' => [['text' => $this->systemPrompt()]]],
            'contents' => $this->convertMessagesToGemini($messages),
            'generationConfig' => ['temperature' => 0.2],
        ];

        if (!empty($tools)) {
            $geminiTools = $this->convertToolsToGemini($tools);
            if (!empty($geminiTools)) $payload['tools'] = $geminiTools;
        }

        $candidateModels = array_values(array_filter(array_unique([
            'gemini-flash-latest',
            'gemini-1.5-flash-latest',
            'gemini-1.5-flash',
            'gemini-2.0-flash',
        ])));

        $lastError = null;

        foreach ($candidateModels as $model) {
            $url = $this->baseUrl . '/models/' . $model . ':generateContent';

            foreach ($this->apiKeys as $apiKey) {
                $maxAttempts = 3;
                for ($attempt = 1; $attempt <= $maxAttempts; $attempt++) {
                    Log::info('Gemini complete request', ['model' => $model, 'attempt' => $attempt, 'messages' => count($messages)]);

                    $start = microtime(true);

                    try {
                        $response = Http::withOptions([
                            'curl' => [
                                CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4,
                                CURLOPT_SSL_VERIFYPEER => false,
                                CURLOPT_SSL_VERIFYHOST => 0,
                            ],
                        ])
                        ->acceptJson()
                        ->withoutVerifying()
                        ->connectTimeout(15)
                        ->timeout(40)
                        ->withQueryParameters(['key' => $apiKey])
                        ->post($url, $payload);
                    } catch (\Throwable $e) {
                        $lastError = 'cURL Connection Exception: ' . $e->getMessage();
                        Log::warning("Gemini complete model {$model} connection attempt {$attempt} failed: " . $e->getMessage());
                        if ($attempt < $maxAttempts) {
                            sleep(1);
                            continue;
                        }
                        break;
                    }

                    Log::info('Gemini complete response', [
                        'duration' => round(microtime(true) - $start, 2),
                        'status' => $response->status(),
                        'model' => $model,
                    ]);

                    if ($response->successful()) {
                        return $this->parseGeminiResponse($response->json());
                    }

                    $status = $response->status();
                    if ($status === 429 || $status === 503 || empty($lastError) || !in_array($status, [404], true)) {
                        $lastError = $response->body();
                    }

                    // If rate limit (429) or busy (503), retry up to 4 times with progressive backoff to let rate limit window reset
                    if (in_array($status, [503, 429], true)) {
                        Log::warning("Gemini model {$model} key busy (HTTP {$status}), retrying attempt {$attempt}/{$maxAttempts}...");
                        if ($attempt < $maxAttempts) {
                            $sleepSecs = ($status === 429) ? ($attempt * 2) : $attempt;
                            sleep($sleepSecs);
                            continue;
                        }
                        break;
                    }

                    break;
                }
            }
        }

        Log::warning('Gemini All Models and Keys Failed, engaging Fallback Engine', ['error' => $lastError]);
        
        $lastUserIndex = -1;
        for ($i = count($messages) - 1; $i >= 0; $i--) {
            if (($messages[$i]['role'] ?? '') === 'user') {
                $lastUserIndex = $i;
                break;
            }
        }

        $hasToolExecutedInCurrentTurn = false;
        if ($lastUserIndex >= 0) {
            for ($i = $lastUserIndex + 1; $i < count($messages); $i++) {
                if (($messages[$i]['role'] ?? '') === 'tool') {
                    $hasToolExecutedInCurrentTurn = true;
                    break;
                }
            }
        }

        if (!$hasToolExecutedInCurrentTurn) {
            $flightIntent = $this->parseFlightIntent($messages);
            if ($flightIntent) {
                return [
                    'role' => 'assistant',
                    'content' => null,
                    'tool_calls' => [
                        [
                            'id' => 'fallback_flight_search_' . uniqid(),
                            'type' => 'function',
                            'function' => [
                                'name' => 'search_flight',
                                'arguments' => $flightIntent,
                            ],
                        ],
                    ],
                ];
            }
        }

        $lastUserMsg = '';
        foreach ($messages as $msg) {
            if (($msg['role'] ?? '') === 'user') {
                $lastUserMsg = $msg['content'] ?? $lastUserMsg;
            }
        }
        $q = mb_strtolower($lastUserMsg, 'UTF-8');
        $introText = "Mình đã tìm được các chuyến bay phù hợp với yêu cầu của bạn từ cơ sở dữ liệu bên dưới 👇";
        if (str_contains($q, 'rẻ nhất') || str_contains($q, 're nhat') || str_contains($q, 'thấp nhất')) {
            $introText = "Chuyến bay có giá rẻ nhất phù hợp với yêu cầu của bạn là chuyến dưới đây 👇";
        }

        return [
            'role' => 'assistant',
            'content' => $introText,
            'tool_calls' => [],
        ];
    }

    protected function parseFlightIntent(array $messages): ?array
    {
        $lastUserMsg = '';
        $fullHistoryText = '';

        foreach ($messages as $msg) {
            $role = $msg['role'] ?? '';
            $content = $msg['content'] ?? '';
            if (is_string($content)) {
                $fullHistoryText .= ' ' . $content;
            }
            if ($role === 'user') {
                $lastUserMsg = is_string($content) ? $content : $lastUserMsg;
            }
        }

        $q = mb_strtolower($lastUserMsg, 'UTF-8');

        // Check if query is about flights
        $isFlightQuery = str_contains($q, 'chuyến') || str_contains($q, 'vé') || str_contains($q, 'bay') || str_contains($q, 'tìm') || str_contains($q, 'rẻ nhất') || str_contains($q, 're nhat') || str_contains($q, 'sớm nhất') || str_contains($q, 'giá');
        if (!$isFlightQuery) {
            return null;
        }

        $airports = [
            'hà nội' => 'HAN', 'ha noi' => 'HAN', 'hn' => 'HAN', 'nội bài' => 'HAN', 'han' => 'HAN',
            'tp hcm' => 'SGN', 'tphcm' => 'SGN', 'tp.hcm' => 'SGN', 'hồ chí minh' => 'SGN', 'ho chi minh' => 'SGN', 'sài gòn' => 'SGN', 'sai gon' => 'SGN', 'sg' => 'SGN', 'sgn' => 'SGN',
            'đà nẵng' => 'DAD', 'da nang' => 'DAD', 'dad' => 'DAD',
            'phú quốc' => 'PQC', 'phu quoc' => 'PQC', 'pqc' => 'PQC',
            'nha trang' => 'CXR', 'cam ranh' => 'CXR', 'cxr' => 'CXR',
            'hải phòng' => 'HPH', 'hai phong' => 'HPH', 'hph' => 'HPH',
            'đà lạt' => 'DLI', 'da lat' => 'DLI', 'dli' => 'DLI',
        ];

        $foundOrigin = null;
        $foundDestination = null;

        foreach ($airports as $name => $code) {
            if (str_contains($q, $name)) {
                if (!$foundOrigin) {
                    $foundOrigin = $code;
                } else if ($code !== $foundOrigin && !$foundDestination) {
                    $foundDestination = $code;
                }
            }
        }

        if (!$foundOrigin || !$foundDestination) {
            $historyQ = mb_strtolower($fullHistoryText, 'UTF-8');
            foreach ($airports as $name => $code) {
                if (str_contains($historyQ, $name)) {
                    if (!$foundOrigin) {
                        $foundOrigin = $code;
                    } else if ($code !== $foundOrigin && !$foundDestination) {
                        $foundDestination = $code;
                    }
                }
            }
        }

        $origin = $foundOrigin ?: 'HAN';
        $destination = $foundDestination ?: ($origin === 'HAN' ? 'SGN' : 'HAN');

        $args = [
            'origin' => $origin,
            'destination' => $destination,
            'sort_by' => 'price_asc',
        ];

        if (str_contains($q, 'rẻ nhất') || str_contains($q, 're nhat') || str_contains($q, '1 chuyến') || str_contains($q, 'thấp nhất') || str_contains($q, 'giá rẻ')) {
            $args['limit'] = 1;
            $args['sort_by'] = 'price_asc';
        }

        if (str_contains($q, 'sớm nhất') || str_contains($q, 'som nhat')) {
            $args['limit'] = 1;
            $args['sort_by'] = 'departure_asc';
        }

        return $args;
    }

    public function stream(array $messages): \Generator
    {
        $payload = [
            'systemInstruction' => ['parts' => [['text' => $this->systemPrompt()]]],
            'contents' => $this->convertMessagesToGemini($messages),
            'generationConfig' => ['temperature' => 0.2],
        ];

        $candidateModels = array_values(array_filter(array_unique([
            'gemini-flash-latest',
            'gemini-1.5-flash-latest',
            'gemini-1.5-flash',
            'gemini-2.0-flash',
        ])));

        $response = null;
        $lastError = null;

        foreach ($candidateModels as $model) {
            $url = $this->baseUrl . '/models/' . $model . ':streamGenerateContent';

            foreach ($this->apiKeys as $apiKey) {
                $maxAttempts = 4;
                for ($attempt = 1; $attempt <= $maxAttempts; $attempt++) {
                    try {
                        $res = Http::withOptions([
                            'stream' => true,
                            'curl' => [
                                CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4,
                                CURLOPT_SSL_VERIFYPEER => false,
                                CURLOPT_SSL_VERIFYHOST => 0,
                            ],
                        ])
                        ->withoutVerifying()
                        ->acceptJson()
                        ->connectTimeout(15)
                        ->timeout(45)
                        ->withQueryParameters(['key' => $apiKey, 'alt' => 'sse'])
                        ->post($url, $payload);
                    } catch (\Throwable $e) {
                        $lastError = 'cURL Connection Exception: ' . $e->getMessage();
                        Log::warning("Gemini stream model {$model} connection attempt {$attempt} failed: " . $e->getMessage());
                        if ($attempt < $maxAttempts) {
                            sleep(1);
                            continue;
                        }
                        break;
                    }

                    if ($res->successful()) {
                        $response = $res;
                        break 2;
                    }

                    $status = $res->status();
                    if ($status === 429 || $status === 503 || empty($lastError) || !in_array($status, [404], true)) {
                        $lastError = $res->body();
                    }

                    if (in_array($status, [503, 429], true)) {
                        Log::warning("Gemini stream model {$model} key busy (HTTP {$status}), retrying attempt {$attempt}/{$maxAttempts}...");
                        if ($attempt < $maxAttempts) {
                            $sleepSecs = ($status === 429) ? ($attempt * 2) : $attempt;
                            sleep($sleepSecs);
                            continue;
                        }
                        break;
                    }

                    break;
                }
            }
        }

        if (!$response) {
            Log::warning('Gemini Stream Failed on all keys/models, engaging Fallback Streaming Engine', ['error' => $lastError]);
            $fallbackText = $this->generateFallbackResponse($messages, $lastError);
            $words = preg_split('/(\s+)/u', $fallbackText, -1, PREG_SPLIT_DELIM_CAPTURE);
            foreach ($words as $word) {
                yield $word;
                usleep(25000); // 25ms streaming simulation
            }
            return;
        }

        $body = $response->toPsrResponse()->getBody();
        $buffer = '';

        while (!$body->eof()) {
            $chunk = $body->read(8192);

            if ($chunk === '') {
                usleep(10000);
                continue;
            }

            $buffer .= $chunk;

            while (($position = strpos($buffer, "\n")) !== false) {
                $line = trim(substr($buffer, 0, $position));
                $buffer = substr($buffer, $position + 1);

                if ($line === '') continue;
                if (str_starts_with($line, 'data:')) $line = trim(substr($line, 5));

                $json = json_decode($line, true);
                if (!is_array($json)) continue;

                $content = $this->extractText($json);

                if ($content !== '') {
                    yield ['content' => $content, 'done' => false];
                }
            }
        }

        yield ['content' => '', 'done' => true];
    }

    private function convertMessagesToGemini(array $messages): array
    {
        $contents = [];

        foreach ($messages as $message) {
            $role = $message['role'] ?? 'user';

            if ($role === 'system') continue;

            if ($role === 'user') {
                $parts = [];
                $text = (string) ($message['content'] ?? '');
                if ($text !== '') {
                    $parts[] = ['text' => $text];
                }

                if (!empty($message['images']) && is_array($message['images'])) {
                    foreach ($message['images'] as $img) {
                        if (is_string($img) && str_starts_with($img, 'data:')) {
                            if (preg_match('/^data:([^;]+);base64,(.+)$/s', $img, $matches)) {
                                $parts[] = [
                                    'inlineData' => [
                                        'mimeType' => $matches[1],
                                        'data' => trim($matches[2]),
                                    ],
                                ];
                            }
                        } elseif (is_array($img) && !empty($img['data'])) {
                            $rawMime = $img['mime_type'] ?? $img['mimeType'] ?? 'image/jpeg';
                            $rawBase64 = preg_replace('/^data:[^;]+;base64,/s', '', (string)$img['data']);
                            $parts[] = [
                                'inlineData' => [
                                    'mimeType' => $rawMime,
                                    'data' => trim($rawBase64),
                                ],
                            ];
                        }
                    }
                }

                if (empty($parts)) {
                    $parts[] = ['text' => ' '];
                }

                $contents[] = [
                    'role' => 'user',
                    'parts' => $parts,
                ];
                continue;
            }

            if ($role === 'assistant') {
                $parts = [];

                if (!empty($message['content'])) {
                    $parts[] = ['text' => (string) $message['content']];
                }

                foreach ($message['tool_calls'] ?? [] as $toolCall) {
                    $name = $toolCall['function']['name'] ?? null;
                    $arguments = $toolCall['function']['arguments'] ?? [];

                    if (is_string($arguments)) {
                        $arguments = json_decode($arguments, true) ?? [];
                    }

                    if ($name) {
                        $part = [
                            'functionCall' => [
                                'name' => $name,
                                'args' => $arguments,
                            ],
                        ];

                        if (!empty($toolCall['thought_signature'])) {
                            $part['thoughtSignature'] = $toolCall['thought_signature'];
                        }

                        $parts[] = $part;
                    }
                }

                if (!empty($parts)) {
                    $contents[] = ['role' => 'model', 'parts' => $parts];
                }

                continue;
            }

            if ($role === 'tool') {
                $result = $message['content'] ?? '';

                if (is_string($result)) {
                    $decoded = json_decode($result, true);
                    if (json_last_error() === JSON_ERROR_NONE) $result = $decoded;
                }

                $contents[] = [
                    'role' => 'user',
                    'parts' => [[
                        'functionResponse' => [
                            'name' => $message['tool_name'] ?? 'unknown',
                            'response' => is_array($result) ? $result : ['result' => $result],
                        ],
                    ]],
                ];
            }
        }

        return $contents;
    }

    private function convertToolsToGemini(array $tools): array
    {
        $functionDeclarations = [];

        foreach ($tools as $tool) {
            if (($tool['type'] ?? '') !== 'function' || !isset($tool['function'])) continue;

            $function = $tool['function'];
            $parameters = $function['parameters'] ?? ['type' => 'object', 'properties' => new \stdClass()];

            $this->cleanGeminiSchema($parameters);

            $functionDeclarations[] = [
                'name' => $function['name'] ?? '',
                'description' => $function['description'] ?? '',
                'parameters' => $parameters,
            ];
        }

        return empty($functionDeclarations) ? [] : [['function_declarations' => $functionDeclarations]];
    }

    private function cleanGeminiSchema(array &$schema): void
    {
        unset($schema['additionalProperties'], $schema['nullable']);

        if (isset($schema['properties']) && is_array($schema['properties'])) {
            foreach ($schema['properties'] as &$property) {
                if (is_array($property)) $this->cleanGeminiSchema($property);
            }
            unset($property);
        }

        if (isset($schema['items']) && is_array($schema['items'])) {
            $this->cleanGeminiSchema($schema['items']);
        }
    }

    private function parseGeminiResponse(array $json): array
    {
        $candidate = $json['candidates'][0] ?? null;

        if (!$candidate) {
            throw new RuntimeException('Gemini returned no candidate.');
        }

        $parts = $candidate['content']['parts'] ?? [];
        $text = '';
        $toolCalls = [];

        foreach ($parts as $part) {
            if (isset($part['text'])) $text .= $part['text'];

            if (isset($part['functionCall'])) {
                $call = $part['functionCall'];

                $toolCalls[] = [
                    'id' => 'gemini_' . uniqid(),
                    'type' => 'function',
                    'thought_signature' => $part['thoughtSignature'] ?? null,
                    'function' => [
                        'name' => $call['name'] ?? '',
                        'arguments' => $call['args'] ?? [],
                    ],
                ];
            }
        }

        return [
            'role' => 'assistant',
            'content' => $text,
            'tool_calls' => $toolCalls,
        ];
    }

    private function extractText(array $json): string
    {
        $parts = $json['candidates'][0]['content']['parts'] ?? [];
        $text = '';

        foreach ($parts as $part) {
            if (isset($part['text'])) $text .= $part['text'];
        }

        return $text;
    }

    protected function formatErrorMessage(?string $rawError): string
    {
        if (empty($rawError)) {
            return 'Hệ thống AI tạm thời không phản hồi. Bạn vui lòng thử lại sau nhé.';
        }

        if (str_contains($rawError, '503') || str_contains($rawError, 'high demand') || str_contains($rawError, 'UNAVAILABLE')) {
            return 'Máy chủ Google AI hiện tại đang quá tải tạm thời (High Demand 503). Bạn bấm nút thử lại sau vài giây nhé! ✈️';
        }

        if (str_contains($rawError, '429') || str_contains($rawError, 'RESOURCE_EXHAUSTED') || str_contains($rawError, 'Quota exceeded')) {
            return 'Hệ thống Trợ lý SkyAI đang nhận nhiều truy vấn cùng lúc (chạm giới hạn lượt gọi Free Tier từ Google API). Bạn vui lòng đợi 15-20 giây rồi gửi lại nhé! ✈️';
        }

        if (str_contains($rawError, '404') || str_contains($rawError, 'NOT_FOUND')) {
            return 'Mô hình AI hiện tại không khả dụng trên API key này. Bạn kiểm tra lại key Google Gemini nhé.';
        }

        return 'Lỗi trợ lý AI: ' . $rawError;
    }

    protected function generateFallbackResponse(array $messages, ?string $lastError = null): string
    {
        $lastUserMsg = '';
        for ($i = count($messages) - 1; $i >= 0; $i--) {
            if (($messages[$i]['role'] ?? '') === 'user') {
                $lastUserMsg = $messages[$i]['content'] ?? '';
                break;
            }
        }

        $query = mb_strtolower($lastUserMsg);

        if (str_contains($query, 'chuyến bay') || str_contains($query, 'vé') || str_contains($query, 'bay') || str_contains($query, 'giá')) {
            return "✈️ **Trợ lý SkyAI (Hãng hàng không SkyLink Airline):**\n\nHệ thống hiện đang lưu trữ đầy đủ lịch trình các chuyến bay nội địa và quốc tế. Bạn có thể sử dụng thanh tìm kiếm trực tiếp trên trang chủ để tra cứu thông tin giờ bay và đặt vé dễ dàng:\n- **Điểm đi & điểm đến:** Hà Nội (HAN), TP.HCM (SGN), Đà Nẵng (DAD), Phú Quốc (PQC)...\n- **Hạng vé:** Phổ thông (Economy), Thương gia (Business).\n\nChúc bạn chọn được hành trình ưng ý nhất cùng SkyLink Airline!";
        }

        if (str_contains($query, 'hành lý') || str_contains($query, 'ký gửi')) {
            return "🧳 **Quy định Hành lý SkyLink Airline:**\n\n1. **Hành lý xách tay:** Tối đa **7kg** (miễn phí theo mỗi vé).\n2. **Hành lý ký gửi:** Bạn có thể linh hoạt chọn các gói 15kg, 20kg, 25kg hoặc 30kg trong quá trình đặt vé trực tuyến hoặc quản lý mã đặt chỗ.\n\nNếu có thắc mắc thêm, nhân viên hỗ trợ tại sân bay sẽ hướng dẫn chi tiết cho bạn nhé!";
        }

        if (str_contains($query, 'checkin') || str_contains($query, 'check-in') || str_contains($query, 'làm thủ tục')) {
            return "📱 **Check-in Online (Thủ tục trực tuyến):**\n\n- Bạn có thể làm thủ tục trực tuyến từ **24 giờ đến 60 phút** trước giờ khởi hành.\n- Truy cập mục **'Check-in Online'** trên thanh Menu chính, nhập Mã đặt chỗ (PNR) và Họ tên hành khách để chọn chỗ ngồi và nhận Thẻ lên máy bay (Boarding Pass) điện tử nhé!";
        }

        return "✈️ **Trợ lý Trực tuyến SkyAI:**\n\nXin chào! Trợ lý SkyAI luôn sẵn sàng đồng hành cùng bạn. Hệ thống SkyLink Airline đang hỗ trợ các dịch vụ:\n- Tìm kiếm & Đặt vé máy bay trực tuyến\n- Quy định hành lý & Đổi/Hủy vé\n- Check-in Online & Chọn chỗ ngồi\n\nBạn cần hỗ trợ thêm thông tin nào, hãy đặt câu hỏi cho mình nhé!";
    }
}