const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'diagrams');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log("Generating 11 SVG Diagram files for SkyLink SRS Report...");

// Helper for SVG wrapper
function wrapSvg(width, height, content) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" font-family="Arial, sans-serif">
  <defs>
    <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E40AF" />
      <stop offset="100%" stop-color="#3B82F6" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284C7" />
      <stop offset="100%" stop-color="#38BDF8" />
    </linearGradient>
    <linearGradient id="actorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#475569" />
      <stop offset="100%" stop-color="#64748B" />
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="2" dy="3" stdDeviation="3" flood-color="#0F172A" flood-opacity="0.15"/>
    </filter>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569"/>
    </marker>
    <marker id="arrowPrimary" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#1E40AF"/>
    </marker>
  </defs>
  <rect width="100%" height="100%" fill="#F8FAFC" rx="12"/>
  ${content}
</svg>`;
}

function drawActor(x, y, label) {
  return `
  <g transform="translate(${x}, ${y})">
    <circle cx="20" cy="15" r="12" fill="url(#actorGrad)" filter="url(#shadow)"/>
    <path d="M 20 27 C 5 27, 0 45, 0 55 L 40 55 C 40 45, 35 27, 20 27 Z" fill="url(#actorGrad)" filter="url(#shadow)"/>
    <text x="20" y="72" text-anchor="middle" font-size="13" font-weight="bold" fill="#1E293B">${label}</text>
  </g>`;
}

function drawUseCase(cx, cy, rx, ry, label) {
  return `
  <g>
    <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#FFFFFF" stroke="#1E40AF" stroke-width="2" filter="url(#shadow)"/>
    <text x="${cx}" y="${cy + 4}" text-anchor="middle" font-size="12" font-weight="600" fill="#0F172A">${label}</text>
  </g>`;
}

function drawActivityNode(x, y, w, h, label, isDecision = false, isStart = false, isEnd = false) {
  if (isStart) {
    return `<circle cx="${x}" cy="${y}" r="14" fill="#1E40AF" filter="url(#shadow)"/>`;
  }
  if (isEnd) {
    return `
    <circle cx="${x}" cy="${y}" r="15" fill="none" stroke="#1E40AF" stroke-width="3" filter="url(#shadow)"/>
    <circle cx="${x}" cy="${y}" r="9" fill="#1E40AF"/>`;
  }
  if (isDecision) {
    const p1 = `${x},${y - h/2}`;
    const p2 = `${x + w/2},${y}`;
    const p3 = `${x},${y + h/2}`;
    const p4 = `${x - w/2},${y}`;
    return `
    <g>
      <polygon points="${p1} ${p2} ${p3} ${p4}" fill="#FFFBEB" stroke="#D97706" stroke-width="2" filter="url(#shadow)"/>
      <text x="${x}" y="${y + 4}" text-anchor="middle" font-size="11" font-weight="bold" fill="#92400E">${label}</text>
    </g>`;
  }

  return `
  <g>
    <rect x="${x - w/2}" y="${y - h/2}" width="${w}" height="${h}" rx="8" fill="#FFFFFF" stroke="#2563EB" stroke-width="2" filter="url(#shadow)"/>
    <text x="${x}" y="${y + 4}" text-anchor="middle" font-size="12" font-weight="600" fill="#1E293B">${label}</text>
  </g>`;
}

function drawLine(x1, y1, x2, y2, label = "", dashed = false) {
  const dashAttr = dashed ? 'stroke-dasharray="5,5"' : '';
  let textSvg = '';
  if (label) {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2 - 6;
    textSvg = `<text x="${mx}" y="${my}" text-anchor="middle" font-size="11" font-weight="600" fill="#475569">${label}</text>`;
  }
  return `
  <g>
    <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#475569" stroke-width="1.8" ${dashAttr} marker-end="url(#arrow)"/>
    ${textSvg}
  </g>`;
}

// ----------------------------------------------------
// 1. HÌNH 2-1: Use Case Tổng Quan
// ----------------------------------------------------
const svg2_1 = wrapSvg(800, 520, `
  <text x="400" y="35" text-anchor="middle" font-size="18" font-weight="bold" fill="#1E40AF">Hình 2-1: Biểu đồ Use Case tổng quan Hệ thống SkyLink Airlines</text>

  <!-- System Boundary -->
  <rect x="180" y="60" width="440" height="430" rx="16" fill="#FFFFFF" stroke="#94A3B8" stroke-width="2" stroke-dasharray="6,6"/>
  <text x="400" y="85" text-anchor="middle" font-size="14" font-weight="bold" fill="#64748B">HỆ THỐNG SKYLINK AIRLINES & SKYAI</text>

  <!-- Actors -->
  ${drawActor(50, 140, "Khách vãng lai")}
  ${drawActor(50, 320, "Hành khách")}
  ${drawActor(690, 180, "Quản trị viên")}
  ${drawActor(690, 360, "SkyAI Agent")}

  <!-- Use Cases -->
  ${drawUseCase(400, 120, 100, 24, "UC001: Đăng nhập & Auth")}
  ${drawUseCase(400, 180, 110, 24, "UC006: Tìm kiếm chuyến bay")}
  ${drawUseCase(400, 240, 120, 24, "UC011: Chọn ghế & Đặt vé")}
  ${drawUseCase(400, 300, 110, 24, "UC007: Check-in trực tuyến")}
  ${drawUseCase(400, 360, 120, 24, "UC014: Đổi vé & Hủy chuyến")}
  ${drawUseCase(400, 420, 125, 24, "UC016: Chat Trợ lý AI SkyAI")}
  ${drawUseCase(400, 470, 110, 20, "UC008: Quản trị hệ thống")}

  <!-- Lines -->
  ${drawLine(90, 170, 290, 130)}
  ${drawLine(90, 180, 280, 180)}

  ${drawLine(90, 340, 290, 240)}
  ${drawLine(90, 350, 280, 300)}
  ${drawLine(90, 360, 280, 360)}
  ${drawLine(90, 370, 275, 420)}

  ${drawLine(690, 210, 520, 130)}
  ${drawLine(690, 220, 520, 470)}

  ${drawLine(690, 390, 525, 425)}
