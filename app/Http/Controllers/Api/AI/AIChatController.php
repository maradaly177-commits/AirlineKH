<?php

namespace App\Http\Controllers\Api\AI;

use App\Http\Controllers\Controller;
use App\Models\AIConversation;
use App\Services\AI\AIChatService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Throwable;

class AIChatController extends Controller
{
    protected AIChatService $aiChatService;

    public function __construct(
        AIChatService $aiChatService
    ) {
        $this->aiChatService = $aiChatService;
    }

    /**
     * ============================================================
     * NORMAL JSON CHAT
     * ============================================================
     *
     * POST /api/ai/chat
     */
    public function chat(Request $request): JsonResponse
    {
        set_time_limit(300);

        $validated = $request->validate([
            'message' => [
                'nullable',
                'string',
                'max:5000',
            ],

            'images' => [
                'nullable',
                'array',
            ],

            'conversation_id' => [
                'nullable',
                'string',
                'max:100',
            ],
        ]);

        try {
            $user =
                $request->user('sanctum')
                ?? $request->user();

            $response = $this->aiChatService->chat(
                message: $validated['message'] ?? ' ',
                user: $user,
                conversationId: $validated['conversation_id'] ?? null,
                images: $validated['images'] ?? []
            );

            return response()->json([
                'success' => true,
                'conversation_id' => $response['conversation_id'],
                'data' => [
                    'type' => 'message',
                    'message' => $response['message'] ?? '',
                    'conversation_id' => $response['conversation_id'],
                    'flights' => $response['flights'] ?? [],
                    'quick_replies' => $response['quick_replies'] ?? [],
                ],
                'reply' => [
                    'type' => !empty($response['flights']) ? 'mixed' : 'text',
                    'text' => $response['message'] ?? '',
                    'flights' => $response['flights'] ?? [],
                    'quick_replies' => $response['quick_replies'] ?? [],
                ],
            ]);

        } catch (Throwable $e) {
            Log::error('AI Chat Error', [
                'user_id' => $request->user()?->id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => app()->environment('local')
                    ? $e->getMessage()
                    : 'AI Assistant is temporarily unavailable.',
            ], 500);
        }
    }


    /**
     * ============================================================
     * REAL SSE STREAMING CHAT
     * ============================================================
     *
     * POST /api/ai/chat/stream
     */
    public function stream(Request $request): StreamedResponse
    {
        set_time_limit(300);

        $validated = $request->validate([
            'message' => [
                'nullable',
                'string',
                'max:5000',
            ],

            'images' => [
                'nullable',
                'array',
            ],

            'conversation_id' => [
                'nullable',
                'string',
                'max:100',
            ],
        ]);

        $user =
            $request->user('sanctum')
            ?? $request->user();

        return response()->stream(
            function () use ($validated, $user) {
                $send = function (array $data): void {
                    echo "data: " . json_encode($data, JSON_UNESCAPED_UNICODE) . "\n\n";

                    if (ob_get_level() > 0) {
                        @ob_flush();
                    }

                    flush();
                };

                try {
                    foreach (
                        $this->aiChatService->streamChat(
                            message: $validated['message'] ?? ' ',
                            user: $user,
                            conversationId: $validated['conversation_id'] ?? null,
                            images: $validated['images'] ?? []
                        ) as $event
                    ) {
                        $send($event);
                    }
                } catch (Throwable $e) {
                    Log::error('AI Streaming Error', [
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString(),
                    ]);

                    $send([
                        'type' => 'error',
                        'message' => app()->environment('local')
                            ? $e->getMessage()
                            : 'AI Assistant is temporarily unavailable.',
                    ]);
                }
            },
            200,
            [
                'Content-Type' =>
                    'text/event-stream; charset=utf-8',

                'Cache-Control' =>
                    'no-cache',

                'Connection' =>
                    'keep-alive',

                'X-Accel-Buffering' =>
                    'no',

                'Access-Control-Allow-Origin' =>
                    '*',
            ]
        );
    }


    /**
     * ============================================================
     * CONVERSATION HISTORY
     * ============================================================
     *
     * GET /api/ai/conversations/{conversationId}
     */
    public function history(
        Request $request,
        string $conversationId
    ): JsonResponse {

        $conversation =
            AIConversation::with('messages')
                ->where(
                    'uuid',
                    $conversationId
                )
                ->where(
                    'user_id',
                    $request->user()->id
                )
                ->firstOrFail();

        return response()->json([
            'success' => true,

            'data' => [
                'conversation_id' =>
                    $conversation->uuid,

                'title' =>
                    $conversation->title,

                'messages' =>
                    $conversation
                        ->messages
                        ->map(
                            fn ($message) => [
                                'role' =>
                                    $message->role,

                                'content' =>
                                    $message->content,

                                'tool_name' =>
                                    $message->tool_name,

                                'created_at' =>
                                    $message->created_at,
                            ]
                        )
                        ->values(),
            ],
        ]);
    }
}