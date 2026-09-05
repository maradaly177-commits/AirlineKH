const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableCell,
  TableRow,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType,
  Header,
  Footer,
  PageNumber,
  TableOfContents,
} = require('docx');

console.log("Generating SRS Document based on SRS.pdf template for AI Assistant & Flight Booking System...");

const PRIMARY_COLOR = "1E40AF"; // Navy Blue
const SECONDARY_COLOR = "0284C7"; // Sky Blue
const ACCENT_COLOR = "F8FAFC"; // Light Gray Zebra
const BORDER_COLOR = "CBD5E1"; // Border Gray

function createHeading1(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 180 },
    run: { font: "Times New Roman", size: 32, bold: true, color: PRIMARY_COLOR },
  });
}

function createHeading2(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    run: { font: "Times New Roman", size: 28, bold: true, color: SECONDARY_COLOR },
  });
}

function createHeading3(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 180, after: 90 },
    run: { font: "Times New Roman", size: 26, bold: true, italic: true, color: "334155" },
  });
}

function createParagraph(text, bold = false, italic = false) {
  return new Paragraph({
    spacing: { after: 120, line: 276 },
    children: [
      new TextRun({ text: text, font: "Times New Roman", size: 26, bold: bold, italic: italic }),
    ],
  });
}

function createBullet(boldPrefix = "", normalText = "") {
  const children = [];
  if (boldPrefix) {
    children.push(new TextRun({ text: boldPrefix, font: "Times New Roman", size: 26, bold: true }));
  }
  if (normalText) {
    children.push(new TextRun({ text: normalText, font: "Times New Roman", size: 26 }));
  }

  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 60, line: 276 },
    children: children,
  });
}

const cellBorder = {
  top: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
  left: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
  right: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
};

