<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PhoneOtpMail extends Mailable
{
    use Queueable, SerializesModels;

    public $otp;
    public $phone;

    /**
     * Create a new message instance.
     */
    public function __construct($otp, $phone)
    {
        $this->otp = $otp;
        $this->phone = $phone;
    }

    public function build(){
        return $this->subject('Your OTP Code for Phone Number Verification')
                    ->markdown('emails.otp')
                    ->with([
                        'otp' => $this->otp,
                        'phone' => $this->phone,
                    ]);
    }


    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Phone Otp Mail',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.otp',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
