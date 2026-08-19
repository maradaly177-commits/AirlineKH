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
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
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
    ) {
    }

    public function chat(
        string $message,
        ?Model $user = null,
        ?string $conversationId = null
    ): array {
        try {
            abort_unless($user !== null, 401, 'Authentication is required.');

            $conversation = $this->conversation($conversationId, $user);

            DB::transaction(function () use ($conversation, $message): void {
                if (!$conversation->title) {
                    $conversation->update(['title' => Str::limit($message, 160)]);
                }

                $conversation->messages()->create([
                    'role' => 'user',
                    'content' => $message,
                ]);
            });

            $messages = [
                ['role' => 'system', 'content' => $this->aiService->systemPrompt()],
                ...$this->history($conversation),
            ];

            for ($attempt = 0; $attempt < 4; $attempt++) {
                $response = $this->aiService->complete($messages, $this->getTools());
                $toolCalls = $response['tool_calls'] ?? [];

                if (!$toolCalls) {
                    $content = (string) ($response['content'] ?? '');
                    $conversation->messages()->create([
                        'role' => 'assistant',
                        'content' => $content,
                    ]);

                    return [
                        'type' => 'message',
                        'message' => $content,
                        'conversation_id' => $conversation->uuid,
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
                    $rawArguments = $toolCall['function']['arguments'] ?? [];
                    $arguments = is_string($rawArguments)
                        ? (json_decode($rawArguments, true) ?? [])
                        : $rawArguments;
                    $result = $this->executeToolCall($toolName, $arguments, $user);

                    $conversation->messages()->create([
                        'role' => 'tool',
                        'content' => json_encode($result, JSON_UNESCAPED_UNICODE),
                        'tool_call_id' => $toolCall['id'] ?? null,
                        'tool_name' => $toolName,
                        'tool_arguments' => $arguments,
                        'tool_result' => $result,
                    ]);
                    $messages[] = [
                        'role' => 'tool',
                        'tool_call_id' => $toolCall['id'] ?? null,
                        'content' => json_encode($result, JSON_UNESCAPED_UNICODE),
                    ];
                }
            }

            throw new \RuntimeException('AI tool-call limit exceeded.');

        } catch (Throwable $e) {

            Log::error('AIChatService Error', [
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    private function getTools(): array
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

    private function executeToolCall(
        string $toolName,
        array $arguments,
        ?Model $user
    ): array {
        return match ($toolName) {

            'search_flight' =>
                $this->searchFlightTool->execute($arguments),

            'get_flight_details' =>
                $this->getFlightDetailsTool->execute($arguments),

            'check_seat_availability' =>
                $this->checkSeatAvailabilityTool->execute($arguments),

            'get_airport_info' =>
                $this->getAirportInfoTool->execute($arguments),

            'get_booking_info' =>
                $this->getBookingInfoTool->execute(
                    $arguments,
                    $user
                ),

            'search_airline_knowledge' =>
                $this->searchKnowledgeTool->execute($arguments),

            default => [
                'type' => 'error',
                'message' => 'Unknown AI tool.',
            ],
        };
    }

    private function conversation(?string $conversationId, Model $user): AIConversation
    {
        if ($conversationId) {
            return AIConversation::where('uuid', $conversationId)
                ->where('user_id', $user->getKey())
                ->firstOrFail();
        }

        return AIConversation::create([
            'uuid' => (string) Str::uuid(),
            'user_id' => $user->getKey(),
        ]);
    }

    private function history(AIConversation $conversation): array
    {
        return $conversation->messages()->oldest('id')->get()->map(function (AIMessage $message): array {
            if ($message->role === 'assistant' && $message->tool_calls) {
                return [
                    'role' => 'assistant',
                    'content' => $message->content,
                    'tool_calls' => $message->tool_calls instanceof \ArrayObject
                        ? $message->tool_calls->getArrayCopy()
                        : $message->tool_calls,
                ];
            }

            return array_filter([
                'role' => $message->role,
                'content' => $message->content,
                'tool_call_id' => $message->tool_call_id,
            ], static fn ($value) => $value !== null);
        })->all();
    }
}