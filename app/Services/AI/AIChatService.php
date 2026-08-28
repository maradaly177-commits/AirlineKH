<?php

namespace App\Services\AI;

use App\Services\AI\Tools\SearchFlightTool;
use App\Services\AI\Tools\GetFlightDetailsTool;
use App\Services\AI\Tools\CheckSeatAvailabilityTool;
use App\Services\AI\Tools\GetAirportInfoTool;
use App\Services\AI\Tools\GetBookingInfoTool;
use App\Services\AI\Tools\SearchKnowledgeTool;
use App\Models\AIConversation;
use App\Models\AIMessage;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable;

class AIChatService
{
    public function __construct(
        protected AIService $aiService,
        protected SearchFlightTool $searchFlightTool,
        protected GetFlightDetailsTool $getFlightDetailsTool,
        protected CheckSeatAvailabilityTool $checkSeatAvailabilityTool,
        protected GetAirportInfoTool $getAirportInfoTool,
        protected GetBookingInfoTool $getBookingInfoTool,
        protected SearchKnowledgeTool $searchKnowledgeTool,
    ) {}

    public function chat(string $message, ?Model $user = null, ?string $conversationId = null, array $images = []): array
    {
        $conversation = $this->conversation($conversationId, $user);
        $this->saveUserMessage($conversation, $message);

        $history = $this->history($conversation);
        if (!empty($images)) {
            // Attach images to the latest user message in $history
            $lastIndex = count($history) - 1;
            if ($lastIndex >= 0 && ($history[$lastIndex]['role'] ?? '') === 'user') {
                $history[$lastIndex]['images'] = $images;
            }
        }

        $messages = [
            ['role' => 'system', 'content' => $this->aiService->systemPrompt()],
            ...$history,
        ];

        $tools = $this->shouldUseTools($message) ? $this->getTools() : [];
        $flights = [];

        for ($attempt = 0; $attempt < 3; $attempt++) {
            $response = $this->aiService->complete($messages, $tools);
            $toolCalls = $response['tool_calls'] ?? [];

            if (!$toolCalls) {
                $content = trim((string) ($response['content'] ?? ''));
                $conversation->messages()->create(['role' => 'assistant', 'content' => $content]);

                return [
                    'type' => 'message',
                    'message' => $content,
                    'flights' => $flights,
                    'conversation_id' => $conversation->uuid,
                    'quick_replies' => [],
                ];
            }

            $conversation->messages()->create([
                'role' => 'assistant',
                'content' => $response['content'] ?? null,
                'tool_calls' => $toolCalls,
            ]);

            $messages[] = $response;

            foreach ($toolCalls as $toolCall) {
                $toolName = $toolCall['function']['name'] ?? '';
                $arguments = $this->normalizeArguments($toolCall['function']['arguments'] ?? []);

                if (!$toolName) continue;

                $result = $this->executeToolCall($toolName, $arguments, $user);

                if (!empty($result['flights'])) {
                    $flights = array_merge($flights, $result['flights']);
                }

                $this->saveToolMessage($conversation, $toolCall, $toolName, $arguments, $result);

                $messages[] = [
                    'role' => 'tool',
                    'tool_call_id' => $toolCall['id'] ?? null,
                    'tool_name' => $toolName,
                    'content' => json_encode($result, JSON_UNESCAPED_UNICODE),
                ];
            }
        }

        throw new \RuntimeException('AI tool-call limit exceeded.');
    }