`);
fs.writeFileSync(path.join(outputDir, 'hinh_2_1_use_case_tong_quan.svg'), svg2_1);

// ----------------------------------------------------
// 2. HÌNH 2-2: Use Case Quản trị viên
// ----------------------------------------------------
const svg2_2 = wrapSvg(750, 480, `
  <text x="375" y="35" text-anchor="middle" font-size="18" font-weight="bold" fill="#1E40AF">Hình 2-2: Biểu đồ Use Case Quản trị viên (Admin)</text>
  <rect x="220" y="60" width="460" height="390" rx="16" fill="#FFFFFF" stroke="#94A3B8" stroke-width="2"/>
  <text x="450" y="85" text-anchor="middle" font-size="14" font-weight="bold" fill="#64748B">PHÂN HỆ ADMIN DASHBOARD</text>

  ${drawActor(70, 210, "Quản trị viên")}

  ${drawUseCase(450, 120, 130, 24, "UC008: Quản lý chuyến bay")}
  ${drawUseCase(450, 180, 130, 24, "UC012: Quản lý sân bay")}
  ${drawUseCase(450, 240, 130, 24, "UC009: Quản lý đặt vé")}
  ${drawUseCase(450, 300, 130, 24, "UC010: Quản lý người dùng")}
  ${drawUseCase(450, 360, 140, 24, "Xem thống kê Dashboard")}
  ${drawUseCase(450, 415, 120, 20, "UC005: Cập nhật Profile")}

  ${drawLine(120, 230, 310, 130)}
  ${drawLine(120, 235, 310, 180)}
  ${drawLine(120, 240, 310, 240)}
  ${drawLine(120, 245, 310, 300)}
  ${drawLine(120, 250, 305, 360)}
  ${drawLine(120, 255, 325, 415)}
