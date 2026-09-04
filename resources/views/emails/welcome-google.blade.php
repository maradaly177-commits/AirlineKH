<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chào mừng bạn đến với SkyLink Airline</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f4f5f7;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #1f2937;
        }
        .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #f4f5f7;
            padding: 30px 0;
        }
        .main-card {
            background-color: #ffffff;
            margin: 0 auto;
            width: 100%;
            max-width: 600px;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
        }
        .header {
            background: linear-gradient(135deg, #1e40af, #2563eb, #3b82f6);
            padding: 40px 30px;
            text-align: center;
            color: #ffffff;
        }
        .logo-text {
            font-size: 26px;
            font-weight: 800;
            letter-spacing: 2px;
            margin: 0;
            text-transform: uppercase;
        }
        .header-sub {
            font-size: 14px;
            opacity: 0.9;
            margin-top: 6px;
            letter-spacing: 0.5px;
        }
        .content {
            padding: 36px 32px;
        }
        .greeting {
            font-size: 20px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 12px;
        }
        .lead {
            font-size: 15px;
            line-height: 1.6;
            color: #4b5563;
            margin-bottom: 24px;
        }
        .info-box {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            padding: 20px;
            margin-bottom: 28px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px dashed #e2e8f0;
            font-size: 14px;
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .info-label {
            color: #64748b;
            font-weight: 500;
        }
        .info-value {
            color: #0f172a;
            font-weight: 600;
        }
        .btn-container {
            text-align: center;
            margin: 32px 0 20px;
        }
        .btn {
            background-color: #2563eb;
            color: #ffffff !important;
            font-weight: 600;
            font-size: 15px;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 12px;
            display: inline-block;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
        }
        .benefits {
            margin-top: 28px;
            border-top: 1px solid #f1f5f9;
            padding-top: 24px;
        }
        .benefit-title {
            font-size: 14px;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .benefit-item {
            font-size: 13.5px;
            color: #64748b;
            margin-bottom: 8px;
            line-height: 1.5;
        }
        .footer {
            background-color: #f8fafc;
            padding: 24px 30px;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
            border-top: 1px solid #f1f5f9;
        }
        .footer a {
            color: #64748b;
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="main-card">
            <!-- Header -->
            <div class="header">
                <h1 class="logo-text">✈️ SKYLINK AIRLINE</h1>
                <div class="header-sub">Trải nghiệm bay đẳng cấp & tiện nghi</div>
            </div>

            <!-- Content -->
            <div class="content">
                <div class="greeting">Xin chào {{ $user->name }},</div>
                <div class="lead">
                    Chúc mừng bạn đã liên kết thành công tài khoản Google với <strong>SkyLink Airline</strong>! Giờ đây bạn có thể đặt vé máy bay nhanh chóng, quản lý chuyến bay và nhận nhiều đặc quyền hội viên.
                </div>

                <!-- Thông tin tài khoản -->
                <div class="info-box">
                    <table width="100%" cellpadding="6" cellspacing="0">
                        <tr>
                            <td class="info-label">Email đăng ký:</td>
                            <td class="info-value" align="right">{{ $user->email }}</td>
                        </tr>
                        <tr>
                            <td class="info-label">Phương thức xác thực:</td>
                            <td class="info-value" align="right">Google OAuth 2.0</td>
                        </tr>
                        <tr>
                            <td class="info-label">Hạng hội viên:</td>
                            <td class="info-value" align="right" style="color: #2563eb; text-transform: uppercase;">{{ $user->membership_tier ?? 'Standard' }}</td>
                        </tr>
                        <tr>
                            <td class="info-label">Thời gian kích hoạt:</td>
                            <td class="info-value" align="right">{{ now()->format('H:i - d/m/Y') }}</td>
                        </tr>
                    </table>
                </div>

                <!-- Nút CTA -->
                <div class="btn-container">
                    <a href="{{ $homeUrl }}" class="btn">Khám phá chuyến bay ngay</a>
                </div>

                <!-- Quyền lợi -->
                <div class="benefits">
                    <div class="benefit-title">Đặc quyền dành riêng cho bạn:</div>
                    <div class="benefit-item">✨ <strong>SkyAI Trợ lý ảo</strong>: Tìm chuyến bay, kiểm tra ghế và chính sách vé 24/7.</div>
                    <div class="benefit-item">🎫 <strong>Quản lý vé dễ dàng</strong>: Xem thẻ lên máy bay, đổi vé, làm thủ tục Check-in Online.</div>
                    <div class="benefit-item">🎁 <strong>Ưu đãi thành viên</strong>: Tích điểm SkyClub và hưởng khuyến mãi độc quyền.</div>
                </div>
            </div>

            <!-- Footer -->
            <div class="footer">
                <p>Email này được gửi tự động khi bạn đăng nhập hoặc đăng ký bằng tài khoản Google tại SkyLink Airline.</p>
                <p>© {{ date('Y') }} SkyLink Airline. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