    public function streamChat(string $message, ?Model $user = null, ?string $conversationId = null, array $images = []): \Generator
    {
        $conversation = $this->conversation($conversationId, $user);
        $this->saveUserMessage($conversation, $message);

        yield ['type' => 'conversation', 'conversation_id' => $conversation->uuid];

        $history = $this->history($conversation);
        if (!empty($images)) {
            // Attach images to the latest user message in $history
            $lastIndex = count($history) - 1;
            if ($lastIndex >= 0 && ($history[$lastIndex]['role'] ?? '') === 'user') {
                $history[$lastIndex]['images'] = $images;
            }
        }

        $messages = [
            ['role' => 'system', 'content' => $this->aiService->systemPrompt()],
            ...$history,
        ];

        yield ['type' => 'status', 'status' => 'thinking', 'message' => 'SkyAI đang kiểm tra thông tin...'];

        $response = $this->aiService->complete($messages, $this->getTools());
        $toolCalls = $response['tool_calls'] ?? [];

        if (!$toolCalls) {
            $content = trim((string) ($response['content'] ?? ''));
            if ($content !== '') {
                $conversation->messages()->create([
                    'role' => 'assistant',
                    'content' => $content,
                ]);

                yield ['type' => 'chunk', 'content' => $content];

                yield [
                    'type' => 'done',
                    'conversation_id' => $conversation->uuid,
                    'message' => $content,
                    'flights' => [],
                    'quick_replies' => [],
                ];
                return;
            }

            yield from $this->streamFinalAnswer($conversation, $messages);
            return;
        }

        $conversation->messages()->create([
            'role' => 'assistant',
            'content' => $response['content'] ?? null,
            'tool_calls' => $toolCalls,
        ]);

        $messages[] = $response;
        $flights = [];

        foreach ($toolCalls as $toolCall) {
            $toolName = $toolCall['function']['name'] ?? '';
            $arguments = $this->normalizeArguments($toolCall['function']['arguments'] ?? []);

            yield [
                'type' => 'tool',
                'status' => 'executing',
                'tool' => $toolName,
                'message' => $this->toolMessage($toolName),
            ];

            $result = $this->executeToolCall($toolName, $arguments, $user);

            if (!empty($result['flights'])) {
                $flights = array_merge($flights, $result['flights']);
            }

            $this->saveToolMessage($conversation, $toolCall, $toolName, $arguments, $result);

            $messages[] = [
                'role' => 'tool',
                'tool_call_id' => $toolCall['id'] ?? null,
                'tool_name' => $toolName,
                'content' => json_encode($result, JSON_UNESCAPED_UNICODE),
            ];
        }

        // Nếu tìm thấy chuyến bay, trả về ngay lập tức
        if (!empty($flights)) {
            $count = count($flights);
            $content = $this->getLocalizedFlightIntro($message, $count);

            $conversation->messages()->create([
                'role' => 'assistant',
                'content' => $content,
            ]);

            yield ['type' => 'chunk', 'content' => $content];

            yield [
                'type' => 'done',
                'conversation_id' => $conversation->uuid,
                'message' => $content,
                'flights' => $flights,
                'quick_replies' => [],
            ];
            return;
        }

        // Nếu tool tìm chuyến bay trả về không có chuyến
        foreach ($toolCalls as $tc) {
            if (($tc['function']['name'] ?? '') === 'search_flight') {
                $content = $this->getLocalizedNoFlights($message);
                $conversation->messages()->create([
                    'role' => 'assistant',
                    'content' => $content,
                ]);

                yield ['type' => 'chunk', 'content' => $content];

                yield [
                    'type' => 'done',
                    'conversation_id' => $conversation->uuid,
                    'message' => $content,
                    'flights' => [],
                    'quick_replies' => [],
                ];
                return;
            }
        }

        // Đối với các tool khác (chính sách, tra cứu booking), tổng hợp câu trả lời từ AI
        yield ['type' => 'status', 'status' => 'writing', 'message' => 'Đang tổng hợp câu trả lời...'];
        
        $finalResponse = $this->aiService->complete($messages);
        $content = trim((string) ($finalResponse['content'] ?? ''));

        $conversation->messages()->create([
            'role' => 'assistant',
            'content' => $content,
        ]);

        if ($content !== '') {
            yield ['type' => 'chunk', 'content' => $content];
        }

        yield [
            'type' => 'done',
            'conversation_id' => $conversation->uuid,
            'message' => $content,
            'flights' => [],
            'quick_replies' => [],
        ];
    }

    private function streamFinalAnswer(AIConversation $conversation, array $messages): \Generator
    {
        $content = '';

        foreach ($this->aiService->stream($messages) as $chunk) {
            if (($chunk['done'] ?? false) === true) break;

            $text = $chunk['content'] ?? '';
            if ($text === '') continue;

            $content .= $text;
            yield ['type' => 'chunk', 'content' => $text];
        }

        $conversation->messages()->create([
            'role' => 'assistant',
            'content' => $content,
        ]);

        yield [
            'type' => 'done',
            'conversation_id' => $conversation->uuid,
            'message' => $content,
            'flights' => [],
            'quick_replies' => [],
        ];
    }

