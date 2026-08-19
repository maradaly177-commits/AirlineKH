<?php

namespace App\Services\AI;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class AIService
{
    protected string $model;

    public function __construct()
    {
        $this->model = (string) config(
            'services.ollama.chat_model',
            'qwen2.5:3b'
        );
    }

    public function systemPrompt(): string
    {
        return <<<PROMPT
You are SkyAI Assistant for an airline booking website.

You help users with:
- Finding flights
- Flight information
- Seat availability
- Airport information
- Booking information
- Airline policies

IMPORTANT:
1. Never invent flight information.
2. Never invent prices.
3. Never invent seat availability.
4. Use tools when real database information is required.
5. Only access booking information belonging to the authenticated user.
6. Ask clarification when required information is missing.
7. Answer clearly and concisely.
PROMPT;
    }

    public function complete(array $messages, array $tools = []): array
    {

        $payload = [
            'model' => $this->model,
            'messages' => $messages,
            'stream' => false,
        ];

        if (!empty($tools)) {
            $payload['tools'] = $tools;
        }

        $response = Http::acceptJson()
            ->timeout(60)
            ->post(
                rtrim(config('services.ollama.url'), '/').'/api/chat',
                $payload
            );

        if ($response->failed()) {
            throw new RuntimeException(
                'Ollama Chat Error: ' .
                $response->body()
            );
        }

        $messageData = $response->json('message');

        if (!$messageData) {
            throw new RuntimeException(
                'Invalid response from Ollama.'
            );
        }

        return $messageData;
    }
}