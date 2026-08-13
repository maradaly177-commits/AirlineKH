import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import BoardingPassDisplay from '../components/BoardingPassDisplay';
import './CheckInPage.css';

/**
 * CheckInPage Component
 * 
 * Trang Check-in điện tử cho hành khách
 * - Nhập mã đặt chỗ (PNR) và tên hành khách
 * - Xác nhận cam kết an toàn bay
 * - Hiển thị thẻ lên máy bay (boarding pass) với QR code
 */
export default function CheckInPage() {
  const [searchParams] = useSearchParams();

  // State quản lý dữ liệu form
  const [pnrCode, setPnrCode] = useState('');
  const [passengerName, setPassengerName] = useState('');

  // Auto fill form fields from query params when page loads
  useEffect(() => {
    const pnr = searchParams.get('pnr');
    const name = searchParams.get('name');
    if (pnr) {
      setPnrCode(pnr.toUpperCase());
    }
    if (name) {
      setPassengerName(name);
    }
  }, [searchParams]);
  const [safetyCommitment, setSafetyCommitment] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);

  // State quản lý trạng thái xử lý
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [boardingPass, setBoardingPass] = useState(null);

  /**
   * Xử lý sự kiện Check-in
   */
  const handleCheckIn = async (e) => {
    e.preventDefault();
    setError('');
    setBoardingPass(null);

    // Validate input
    if (!pnrCode.trim()) {
      setError('Vui lòng nhập mã đặt chỗ (PNR)');
      return;
    }

    if (!passengerName.trim()) {
      setError('Vui lòng nhập tên hành khách');
      return;
    }

    if (!safetyCommitment) {
      setError('Vui lòng xác nhận cam kết an toàn bay');
      return;
    }

    if (!termsAgreed) {
      setError('Vui lòng đồng ý với các điều khoản và điều kiện');
      return;
    }

    // Gọi API Check-in
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/check-in', {
        pnr_code: pnrCode.toUpperCase(),
        passenger_name: passengerName.trim(),
      });

      if (response.data.status === 'success') {
        // Check-in thành công
        setBoardingPass(response.data.data);
        setPnrCode('');
        setPassengerName('');
        setSafetyCommitment(false);
        setTermsAgreed(false);
      }
    } catch (err) {
      // Xử lý lỗi
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Có lỗi xảy ra khi Check-in. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Xử lý sự kiện In lại thẻ lên máy bay
   */
  const handlePrintAgain = () => {
    window.print();
  };

  /**
   * Xử lý sự kiện Check-in thêm hành khách khác
   */
  const handleCheckInAnother = () => {
    setBoardingPass(null);
  };

  // Nếu đã Check-in thành công, hiển thị thẻ lên máy bay
  if (boardingPass) {
    return (
      <div className="check-in-page">
        <BoardingPassDisplay boardingPass={boardingPass} />
        
        <div className="boarding-pass-actions">
          <button 
            className="btn btn-primary"
            onClick={handlePrintAgain}
          >
            🖨️ In Thẻ Lên Máy Bay
          </button>
          <button 
            className="btn btn-secondary"
            onClick={handleCheckInAnother}
          >
            ➕ Check-in Hành Khách Khác
          </button>
        </div>

        <div className="success-message">
          <p>✅ <strong>Check-in thành công!</strong></p>
          <p>Thẻ lên máy bay đã được gửi đến email của bạn. Vui lòng chuẩn bị và đến cổng lên máy bay đúng giờ.</p>
        </div>
      </div>
    );
  }

  // Form Check-in
  return (
    <div className="check-in-page">
      <div className="check-in-container">
        <div className="check-in-header">
          <h1>✈️ Check-in Điện Tử SkyLink Airlines</h1>
          <p>Vui lòng nhập thông tin của bạn để Check-in 24 giờ trước khi cất cánh</p>
        </div>

        <form className="check-in-form" onSubmit={handleCheckIn}>
          {/* Thông báo lỗi */}
          {error && (
            <div className="error-message">
              <span className="error-icon">❌</span>
              <span>{error}</span>
            </div>
          )}

          {/* Mã đặt chỗ */}
          <div className="form-group">
            <label htmlFor="pnr-code" className="form-label">
              Mã Đặt Chỗ (PNR) *
            </label>
            <input
              id="pnr-code"
              type="text"
              className="form-input"
              placeholder="VD: ABC123"
              value={pnrCode}
              onChange={(e) => setPnrCode(e.target.value.toUpperCase())}
              maxLength="6"
              disabled={loading}
              required
            />
            <small className="form-help">Mã 6 ký tự được ghi trên vé hoặc email xác nhận</small>
          </div>

          {/* Tên hành khách */}
          <div className="form-group">
            <label htmlFor="passenger-name" className="form-label">
              Họ Và Tên *
            </label>
            <input
              id="passenger-name"
              type="text"
              className="form-input"
              placeholder="VD: Nguyễn Văn A"
              value={passengerName}
              onChange={(e) => setPassengerName(e.target.value)}
              disabled={loading}
              required
            />
            <small className="form-help">Tên phải trùng khớp với hộ chiếu hoặc giấy tờ tùy thân</small>
          </div>

          {/* Cam kết an toàn bay */}
          <div className="safety-section">
            <h3>🛡️ Cam Kết An Toàn Bay</h3>
            <p className="safety-intro">
              Theo quy định của hãng hàng không, vui lòng xác nhận rằng bạn không mang theo các vật phẩm sau:
            </p>
            <ul className="safety-list">
              <li>💣 Chất nổ, lửa pháo, hoặc vật phẩm dễ cháy</li>
              <li>🔋 Pin dự phòng có công suất cao (trên 100Wh)</li>
              <li>🪒 Lưỡi dao cạo, dao bỏ túi, hoặc dụng cụ sắc nhọn</li>
              <li>⚗️ Chất hóa học, axit, hay chất nguy hiểm khác</li>
              <li>🔫 Vũ khí bất kỳ loại nào</li>
            </ul>

            <div className="checkbox-group">
              <input
                id="safety-commitment"
                type="checkbox"
                className="checkbox-input"
                checked={safetyCommitment}
                onChange={(e) => setSafetyCommitment(e.target.checked)}
                disabled={loading}
                required
              />
              <label htmlFor="safety-commitment" className="checkbox-label">
                Tôi xác nhận rằng tôi không mang theo các vật phẩm cấm và cam kết tuân thủ các quy định an toàn bay
              </label>
            </div>
          </div>

          {/* Điều khoản và điều kiện */}
          <div className="terms-section">
            <div className="checkbox-group">
              <input
                id="terms-agreed"
                type="checkbox"
                className="checkbox-input"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                disabled={loading}
                required
              />
              <label htmlFor="terms-agreed" className="checkbox-label">
                Tôi đồng ý với <a href="#terms" className="link">các điều khoản và điều kiện</a> của SkyLink Airlines
              </label>
            </div>
          </div>

          {/* Nút Check-in */}
          <button
            type="submit"
            className="btn btn-check-in"
            disabled={loading}
          >
            {loading ? '⏳ Đang xử lý...' : '✅ Check-in Ngay'}
          </button>
        </form>

        {/* Thông tin hỗ trợ */}
        <div className="support-section">
          <h3>ℹ️ Thông Tin Hỗ Trợ</h3>
          <p>
            <strong>Giờ Check-in:</strong> 24 giờ trước khi cất cánh
          </p>
          <p>
            <strong>Yêu cầu:</strong> Đến sân bay ít nhất 2 giờ trước cho chuyến bay nước ngoài, 1 giờ cho chuyến bay nội địa
          </p>
          <p>
            <strong>Cần hỗ trợ?</strong> Liên hệ với chúng tôi qua <a href="mailto:support@skylink.com" className="link">support@skylink.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
