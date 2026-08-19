<?php

namespace App\Services\AI\RAG;

use Illuminate\Support\Facades\Http;
use RuntimeException;

class QdrantService
{
    protected string $url;
    protected string $collection;
    protected ?string $apiKey;

    public function __construct()
    {
        $this->url =
            rtrim(config('services.qdrant.url'), '/');

        $this->collection =
            config('services.qdrant.collection');

        $this->apiKey =
            config('services.qdrant.api_key');
    }

    public function search(
        array $vector,
        int $limit = 5
    ): array {

        $request = Http::acceptJson();

        if ($this->apiKey) {
            $request->withHeaders([
                'api-key' => $this->apiKey,
            ]);
        }

        $response = $request->post(
            "{$this->url}/collections/{$this->collection}/points/search",
            [
                'vector' => $vector,
                'limit' => $limit,
                'with_payload' => true,
            ]
        );

        if ($response->failed()) {
            throw new RuntimeException(
                'Qdrant Error: ' .
                $response->body()
            );
        }

        return $response->json('result', []);
    }

    public function collectionExists(): bool
    {
        $response = $this->request()->get(
            "{$this->url}/collections/{$this->collection}"
        );

        if ($response->status() === 404) {
            return false;
        }

        if ($response->failed()) {
            throw new RuntimeException('Qdrant Error: '.$response->body());
        }

        return true;
    }

    public function createCollection(int $vectorSize = 1536): void
    {
        $response = $this->request()->put(
            "{$this->url}/collections/{$this->collection}",
            [
                'vectors' => [
                    'size' => $vectorSize,
                    'distance' => 'Cosine',
                ],
            ]
        );

        if ($response->failed()) {
            throw new RuntimeException('Qdrant Error: '.$response->body());
        }
    }

    public function deleteCollection(): void
    {
        $response = $this->request()->delete(
            "{$this->url}/collections/{$this->collection}"
        );

        if ($response->failed() && $response->status() !== 404) {
            throw new RuntimeException('Qdrant Error: '.$response->body());
        }
    }

    public function upsert(array $points): void
    {
        $response = $this->request()->put(
            "{$this->url}/collections/{$this->collection}/points",
            [
                'wait' => true,
                'points' => $points,
            ]
        );

        if ($response->failed()) {
            throw new RuntimeException('Qdrant Error: '.$response->body());
        }
    }

    private function request(): \Illuminate\Http\Client\PendingRequest
    {
        $request = Http::acceptJson()->timeout(60);

        if ($this->apiKey) {
            $request->withHeaders(['api-key' => $this->apiKey]);
        }

        return $request;
    }
}