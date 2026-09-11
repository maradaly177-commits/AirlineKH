<?php

namespace Tests\Feature;

use App\Services\AI\AIChatService;
use Mockery;
use Tests\TestCase;

class AIChatTest extends TestCase
{
    public function test_ai_chat_endpoint_returns_success_response(): void
    {
        $mock = Mockery::mock(AIChatService::class);
        $mock->shouldReceive('chat')
            ->once()
            ->andReturn([
                'type' => 'message',
                'message' => 'Xin chào!',
                'flights' => [],
                'conversation_id' => 'test-uuid',
                'quick_replies' => [],
            ]);

        $this->app->instance(AIChatService::class, $mock);

        $response = $this->postJson('/api/ai/chat', [
            'message' => 'Xin chào',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'message' => 'Xin chào!',
                ],
            ]);
    }
}