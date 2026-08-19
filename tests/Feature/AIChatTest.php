<?php

namespace Tests\Feature;

use App\Models\AIConversation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AIChatTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_chat_and_conversation_is_saved(): void
    {
        config(['services.ollama.chat_model' => 'test-chat-model']);
        Http::fake([
            'http://127.0.0.1:11434/api/chat' => Http::response([
                'message' => [
                    'role' => 'assistant',
                    'content' => 'Xin chào, tôi có thể hỗ trợ chuyến bay của bạn.',
                ],
            ]),
        ]);

        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/ai/chat', [
            'message' => 'Xin chào',
        ]);

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.type', 'message')
            ->assertJsonPath('data.message', 'Xin chào, tôi có thể hỗ trợ chuyến bay của bạn.');

        $conversationId = $response->json('data.conversation_id');

        $this->assertDatabaseHas('ai_conversations', [
            'uuid' => $conversationId,
            'user_id' => $user->id,
        ]);
        $this->assertDatabaseHas('ai_messages', [
            'role' => 'user',
            'content' => 'Xin chào',
        ]);
        $this->assertDatabaseHas('ai_messages', [
            'role' => 'assistant',
            'content' => 'Xin chào, tôi có thể hỗ trợ chuyến bay của bạn.',
        ]);
    }

    public function test_user_cannot_read_another_users_conversation(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $conversation = AIConversation::create([
            'uuid' => '11111111-1111-4111-8111-111111111111',
            'user_id' => $owner->id,
        ]);

        Sanctum::actingAs($otherUser);

        $this->getJson('/api/ai/conversations/'.$conversation->uuid)
            ->assertNotFound();
    }

    public function test_tool_call_is_executed_and_followed_by_final_answer(): void
    {
        config(['services.ollama.chat_model' => 'test-chat-model']);
        Http::fake([
            'http://127.0.0.1:11434/api/chat' => Http::sequence()
                ->push([
                    'message' => [
                        'role' => 'assistant',
                        'content' => '',
                        'tool_calls' => [[
                            'id' => 'call_knowledge_1',
                            'type' => 'function',
                            'function' => [
                                'name' => 'search_airline_knowledge',
                                'arguments' => ['question' => 'Quy định hành lý là gì?'],
                            ]],
                        ],
                    ],
                ])
                ->push([
                    'message' => [
                        'role' => 'assistant',
                        'content' => 'Hành lý được áp dụng theo chính sách của hãng.',
                    ],
                ]),
            'http://127.0.0.1:11434/api/embeddings' => Http::response([
                'embedding' => [0.1, 0.2, 0.3],
            ]),
            'http://127.0.0.1:6333/collections/airline_knowledge/points/search' => Http::response([
                'result' => [['id' => 1, 'score' => 0.95, 'payload' => ['text' => 'Chính sách hành lý.']]],
            ]),
        ]);

        Sanctum::actingAs(User::factory()->create());

        $response = $this->postJson('/api/ai/chat', [
            'message' => 'Quy định hành lý là gì?',
        ]);

        $response->assertOk()
            ->assertJsonPath('data.message', 'Hành lý được áp dụng theo chính sách của hãng.');

        Http::assertSentCount(4);
    }

    public function test_chat_requires_authentication(): void
    {
        $this->postJson('/api/ai/chat', ['message' => 'Xin chào'])
            ->assertUnauthorized();
    }
}