function createUseCaseTablePdfStyle(ucCode, ucName, actor, desc, trigger, preCond, mainSteps, altSteps, postCond) {
  const rows = [
    new TableRow({
      children: [
        new TableCell({
          width: { size: 25, type: WidthType.PERCENTAGE },
          shading: { fill: PRIMARY_COLOR, type: ShadingType.CLEAR },
          borders: cellBorder,
          children: [new Paragraph({ children: [new TextRun({ text: "Mã Use case", bold: true, color: "FFFFFF", font: "Times New Roman", size: 24 })] })],
        }),
        new TableCell({
          width: { size: 25, type: WidthType.PERCENTAGE },
          borders: cellBorder,
          children: [new Paragraph({ children: [new TextRun({ text: ucCode, bold: true, font: "Times New Roman", size: 24 })] })],
        }),
        new TableCell({
          width: { size: 25, type: WidthType.PERCENTAGE },
          shading: { fill: PRIMARY_COLOR, type: ShadingType.CLEAR },
          borders: cellBorder,
          children: [new Paragraph({ children: [new TextRun({ text: "Tên Use case", bold: true, color: "FFFFFF", font: "Times New Roman", size: 24 })] })],
        }),
        new TableCell({
          width: { size: 25, type: WidthType.PERCENTAGE },
          borders: cellBorder,
          children: [new Paragraph({ children: [new TextRun({ text: ucName, bold: true, font: "Times New Roman", size: 24 })] })],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          width: { size: 25, type: WidthType.PERCENTAGE },
          shading: { fill: ACCENT_COLOR, type: ShadingType.CLEAR },
          borders: cellBorder,
          children: [new Paragraph({ children: [new TextRun({ text: "Tác nhân", bold: true, font: "Times New Roman", size: 24 })] })],
        }),
        new TableCell({
          columnSpan: 3,
          width: { size: 75, type: WidthType.PERCENTAGE },
          borders: cellBorder,
          children: [new Paragraph({ children: [new TextRun({ text: actor, font: "Times New Roman", size: 24 })] })],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          width: { size: 25, type: WidthType.PERCENTAGE },
          shading: { fill: ACCENT_COLOR, type: ShadingType.CLEAR },
          borders: cellBorder,
          children: [new Paragraph({ children: [new TextRun({ text: "Mô tả", bold: true, font: "Times New Roman", size: 24 })] })],
        }),
        new TableCell({
          columnSpan: 3,
          width: { size: 75, type: WidthType.PERCENTAGE },
          borders: cellBorder,
          children: [new Paragraph({ children: [new TextRun({ text: desc, font: "Times New Roman", size: 24 })] })],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          width: { size: 25, type: WidthType.PERCENTAGE },
          shading: { fill: ACCENT_COLOR, type: ShadingType.CLEAR },
          borders: cellBorder,
          children: [new Paragraph({ children: [new TextRun({ text: "Sự kiện kích hoạt", bold: true, font: "Times New Roman", size: 24 })] })],
        }),
        new TableCell({
          columnSpan: 3,
          width: { size: 75, type: WidthType.PERCENTAGE },
          borders: cellBorder,
          children: [new Paragraph({ children: [new TextRun({ text: trigger, font: "Times New Roman", size: 24 })] })],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          width: { size: 25, type: WidthType.PERCENTAGE },
          shading: { fill: ACCENT_COLOR, type: ShadingType.CLEAR },
          borders: cellBorder,
          children: [new Paragraph({ children: [new TextRun({ text: "Tiền điều kiện", bold: true, font: "Times New Roman", size: 24 })] })],
        }),
        new TableCell({
          columnSpan: 3,
          width: { size: 75, type: WidthType.PERCENTAGE },
          borders: cellBorder,
          children: [new Paragraph({ children: [new TextRun({ text: preCond, font: "Times New Roman", size: 24 })] })],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          columnSpan: 4,
          shading: { fill: SECONDARY_COLOR, type: ShadingType.CLEAR },
          borders: cellBorder,
          children: [new Paragraph({ children: [new TextRun({ text: "Luồng sự kiện chính (Thành công)", bold: true, color: "FFFFFF", font: "Times New Roman", size: 24 })] })],
        }),
      ],
    }),
    ...mainSteps.map((step, idx) => new TableRow({
      children: [
        new TableCell({
          width: { size: 10, type: WidthType.PERCENTAGE },
          borders: cellBorder,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${idx + 1}`, font: "Times New Roman", size: 24 })] })],
        }),
        new TableCell({
          columnSpan: 3,
          width: { size: 90, type: WidthType.PERCENTAGE },
          borders: cellBorder,
          children: [new Paragraph({ children: [new TextRun({ text: step, font: "Times New Roman", size: 24 })] })],
        }),
      ],
    })),
    new TableRow({
      children: [
        new TableCell({
          columnSpan: 4,
          shading: { fill: "F1F5F9", type: ShadingType.CLEAR },
          borders: cellBorder,
          children: [new Paragraph({ children: [new TextRun({ text: "Luồng sự kiện thay thế / Ngoại lệ", bold: true, color: "334155", font: "Times New Roman", size: 24 })] })],
        }),
      ],
    }),
    ...altSteps.map((step) => new TableRow({
      children: [
        new TableCell({
          columnSpan: 4,
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: cellBorder,
          children: [new Paragraph({ children: [new TextRun({ text: step, font: "Times New Roman", size: 24 })] })],
        }),
      ],
    })),
    new TableRow({
      children: [
        new TableCell({
          width: { size: 25, type: WidthType.PERCENTAGE },
          shading: { fill: ACCENT_COLOR, type: ShadingType.CLEAR },
          borders: cellBorder,
          children: [new Paragraph({ children: [new TextRun({ text: "Hậu điều kiện", bold: true, font: "Times New Roman", size: 24 })] })],
        }),
        new TableCell({
          columnSpan: 3,
          width: { size: 75, type: WidthType.PERCENTAGE },
          borders: cellBorder,
          children: [new Paragraph({ children: [new TextRun({ text: postCond, font: "Times New Roman", size: 24 })] })],
        }),
      ],
    }),
  ];

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows,
  });
}

function createDataTable(fields) {
  const headerRow = new TableRow({
    children: [
      new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, shading: { fill: PRIMARY_COLOR }, borders: cellBorder, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "STT", bold: true, color: "FFFFFF", font: "Times New Roman", size: 22 })] })] }),
      new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, shading: { fill: PRIMARY_COLOR }, borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: "Trường dữ liệu", bold: true, color: "FFFFFF", font: "Times New Roman", size: 22 })] })] }),
      new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, shading: { fill: PRIMARY_COLOR }, borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: "Mô tả", bold: true, color: "FFFFFF", font: "Times New Roman", size: 22 })] })] }),
      new TableCell({ width: { size: 12, type: WidthType.PERCENTAGE }, shading: { fill: PRIMARY_COLOR }, borders: cellBorder, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Bắt buộc?", bold: true, color: "FFFFFF", font: "Times New Roman", size: 22 })] })] }),
      new TableCell({ width: { size: 18, type: WidthType.PERCENTAGE }, shading: { fill: PRIMARY_COLOR }, borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: "Điều kiện hợp lệ", bold: true, color: "FFFFFF", font: "Times New Roman", size: 22 })] })] }),
      new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, shading: { fill: PRIMARY_COLOR }, borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: "Ví dụ", bold: true, color: "FFFFFF", font: "Times New Roman", size: 22 })] })] }),
    ],
  });

  const dataRows = fields.map((f, idx) => new TableRow({
    children: [
      new TableCell({ borders: cellBorder, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${idx + 1}`, font: "Times New Roman", size: 22 })] })] }),
      new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: f.name, font: "Times New Roman", size: 22 })] })] }),
      new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: f.desc, font: "Times New Roman", size: 22 })] })] }),
      new TableCell({ borders: cellBorder, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: f.req, font: "Times New Roman", size: 22 })] })] }),
      new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: f.valid, font: "Times New Roman", size: 22 })] })] }),
      new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: f.example, font: "Times New Roman", size: 22 })] })] }),
    ],
  }));

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...dataRows],
  });
}