    private function saveUserMessage(AIConversation $conversation, string $message): void
    {
        DB::transaction(function () use ($conversation, $message) {
            if (!$conversation->title) {
                $conversation->update(['title' => Str::limit($message, 160)]);
            }

            $conversation->messages()->create([
                'role' => 'user',
                'content' => $message,
            ]);
        });
    }

    private function saveToolMessage(AIConversation $conversation, array $toolCall, string $toolName, array $arguments, array $result): void
    {
        $conversation->messages()->create([
            'role' => 'tool',
            'content' => json_encode($result, JSON_UNESCAPED_UNICODE),
            'tool_call_id' => $toolCall['id'] ?? null,
            'tool_name' => $toolName,
            'tool_arguments' => $arguments,
            'tool_result' => $result,
        ]);
    }

    private function shouldUseTools(string $message): bool
    {
        $message = mb_strtolower(trim($message));

        foreach ([
            'tìm chuyến bay', 'tìm vé', 'chuyến bay', 'vé máy bay', 'bay từ', 'bay đi',
            'đi từ', 'đến', 'đặt vé', 'booking', 'mã đặt chỗ', 'đặt chỗ', 'vé của tôi',
            'ghế', 'ghế trống', 'chỗ ngồi', 'hành lý', 'hoàn vé', 'hủy vé', 'đổi vé',
            'chính sách', 'quy định', 'dịch vụ', 'sân bay', 'nội bài', 'tân sơn nhất',
            'đà nẵng', 'cam ranh', 'phú quốc',
        ] as $keyword) {
            if (str_contains($message, $keyword)) return true;
        }

        return false;
    }

    private function toolMessage(string $toolName): string
    {
        return match ($toolName) {
            'search_flight' => 'Đang tìm chuyến bay phù hợp...',
            'get_flight_details' => 'Đang lấy thông tin chuyến bay...',
            'check_seat_availability' => 'Đang kiểm tra ghế trống...',
            'get_airport_info' => 'Đang kiểm tra thông tin sân bay...',
            'get_booking_info' => 'Đang kiểm tra booking của bạn...',
            'search_airline_knowledge' => 'Đang tìm trong kho kiến thức SkyLink...',
            default => 'Đang kiểm tra thông tin...',
        };
    }

    public function getTools(): array
    {
        return [
            $this->searchFlightTool->definition(),
            $this->getFlightDetailsTool->definition(),
            $this->checkSeatAvailabilityTool->definition(),
            $this->getAirportInfoTool->definition(),
            $this->getBookingInfoTool->definition(),
            $this->searchKnowledgeTool->definition(),
        ];
    }

    private function executeToolCall(string $toolName, array $arguments, ?Model $user): array
    {
        try {
            return match ($toolName) {
                'search_flight' => $this->searchFlightTool->execute($arguments),
                'get_flight_details' => $this->getFlightDetailsTool->execute($arguments),
                'check_seat_availability' => $this->checkSeatAvailabilityTool->execute($arguments),
                'get_airport_info' => $this->getAirportInfoTool->execute($arguments),
                'get_booking_info' => $this->getBookingInfoTool->execute($arguments, $user),
                'search_airline_knowledge' => $this->searchKnowledgeTool->execute($arguments),
                default => ['type' => 'error', 'message' => 'Unknown AI tool.'],
            };
        } catch (Throwable $e) {
            Log::error('AI Tool Execution Error', [
                'tool' => $toolName,
                'arguments' => $arguments,
                'error' => $e->getMessage(),
            ]);

            return [
                'type' => 'error',
                'tool' => $toolName,
                'message' => 'Không thể lấy dữ liệu từ hệ thống lúc này.',
            ];
        }
    }

    private function normalizeArguments(mixed $arguments): array
    {
        if (is_array($arguments)) return $arguments;

        if (is_string($arguments) && $arguments !== '') {
            $decoded = json_decode($arguments, true);
            if (is_array($decoded)) return $decoded;
        }

        return [];
    }

    private function conversation(?string $conversationId, ?Model $user): AIConversation
    {
        if ($conversationId) {
            $query = AIConversation::where('uuid', $conversationId);

            if ($user) {
                $query->where(fn($q) => $q->where('user_id', $user->getKey())->orWhereNull('user_id'));
            } else {
                $query->whereNull('user_id');
            }

            return $query->firstOrFail();
        }

        return AIConversation::create([
            'uuid' => (string) Str::uuid(),
            'user_id' => $user?->getKey(),
        ]);
    }

