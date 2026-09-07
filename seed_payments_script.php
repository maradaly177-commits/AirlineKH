<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Booking;
use App\Models\Payment;
use App\Models\User;

$users = User::all();
$bookings = Booking::all();

echo "Found " . $bookings->count() . " bookings.\n";

$methods = ['vnpay', 'momo', 'credit_card'];
$statuses = ['success', 'success', 'success', 'pending', 'failed'];

if ($bookings->count() == 0) {
    // Create mock payment records linked to users
    for ($i = 1; $i <= 12; $i++) {
        $user = $users->random();
        Payment::create([
            'booking_id' => $i,
            'transaction_id' => 'TXN-' . (800000 + $i),
            'amount' => rand(12, 45) * 100000,
            'payment_method' => $methods[array_rand($methods)],
            'status' => $statuses[array_rand($statuses)],
            'paid_at' => now()->subDays(rand(0, 15))->subHours(rand(1, 20)),
        ]);
    }
} else {
    foreach ($bookings as $b) {
        Payment::firstOrCreate(
            ['booking_id' => $b->id],
            [
                'transaction_id' => 'TXN-' . (800000 + $b->id),
                'amount' => $b->total_price ?? rand(1500000, 3500000),
                'payment_method' => $methods[array_rand($methods)],
                'status' => 'success',
                'paid_at' => now()->subDays(rand(0, 10)),
            ]
        );
    }
}

echo "Total Payments in DB: " . Payment::count() . "\n";