`);
fs.writeFileSync(path.join(outputDir, 'hinh_2_2_use_case_quan_tri_vien.svg'), svg2_2);

// ----------------------------------------------------
// 3. HÌNH 2-3: Use Case Hành khách & SkyAI
// ----------------------------------------------------
const svg2_3 = wrapSvg(800, 500, `
  <text x="400" y="35" text-anchor="middle" font-size="18" font-weight="bold" fill="#1E40AF">Hình 2-3: Biểu đồ Use Case Hành khách & Trợ lý AI SkyAI</text>
  <rect x="200" y="60" width="420" height="410" rx="16" fill="#FFFFFF" stroke="#94A3B8" stroke-width="2"/>
  <text x="410" y="85" text-anchor="middle" font-size="14" font-weight="bold" fill="#64748B">PHÂN HỆ HÀNH KHÁCH & AI</text>

  ${drawActor(50, 220, "Hành khách")}
  ${drawActor(680, 220, "SkyAI Agent")}

  ${drawUseCase(410, 125, 130, 24, "UC006: Tìm kiếm chuyến bay")}
  ${drawUseCase(410, 185, 130, 24, "UC011: Chọn ghế & Đặt vé")}
  ${drawUseCase(410, 245, 130, 24, "UC015: Thanh toán & PNR")}
  ${drawUseCase(410, 305, 130, 24, "UC007: Check-in trực tuyến")}
  ${drawUseCase(410, 365, 130, 24, "UC014: Đổi vé & Hủy chuyến")}
  ${drawUseCase(410, 425, 140, 24, "UC016: Chat tự nhiên với AI")}

  ${drawLine(90, 240, 275, 130)}
  ${drawLine(90, 245, 275, 185)}
  ${drawLine(90, 250, 275, 245)}
  ${drawLine(90, 255, 275, 305)}
  ${drawLine(90, 260, 275, 365)}
  ${drawLine(90, 265, 265, 425)}

  ${drawLine(680, 240, 550, 425)}
  ${drawLine(680, 230, 540, 125)}
`);
fs.writeFileSync(path.join(outputDir, 'hinh_2_3_use_case_hanh_khach_ai.svg'), svg2_3);

// ----------------------------------------------------
// 4. HÌNH 2-4: Quy trình sử dụng phần mềm
// ----------------------------------------------------
const svg2_4 = wrapSvg(750, 520, `
  <text x="375" y="35" text-anchor="middle" font-size="18" font-weight="bold" fill="#1E40AF">Hình 2-4: Biểu đồ hoạt động Quy trình sử dụng phần mềm chung</text>
  
  ${drawActivityNode(375, 70, 0, 0, "", false, true, false)}
  ${drawActivityNode(375, 130, 180, 40, "Truy cập Website SkyLink")}
  ${drawActivityNode(375, 210, 180, 40, "Đăng ký / Đăng nhập", true)}
  ${drawActivityNode(375, 290, 220, 40, "Tìm chuyến bay & Chọn ghế")}
  ${drawActivityNode(375, 370, 200, 40, "Thanh toán & Nhận vé PNR")}
  ${drawActivityNode(375, 440, 180, 40, "Quản lý chuyến bay / AI Chat")}
  ${drawActivityNode(375, 495, 0, 0, "", false, false, true)}

  ${drawLine(375, 84, 375, 110)}
  ${drawLine(375, 150, 375, 190)}
  ${drawLine(375, 230, 375, 270, "Thành công")}
  ${drawLine(375, 310, 375, 350)}
  ${drawLine(375, 390, 375, 420)}
  ${drawLine(375, 460, 375, 480)}
