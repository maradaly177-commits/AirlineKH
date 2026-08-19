<?php

namespace App\Http\Controllers\Api\AI;

use App\Http\Controllers\Controller;
use App\Services\AI\AIChatService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\AIConversation;
use Throwable;

class AIChatController extends Controller
{
    protected AIChatService $aiChatService;

    public function __construct(AIChatService $aiChatService)
    {
        $this->aiChatService = $aiChatService;
    }

    /**
     * Send message to AI Assistant
     *
     * POST /api/ai/chat
     */
    public function chat(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'message' => [
                'required',
                'string',
                'max:5000',
            ],

            'conversation_id' => [
                'nullable',
                'string',
                'max:100',
            ],
        ]);

        try {
            $user = $request->user();

            $response = $this->aiChatService->chat(
                message: $validated['message'],
                user: $user,
                conversationId: $validated['conversation_id'] ?? null
            );

            return response()->json([
                'success' => true,
                'data' => $response,
            ], 200);

        } catch (Throwable $e) {

            Log::error('AI Chat Error', [
                'user_id' => $request->user()?->id,
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'AI Assistant is temporarily unavailable.',
            ], 500);
        }
    }

    public function history(Request $request, string $conversationId): JsonResponse
    {
        $conversation = AIConversation::with('messages')
            ->where('uuid', $conversationId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => [
                'conversation_id' => $conversation->uuid,
                'title' => $conversation->title,
                'messages' => $conversation->messages->map(fn ($message) => [
                    'role' => $message->role,
                    'content' => $message->content,
                    'tool_name' => $message->tool_name,
                    'created_at' => $message->created_at,
                ])->values(),
            ],
        ]);
    }
}