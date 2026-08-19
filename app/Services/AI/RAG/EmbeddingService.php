<?php

namespace App\Services\AI\RAG;

use Illuminate\Support\Facades\Http;
use RuntimeException;

class EmbeddingService
{
    public function embed(string $text): array
    {
        $response = Http::acceptJson()
            ->timeout(60)
            ->post(
                rtrim(config('services.ollama.url'), '/').'/api/embeddings',
                [
                    'model' => config('services.ollama.embedding_model', 'nomic-embed-text'),
                    'prompt' => $text,
                ]
            );

        if ($response->failed()) {
            throw new RuntimeException(
                'Ollama Embedding Error: ' .
                $response->body()
            );
        }

        $embedding = $response->json('embedding');

        if (!is_array($embedding) || $embedding === []) {
            throw new RuntimeException('Ollama returned an invalid embedding.');
        }

        return $embedding;
    }
}