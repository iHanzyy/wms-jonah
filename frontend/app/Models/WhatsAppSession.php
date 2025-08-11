<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WhatsAppSession extends Model
{
    use HasFactory;

    protected $table = 'whatsapp_sessions';

    protected $fillable = [
        'user_id',
        'session_name',
        'webhook_url',
        'status',
        'qr_code',
        'session_data',
        'last_seen',
    ];

    protected $casts = [
        'session_data' => 'array',
        'last_seen' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isConnected(): bool
    {
        return $this->status === 'connected';
    }

    public function isConnecting(): bool
    {
        return $this->status === 'connecting';
    }

    public function isDisconnected(): bool
    {
        return $this->status === 'disconnected';
    }
}
