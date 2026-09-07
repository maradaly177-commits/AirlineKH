<?php
namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentAdminController extends Controller
{
    // GET /admin/payments
    public function index(Request $request)
    {
        $search = $request->get('search');
        $status = $request->get('status');
        $sortDir = $request->get('sort', 'desc');

        $query = Payment::with(['booking.user', 'booking.flight']);

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('transaction_id', 'like', "%{$search}%")
                  ->orWhereHas('booking.user', function ($u) use ($search) {
                      $u->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                  })
                  ->orWhereHas('booking', function ($b) use ($search) {
                      $b->where('id', 'like', "%{$search}%");
                  });
            });
        }

        if (!empty($status) && $status !== 'All') {
            $query->where('status', strtolower($status));
        }

        $direction = strtolower($sortDir) === 'asc' ? 'asc' : 'desc';
        $payments = $query->orderBy('id', $direction)->paginate(10);

        $payments->getCollection()->transform(function ($p) {
            return [
                'id' => $p->id,
                'transaction_id' => $p->transaction_id ?? ('TXN-' . str_pad($p->id, 6, '0', STR_PAD_LEFT)),
                'booking_id' => $p->booking_id,
                'customer_name' => $p->booking?->user?->name ?? $p->booking?->passenger ?? 'Guest Customer',
                'customer_email' => $p->booking?->user?->email ?? 'N/A',
                'amount' => $p->amount ?? 0,
                'payment_method' => strtoupper($p->payment_method ?? 'VNPAY'),
                'status' => $p->status ?? 'success',
                'paid_at' => $p->paid_at ? $p->paid_at->format('Y-m-d H:i:s') : ($p->created_at ? $p->created_at->format('Y-m-d H:i:s') : null),
            ];
        });

        return response()->json($payments);
    }

    // DELETE /admin/payments/{id}
    public function destroy($id)
    {
        $payment = Payment::findOrFail($id);
        $payment->delete();

        return response()->json([
            'message' => 'Payment record deleted successfully'
        ]);
    }
}