    private function history(AIConversation $conversation): array
    {
        return $conversation->messages()->oldest('id')->get()->map(function (AIMessage $message) {
            if ($message->role === 'assistant' && $message->tool_calls) {
                $toolCalls = $message->tool_calls;

                if (is_string($toolCalls)) {
                    $toolCalls = json_decode($toolCalls, true) ?? [];
                }

                return [
                    'role' => 'assistant',
                    'content' => $message->content,
                    'tool_calls' => is_array($toolCalls) ? $toolCalls : [],
                ];
            }

            if ($message->role === 'tool') {
                return [
                    'role' => 'tool',
                    'content' => $message->content,
                    'tool_call_id' => $message->tool_call_id,
                    'tool_name' => $message->tool_name,
                ];
            }

            return array_filter([
                'role' => $message->role,
                'content' => $message->content,
            ], fn($value) => $value !== null);
        })->values()->all();
    }

    private function getLocalizedFlightIntro(string $userMessage, int $count): string
    {
        $lang = $this->detectLanguage($userMessage);
        return match ($lang) {
            'en' => $count === 1
                ? "Here is the best matching flight for your request 👇"
                : "Here are {$count} matching flights for your request 👇",
            'km' => "នេះជាជើងហោះហើរដែលស័ក្តិសមបំផុតសម្រាប់អ្នក 👇",
            'zh' => $count === 1
                ? "以下是为您找到的最合适航班 👇"
                : "以下是为您找到的 {$count} 个航班 👇",
            'ja' => "ご希望に合ったフライトが見つかりました 👇",
            'ko' => "요청하신 일정에 맞는 항공편입니다 👇",
            'fr' => "Voici le vol le plus adapté à votre demande 👇",
            default => $count === 1
                ? "Dưới đây là chuyến bay phù hợp nhất với yêu cầu của bạn 👇"
                : "Mình tìm được {$count} chuyến bay phù hợp theo yêu cầu của bạn bên dưới 👇",
        };
    }

    private function getLocalizedNoFlights(string $userMessage): string
    {
        $lang = $this->detectLanguage($userMessage);
        return match ($lang) {
            'en' => "Sorry, we could not find any matching flights in the database for your request. Would you like me to check another date?",
            'km' => "សូមអភ័យទោស មិនមានជើងហោះហើរដែលត្រូវគ្នានៅក្នុងប្រព័ន្ធទេ។ តើអ្នកចង់ពិនិត្យមើលកាលបរិច្ឆេទផ្សេងទៀតទេ?",
            'zh' => "抱歉，数据库中暂未找到符合您要求的航班。您想查询其他日期吗？",
            'ja' => "申し訳ございません。該当するフライトが見つかりませんでした。他の日付でお探ししますか？",
            'ko' => "죄송합니다. 조건에 맞는 항공편을 찾을 수 없습니다. 다른 날짜로 검색해 드릴까요?",
            'fr' => "Désolé, aucun vol correspondant n'a été trouvé pour votre demande. Souhaitez-vous vérifier une autre date ?",
            default => "Rất tiếc, hiện tại không tìm thấy chuyến bay phù hợp trong cơ sở dữ liệu cho yêu cầu của bạn. Bạn có muốn mình kiểm tra vào một ngày khác không?",
        };
    }

    private function detectLanguage(string $text): string
    {
        // Khmer unicode range
        if (preg_match('/[\x{1780}-\x{17FF}]/u', $text)) return 'km';
        // Chinese
        if (preg_match('/[\x{4E00}-\x{9FFF}]/u', $text)) return 'zh';
        // Japanese (Hiragana/Katakana)
        if (preg_match('/[\x{3040}-\x{30FF}]/u', $text)) return 'ja';
        // Korean (Hangul)
        if (preg_match('/[\x{AC00}-\x{D7AF}]/u', $text)) return 'ko';

        // Vietnamese specific diacritics
        if (preg_match('/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/ui', $text)) {
            return 'vi';
        }

        // Check common English keywords
        $lower = strtolower($text);
        foreach (['flight', 'fly', 'book', 'ticket', 'tomorrow', 'today', 'from', 'to', 'hanoi', 'saigon', 'find', 'search', 'cheap', 'price', 'passport', 'baggage', 'seat', 'when', 'how', 'can i', 'hello', 'hi', 'where'] as $enWord) {
            if (str_contains($lower, $enWord)) return 'en';
        }

        return 'vi';
    }
}