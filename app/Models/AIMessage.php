<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\AsArrayObject;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AIMessage extends Model
{
    use HasFactory;

    protected $table = 'ai_messages';

    protected $fillable = [
        'ai_conversation_id',
        'role',
        'content',
        'tool_call_id',
        'tool_name',
        'tool_calls',
        'tool_arguments',
        'tool_result',
    ];

    protected function casts(): array
    {
        return [
            'tool_calls' => AsArrayObject::class,
            'tool_arguments' => AsArrayObject::class,
            'tool_result' => AsArrayObject::class,
        ];
    }

    public function conversation(): BelongsTo
    {
        return $this->belongsTo(AIConversation::class, 'ai_conversation_id');
    }
}
