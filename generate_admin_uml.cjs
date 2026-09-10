const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'diagrams');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function drawStickFigure(x, y, label) {
  return `
  <g transform="translate(${x}, ${y})">
    <!-- Head -->
    <circle cx="20" cy="15" r="14" fill="none" stroke="#000000" stroke-width="2"/>
    <!-- Body -->
    <line x1="20" y1="29" x2="20" y2="65" stroke="#000000" stroke-width="2"/>
    <!-- Arms -->
    <line x1="20" y1="40" x2="-5" y2="52" stroke="#000000" stroke-width="2"/>
    <line x1="20" y1="40" x2="45" y2="52" stroke="#000000" stroke-width="2"/>
    <!-- Legs -->
    <line x1="20" y1="65" x2="-2" y2="95" stroke="#000000" stroke-width="2"/>
    <line x1="20" y1="65" x2="42" y2="95" stroke="#000000" stroke-width="2"/>
    <!-- Label -->
    <text x="20" y="115" text-anchor="middle" font-size="14" font-weight="bold" fill="#000000" font-family="Arial">${label}</text>
  </g>`;
}

function drawUseCase(cx, cy, rx, ry, label) {
  const lines = label.split('\n');
  let textSvg = '';
  if (lines.length === 1) {
    textSvg = `<text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="13" font-weight="bold" fill="#000000" font-family="Arial">${lines[0]}</text>`;
  } else {
    textSvg = `
      <text x="${cx}" y="${cy - 3}" text-anchor="middle" font-size="12" font-weight="bold" fill="#000000" font-family="Arial">${lines[0]}</text>
      <text x="${cx}" y="${cy + 13}" text-anchor="middle" font-size="12" font-weight="bold" fill="#000000" font-family="Arial">${lines[1]}</text>
    `;
  }

  return `
  <g>
    <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#FFFFC0" stroke="#000000" stroke-width="2"/>
    ${textSvg}
  </g>`;
}

function drawLine(x1, y1, x2, y2) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#000000" stroke-width="1.8"/>`;
}

function drawExtendLine(x1, y1, x2, y2) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return `
  <g>
    <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#000000" stroke-width="1.5" stroke-dasharray="6,4" marker-end="url(#openArrow)"/>
    <rect x="${mx - 32}" y="${my - 10}" width="64" height="18" fill="#FFFFFF" opacity="0.9"/>
    <text x="${mx}" y="${my + 3}" text-anchor="middle" font-size="11" fill="#000000" font-family="Arial">&lt;&lt;extend&gt;&gt;</text>
  </g>`;
}

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 820" width="900" height="820">
  <defs>
    <marker id="openArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5" fill="none" stroke="#000000" stroke-width="1.5"/>
    </marker>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="2" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.15"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="100%" height="100%" fill="#FFFFFF"/>

  <!-- System Boundary -->
  <rect x="220" y="30" width="640" height="760" fill="#FFFFFF" stroke="#000000" stroke-width="2" filter="url(#shadow)"/>
  
  <!-- Note Box top right -->
  <g transform="translate(640, 45)">
    <path d="M 0 0 L 170 0 L 195 25 L 195 75 L 0 75 Z" fill="#FFD1D1" stroke="#000000" stroke-width="1.5"/>
    <path d="M 170 0 L 170 25 L 195 25" fill="#FFB0B0" stroke="#000000" stroke-width="1.5"/>
    <text x="10" y="20" font-size="11" font-family="Arial" fill="#000000" font-weight="bold">CRUD: Thêm, sửa, xóa,</text>
    <text x="10" y="38" font-size="11" font-family="Arial" fill="#000000">xem thông tin chuyến bay,</text>
    <text x="10" y="56" font-size="11" font-family="Arial" fill="#000000">sân bay, vé, người dùng.</text>
  </g>

  <!-- Title -->
  <text x="440" y="65" text-anchor="middle" font-size="16" font-weight="bold" font-family="Arial" fill="#000000">Phân hệ Quản trị viên (Admin) - SkyLink Airline</text>

  <!-- Actor -->
  ${drawStickFigure(65, 360, "Quản trị viên")}

  <!-- Primary Use Cases (Middle Column) -->
  ${drawUseCase(420, 140, 110, 30, "Xem Dashboard\n& Thống kê")}
  ${drawUseCase(420, 260, 115, 30, "Quản lý Chuyến bay")}
  ${drawUseCase(420, 380, 110, 30, "Quản lý Sân bay")}
  ${drawUseCase(420, 500, 110, 30, "Quản lý Đặt vé")}
  ${drawUseCase(420, 620, 120, 30, "Xem danh sách\nngười dùng")}
  ${drawUseCase(420, 730, 115, 28, "Cập nhật Profile\nAdmin")}

  <!-- Extended Sub Use Cases (Right Column) -->
  ${drawUseCase(710, 140, 110, 26, "Xem biểu đồ\ndoanh thu")}
  
  ${drawUseCase(710, 220, 115, 26, "Thêm chuyến bay mới")}
  ${drawUseCase(710, 280, 125, 26, "Cập nhật lịch bay\n& giá vé gốc")}

  ${drawUseCase(710, 380, 115, 26, "Thêm / Sửa / Xóa\nsân bay")}

  ${drawUseCase(710, 500, 120, 26, "Xử lý yêu cầu\nĐổi / Hủy vé")}

  ${drawUseCase(710, 590, 115, 26, "Khóa / Mở khóa\ntài khoản")}
  ${drawUseCase(710, 650, 125, 26, "Phân quyền Role\n(Admin / Customer)")}

  <!-- Lines from Actor to Primary Use Cases -->
  ${drawLine(120, 400, 310, 140)}
  ${drawLine(120, 405, 305, 260)}
  ${drawLine(120, 410, 310, 380)}
  ${drawLine(120, 415, 310, 500)}
  ${drawLine(120, 420, 300, 620)}
  ${drawLine(120, 425, 305, 730)}

  <!-- Extend Relations (Dashed arrows from Extended to Base) -->
  ${drawExtendLine(600, 140, 530, 140)}
  
  ${drawExtendLine(595, 220, 520, 250)}
  ${drawExtendLine(585, 280, 535, 270)}

  ${drawExtendLine(595, 380, 530, 380)}

  ${drawExtendLine(590, 500, 530, 500)}

  ${drawExtendLine(595, 590, 525, 610)}
  ${drawExtendLine(585, 650, 525, 630)}

</svg>`;

const filePath = path.join(outputDir, 'hinh_2_2_use_case_quan_tri_vien_uml.svg');
fs.writeFileSync(filePath, svgContent);
console.log("Generated UML Use Case Diagram SVG successfully at:", filePath);
