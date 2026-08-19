<?php

namespace App\Services\AI\Tools;

use App\Services\AI\RAG\DocumentSearchService;

class SearchKnowledgeTool
{
    public function __construct(
        protected DocumentSearchService $documentSearchService
    ) {
    }

    public function definition(): array
    {
        return [
            'type' => 'function',
            'function' => [
                'name' => 'search_airline_knowledge',
                'description' => 'Search airline policies and knowledge documents. Use this for policy questions instead of guessing.',
                'parameters' => [
                    'type' => 'object',
                    'properties' => [
                        'question' => [
                            'type' => 'string',
                            'description' => 'The policy or airline knowledge question.',
                        ],
                    ],
                    'required' => ['question'],
                    'additionalProperties' => false,
                ],
            ],
        ];
    }

    public function execute(array $arguments): array
    {
        $question = trim((string) ($arguments['question'] ?? ''));

        if ($question === '') {
            return [
                'success' => false,
                'message' => 'A question is required.',
            ];
        }

        return [
            'success' => true,
            'documents' => $this->documentSearchService->search($question),
        ];
    }
}
