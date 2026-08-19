<?php

namespace App\Services\AI\RAG;

class DocumentSearchService
{
    public function __construct(
        protected EmbeddingService $embeddingService,
        protected QdrantService $qdrantService
    ) {
    }

    public function search(
        string $question,
        int $limit = 5
    ): array {

        $vector =
            $this->embeddingService->embed($question);

        return $this->qdrantService->search(
            $vector,
            $limit
        );
    }
}