const doc = new Document({
  sections: [
    {
      properties: {},
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({ text: "SRS: XÂY DỰNG HỆ THỐNG TRỢ LÝ AI HỖ TRỢ KHÁCH HÀNG CHO NỀN TẢNG ĐẶT VÉ MÁY BAY", font: "Times New Roman", size: 18, color: "64748B", italic: true }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: "Trang ", font: "Times New Roman", size: 20, color: "64748B" }),
                new TextRun({ children: [PageNumber.CURRENT], font: "Times New Roman", size: 20, color: "64748B" }),
                new TextRun({ text: " / ", font: "Times New Roman", size: 20, color: "64748B" }),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], font: "Times New Roman", size: 20, color: "64748B" }),
              ],
            }),
          ],
        }),
      },
      children: [
        // COVER PAGE
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 720, after: 180 }, children: [new TextRun({ text: "TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM (SRS)", bold: true, size: 34, color: PRIMARY_COLOR, font: "Times New Roman" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 360 }, children: [new TextRun({ text: "XÂY DỰNG HỆ THỐNG TRỢ LÝ AI HỖ TRỢ KHÁCH HÀNG\nCHO NỀN TẢNG ĐẶT VÉ MÁY BAY (SKYLINK AIRLINES)", bold: true, size: 26, color: SECONDARY_COLOR, font: "Times New Roman" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 1080 }, children: [new TextRun({ text: "Đồ án / Báo cáo Nghiên cứu Kỹ thuật Phần mềm\nPhiên bản 1.0.0", italic: true, size: 24, color: "475569", font: "Times New Roman" })] }),

        // MỤC LỤC
        createHeading1("Mục lục"),
        new TableOfContents("Mục lục", {
          hyperlink: true,
          headingStyleRange: "1-3",
        }),

        createHeading1("Danh mục hình ảnh, bảng biểu"),
        createBullet("Hình 2-1: ", "Biểu đồ Use Case tổng quan Hệ thống Trợ lý AI & Đặt vé máy bay SkyLink"),
        createBullet("Hình 2-2: ", "Biểu đồ Use Case phân rã Quản trị viên (Admin)"),
        createBullet("Hình 2-3: ", "Biểu đồ Use Case phân rã Hành khách & Trợ lý AI SkyAI"),
        createBullet("Hình 2-4 đến 2-11: ", "Sơ đồ các quy trình nghiệp vụ hệ thống"),
        createBullet("Bảng 1-1: ", "Từ điển thuật ngữ hệ thống"),
        createBullet("Bảng 2-1 đến 2-33: ", "Danh mục bảng đặc tả chi tiết 16 Use Case và Dữ liệu đầu vào thực tế dựa trên codebase dự án AirlineKH"),

        // CHƯƠNG 1
        createHeading1("1 Giới thiệu"),

        createHeading2("1.1 Mục đích"),
        createParagraph("Mục đích của tài liệu Đặc tả Yêu cầu Phần mềm (SRS) này là cung cấp mô tả chi tiết, chính xác về các yêu cầu chức năng và phi chức năng cho đề tài 'Xây dựng hệ thống Trợ lý AI hỗ trợ khách hàng cho nền tảng đặt vé máy bay SkyLink Airlines' (Mã nguồn dự án AirlineKH). Tài liệu phục vụ cho công tác phát triển, kiểm thử, nghiệm thu đồ án và phát triển hệ thống trong thực tế."),

        createHeading2("1.2 Phạm vi"),
        createParagraph("Dự án tập trung xây dựng giải pháp đặt vé máy bay trực tuyến toàn diện tích hợp Trợ lý AI thông minh (SkyAI), bao gồm các phân hệ:"),
        createBullet("Phân hệ Frontend Hành khách (React.js + Tailwind CSS): ", "Cung cấp giao diện đặt vé máy bay, chọn vị trí ghế trực quan, làm thủ tục Check-in trực tuyến, quản lý chuyến bay cá nhân (Đổi chuyến/Hủy vé) và giao diện Chatbot AI tương tác thông minh."),
        createBullet("Phân hệ Backend RESTful API (Laravel 11 + MySQL): ", "Quản lý dữ liệu chuyến bay, lịch trình cất hạ cánh, danh mục sân bay, thông tin hành khách, xử lý giữ chỗ/thanh toán và hạ tầng kết nối với Gemini AI API."),
        createBullet("Phân hệ Trợ lý AI Hỗ trợ Khách hàng (SkyAI / Gemini API Integration): ", "Tích hợp mô hình AI ngôn ngữ lớn (LLM) hỗ trợ tự động tìm kiếm vé, giải đáp quy định hành lý, kiểm tra sơ đồ ghế trống và tra cứu đơn đặt chỗ 24/7."),

        createHeading2("1.3 Từ điển thuật ngữ"),
        createBullet("SRS (Software Requirements Specification): ", "Tài liệu đặc tả yêu cầu phần mềm chuẩn IEEE."),
        createBullet("SkyAI: ", "Trợ lý trí tuệ nhân tạo hỗ trợ khách hàng tự động trong nền tảng đặt vé máy bay."),
        createBullet("PNR (Passenger Name Record): ", "Mã đặt chỗ duy nhất gồm 6 ký tự đại diện cho thông tin đơn đặt vé."),
        createBullet("Function Calling / AI Tools: ", "Cơ chế cho phép AI tự động kích hoạt các hàm truy vấn dữ liệu từ Backend Laravel."),
        createBullet("JWT / Sanctum: ", "Phương thức xác thực API an toàn bằng chuỗi token."),

        createHeading2("1.4 Tài liệu tham khảo"),
        createBullet("1. ", "Chuẩn đặc tả tài liệu IEEE Std 830-1998 cho tài liệu SRS."),
        createBullet("2. ", "Mã nguồn ứng dụng AirlineKH (Laravel Backend & React Client)."),

        createHeading2("1.5 Tổng quát"),
        createParagraph("Tài liệu được chia làm 3 phần chính: Phần 1 Giới thiệu; Phần 2 Đặc tả yêu cầu chức năng, các tác nhân, biểu đồ use case, quy trình nghiệp vụ và bảng chi tiết 16 Use Case; Phần 3 Đặc tả yêu cầu phi chức năng về hiệu năng, an toàn và bảo mật."),

        // CHƯƠNG 2
        createHeading1("2 Các yêu cầu chức năng"),

        createHeading2("2.1 Các tác nhân"),
        createParagraph("Hệ thống bao gồm các tác nhân chính sau:"),
        createBullet("Khách vãng lai (Guest): ", "Người dùng chưa đăng nhập, có thể tra cứu thông tin chuyến bay, bài viết tin tức, câu hỏi thường gặp (FAQs) và chat tư vấn với Trợ lý AI SkyAI."),
        createBullet("Hành khách / Thành viên (Customer / Passenger): ", "Người dùng đã đăng ký tài khoản, có quyền thực hiện Đặt vé máy bay, chọn sơ đồ ghế trực quan, thanh toán trực tuyến, làm thủ tục Check-in trực tuyến, quản lý chuyến bay cá nhân (Đổi vé / Hủy vé) và quản lý điểm thưởng SkyClub."),
        createBullet("Quản trị viên (Admin): ", "Người dùng quản trị hệ thống, có quyền xem báo cáo thống kê Dashboard, quản lý danh mục chuyến bay, quản lý sân bay, quản lý danh sách đơn đặt vé và quản lý tài khoản người dùng."),
        createBullet("Trợ lý AI (SkyAI Agent): ", "Tác nhân thông minh đóng vai trò hỗ trợ viên 24/7, tự động xử lý ngôn ngữ tự nhiên và thực thi các công cụ API để phục vụ khách hàng."),

        createHeading2("2.2 Các chức năng của hệ thống"),
        createBullet("1. Nhóm Xác thực & Tài khoản: ", "Đăng ký, Đăng nhập, Đăng xuất, Cập nhật thông tin cá nhân, Đổi mật khẩu."),
        createBullet("2. Nhóm Tìm kiếm & Đặt vé: ", "Tìm kiếm chuyến bay theo ngày/tuyến, xem sơ đồ ghế máy bay trực quan, khóa ghế tạm thời, thanh toán và sinh mã PNR."),
        createBullet("3. Nhóm Quản lý chuyến bay cá nhân: ", "Check-in trực tuyến nhận Thẻ lên máy bay (Boarding Pass), Yêu cầu Đổi chuyến bay (Reschedule), Yêu cầu Hủy vé (Cancel)."),
        createBullet("4. Nhóm Trợ lý AI Hỗ trợ Khách hàng (SkyAI): ", "Chat trực tiếp/streaming, tự động tìm kiếm chuyến bay thông minh, kiểm tra sơ đồ ghế trống, giải đáp chính sách hành lý."),
        createBullet("5. Nhóm Quản trị hệ thống (Admin): ", "Dashboard thống kê doanh thu, Quản lý chuyến bay, Quản lý sân bay, Quản lý đơn đặt vé, Quản lý người dùng."),

        createHeading2("2.3 Biểu đồ use case tổng quan"),
        createParagraph("Hình 2-1: Biểu đồ Use Case tổng quan thể hiện sự tương tác giữa Khách hàng, Quản trị viên và Trợ lý AI SkyAI với hệ thống."),

        createHeading2("2.4 Biểu đồ use case phân rã"),
        createHeading3("2.4.1 Phân rã use case “Quản trị viên”"),
        createParagraph("Hình 2-2: Phân rã nhóm chức năng quản trị: Dashboard, Quản lý chuyến bay, Quản lý sân bay, Quản lý đặt vé, Quản lý tài khoản người dùng."),

        createHeading3("2.4.2 Phân rã use case “Hành khách & Trợ lý AI”"),
        createParagraph("Hình 2-3: Phân rã nhóm chức năng Hành khách: Tìm kiếm chuyến bay, Chọn ghế, Thanh toán, Check-in, Quản lý vé (Đổi/Hủy vé) và Tương tác SkyAI."),

        createHeading2("2.5 Quy trình nghiệp vụ"),
        createHeading3("2.5.1 Quy trình sử dụng phần mềm"),
        createParagraph("Hình 2-4: Khách đăng ký/đăng nhập -> Tìm kiếm chuyến bay -> Chọn ghế -> Thanh toán -> Nhận mã PNR vé."),

        createHeading3("2.5.2 Quy trình quản lý chuyến bay"),
        createParagraph("Hình 2-5: Admin khởi tạo/chỉnh sửa thông tin chuyến bay, lịch bay, giá vé gốc -> Cập nhật CSDL."),

        createHeading3("2.5.3 Quy trình quản lý đặt vé & thanh toán"),
        createParagraph("Hình 2-6: Khởi tạo đơn hàng -> Giữ chỗ -> Thanh toán qua cổng thanh toán -> Cấp mã PNR xác nhận."),

        createHeading3("2.5.4 Quy trình quản lý sơ đồ ghế"),
        createParagraph("Hình 2-7: Tải danh sách ghế theo tàu bay -> Khách chọn vị trí -> Gọi API khóa ghế tránh trùng lặp."),

        createHeading3("2.5.5 Quy trình quản lý hành khách & người dùng"),
        createParagraph("Hình 2-8: Admin xem danh sách người dùng, phân quyền Role Admin/Customer hoặc mở/khóa tài khoản."),

        createHeading3("2.5.6 Quy trình làm thủ tục Check-in trực tuyến"),
        createParagraph("Hình 2-9: Hành khách nhập mã PNR -> Xác thực đơn vé -> Tạo thẻ Boarding Pass điện tử kèm mã QR."),

        createHeading3("2.5.7 Quy trình tư vấn & hỗ trợ bởi Trợ lý AI (SkyAI)"),
        createParagraph("Hình 2-10: Khách hàng chat với SkyAI -> SkyAI kích hoạt Function Tools (`search_flight`, `check_seat`) -> Trả về câu trả lời và thẻ chuyến bay."),

        createHeading3("2.5.8 Quy trình sử dụng phần mềm của hành khách (Đổi vé / Hủy vé)"),
        createParagraph("Hình 2-11: Hành khách chọn đơn vé -> Yêu cầu Đổi chuyến bay hoặc Hủy vé -> Hệ thống xác nhận và xử lý chênh lệch phí."),

        createHeading2("2.6 Đặc tả các usecase"),

        // UC-001
        createHeading3("2.6.1 Đăng nhập"),
        createUseCaseTablePdfStyle(
          "UC001", "Đăng nhập", "Khách, Hành khách, Quản trị viên",
          "Xác thực tài khoản người dùng vào hệ thống bằng Email và Mật khẩu thông qua API /api/auth/login.",
          "Nhấp vào nút 'Đăng nhập' trên thanh tiêu đề website.",
          "Tác nhân chưa xác thực phiên làm việc.",
          ["1. Người dùng chọn chức năng Đăng nhập.", "2. Hệ thống hiển thị giao diện đăng nhập.", "3. Nhập Email và Mật khẩu.", "4. Nhấn 'Đăng nhập'.", "5. Hệ thống xác thực thông tin và kiểm tra mật khẩu mã hóa bcrypt.", "6. Trả về Token JWT Sanctum và đăng nhập thành công."],
          ["5a. Thông báo lỗi nếu thiếu trường bắt buộc.", "6a. Thông báo lỗi 'Email hoặc mật khẩu chưa chính xác' nếu không tìm thấy thông tin."],
          "Tài khoản được đăng nhập, nhận JWT Access Token và hiển thị menu chức năng tương ứng."
        ),
        createParagraph("* Dữ liệu đầu vào chức năng 'Đăng nhập':"),
        createDataTable([
          { name: "Email", desc: "Địa chỉ email tài khoản", req: "Có", valid: "Đúng định dạng email", example: "user@skylink.com" },
          { name: "Mật khẩu", desc: "Mật khẩu bảo vệ", req: "Có", valid: "Tối thiểu 6 ký tự", example: "******" },
        ]),

        // UC-002
        createHeading3("2.6.2 Thay đổi mật khẩu"),
        createUseCaseTablePdfStyle(
          "UC002", "Thay đổi mật khẩu", "Hành khách, Quản trị viên",
          "Thay đổi mật khẩu cá nhân để tăng cường bảo mật tài khoản.",
          "Chọn item 'Đổi mật khẩu' trong menu Profile.",
          "Tác nhân đã đăng nhập thành công vào hệ thống.",
          ["1. Người dùng chọn 'Thay đổi mật khẩu'.", "2. Hệ thống hiển thị form đổi mật khẩu.", "3. Nhập Mật khẩu hiện tại, Mật khẩu mới và Xác nhận mật khẩu mới.", "4. Nhấn 'Lưu thay đổi'.", "5. Hệ thống xác nhận và cập nhật mật khẩu mới."],
          ["5a. Thông báo lỗi nếu mật khẩu hiện tại không đúng hoặc mật khẩu mới không trùng khớp."],
          "Mật khẩu mới được mã hóa bcrypt và lưu vào cơ sở dữ liệu."
        ),

        // UC-003
        createHeading3("2.6.3 Đăng xuất & Quản lý phiên"),
        createUseCaseTablePdfStyle(
          "UC003", "Đăng xuất hệ thống", "Hành khách, Quản trị viên",
          "Hủy phiên làm việc và thu hồi Token xác thực khỏi hệ thống.",
          "Click nút 'Đăng xuất' trên Header.",
          "Tác nhân đang trong trạng thái đăng nhập.",
          ["1. Người dùng nhấp 'Đăng xuất'.", "2. Frontend gửi request POST /api/auth/logout.", "3. Hệ thống thu hồi Token và xóa Token khỏi LocalStorage.", "4. Chuyển hướng người dùng về trang chủ."],
          ["2a. Mất kết nối mạng: Frontend tự giải phóng Token cục bộ."],
          "Phiên làm việc kết thúc thành công."
        ),

        // UC-004
        createHeading3("2.6.4 Đăng ký"),
        createUseCaseTablePdfStyle(
          "UC004", "Đăng ký tài khoản", "Khách vãng lai",
          "Đăng ký tài khoản thành viên mới để đặt vé máy bay.",
          "Click nút 'Đăng ký' trên trang chủ.",
          "Chưa có tài khoản đăng nhập.",
          ["1. Chọn chức năng Đăng ký.", "2. Nhập Họ tên, Email, Số điện thoại và Mật khẩu.", "3. Nhấn 'Đăng ký'.", "4. Hệ thống kiểm tra dữ liệu và lưu tài khoản mới với role 'customer'.", "5. Tự động đăng nhập và thông báo thành công."],
          ["4a. Thông báo lỗi nếu Email đã được đăng ký.", "4b. Thông báo lỗi nếu Mật khẩu xác nhận không khớp."],
          "Tài khoản mới được ghi nhận vào CSDL."
        ),
        createParagraph("* Dữ liệu đầu vào chức năng 'Đăng ký':"),
        createDataTable([
          { name: "Họ và tên", desc: "Họ tên đầy đủ", req: "Có", valid: "Tối đa 255 ký tự", example: "Nguyen Van A" },
          { name: "Email", desc: "Địa chỉ email cá nhân", req: "Có", valid: "Đúng định dạng email", example: "nguyenvana@gmail.com" },
          { name: "Số điện thoại", desc: "Số điện thoại liên hệ", req: "Có", valid: "Ký tự số 10-11 số", example: "0912345678" },
          { name: "Mật khẩu", desc: "Mật khẩu tài khoản", req: "Có", valid: "Tối thiểu 6 ký tự", example: "123456" },
        ]),

        // UC-005
        createHeading3("2.6.5 Cập nhật thông tin cá nhân"),
        createUseCaseTablePdfStyle(
          "UC005", "Cập nhật thông tin cá nhân", "Hành khách, Quản trị viên",
          "Cập nhật thông tin hồ sơ cá nhân (Họ tên, Ngày sinh, Điện thoại, Địa chỉ).",
          "Click menu 'Hồ sơ cá nhân'.",
          "Đã đăng nhập tài khoản.",
          ["1. Mở trang Hồ sơ cá nhân.", "2. Chỉnh sửa các trường thông tin.", "3. Nhấn 'Cập nhật'.", "4. Hệ thống kiểm tra và lưu dữ liệu mới vào CSDL."],
          ["4a. Thông báo lỗi nếu định dạng số điện thoại hoặc email không hợp lệ."],
          "Thông tin hồ sơ được cập nhật thành công."
        ),

        // UC-006
        createHeading3("2.6.6 Tìm kiếm chuyến bay"),
        createUseCaseTablePdfStyle(
          "UC006", "Tìm kiếm chuyến bay", "Khách vãng lai, Hành khách",
          "Tìm kiếm các chuyến bay khả dụng theo Tuyến bay, Ngày khởi hành, Số hành khách và Hạng ghế.",
          "Click nút 'Tìm kiếm chuyến bay' trên Form tìm kiếm.",
          "Truy cập trang chủ hoặc trang Tìm kiếm chuyến bay.",
          ["1. Chọn Sân bay đi và Sân bay đến.", "2. Chọn Ngày đi (và Ngày về nếu khứ hồi).", "3. Chọn Số lượng hành khách và Hạng ghế (Economy / Business).", "4. Nhấn 'Tìm kiếm chuyến bay'.", "5. Hệ thống hiển thị danh sách các chuyến bay tìm thấy kèm theo giá vé."],
          ["5a. Không tìm thấy chuyến bay thỏa mãn: Hiển thị thông báo không có lịch bay."],
          "Danh sách chuyến bay phù hợp được trình bày trực quan."
        ),
        createParagraph("* Dữ liệu đầu vào chức năng 'Tìm kiếm chuyến bay':"),
        createDataTable([
          { name: "Sân bay đi", desc: "Mã IATA sân bay xuất phát", req: "Có", valid: "Mã IATA 3 ký tự", example: "HAN" },
          { name: "Sân bay đến", desc: "Mã IATA sân bay hạ cánh", req: "Có", valid: "Mã IATA 3 ký tự", example: "SGN" },
          { name: "Ngày đi", desc: "Ngày khởi hành chuyến bay", req: "Có", valid: "Ngày lớn hơn hoặc bằng ngày hiện tại", example: "2026-09-15" },
          { name: "Số hành khách", desc: "Số lượng người đi", req: "Có", valid: "Số nguyên >= 1", example: "2" },
        ]),

        // UC-007
        createHeading3("2.6.7 Check-in trực tuyến & Tra cứu dịch vụ"),
        createUseCaseTablePdfStyle(
          "UC007", "Check-in trực tuyến & Dịch vụ", "Hành khách",
          "Làm thủ tục chuyến bay trực tuyến và chọn các gói dịch vụ bổ sung (Hành lý, Suất ăn).",
          "Truy cập menu 'Check-in trực tuyến'.",
          "Hành khách có mã đặt chỗ PNR hợp lệ.",
          ["1. Nhập Mã PNR và Họ tên hành khách.", "2. Nhấn 'Tra cứu đặt chỗ'.", "3. Hệ thống xác nhận và hiển thị thông tin chuyến bay.", "4. Chọn dịch vụ bổ sung (Hành lý/Suất ăn) nếu cần.", "5. Nhấn 'Xác nhận Check-in'.", "6. Hệ thống phát hành Thẻ lên máy bay (Boarding Pass) kèm mã QR."],
          ["3a. Mã PNR không tồn tại hoặc chuyến bay chưa mở Check-in: Báo lỗi."],
          "Thẻ Boarding Pass điện tử được cấp thành công."
        ),

        // UC-008
        createHeading3("2.6.8 Quản lý chuyến bay (Admin)"),
        createUseCaseTablePdfStyle(
          "UC008", "Quản lý chuyến bay", "Quản trị viên",
          "Thêm mới, Chỉnh sửa, Xóa thông tin chuyến bay, lịch trình và giá vé trong hệ thống.",
          "Truy cập Admin Dashboard -> Quản lý chuyến bay.",
          "Đã đăng nhập bằng tài khoản có quyền Admin.",
          ["1. Admin chọn 'Quản lý chuyến bay'.", "2. Chọn Thêm chuyến bay hoặc Sửa/Xóa chuyến bay sẵn có.", "3. Nhập Mã chuyến bay, Sân bay đi/đến, Giờ đi/đến, Giá vé gốc.", "4. Nhấn 'Lưu chuyến bay'.", "5. Hệ thống ghi nhận vào CSDL."],
          ["4a. Thông báo lỗi nếu trùng Mã chuyến bay hoặc thời gian không hợp lệ."],
          "Thông tin chuyến bay được cập nhật trong CSDL."
        ),

        // UC-009
        createHeading3("2.6.9 Quản lý đặt vé (Admin)"),
        createUseCaseTablePdfStyle(
          "UC009", "Quản lý danh sách đặt vé", "Quản trị viên",
          "Xem chi tiết đơn đặt vé, cập nhật trạng thái thanh toán hoặc thực hiện hủy đơn vé.",
          "Truy cập Admin Dashboard -> Quản lý Đặt vé.",
          "Đã đăng nhập tài khoản Admin.",
          ["1. Admin xem danh sách tất cả các đơn đặt vé.", "2. Tìm kiếm đơn vé theo mã PNR hoặc Tên khách hàng.", "3. Xem chi tiết thông tin hành khách và ghế ngồi.", "4. Cập nhật trạng thái 'Confirmed' hoặc 'Cancelled'.", "5. Lưu thay đổi."],
          ["4a. Báo lỗi nếu không tìm thấy đơn vé."],
          "Trạng thái đơn vé được cập nhật thành công."
        ),

        // UC-010
        createHeading3("2.6.10 Quản lý người dùng (Admin)"),
        createUseCaseTablePdfStyle(
          "UC010", "Quản lý tài khoản người dùng", "Quản trị viên",
          "Quản lý danh sách tài khoản, phân quyền Role Admin/Customer hoặc khóa/mở khóa tài khoản.",
          "Truy cập Admin Dashboard -> Quản lý Người dùng.",
          "Đã đăng nhập Admin.",
          ["1. Admin xem danh sách người dùng.", "2. Chọn người dùng cần chỉnh sửa.", "3. Thay đổi Role hoặc Trạng thái tài khoản.", "4. Nhấn 'Lưu thay đổi'."],
          ["3a. Không thể xóa tài khoản Admin quản trị tối cao."],
          "Thông tin phân quyền người dùng được cập nhật."
        ),

        // UC-011
        createHeading3("2.6.11 Quản lý sơ đồ ghế & Khóa ghế"),
        createUseCaseTablePdfStyle(
          "UC011", "Chọn ghế & Khóa ghế tạm thời", "Hành khách",
          "Hiển thị sơ đồ ghế máy bay tương tác thực tế và thực hiện khóa vị trí ghế được chọn.",
          "Khách hàng nhấp vào bước 'Chọn ghế' khi đặt vé.",
          "Đã chọn chuyến bay thành công.",
          ["1. Hệ thống tải sơ đồ ghế máy bay (Rows, Columns, Seat Status).", "2. Hành khách nhấp chọn vị trí ghế trên sơ đồ.", "3. Hệ thống gửi API lock-seat giữ chỗ tạm thời trong 10 phút.", "4. Xác nhận vị trí ghế."],
          ["2a. Ghế đã có người mua: Báo đỏ và ngăn cản việc chọn."],
          "Vị trí ghế được gắn liền với đơn đặt vé."
        ),

        // UC-012
        createHeading3("2.6.12 Quản lý sân bay (Admin)"),
        createUseCaseTablePdfStyle(
          "UC012", "Quản lý danh mục sân bay", "Quản trị viên",
          "Quản lý danh sách các sân bay trong và ngoài nước (Mã IATA, Tên sân bay, Thành phố, Quốc gia).",
          "Truy cập Admin Dashboard -> Quản lý Sân bay.",
          "Đã đăng nhập Admin.",
          ["1. Admin chọn Quản lý Sân bay.", "2. Nhập Mã IATA (Ví dụ: HAN, SGN, DAD), Tên sân bay, Thành phố.", "3. Nhấn 'Thêm sân bay' hoặc 'Lưu'.", "4. CSDL được cập nhật."],
          ["2a. Thông báo lỗi nếu Mã IATA bị trùng."],
          "Sân bay mới được thêm vào danh mục tìm kiếm."
        ),

        // UC-013
        createHeading3("2.6.13 Quản lý dịch vụ bổ sung"),
        createUseCaseTablePdfStyle(
          "UC013", "Quản lý dịch vụ hành lý & suất ăn", "Hành khách, Quản trị viên",
          "Xem và lựa chọn các gói dịch vụ bổ sung (Hành lý ký gửi 20kg/30kg, Suất ăn hàng không).",
          "Trong bước Chọn dịch vụ đặt vé.",
          "Đã chọn chuyến bay.",
          ["1. Hiển thị danh sách các gói dịch vụ bổ sung.", "2. Hành khách tích chọn gói dịch vụ mong muốn.", "3. Hệ thống tự động tính toán cộng thêm phí dịch vụ vào tổng hóa đơn."],
          ["2a. Bỏ qua bước chọn nếu không cần dịch vụ."],
          "Thông tin dịch vụ được lưu kèm theo đơn hàng."
        ),

        // UC-014
        createHeading3("2.6.14 Xem lịch sử chuyến bay, Đổi vé & Hủy vé"),
        createUseCaseTablePdfStyle(
          "UC014", "Quản lý vé đã đặt (Đổi vé / Hủy vé)", "Hành khách",
          "Xem danh sách vé đã mua, gửi yêu cầu Đổi chuyến bay (Reschedule) hoặc Hủy vé (Cancel).",
          "Vào trang 'Chuyến bay của tôi' (My Bookings).",
          "Đã đăng nhập tài khoản Hành khách.",
          ["1. Xem danh sách các đơn vé đã đặt.", "2. Chọn đơn vé cần xử lý.", "3. Nhấp 'Đổi chuyến bay' (chọn ngày bay mới) hoặc 'Yêu cầu Hủy vé'.", "4. Hệ thống tính phí chênh lệch và cập nhật trạng thái đơn vé."],
          ["3a. Vé đã qua ngày bay hoặc không được hủy: Báo lỗi."],
          "Đơn vé được cập nhật ngày bay mới hoặc hủy thành công."
        ),

        // UC-015
        createHeading3("2.6.15 Thanh toán & Xử lý giao dịch"),
        createUseCaseTablePdfStyle(
          "UC015", "Thanh toán đơn đặt vé", "Hành khách",
          "Thực hiện thanh toán đơn đặt vé qua Cổng thanh toán trực tuyến và nhận Mã PNR.",
          "Click nút 'Thanh toán ngay' tại trang Checkout.",
          "Đã điền đầy đủ thông tin hành khách và ghế ngồi.",
          ["1. Chọn phương thức thanh toán (VNPay / Thẻ ngân hàng).", "2. Nhấn 'Thanh toán'.", "3. Hệ thống xác nhận giao dịch thành công.", "4. Sinh mã PNR 6 ký tự duy nhất và chuyển đơn vé sang trạng thái 'Confirmed'."],
          ["3a. Thanh toán thất bại: Giữ đơn chờ thanh toán và cho phép thử lại."],
          "Mã PNR được cấp và gửi email xác nhận đặt vé thành công."
        ),

        // UC-016
        createHeading3("2.6.16 Tương tác với Trợ lý AI SkyAI"),
        createUseCaseTablePdfStyle(
          "UC016", "Tương tác với Trợ lý AI SkyAI", "Khách vãng lai, Hành khách",
          "Hỗ trợ tư vấn lịch bay, tự động thực thi tra cứu vé và kiểm tra ghế trống bằng Trợ lý AI SkyAI.",
          "Bấm vào biểu tượng Chatbot SkyAI ở góc màn hình.",
          "Không yêu cầu (có thể truy cập tự do).",
          ["1. Mở cửa sổ Trợ lý AI SkyAI.", "2. Khách hàng gửi tin nhắn bằng câu lệnh tự nhiên (VD: 'Tìm giúp tôi chuyến bay từ Hà Nội đi Đà Nẵng ngày 15/09').", "3. SkyAI phân tích ý định (Intent) và kích hoạt công cụ `search_flight` từ Backend.", "4. SkyAI trả về câu trả lời tự nhiên kèm Thẻ chuyến bay trực quan (Flight Card).", "5. Khách hàng bấm nút 'Chọn chuyến' trực tiếp trên khung chat để tiến hành đặt vé."],
          ["3a. Không có chuyến bay phù hợp: SkyAI đưa ra lời khuyên gợi ý ngày khác."],
          "Khách hàng nhận được sự trợ giúp tức thì 24/7 từ AI."
        ),
        createParagraph("* Dữ liệu đầu vào giao tiếp với Trợ lý AI SkyAI:"),
        createDataTable([
          { name: "Tin nhắn người dùng", desc: "Câu hỏi hoặc yêu cầu dạng văn bản", req: "Có", valid: "Chuỗi văn bản tự nhiên", example: "Giá vé bay Sài Gòn Hà Nội bao nhiêu?" },
          { name: "Mã hội thoại", desc: "ID phiên trò chuyện AI", req: "Không", valid: "UUID hợp lệ", example: "conv_123456" },
        ]),

        // CHƯƠNG 3
        createHeading1("3 Các yêu cầu phi chức năng"),

        createHeading2("3.1 Giao diện người dùng"),
        createBullet("Phong cách thiết kế: ", "Giao diện hiện đại, chuyên nghiệp sử dụng tone màu Xanh Navy (#1E40AF) chuẩn thương hiệu SkyLink Airlines."),
        createBullet("Thiết kế Responsive: ", "Tương thích hoàn hảo trên các trình duyệt Chrome, Safari, Edge và hiển thị tối ưu trên Desktop, Tablet, Mobile."),
        createBullet("Trải nghiệm trợ lý AI: ", "Khung chat SkyAI hiển thị nổi ở góc màn hình, hỗ trợ streaming câu trả lời thời gian thực với độ trễ siêu thấp."),

        createHeading2("3.2 Tính bảo mật"),
        createBullet("Xác thực & Phân quyền: ", "Sử dụng Laravel Sanctum cấp phát Bearer JWT Token mã hóa an toàn, phân chia rõ rệt quyền Admin và Member."),
        createBullet("Mã hóa dữ liệu: ", "Mật khẩu mã hóa 1 chiều bằng thuật toán Bcrypt; toàn bộ kết nối API mã hóa giao thức HTTPS/SSL."),

        createHeading2("3.3 Ràng buộc"),
        createBullet("Ràng buộc hạ tầng kỹ thuật: ", "Backend PHP 8.2 / Laravel 11.x, MySQL 8.0, Frontend React 18 / Vite / Tailwind CSS, Tích hợp Gemini AI API."),
        createBullet("Ràng buộc hiệu năng: ", "Tốc độ xử lý API tìm kiếm chuyến bay < 500ms, thời gian phản hồi câu thoại AI < 1.5s."),
      ],
    },
  ],
});

const outputPath1 = path.join(__dirname, "Bao_Cao_SRS_Tro_Ly_AI_SkyLink_V2.docx");
const outputPath2 = path.join(__dirname, "Bao_Cao_Dac_Ta_SkyLink_Airlines_V2.docx");

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outputPath1, buffer);
  fs.writeFileSync(outputPath2, buffer);
  console.log(`✅ SRS Word Document generated successfully!`);
  console.log(`- File 1: ${outputPath1}`);
  console.log(`- File 2: ${outputPath2}`);
}).catch((err) => {
  console.error("❌ Error generating Word document:", err);
});
