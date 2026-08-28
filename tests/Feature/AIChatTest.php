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

class AIChatService
{
    public function __construct(
        protected AIService $aiService,

        protected SearchFlightTool
            $searchFlightTool,

        protected GetFlightDetailsTool
            $getFlightDetailsTool,

        protected CheckSeatAvailabilityTool
            $checkSeatAvailabilityTool,

        protected GetAirportInfoTool
            $getAirportInfoTool,

        protected GetBookingInfoTool
            $getBookingInfoTool,

        protected SearchKnowledgeTool
            $searchKnowledgeTool,
    ) {
    }


    /*
    |--------------------------------------------------------------------------
    | NORMAL CHAT
    |--------------------------------------------------------------------------
    */

    public function chat(
        string $message,
        ?Model $user = null,
        ?string $conversationId = null
    ): array {

        $conversation =
            $this->conversation(
                $conversationId,
                $user
            );


        $this->saveUserMessage(
            $conversation,
            $message
        );


        $messages = [
            [
                'role' =>
                    'system',

                'content' =>
                    $this->aiService
                        ->systemPrompt(),
            ],

            ...
            $this->history(
                $conversation
            ),
        ];


        $tools =
            $this->shouldUseTools(
                $message
            )
                ? $this->getTools()
                : [];


        $collectedFlights = [];


        for (
            $attempt = 0;
            $attempt < 3;
            $attempt++
        ) {

            $response =
                $this->aiService->complete(
                    $messages,
                    $tools
                );


            $toolCalls =
                $response['tool_calls']
                ?? [];


            /*
            |--------------------------------------------------------------------------
            | Normal response
            |--------------------------------------------------------------------------
            */

            if (
                empty(
                    $toolCalls
                )
            ) {

                $content =
                    (string) (
                        $response['content']
                        ?? ''
                    );


                $conversation
                    ->messages()
                    ->create([
                        'role' =>
                            'assistant',

                        'content' =>
                            $content,
                    ]);


                return [
                    'type' =>
                        'message',

                    'message' =>
                        $content,

                    'flights' =>
                        $collectedFlights,

                    'conversation_id' =>
                        $conversation->uuid,

                    'quick_replies' =>
                        $this->quickReplies(
                            $collectedFlights
                        ),
                ];
            }


            /*
            |--------------------------------------------------------------------------
            | Save assistant tool call
            |--------------------------------------------------------------------------
            */

            $conversation
                ->messages()
                ->create([
                    'role' =>
                        'assistant',

                    'content' =>
                        $response['content']
                        ?? null,

                    'tool_calls' =>
                        $toolCalls,
                ]);


            $messages[] =
                $response;


            /*
            |--------------------------------------------------------------------------
            | Execute tools
            |--------------------------------------------------------------------------
            */

            foreach (
                $toolCalls as $toolCall
            ) {

                $toolName =
                    $toolCall[
                        'function'
                    ]['name']
                    ?? '';


                $arguments =
                    $toolCall[
                        'function'
                    ]['arguments']
                    ?? [];


                if (
                    is_string(
                        $arguments
                    )
                ) {

                    $arguments =
                        json_decode(
                            $arguments,
                            true
                        ) ?? [];
                }


                $result =
                    $this->executeToolCall(
                        $toolName,
                        $arguments,
                        $user
                    );


                if (
                    is_array($result) &&
                    !empty(
                        $result['flights']
                    )
                ) {

                    $collectedFlights =
                        array_merge(
                            $collectedFlights,
                            $result['flights']
                        );
                }


                $conversation
                    ->messages()
                    ->create([
                        'role' =>
                            'tool',

                        'content' =>
                            json_encode(
                                $result,
                                JSON_UNESCAPED_UNICODE
                            ),

                        'tool_call_id' =>
                            $toolCall['id']
                            ?? null,

                        'tool_name' =>
                            $toolName,

                        'tool_arguments' =>
                            $arguments,

                        'tool_result' =>
                            $result,
                    ]);


                /*
                |--------------------------------------------------------------------------
                | Add tool result
                |--------------------------------------------------------------------------
                */

                $messages[] = [
                    'role' =>
                        'tool',

                    'tool_call_id' =>
                        $toolCall['id']
                        ?? null,

                    'tool_name' =>
                        $toolName,

                    'content' =>
                        json_encode(
                            $result,
                            JSON_UNESCAPED_UNICODE
                        ),
                ];
            }
        }


        throw new \RuntimeException(
            'AI tool-call limit exceeded.'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | STREAMING
    |--------------------------------------------------------------------------
    */

    public function streamChat(
        string $message,
        ?Model $user = null,
        ?string $conversationId = null
    ): \Generator {

        $conversation =
            $this->conversation(
                $conversationId,
                $user
            );


        $this->saveUserMessage(
            $conversation,
            $message
        );


        yield [
            'type' =>
                'conversation',

            'conversation_id' =>
                $conversation->uuid,
        ];


        $messages = [
            [
                'role' =>
                    'system',

                'content' =>
                    $this->aiService
                        ->systemPrompt(),
            ],

            ...
            $this->history(
                $conversation
            ),
        ];


        $useTools =
            $this->shouldUseTools(
                $message
            );


        /*
        |--------------------------------------------------------------------------
        | NORMAL CHAT
        |--------------------------------------------------------------------------
        */

        if (!$useTools) {

            yield [
                'type' =>
                    'status',

                'status' =>
                    'thinking',

                'message' =>
                    'SkyAI đang trả lời...',
            ];


            $fullContent = '';


            foreach (
                $this->aiService
                    ->stream($messages)
                as $chunk
            ) {

                if (
                    ($chunk['done'] ?? false)
                ) {
                    break;
                }


                $content =
                    $chunk['content']
                    ?? '';


                if (
                    $content === ''
                ) {
                    continue;
                }


                $fullContent .=
                    $content;


                yield [
                    'type' =>
                        'chunk',

                    'content' =>
                        $content,
                ];
            }


            $conversation
                ->messages()
                ->create([
                    'role' =>
                        'assistant',

                    'content' =>
                        $fullContent,
                ]);


            yield [
                'type' =>
                    'done',

                'conversation_id' =>
                    $conversation->uuid,

                'message' =>
                    $fullContent,

                'flights' =>
                    [],

                'quick_replies' =>
                    [],
            ];


            return;
        }


        /*
        |--------------------------------------------------------------------------
        | TOOL MODE
        |--------------------------------------------------------------------------
        */

        yield [
            'type' =>
                'status',

            'status' =>
                'thinking',

            'message' =>
                'Mình đang kiểm tra thông tin...',
        ];


        /*
        |--------------------------------------------------------------------------
        | First Gemini call
        |--------------------------------------------------------------------------
        */

        $response =
            $this->aiService->complete(
                $messages,
                $this->getTools()
            );


        $toolCalls =
            $response['tool_calls']
            ?? [];


        /*
        |--------------------------------------------------------------------------
        | Gemini decided no tool
        |--------------------------------------------------------------------------
        */

        if (
            empty(
                $toolCalls
            )
        ) {

            $fullContent = '';


            foreach (
                $this->aiService
                    ->stream($messages)
                as $chunk
            ) {

                if (
                    ($chunk['done'] ?? false)
                ) {
                    break;
                }


                $content =
                    $chunk['content']
                    ?? '';


                if (
                    $content === ''
                ) {
                    continue;
                }


                $fullContent .=
                    $content;


                yield [
                    'type' =>
                        'chunk',

                    'content' =>
                        $content,
                ];
            }


            $conversation
                ->messages()
                ->create([
                    'role' =>
                        'assistant',

                    'content' =>
                        $fullContent,
                ]);


            yield [
                'type' =>
                    'done',

                'conversation_id' =>
                    $conversation->uuid,

                'message' =>
                    $fullContent,

                'flights' =>
                    [],

                'quick_replies' =>
                    [],
            ];


            return;
        }


        /*
        |--------------------------------------------------------------------------
        | Save assistant tool call
        |--------------------------------------------------------------------------
        */

        $conversation
            ->messages()
            ->create([
                'role' =>
                    'assistant',

                'content' =>
                    $response['content']
                    ?? null,

                'tool_calls' =>
                    $toolCalls,
            ]);


        $messages[] =
            $response;


        $collectedFlights = [];


        /*
        |--------------------------------------------------------------------------
        | Execute tool calls
        |--------------------------------------------------------------------------
        */

        foreach (
            $toolCalls as $toolCall
        ) {

            $toolName =
                $toolCall[
                    'function'
                ]['name']
                ?? '';


            $arguments =
                $toolCall[
                    'function'
                ]['arguments']
                ?? [];


            if (
                is_string(
                    $arguments
                )
            ) {

                $arguments =
                    json_decode(
                        $arguments,
                        true
                    ) ?? [];
            }


            yield [
                'type' =>
                    'tool',

                'status' =>
                    'executing',

                'tool' =>
                    $toolName,

                'message' =>
                    $this->toolMessage(
                        $toolName
                    ),
            ];


            /*
            |--------------------------------------------------------------------------
            | Execute DB tool
            |--------------------------------------------------------------------------
            */

            $result =
                $this->executeToolCall(
                    $toolName,
                    $arguments,
                    $user
                );


            /*
            |--------------------------------------------------------------------------
            | Collect flights
            |--------------------------------------------------------------------------
            */

            if (
                is_array($result) &&
                !empty(
                    $result['flights']
                )
            ) {

                $collectedFlights =
                    array_merge(
                        $collectedFlights,
                        $result['flights']
                    );
            }


            /*
            |--------------------------------------------------------------------------
            | Save tool result
            |--------------------------------------------------------------------------
            */

            $conversation
                ->messages()
                ->create([
                    'role' =>
                        'tool',

                    'content' =>
                        json_encode(
                            $result,
                            JSON_UNESCAPED_UNICODE
                        ),

                    'tool_call_id' =>
                        $toolCall['id']
                        ?? null,

                    'tool_name' =>
                        $toolName,

                    'tool_arguments' =>
                        $arguments,

                    'tool_result' =>
                        $result,
                ]);


            /*
            |--------------------------------------------------------------------------
            | Send result back to Gemini
            |--------------------------------------------------------------------------
            */

            $messages[] = [
                'role' =>
                    'tool',

                'tool_call_id' =>
                    $toolCall['id']
                    ?? null,

                'tool_name' =>
                    $toolName,

                'content' =>
                    json_encode(
                        $result,
                        JSON_UNESCAPED_UNICODE
                    ),
            ];
        }


        /*
        |--------------------------------------------------------------------------
        | Final answer
        |--------------------------------------------------------------------------
        */

        yield [
            'type' =>
                'status',

            'status' =>
                'writing',

            'message' =>
                'Mình đã tìm được thông tin. Để mình trả lời bạn...',
        ];


        $fullContent = '';


        foreach (
            $this->aiService
                ->stream($messages)
            as $chunk
        ) {

            if (
                ($chunk['done'] ?? false)
            ) {
                break;
            }


            $content =
                $chunk['content']
                ?? '';


            if (
                $content === ''
            ) {
                continue;
            }


            $fullContent .=
                $content;


            yield [
                'type' =>
                    'chunk',

                'content' =>
                    $content,
            ];
        }


        $conversation
            ->messages()
            ->create([
                'role' =>
                    'assistant',

                'content' =>
                    $fullContent,
            ]);


        yield [
            'type' =>
                'done',

            'conversation_id' =>
                $conversation->uuid,

            'message' =>
                $fullContent,

            'flights' =>
                $collectedFlights,

            'quick_replies' =>
                $this->quickReplies(
                    $collectedFlights
                ),
        ];
    }


    /*
    |--------------------------------------------------------------------------
    | SHOULD USE TOOLS
    |--------------------------------------------------------------------------
    */

    private function shouldUseTools(
        string $message
    ): bool {

        $message =
            mb_strtolower(
                $message
            );


        $keywords = [
            'tìm chuyến bay',
            'tìm vé',
            'chuyến bay',
            'vé máy bay',
            'bay từ',
            'bay đi',
            'đi từ',
            'đặt vé',
            'booking',
            'ghế',
            'hành lý',
            'hoàn vé',
            'hủy vé',
            'đổi vé',
            'chính sách',
            'quy định',
            'sân bay',
        ];


        foreach (
            $keywords as $keyword
        ) {

            if (
                str_contains(
                    $message,
                    $keyword
                )
            ) {

                return true;
            }
        }


        return false;
    }


    /*
    |--------------------------------------------------------------------------
    | TOOLS
    |--------------------------------------------------------------------------
    */

    private function getTools(): array
    {
        return [
            $this->searchFlightTool
                ->definition(),

            $this->getFlightDetailsTool
                ->definition(),

            $this->checkSeatAvailabilityTool
                ->definition(),

            $this->getAirportInfoTool
                ->definition(),

            $this->getBookingInfoTool
                ->definition(),

            $this->searchKnowledgeTool
                ->definition(),
        ];
    }


    /*
    |--------------------------------------------------------------------------
    | EXECUTE TOOL
    |--------------------------------------------------------------------------
    */

    private function executeToolCall(
        string $toolName,
        array $arguments,
        ?Model $user
    ): array {

        return match ($toolName) {

            'search_flight' =>
                $this->searchFlightTool
                    ->execute(
                        $arguments
                    ),

            'get_flight_details' =>
                $this->getFlightDetailsTool
                    ->execute(
                        $arguments
                    ),

            'check_seat_availability' =>
                $this->checkSeatAvailabilityTool
                    ->execute(
                        $arguments
                    ),

            'get_airport_info' =>
                $this->getAirportInfoTool
                    ->execute(
                        $arguments
                    ),

            'get_booking_info' =>
                $this->getBookingInfoTool
                    ->execute(
                        $arguments,
                        $user
                    ),

            'search_airline_knowledge' =>
                $this->searchKnowledgeTool
                    ->execute(
                        $arguments
                    ),

            default => [
                'type' =>
                    'error',

                'message' =>
                    'Unknown AI tool.',
            ],
        };
    }


    /*
    |--------------------------------------------------------------------------
    | CONVERSATION
    |--------------------------------------------------------------------------
    */

    private function conversation(
        ?string $conversationId,
        ?Model $user
    ): AIConversation {

        if ($conversationId) {

            $query =
                AIConversation::where(
                    'uuid',
                    $conversationId
                );


            if ($user) {

                $query->where(
                    function ($q) use ($user) {

                        $q->where(
                            'user_id',
                            $user->getKey()
                        )->orWhereNull(
                            'user_id'
                        );
                    }
                );

            } else {

                $query->whereNull(
                    'user_id'
                );
            }


            return $query->firstOrFail();
        }


        return AIConversation::create([
            'uuid' =>
                (string) Str::uuid(),

            'user_id' =>
                $user?->getKey(),
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | HISTORY
    |--------------------------------------------------------------------------
    */

    private function history(
        AIConversation $conversation
    ): array {

        return $conversation
            ->messages()
            ->oldest('id')
            ->get()
            ->map(
                function (
                    AIMessage $message
                ): array {

                    if (
                        $message->role ===
                            'assistant' &&
                        $message->tool_calls
                    ) {

                        return [
                            'role' =>
                                'assistant',

                            'content' =>
                                $message->content,

                            'tool_calls' =>
                                $message->tool_calls
                                    instanceof
                                    \ArrayObject
                                    ? $message
                                        ->tool_calls
                                        ->getArrayCopy()
                                    : $message
                                        ->tool_calls,
                        ];
                    }


                    return array_filter(
                        [
                            'role' =>
                                $message->role,

                            'content' =>
                                $message->content,

                            'tool_call_id' =>
                                $message
                                    ->tool_call_id,

                            'tool_name' =>
                                $message
                                    ->tool_name,
                        ],
                        static fn (
                            $value
                        ) =>
                            $value !== null
                    );
                }
            )
            ->all();
    }


    /*
    |--------------------------------------------------------------------------
    | SAVE USER MESSAGE
    |--------------------------------------------------------------------------
    */

    private function saveUserMessage(
        AIConversation $conversation,
        string $message
    ): void {

        DB::transaction(
            function () use (
                $conversation,
                $message
            ) {

                if (
                    !$conversation->title
                ) {

                    $conversation->update([
                        'title' =>
                            Str::limit(
                                $message,
                                160
                            ),
                    ]);
                }


                $conversation
                    ->messages()
                    ->create([
                        'role' =>
                            'user',

                        'content' =>
                            $message,
                    ]);
            }
        );
    }


    /*
    |--------------------------------------------------------------------------
    | TOOL MESSAGE
    |--------------------------------------------------------------------------
    */

    private function toolMessage(
        string $toolName
    ): string {

        return match (
            $toolName
        ) {

            'search_flight' =>
                'Đang tìm chuyến bay phù hợp...',

            'get_flight_details' =>
                'Đang lấy thông tin chuyến bay...',

            'check_seat_availability' =>
                'Đang kiểm tra ghế trống...',

            'get_airport_info' =>
                'Đang kiểm tra thông tin sân bay...',

            'get_booking_info' =>
                'Đang kiểm tra booking của bạn...',

            'search_airline_knowledge' =>
                'Đang tìm trong kho kiến thức SkyLink...',

            default =>
                'Đang kiểm tra thông tin...',
        };
    }


    /*
    |--------------------------------------------------------------------------
    | QUICK REPLIES
    |--------------------------------------------------------------------------
    */

    private function quickReplies(
        array $flights
    ): array {

        if (
            empty($flights)
        ) {

            return [];
        }


        return [
            [
                'label' =>
                    '👉 Chọn ghế & Đặt vé ngay',

                'payload' =>
                    'open:/seat-selection',
            ],
        ];
    }
}