`);
fs.writeFileSync(path.join(outputDir, 'hinh_2_4_quy_trinh_su_dung_phan_mem.svg'), svg2_4);

// ----------------------------------------------------
// 5. HÌNH 2-5: Quy trình quản lý chuyến bay
// ----------------------------------------------------
const svg2_5 = wrapSvg(750, 480, `
  <text x="375" y="35" text-anchor="middle" font-size="18" font-weight="bold" fill="#1E40AF">Hình 2-5: Biểu đồ hoạt động Quy trình quản lý chuyến bay (Admin)</text>
  
  ${drawActivityNode(375, 70, 0, 0, "", false, true, false)}
  ${drawActivityNode(375, 130, 200, 40, "Truy cập Quản lý chuyến bay")}
  ${drawActivityNode(375, 210, 220, 40, "Chọn Thêm / Sửa / Xóa chuyến")}
  ${drawActivityNode(375, 290, 180, 40, "Kiểm tra hợp lệ?", true)}
  ${drawActivityNode(375, 380, 220, 40, "Cập nhật Cơ sở dữ liệu")}
  ${drawActivityNode(375, 445, 0, 0, "", false, false, true)}

  ${drawLine(375, 84, 375, 110)}
  ${drawLine(375, 150, 375, 190)}
  ${drawLine(375, 230, 375, 270)}
  ${drawLine(375, 310, 375, 360, "Hợp lệ")}
  ${drawLine(285, 290, 200, 290)}
  ${drawLine(200, 290, 200, 210)}
  ${drawLine(200, 210, 265, 210, "Báo lỗi")}
  ${drawLine(375, 400, 375, 430)}
`);
fs.writeFileSync(path.join(outputDir, 'hinh_2_5_quy_trinh_quan_ly_chuyen_bay.svg'), svg2_5);

// ----------------------------------------------------
// 6. HÌNH 2-6: Quy trình đặt vé & thanh toán
// ----------------------------------------------------
const svg2_6 = wrapSvg(750, 520, `
  <text x="375" y="35" text-anchor="middle" font-size="18" font-weight="bold" fill="#1E40AF">Hình 2-6: Biểu đồ hoạt động Quy trình đặt vé & thanh toán</text>
  
  ${drawActivityNode(375, 70, 0, 0, "", false, true, false)}
  ${drawActivityNode(375, 130, 220, 40, "Nhập thông tin hành khách")}
  ${drawActivityNode(375, 210, 200, 40, "Chọn phương thức thanh toán")}
  ${drawActivityNode(375, 290, 180, 40, "Thanh toán thành công?", true)}
  ${drawActivityNode(375, 380, 220, 40, "Tạo mã PNR & Gửi e-ticket")}
  ${drawActivityNode(375, 450, 200, 40, "Hoàn tất đặt chỗ")}
  ${drawActivityNode(375, 500, 0, 0, "", false, false, true)}

  ${drawLine(375, 84, 375, 110)}
  ${drawLine(375, 150, 375, 190)}
  ${drawLine(375, 230, 375, 270)}
  ${drawLine(375, 310, 375, 360, "Có")}
  ${drawLine(465, 290, 560, 290)}
  ${drawLine(560, 290, 560, 210)}
  ${drawLine(560, 210, 475, 210, "Thử lại")}
  ${drawLine(375, 400, 375, 430)}
  ${drawLine(375, 470, 375, 485)}
