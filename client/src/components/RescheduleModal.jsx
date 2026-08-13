import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle } from "@phosphor-icons/react";

/**
 * RescheduleModal - Hiển thị phí đổi chuyến và xử lý thanh toán
 * 
 * Props:
 * - isOpen: boolean
 * - data: { oldBooking, newFlight, reschedule_fee, original_amount }
 * - onClose: function
 * - onConfirm: function (user confirms to reschedule)
 */
export default function RescheduleModal({ isOpen, data, onClose, onConfirm, isProcessing = false }) {
  if (!isOpen || !data) return null;

  const { oldBooking, newFlight, reschedule_fee, original_amount } = data;
  const oldFlight = oldBooking.flight;
  
  // Tính toán số tiền phải thanh toán
  const oldFlightPrice = original_amount;
  const newFlightBasePrice = parseFloat(newFlight.display_price || newFlight.base_price);
  const ticketsCount = oldBooking.tickets?.length || 1;
  const newFlightTotalPrice = newFlightBasePrice * ticketsCount * 1.8; // Include tax
  
  const paymentAmount = newFlightTotalPrice - oldFlightPrice + reschedule_fee;
  const isRefund = paymentAmount < 0;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 px-8 py-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-zinc-900">Xác nhận đổi chuyến bay</h2>
                  <p className="text-sm text-zinc-500 mt-1">Kiểm tra chi tiết thanh toán</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/50 rounded-full transition"
                  disabled={isProcessing}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-8 space-y-8">
                
                {/* Flight Comparison */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-zinc-900">So sánh chuyến bay</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Old Flight */}
                    <div className="border-2 border-red-200 rounded-2xl p-6 bg-red-50/50">
                      <p className="text-xs font-bold text-red-700 uppercase tracking-widest mb-3">Chuyến bay cũ</p>
                      <p className="text-sm text-zinc-600 mb-2">
                        {oldFlight.departure_airport?.name || 'N/A'} → {oldFlight.arrival_airport?.name || 'N/A'}
                      </p>
                      <p className="text-xl font-bold text-zinc-900 mb-1">
                        {formatTime(oldFlight.departure_time)}
                      </p>
                      <p className="text-xs text-zinc-500">{formatDate(oldFlight.departure_time)}</p>
                      <p className="text-xs text-zinc-500 mt-2">Flight: {oldFlight.flight_number}</p>
                    </div>

                    {/* New Flight */}
                    <div className="border-2 border-green-200 rounded-2xl p-6 bg-green-50/50">
                      <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-3">Chuyến bay mới</p>
                      <p className="text-sm text-zinc-600 mb-2">
                        {newFlight.departure_airport?.name || 'N/A'} → {newFlight.arrival_airport?.name || 'N/A'}
                      </p>
                      <p className="text-xl font-bold text-zinc-900 mb-1">
                        {formatTime(newFlight.departure_time)}
                      </p>
                      <p className="text-xs text-zinc-500">{formatDate(newFlight.departure_time)}</p>
                      <p className="text-xs text-zinc-500 mt-2">Flight: {newFlight.flight_number}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Breakdown */}
                <div className="space-y-3 border-t-2 border-zinc-200 pt-6">
                  <h3 className="text-lg font-bold text-zinc-900">Bảng tính thanh toán</h3>
                  
                  <div className="space-y-2 bg-zinc-50 rounded-xl p-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-zinc-600">Giá vé cũ:</span>
                      <span className="font-semibold text-zinc-900">{formatPrice(oldFlightPrice)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm border-t border-zinc-200 pt-2">
                      <span className="text-zinc-600">Phí đổi chuyến:</span>
                      <span className="font-semibold text-red-600">+ {formatPrice(reschedule_fee)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-zinc-600">Giá vé mới:</span>
                      <span className="font-semibold text-zinc-900">+ {formatPrice(newFlightTotalPrice - oldFlightPrice)}</span>
                    </div>

                    <div className="border-t-2 border-zinc-300 pt-3 mt-3 flex justify-between items-center">
                      <span className="font-bold text-zinc-900">Tổng cần {isRefund ? 'hoàn' : 'thanh toán'}:</span>
                      <span className={`text-xl font-bold ${isRefund ? 'text-green-600' : 'text-blue-600'}`}>
                        {isRefund ? '- ' : '+ '}{formatPrice(Math.abs(paymentAmount))}
                      </span>
                    </div>
                  </div>

                  {isRefund && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex gap-2">
                      <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-green-700">
                        Hệ thống sẽ hoàn <strong>{formatPrice(Math.abs(paymentAmount))}</strong> vào ví SkyLink của bạn
                      </p>
                    </div>
                  )}
                </div>

                {/* Notices */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-bold text-blue-700 uppercase">Lưu ý</p>
                  <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                    <li>Bạn sẽ được chọn ghế cho chuyến bay mới</li>
                    <li>Mã vé (PNR) sẽ được giữ nguyên</li>
                    <li>Ghi nhận thay đổi trong hóa đơn</li>
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-zinc-50 border-t border-zinc-200 px-8 py-6 flex gap-3">
                <button
                  onClick={onClose}
                  disabled={isProcessing}
                  className="flex-1 py-3 rounded-xl border border-zinc-300 text-zinc-900 font-bold hover:bg-zinc-100 transition disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isProcessing}
                  className={`flex-1 py-3 rounded-xl font-bold text-white transition ${
                    isRefund
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
                  } disabled:opacity-50`}
                >
                  {isProcessing ? 'Đang xử lý...' : (isRefund ? 'Xác nhận hoàn tiền' : 'Thanh toán ngay')}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
