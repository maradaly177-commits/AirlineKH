<?php

namespace App\Jobs;

use App\Models\BoardingPass;
use App\Models\Ticket;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;
use Exception;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * SendBoardingPassEmailJob
 * 
 * Job được queue (xếp hàng) để gửi Thẻ lên máy bay (Boarding Pass) qua email
 * mà không làm chậm trang web khi người dùng Check-in.
 * 
 * Được triển khai sau khi Check-in thành công.
 * Sử dụng Laravel Queue để xử lý ngầm (background job).
 */
class SendBoardingPassEmailJob implements ShouldQueue
{
    use Queueable;

    /**
     * Số lần retry nếu job thất bại
     * @var int
     */
    public int $tries = 3;

    /**
     * Thời gian chờ giữa các lần retry (giây)
     * @var int
     */
    public int $backoff = 60;

    /**
     * ID của Boarding Pass cần gửi
     * @var int
     */
    private int $boardingPassId;

    /**
     * Email đích cần gửi (nếu có chỉ định từ user đang đăng nhập/request)
     * @var string|null
     */
    private ?string $targetEmail;

    /**
     * Constructor
     * 
     * @param int $boardingPassId
     * @param string|null $targetEmail
     */
    public function __construct(int $boardingPassId, ?string $targetEmail = null)
    {
        $this->boardingPassId = $boardingPassId;
        $this->targetEmail = $targetEmail;
    }

    /**
     * Xử lý job - Gửi email Boarding Pass
     * 
     * @return void
     * @throws Exception
     */
    public function handle(): void
    {
        try {
            // 1. Lấy Boarding Pass kèm thông tin liên quan
            $boardingPass = BoardingPass::with([
                'ticket.booking.user',
                'ticket.flight.departureAirport',
                'ticket.flight.arrivalAirport',
                'ticket.seat',
            ])->find($this->boardingPassId);

            if (!$boardingPass) {
                throw new Exception("Không tìm thấy Boarding Pass với ID: {$this->boardingPassId}");
            }

            $ticket = $boardingPass->ticket;
            if (!$ticket) {
                throw new Exception("Không tìm thấy thông tin vé liên kết với Boarding Pass ID: {$this->boardingPassId}");
            }

            $booking = $ticket->booking;
            $flight = $ticket->flight;
            $user = $booking?->user;

            // Ưu tiên email đích truyền vào, nếu không có thì lấy email user hoặc email admin
            $recipientEmail = !empty($this->targetEmail) ? $this->targetEmail : ($user?->email ?: config('mail.from.address', 'vakhimkhean@gmail.com'));
            if (!$recipientEmail) {
                throw new Exception("Không tìm thấy email người nhận cho đơn đặt chỗ {$booking?->pnr_code}");
            }

            // Chuẩn bị dữ liệu mã QR tương thích email client (hỗ trợ render trên Gmail/Outlook)
            $qrData = "{$booking->pnr_code}|{$ticket->passenger_name}|{$flight->flight_number}|" . ($ticket->seat?->seat_number ?? 'TBA');
            $qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' . urlencode($qrData);

            // Format thời gian bay
            $departureTime = $flight->departure_time;
            $departureTimeStr = $departureTime instanceof \Carbon\Carbon 
                ? $departureTime->format('H:i - d/m/Y')
                : date('H:i - d/m/Y', strtotime($departureTime));

            // 2. Tạo dữ liệu cho email
            $data = [
                'passenger_name' => $ticket->passenger_name,
                'pnr_code' => $booking->pnr_code,
                'ticket_code' => $ticket->ticket_code,
                'flight_number' => $flight->flight_number,
                'departure_airport' => $flight->departureAirport?->name ?? 'N/A',
                'departure_code' => $flight->departureAirport?->iata_code ?? $flight->departureAirport?->code ?? '',
                'arrival_airport' => $flight->arrivalAirport?->name ?? 'N/A',
                'arrival_code' => $flight->arrivalAirport?->iata_code ?? $flight->arrivalAirport?->code ?? '',
                'departure_time' => $departureTimeStr,
                'seat_number' => $ticket->seat?->seat_number ?? 'N/A',
                'gate' => $boardingPass->gate ?? 'TBA',
                'qr_code' => $qrCodeUrl,
            ];

            // 3. Gửi email
            Mail::send('emails.boarding-pass', $data, function ($message) use ($recipientEmail, $booking) {
                $message
                    ->to($recipientEmail)
                    ->subject("Thẻ Lên Máy Bay Điện Tử - SkyLink Airlines (PNR: {$booking->pnr_code})")
                    ->from(config('mail.from.address'), config('mail.from.name'));
            });

            Log::info("Email Boarding Pass gửi thành công", [
                'boarding_pass_id' => $this->boardingPassId,
                'user_email' => $recipientEmail,
                'pnr_code' => $booking->pnr_code,
            ]);

        } catch (Exception $e) {
            Log::error("Lỗi khi gửi Boarding Pass Email", [
                'boarding_pass_id' => $this->boardingPassId,
                'error' => $e->getMessage(),
            ]);

            // Throw exception để queue có thể retry
            throw $e;
        }
    }

    /**
     * Job bị failed - ghi log lỗi
     * 
     * @param Throwable $exception
     * @return void
     */
    public function failed(Throwable $exception): void
    {
        Log::error("SendBoardingPassEmailJob failed sau {$this->tries} lần retry", [
            'boarding_pass_id' => $this->boardingPassId,
            'error' => $exception->getMessage(),
        ]);
    }
}