`);
fs.writeFileSync(path.join(outputDir, 'hinh_2_6_quy_trinh_dat_ve_thanh_toan.svg'), svg2_6);

// ----------------------------------------------------
// 7. HÌNH 2-7: Quy trình chọn ghế & giữ chỗ
// ----------------------------------------------------
const svg2_7 = wrapSvg(750, 480, `
  <text x="375" y="35" text-anchor="middle" font-size="18" font-weight="bold" fill="#1E40AF">Hình 2-7: Biểu đồ hoạt động Quy trình chọn ghế & giữ chỗ</text>
  
  ${drawActivityNode(375, 70, 0, 0, "", false, true, false)}
  ${drawActivityNode(375, 130, 220, 40, "Tải sơ đồ ghế máy bay thời gian thực")}
  ${drawActivityNode(375, 210, 200, 40, "Hành khách click chọn ghế")}
  ${drawActivityNode(375, 290, 180, 40, "Ghế còn trống?", true)}
  ${drawActivityNode(375, 380, 240, 40, "Gọi API lock-seat giữ chỗ 10 phút")}
  ${drawActivityNode(375, 445, 0, 0, "", false, false, true)}

  ${drawLine(375, 84, 375, 110)}
  ${drawLine(375, 150, 375, 190)}
  ${drawLine(375, 230, 375, 270)}
  ${drawLine(375, 310, 375, 360, "Trống")}
  ${drawLine(285, 290, 180, 290)}
  ${drawLine(180, 290, 180, 210)}
  ${drawLine(180, 210, 275, 210, "Đã mua / Báo đỏ")}
  ${drawLine(375, 400, 375, 430)}
`);
fs.writeFileSync(path.join(outputDir, 'hinh_2_7_quy_trinh_chon_ghe_giu_cho.svg'), svg2_7);

// ----------------------------------------------------
// 8. HÌNH 2-8: Quy trình quản lý người dùng
// ----------------------------------------------------
const svg2_8 = wrapSvg(750, 460, `
  <text x="375" y="35" text-anchor="middle" font-size="18" font-weight="bold" fill="#1E40AF">Hình 2-8: Biểu đồ hoạt động Quy trình quản lý người dùng (Admin)</text>
  
  ${drawActivityNode(375, 70, 0, 0, "", false, true, false)}
  ${drawActivityNode(375, 130, 220, 40, "Xem danh sách tài khoản")}
  ${drawActivityNode(375, 210, 240, 40, "Phân quyền Role / Khóa tài khoản")}
  ${drawActivityNode(375, 290, 180, 40, "Xác nhận lưu?", true)}
  ${drawActivityNode(375, 375, 220, 40, "Lưu thay đổi vào CSDL")}
  ${drawActivityNode(375, 430, 0, 0, "", false, false, true)}

  ${drawLine(375, 84, 375, 110)}
  ${drawLine(375, 150, 375, 190)}
  ${drawLine(375, 230, 375, 270)}
  ${drawLine(375, 310, 375, 355, "Đồng ý")}
  ${drawLine(375, 395, 375, 415)}
`);
fs.writeFileSync(path.join(outputDir, 'hinh_2_8_quy_trinh_quan_ly_nguoi_dung.svg'), svg2_8);

// ----------------------------------------------------
// 9. HÌNH 2-9: Quy trình Check-in trực tuyến
// ----------------------------------------------------
const svg2_9 = wrapSvg(750, 480, `
  <text x="375" y="35" text-anchor="middle" font-size="18" font-weight="bold" fill="#1E40AF">Hình 2-9: Biểu đồ hoạt động Quy trình làm thủ tục Check-in trực tuyến</text>
  
  ${drawActivityNode(375, 70, 0, 0, "", false, true, false)}
  ${drawActivityNode(375, 130, 220, 40, "Nhập Mã PNR & Họ tên hành khách")}
  ${drawActivityNode(375, 210, 200, 40, "Xác thực PNR & Giờ bay?", true)}
  ${drawActivityNode(375, 300, 240, 40, "Chọn dịch vụ bổ sung & Xác nhận")}
  ${drawActivityNode(375, 380, 260, 40, "Xuất Thẻ lên máy bay (Boarding Pass QR)")}
  ${drawActivityNode(375, 445, 0, 0, "", false, false, true)}

  ${drawLine(375, 84, 375, 110)}
  ${drawLine(375, 150, 375, 190)}
  ${drawLine(375, 230, 375, 280, "Hợp lệ")}
  ${drawLine(285, 210, 180, 210)}
  ${drawLine(180, 210, 180, 130)}
  ${drawLine(180, 130, 265, 130, "Báo lỗi PNR")}
  ${drawLine(375, 320, 375, 360)}
  ${drawLine(375, 400, 375, 430)}
