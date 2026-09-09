<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thẻ Lên Máy Bay - SkyLink Airlines</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f1f5f9;
            margin: 0;
            padding: 24px 12px;
            color: #1e293b;
        }
        .container {
            max-width: 620px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
            border: 1px solid #e2e8f0;
        }
        .header {
            background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
            color: #ffffff;
            padding: 28px 24px;
            text-align: center;
        }
        .header h1 {
            margin: 0 0 6px 0;
            font-size: 24px;
            letter-spacing: 1px;
            font-weight: 700;
        }
        .header p {
            margin: 0;
            font-size: 14px;
            opacity: 0.9;
        }
        .flight-badge {
            display: inline-block;
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(4px);
            padding: 4px 14px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            margin-top: 10px;
        }
        .content {
            padding: 24px;
        }
        .greeting {
            font-size: 15px;
            line-height: 1.6;
            margin-bottom: 20px;
            color: #334155;
        }
        .flight-route-box {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 16px 20px;
            margin-bottom: 20px;
            text-align: center;
        }
        .route-item {
            flex: 1;
        }
        .route-code {
            font-size: 26px;
            font-weight: 800;
            color: #1e3a8a;
            letter-spacing: 1px;
        }
        .route-name {
            font-size: 12px;
            color: #64748b;
            margin-top: 4px;
        }
        .route-arrow {
            font-size: 22px;
            color: #94a3b8;
            padding: 0 10px;
        }
        .pass-details-table {
            width: 100%;
            border-collapse: collapse;
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            overflow: hidden;
            margin-bottom: 24px;
        }
        .pass-details-table td {
            padding: 12px 16px;
            border-bottom: 1px solid #f1f5f9;
            font-size: 14px;
        }
        .pass-details-table tr:last-child td {
            border-bottom: none;
        }
        .pass-label {
            color: #64748b;
            font-weight: 500;
            width: 40%;
        }
        .pass-val {
            color: #0f172a;
            font-weight: 700;
            text-align: right;
        }
        .highlight-seat {
            color: #2563eb;
            font-size: 18px;
        }
        .qr-section {
            text-align: center;
            padding: 20px;
            background: #f8fafc;
            border-radius: 12px;
            border: 2px dashed #cbd5e1;
            margin-bottom: 24px;
        }
        .qr-section img {
            width: 180px;
            height: 180px;
            border-radius: 8px;
            background: #ffffff;
            padding: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        .qr-caption {
            font-size: 13px;
            color: #64748b;
            margin-top: 10px;
            font-weight: 500;
        }
        .notice-card {
            background-color: #fffbeb;
            border-left: 4px solid #f59e0b;
            border-radius: 6px;
            padding: 14px 18px;
            margin-bottom: 16px;
            font-size: 13px;
            color: #92400e;
            line-height: 1.5;
        }
        .safety-card {
            background-color: #f0fdf4;
            border-left: 4px solid #22c55e;
            border-radius: 6px;
            padding: 14px 18px;
            font-size: 13px;
            color: #166534;
            line-height: 1.5;
        }
        .footer {
            background-color: #f8fafc;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
        }
        .footer a {
            color: #3b82f6;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>✈️ SkyLink Airlines</h1>
            <p>Thẻ Lên Máy Bay Điện Tử (Boarding Pass)</p>
            <div class="flight-badge">Chuyến Bay: {{ $flight_number }}</div>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="greeting">
                Xin chào <strong>{{ $passenger_name }}</strong>,<br>
                Quý khách đã hoàn tất thủ tục <strong>Check-in trực tuyến</strong> thành công. Dưới đây là thông tin thẻ lên máy bay của quý khách:
            </div>

            <!-- Route Box -->
            @if(!empty($departure_code) && !empty($arrival_code))
            <div class="flight-route-box">
                <div class="route-item">
                    <div class="route-code">{{ $departure_code }}</div>
                    <div class="route-name">{{ $departure_airport }}</div>
                </div>
                <div class="route-arrow">✈ ➔</div>
                <div class="route-item">
                    <div class="route-code">{{ $arrival_code }}</div>
                    <div class="route-name">{{ $arrival_airport }}</div>
                </div>
            </div>
            @endif

            <!-- Boarding Details -->
            <table class="pass-details-table">
                <tr>
                    <td class="pass-label">Hành khách:</td>
                    <td class="pass-val">{{ $passenger_name }}</td>
                </tr>
                <tr>
                    <td class="pass-label">Mã đặt chỗ (PNR):</td>
                    <td class="pass-val" style="letter-spacing: 1px; color: #1e3a8a;">{{ $pnr_code }}</td>
                </tr>
                <tr>
                    <td class="pass-label">Mã vé điện tử:</td>
                    <td class="pass-val">{{ $ticket_code }}</td>
                </tr>
                <tr>
                    <td class="pass-label">Giờ cất cánh:</td>
                    <td class="pass-val">{{ $departure_time }}</td>
                </tr>
                <tr>
                    <td class="pass-label">Số ghế:</td>
                    <td class="pass-val highlight-seat">{{ $seat_number }}</td>
                </tr>
                <tr>
                    <td class="pass-label">Cổng ra máy bay (Gate):</td>
                    <td class="pass-val">{{ $gate ?? 'TBA' }}</td>
                </tr>
            </table>

            <!-- QR Code Section -->
            <div class="qr-section">
                <img src="{{ $qr_code }}" alt="QR Code Boarding Pass">
                <div class="qr-caption">Quét mã QR này tại Cổng An Ninh & Cổng Ra Máy Bay</div>
            </div>

            <!-- Notice Cards -->
            <div class="notice-card">
                <strong>⏰ Lưu ý giờ bay:</strong> Quý khách vui lòng có mặt tại cửa ra máy bay (Boarding Gate) ít nhất <strong>40 phút</strong> trước giờ cất cánh. Cổng sẽ đóng trước giờ bay 15 phút.
            </div>

            <div class="safety-card">
                <strong>🛡️ Giấy tờ tùy thân:</strong> Vui lòng mang theo CMND/CCCD hoặc Hộ chiếu gốc còn hiệu lực để xuất trình cùng thẻ lên máy bay này.
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p style="margin: 0 0 6px 0;">&copy; {{ date('Y') }} SkyLink Airlines. Hotline hỗ trợ: 1900 8888</p>
            <p style="margin: 0;">Email gửi tự động từ hệ thống SkyLink Airlines. Hỗ trợ kỹ thuật: <a href="mailto:support@skylink.com">support@skylink.com</a></p>
        </div>
    </div>
</body>
</html>
