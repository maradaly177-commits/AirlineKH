<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WelcomeGoogleUserMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $user
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '✈️ Chào mừng bạn đến với SkyLink Airline!',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.welcome-google',
            with: [
                'user' => $this->user,
                'homeUrl' => env('FRONTEND_URL', 'http://localhost:5173'),
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