`);
fs.writeFileSync(path.join(outputDir, 'hinh_2_9_quy_trinh_checkin_truc_tuyen.svg'), svg2_9);

// ----------------------------------------------------
// 10. HÌNH 2-10: Quy trình tư vấn Trợ lý AI SkyAI
// ----------------------------------------------------
const svg2_10 = wrapSvg(780, 520, `
  <text x="390" y="35" text-anchor="middle" font-size="18" font-weight="bold" fill="#1E40AF">Hình 2-10: Biểu đồ hoạt động Quy trình tư vấn & hỗ trợ bởi Trợ lý AI SkyAI</text>
  
  ${drawActivityNode(390, 70, 0, 0, "", false, true, false)}
  ${drawActivityNode(390, 130, 240, 40, "Khách hàng gửi câu hỏi tự nhiên")}
  ${drawActivityNode(390, 210, 240, 40, "SkyAI phân tích Intent & Gọi Function Tools")}
  ${drawActivityNode(390, 290, 200, 40, "Cần truy vấn dữ liệu?", true)}
  ${drawActivityNode(390, 380, 260, 40, "Gọi API backend (`search_flight`/`check_seat`)")}
  ${drawActivityNode(390, 450, 280, 40, "Trả về câu trả lời tự nhiên + Thẻ chuyến bay UI")}
  ${drawActivityNode(390, 500, 0, 0, "", false, false, true)}

  ${drawLine(390, 84, 390, 110)}
  ${drawLine(390, 150, 390, 190)}
  ${drawLine(390, 230, 390, 270)}
  ${drawLine(390, 310, 390, 360, "Có")}
  ${drawLine(490, 290, 600, 290)}
  ${drawLine(600, 290, 600, 450)}
  ${drawLine(600, 450, 530, 450, "Trả lời trực tiếp")}
  ${drawLine(390, 400, 390, 430)}
  ${drawLine(390, 470, 390, 485)}
`);
fs.writeFileSync(path.join(outputDir, 'hinh_2_10_quy_trinh_tu_van_ai_skyai.svg'), svg2_10);

// ----------------------------------------------------
// 11. HÌNH 2-11: Quy trình Đổi vé / Hủy vé
// ----------------------------------------------------
const svg2_11 = wrapSvg(750, 480, `
  <text x="375" y="35" text-anchor="middle" font-size="18" font-weight="bold" fill="#1E40AF">Hình 2-11: Biểu đồ hoạt động Quy trình Đổi vé / Hủy vé của hành khách</text>
  
  ${drawActivityNode(375, 70, 0, 0, "", false, true, false)}
  ${drawActivityNode(375, 130, 220, 40, "Truy cập 'Chuyến bay của tôi'")}
  ${drawActivityNode(375, 210, 200, 40, "Chọn Đổi vé hoặc Hủy chuyến")}
  ${drawActivityNode(375, 290, 180, 40, "Đủ điều kiện?", true)}
  ${drawActivityNode(375, 380, 260, 40, "Tính chênh lệch phí & Cập nhật đơn vé")}
  ${drawActivityNode(375, 445, 0, 0, "", false, false, true)}

  ${drawLine(375, 84, 375, 110)}
  ${drawLine(375, 150, 375, 190)}
  ${drawLine(375, 230, 375, 270)}
  ${drawLine(375, 310, 375, 360, "Đồng ý")}
  ${drawLine(285, 290, 180, 290)}
  ${drawLine(180, 290, 180, 130)}
  ${drawLine(180, 130, 265, 130, "Không được hủy")}
  ${drawLine(375, 400, 375, 430)}
`);
fs.writeFileSync(path.join(outputDir, 'hinh_2_11_quy_trinh_doi_huy_ve.svg'), svg2_11);

console.log("✅ All 11 SVG Diagram files generated successfully in 'diagrams/' folder!");
