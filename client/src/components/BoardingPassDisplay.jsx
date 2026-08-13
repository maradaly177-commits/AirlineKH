import './BoardingPassDisplay.css';

/**
 * BoardingPassDisplay Component
 * 
 * Hiển thị thẻ lên máy bay (boarding pass) với:
 * - Thông tin hành khách
 * - Thông tin chuyến bay
 * - Mã QR để scan tại cổng lên máy bay
 */
export default function BoardingPassDisplay({ boardingPass }) {
  const {
    ticket_code,
    passenger_name,
    pnr_code,
    flight_number,
    departure_time,
    seat_number,
    qr_code_url,
    check_in_time,
  } = boardingPass;

  return (
    <div className="boarding-pass-wrapper">
      <div className="boarding-pass">
        {/* Header */}
        <div className="boarding-pass-header">
          <div className="airline-logo">✈️ SkyLink</div>
          <div className="header-text">
            <h2>THẺ LÊN MÁY BAY</h2>
            <p>BOARDING PASS</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="boarding-pass-content">
          {/* Left Side - Passenger Info */}
          <div className="pass-section left-section">
            <div className="pass-field">
              <label>HỌ VÀ TÊN / NAME</label>
              <div className="pass-value name">{passenger_name}</div>
            </div>

            <div className="field-row">
              <div className="pass-field">
                <label>MÃ VÉ / TICKET</label>
                <div className="pass-value">{ticket_code}</div>
              </div>
              <div className="pass-field">
                <label>MÃ ĐẶT CHỖ / PNR</label>
                <div className="pass-value">{pnr_code}</div>
              </div>
            </div>

            <div className="pass-field">
              <label>CHUYẾN BAY / FLIGHT</label>
              <div className="pass-value flight-number">{flight_number}</div>
            </div>

            <div className="field-row">
              <div className="pass-field">
                <label>THỜI GIAN / TIME</label>
                <div className="pass-value">{departure_time}</div>
              </div>
              <div className="pass-field">
                <label>GHẾ / SEAT</label>
                <div className="pass-value seat">{seat_number}</div>
              </div>
            </div>

            <div className="pass-field">
              <label>THỜI GIAN CHECK-IN / CHECK-IN TIME</label>
              <div className="pass-value small">{check_in_time}</div>
            </div>
          </div>

          {/* Right Side - QR Code */}
          <div className="pass-section right-section">
            <div className="qr-code-container">
              {qr_code_url && (
                <img 
                  src={qr_code_url} 
                  alt="QR Code" 
                  className="qr-code"
                />
              )}
              <p className="qr-text">Scan để lên máy bay</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="boarding-pass-footer">
          <div className="footer-text">
            <p>Vui lòng xuất trình thẻ này tại cổng lên máy bay • Please present this pass at boarding gate</p>
            <p>© 2026 SkyLink Airlines | www.skylink.com</p>
          </div>
        </div>
      </div>

      {/* Print Instructions */}
      <div className="print-instructions">
        <p>💡 <strong>Mẹo:</strong> Bạn có thể in thẻ này hoặc xuất trình từ điện thoại tại cổng lên máy bay.</p>
      </div>
    </div>
  );
}
