# BÁO CÁO SLIDE THUYẾT TRÌNH ĐỒ ÁN
## ĐỀ TÀI: XÂY DỰNG HỆ THỐNG TRỢ LÝ AI HỖ TRỢ KHÁCH HÀNG CHO NỀN TẢNG ĐẶT VÉ MÁY BAY (SKYLINK AIRLINE)

---

### SLIDE 1: TRANG BÌA
* **Tên đề tài:** XÂY DỰNG HỆ THỐNG TRỢ LÝ AI HỖ TRỢ KHÁCH HÀNG CHO NỀN TẢNG ĐẶT VÉ MÁY BAY
* **Dự án áp dụng:** Hệ thống Đặt vé & Quản lý Hàng không Trực tuyến SkyLink Airline
* **Giảng viên hướng dẫn:** [Tên Giảng Viên Hướng Dẫn]
* **Sinh viên thực hiện:** [Tên Sinh Viên / Nhóm Sinh Viên]
* **Chuyên ngành:** Công nghệ Thông tin / Kỹ thuật Phần mềm
* **Năm học:** 2026

---

### SLIDE 2: ĐẶT VẤN ĐỀ & LÝ DO CHỌN ĐỀ TÀI
* **Bối cảnh ngành hàng không:** 
  * Nhu cầu di chuyển bằng đường hàng không tăng cao, khối lượng yêu cầu hỗ trợ khách hàng bùng nổ 24/7.
  * Phương thức hỗ trợ truyền thống (Call center, Email) thường gây nghẽn mạng, thời gian phản hồi chậm và chi phí vận hành lớn.
* **Thách thức hiện tại:**
  * Khách hàng gặp khó khăn trong việc tra cứu thông tin chuyến bay, quy định hành lý, chính sách đổi/hoàn vé phức tạp.
  * Trải nghiệm đặt vé trực tuyến còn rải rác, thiếu trợ lý thông minh đồng hành realtime.
* **Giải pháp đề xuất:** 
  * Tích hợp Trợ lý AI thế hệ mới (SkyAI Assistant) sử dụng Large Language Model (LLM) và RAG (Retrieval-Augmented Generation) trực tiếp vào hệ thống đặt vé máy bay SkyLink Airline.

---

### SLIDE 3: MỤC TIÊU CỦA ĐỀ TÀI
* **Mục tiêu tổng quát:** Xây dựng thành công nền tảng đặt vé máy bay tích hợp Trợ lý AI đa năng, tự động hóa quy trình hỗ trợ và nâng cao trải nghiệm người dùng.
* **Mục tiêu cụ thể:**
  1. Thiết kế & phát triển Hệ thống Đặt vé Máy bay SkyLink (Backend Laravel 11 + Frontend ReactJS).
  2. Tích hợp Trợ lý AI SkyAI dựa trên mô hình Gemini 2.0/3.1 Flash với khả năng **Function Calling** & **RAG Knowledge Base**.
  3. Tự động hóa 6 tác vụ cốt lõi: Tìm chuyến bay, Kiểm tra ghế trống, Tra cứu mã đặt chỗ (PNR), Tư vấn chính sách hàng không, Tra cứu thông tin sân bay, Xử lý ảnh đa phương tiện (Multimodal).
  4. Hỗ trợ đa ngôn ngữ tự động (Việt, Anh, Khmer, Trung, Nhật, Hàn, Pháp).

---

### SLIDE 4: PHẠM VI VÀ ĐÓNG GÓP CỦA ĐỀ TÀI
* **Phạm vi nghiên cứu & phát triển:**
  * **Nghiệp vụ Hàng không:** Tìm kiếm chuyến bay thời gian thực, Chọn ghế ngồi trực quan (Seat Map), Dịch vụ bổ trợ (Hành lý, Suất ăn), Thanh toán & Check-in Online.
  * **Công nghệ AI:** Đổi mới kiến trúc AI Chatbot từ dạng Q&A cứng nhắc sang dạng **Agentic AI** có khả năng gọi hàm (Tools) truy vấn CSDL live.
* **Đóng góp chính:**
  * Giải pháp kết hợp Decoupled Architecture (Laravel Web API + React Vite) giúp hệ thống phản hồi cực nhanh.
  * Tối ưu chi phí API LLM với cơ chế phân tầng fallback model và streaming SSE (Server-Sent Events).
  * Bộ công cụ hoàn chỉnh phục vụ nghiên cứu và triển khai thực tế cho các doanh nghiệp du lịch/hàng không.

---

### SLIDE 5: TỔNG QUAN HỆ THỐNG SKYLINK AIRLINE
* **Kiến trúc hệ thống:** Decoupled Architecture (API First Model).
* **Phân hệ Người dùng (Customer Portal):**
  * Tra cứu & lọc chuyến bay theo ngày, giờ, mức giá, hạng vé (Economy, Business, Saver).
  * Đặt chỗ trực tiếp, chọn vị trí ghế ngồi tương tác trên sơ đồ máy bay (Seat Map).
  * Mua thêm hành lýký gửi, suất ăn nóng và bảo hiểm chuyến bay.
  * Thanh toán đa kênh (Thẻ tín dụng, Ví điện tử MoMo/VNPAY, Chuyển khoản) & nhận mã PNR qua Email.
* **Phân hệ Quản trị (Admin Portal):**
  * Quản lý máy bay (Aircrafts), tuyến bay (Routes), lịch trình chuyến bay (Flights).
  * Quản lý giá vé, sơ đồ ghế và theo dõi báo cáo doanh thu trực quan.

---

### SLIDE 6: TỔNG QUAN TRỢ LÝ AI TRONG HÀNG KHÔNG (SKYAI ASSISTANT)
* **Định danh Trợ lý AI:** **SkyAI Assistant** - Trợ lý ảo chính thức của SkyLink Airline.
* **Các đặc tính nổi bật:**
  * **Thông minh & Linh hoạt:** Hiểu ngữ cảnh ngôn ngữ tự nhiên, xử lý các câu hỏi phức tạp hoặc câu hỏi gộp.
  * **Độ chính xác cao:** Tuyệt đối không tự bịa đặt thông tin chuyến bay hay giá vé (Zero Hallucination nhờ Function Calling).
  * **Thị giác máy tính (Multimodal):** Phân tích hình ảnh tài liệu, vé bay hoặc giấy tờ tùy thân do khách hàng tải lên.
  * **Phản hồi Real-time:** Sử dụng công nghệ SSE Stream để trả về từng từ (tokens) tức thì, xóa bỏ độ trễ chờ đợi.

---

### SLIDE 7: KIẾN TRÚC CÔNG NGHỆ TỔNG THỂ
* **Frontend:**
  * Framework: **ReactJS** với **Vite 6** (Cực kỳ tối ưu tốc độ build & render).
  * Styling: Vanilla CSS & TailwindCSS (UI hiện đại, hiệu ứng Glassmorphism & Dark Mode).
  * State Management & Routing: React Router DOM, Context API.
* **Backend:**
  * Framework: **Laravel 11** (PHP 8.2+) áp dụng **Service - Repository Pattern**.
  * CSDL: **MySQL 8.0** với schema chuẩn hóa cho giao dịch đặt vé & lưu trữ lịch sử hội thoại AI.
* **AI Core Integration:**
  * API Provider: Google Gemini API (Gemini 2.0 Flash / Gemini 3.1 Flash Lite).
  * Protocols: RESTful API, Server-Sent Events (SSE) Streaming.

---

### SLIDE 8: SƠ ĐỒ KIẾN TRÚC PHÂN HỆ AI (AI SUBSYSTEM ARCHITECTURE)
```
+-----------------------------------------------------------------------+
|                           CLIENT (ReactJS UI)                         |
|    [Chat Widget / SSE Stream Reader] <---> [Flight Card Renderer]     |
+-----------------------------------▲-----------------------------------+
                                    | HTTP / SSE Stream
+-----------------------------------▼-----------------------------------+
|                        BACKEND (Laravel 11 API)                       |
|   +---------------------------------------------------------------+   |
|   |                       AIChatService                           |   |
|   +-------------------------------+-------------------------------+   |
|                                   |                                   |
|   +-------------------------------+-------------------------------+   |
|   |                       AIService                               |   |
|   |  - System Prompt Engine       - Gemini API Integration        |   |
|   |  - Multilingual Detector      - Fallback & Retry Handler      |   |
|   +-------------------------------+-------------------------------+   |
|                                   |                                   |
|   +-------------------------------+-------------------------------+   |
|   |                    AI Tool Calling Engine                     |   |
|   |  [SearchFlightTool]      [GetFlightDetailsTool]                |   |
|   |  [CheckSeatTool]         [GetBookingInfoTool]                  |   |
|   |  [GetAirportInfoTool]    [SearchKnowledgeTool - RAG]           |   |
|   +-------------------------------+-------------------------------+   |
+-----------------------------------▲-----------------------------------+
                                    | SQL / Database Queries
+-----------------------------------▼-----------------------------------+
|                   MySQL Database & Knowledge Base                     |
+-----------------------------------------------------------------------+
```

---

### SLIDE 9: MÔ HÌNH DỮ LIỆU & LƯU TRỮ TRẠNG THÁI AI
* **Thực thể `ai_conversations`:**
  * `id`, `uuid` (Mã phiên hội thoại định danh duy nhất).
  * `user_id` (Khóa ngoại liên kết bảng users nếu người dùng đã đăng nhập).
  * `title` (Tự động trích xuất tiêu đề ngắn từ tin nhắn đầu tiên).
  * `created_at`, `updated_at`.
* **Thực thể `ai_messages`:**
  * `id`, `conversation_id` (Khóa ngoại).
  * `role` (`user`, `assistant`, `tool`).
  * `content` (Nội dung văn bản tin nhắn).
  * `tool_calls` (JSON lưu thông tin hàm được LLM đề xuất gọi).
  * `tool_name`, `tool_arguments`, `tool_result` (Lưu lịch sử kết quả thực thi công cụ).

---

### SLIDE 10: CƠ CHẾ FUNCTION CALLING (TỔNG QUAN 6 TOOLS CORE)
* **Khái niệm:** LLM không trực tiếp đọc CSDL mà phân tích intent của khách hàng và đưa ra quyết định gọi các hàm chuyên biệt (Tools).
* **Danh sách 6 Tools cốt lõi của SkyAI:**
  1. `search_flight`: Tìm kiếm chuyến bay theo điểm đi, điểm đến, ngày bay, mức giá, thời gian trong ngày.
  2. `get_flight_details`: Lấy chi tiết thông số chuyến bay, số hiệu máy bay, hạng ghế.
  3. `check_seat_availability`: Kiểm tra số lượng ghế trống còn lại trên từng hạng vé.
  4. `get_booking_info`: Tra cứu mã đặt chỗ PNR, trạng thái vé, thông tin hành khách.
  5. `get_airport_info`: Tra cứu thông tin mã IATA sân bay, tên thành phố, nhà ga.
  6. `search_airline_knowledge`: Tìm kiếm trong Kho kiến thức quy định & chính sách hãng (RAG).

---

### SLIDE 11: QUI TRÌNH XỬ LÝ RAG & TRA CỨU KHO KIẾN THỨC (RAG FLOW)
* **Retrieval-Augmented Generation (RAG):**
  * Tích hợp tri thức chuyên ngành Hàng không vào System Prompt & Tool Tra cứu Tri thức.
* **Quy trình tra cứu thông minh:**
  1. Khách hàng hỏi: *"Hành lý xách tay được bao nhiêu kg và trẻ em dưới 2 tuổi tính giá thế nào?"*
  2. AI nhận diện đây là câu hỏi chính sách -> Kích hoạt `search_airline_knowledge` hoặc trích xuất quy định tích hợp sẵn.
  3. Dữ liệu chuẩn xác về quy định (7kg xách tay, Trẻ em < 2 tuổi tính 10% vé người lớn) được hợp nhất vào phản hồi.
  4. Kết quả: Phản hồi chuẩn xác 100% theo quy chuẩn chính thức của SkyLink Airline.

---

### SLIDE 12: KHẢ NĂNG ĐA NGÔN NGỮ TỰ ĐỘNG (MULTILINGUAL SYSTEM)
* **Cơ chế nhận diện ngôn ngữ:**
  * Tích hợp bộ nhận diện diacritics & Unicode Range trong `detectLanguage()`.
  * Hỗ trợ tự động 7+ ngôn ngữ phổ biến:
    * **Tiếng Việt (vi):** Ngôn ngữ mặc định.
    * **Tiếng Anh (en):** Phản hồi chuẩn mực quốc tế.
    * **Tiếng Khmer (km):** Phân tích dải Unicode `\u1780-\u17FF`.
    * **Tiếng Trung (zh):** Phân tích dải Hán tự `\u4E00-\u9FFF`.
    * **Tiếng Nhật (ja) & Tiếng Hàn (ko) & Tiếng Pháp (fr).**
* **Nguyên tắc Phản hồi:** Khách hàng hỏi bằng ngôn ngữ nào, AI bắt buộc phản hồi 100% bằng chính ngôn ngữ đó.

---

### SLIDE 13: XỬ LÝ ĐA PHƯƠNG TIỆN (MULTIMODAL IMAGE ANALYSIS)
* **Tính năng nhận diện hình ảnh:**
  * Khách hàng có thể gửi ảnh thẻ căn cước/hộ chiếu, ảnh mặt vé cũ hoặc ảnh mã lỗi lên khung chat.
* **Quy trình xử lý:**
  1. Frontend chuyển đổi tệp ảnh thành định dạng `base64` / `inlineData`.
  2. `AIService` đóng gói payload chứa thông tin `mimeType` và dữ liệu ảnh gửi tới Gemini Vision API.
  3. AI trích xuất văn bản (OCR), nhận diện họ tên, số hộ chiếu hoặc mã PNR từ hình ảnh để hỗ trợ khách hàng nhanh chóng.

---

### SLIDE 14: KỸ THUẬT STREAMING SSE & TỐI ƯU TRẢI NGHIỆM CHIẾN LƯỢC UI
* **Công nghệ Server-Sent Events (SSE):**
  * Giảm cảm giác chờ đợi của khách hàng bằng cách đẩy dữ liệu theo dạng luồng (Chunk stream).
* **Chiến lược giao diện thông minh (UI Optimization Rule):**
  * Khi AI tìm thấy danh sách chuyến bay từ tool `search_flight`, hệ thống không liệt kê văn bản dông dài.
  * Thay vào đó, AI chỉ tạo câu dẫn ngắn (dưới 2 câu) và tự động kích hoạt **Flight Cards Component** hiển thị giao diện thẻ chuyến bay trực quan (thời gian, giá vé, nút chọn mua).

---

### SLIDE 15: QUY TRÌNH NGHIỆP VỤ KHÁCH HÀNG (CUSTOMER JOURNEY)
* **Bước 1: Tìm kiếm & Tư vấn:** Nhập thông tin hoặc trò chuyện với SkyAI để chọn chuyến bay tối ưu.
* **Bước 2: Chọn ghế ngồi (Seat Map):** Chọn vị trí ghế ưa thích trực quan theo mã sơ đồ (A1, B2...).
* **Bước 3: Dịch vụ bổ sung:** Đặt trước hành lý ký gửi, suất ăn nóng, bảo hiểm du lịch.
* **Bước 4: Thanh toán:** Nhập thông tin hành khách, thanh toán an toàn qua Cổng thanh toán.
* **Bước 5: Làm thủ tục (Check-in Online):** Làm thủ tục trực tuyến trước 24h và nhận Thẻ lên máy bay (Boarding Pass) qua Email.

---

### SLIDE 16: QUY TRÌNH NGHIỆP VỤ QUẢN TRỊ (ADMIN MANAGEMENT)
* **Quản lý Đội bay & Tuyến bay:** Khởi tạo thông số kỹ thuật máy bay, thiết lập các tuyến bay nội địa và quốc tế.
* **Lên lịch trình chuyến bay:** Cấu hình thời gian cất cánh, hạ cánh, giá vé tiêu chuẩn cho từng phân hạng.
* **Quản lý Sơ đồ ghế:** Tự động tạo bản đồ ghế ngồi tương ứng với từng dòng máy bay (Airbus A320, A350, Boeing 787).
* **Báo cáo & Thống kê:** Bảng điều khiển (Dashboard) theo dõi doanh thu, tỷ lệ lấp đầy ghế và số lượng lượt hội thoại AI.

---

### SLIDE 17: THIẾT KẾ GIAO DIỆN PHÂN HỆ KHÁCH HÀNG (REACTJS FRONTEND)
* **Đặc trưng Giao diện:**
  * Phong cách thiết kế hiện đại, sang trọng (Luxury Airline Aesthetic).
  * Hiệu ứng chuyển động mượt mà, hỗ trợ giao diện đáp ứng (Responsive Layout) trên Desktop, Tablet & Mobile.
  * Gam màu chủ đạo: Xanh hàng không (Deep Navy Blue) kết hợp Trắng bạc và Vàng ánh kim cao cấp.

---

### SLIDE 18: THIẾT KẾ GIAO DIỆN CHATBOT TRỢ LÝ AI (SKYAI CHATBOT UI)
* **Cấu trúc Khung Chat:**
  * Nút kích hoạt dạng Widget nổi linh hoạt ở góc màn hình.
  * Cửa sổ Chat đa chức năng: Hiển thị trạng thái "SkyAI đang suy nghĩ...", danh sách gợi ý nhanh (Quick Replies).
  * Khả năng hiển thị trực tiếp **Thẻ chuyến bay (Flight Cards)** tương tác ngay trong luồng hội thoại.
  * Hỗ trợ nút tải ảnh tài liệu và xóa lịch sử trò chuyện.

---

### SLIDE 19: AN TOÀN THÔNG TIN & XỬ LÝ NGOẠI LỆ AI
* **An toàn & Bảo mật:**
  * Kiểm soát quyền truy cập API qua Laravel Middleware & Authentication Tokens.
  * Che mờ / Không lưu trữ các thông tin nhạy cảm (Số thẻ thanh toán, CVV) trong dữ liệu trò chuyện AI.
* **Chiến lược xử lý ngoại lệ (Fallback & Resilience):**
  * Tự động thử lại (Retry Strategy 3 lần) khi gặp lỗi quá tải mạng (HTTP 503/429).
  * Tự động chuyển đổi mô hình dự phòng (Fallback từ Gemini 3.1 Flash -> Gemini 2.5 Flash -> Gemini 1.5 Flash).
  * Giới hạn tối đa 3 vòng lặp Tool Calls để tránh hiện tượng lặp vô hạn (Infinite Loop Prevention).

---

### SLIDE 20: MÔ TRƯỜNG THỬ NGHIỆM & KỊCH BẢN KIỂM THỬ
* **Môi trường thử nghiệm:**
  * Server Local: PHP 8.2+, Laravel 11, Node.js v18+, MySQL 8.0.
  * Dữ liệu thử nghiệm: 50+ chuyến bay thực tế giữa các sân bay HAN, SGN, DAD, CXR, PQC, BKK, SIN...
* **Các kịch bản kiểm thử trọng tâm:**
  * Kịch bản 1: Tra cứu chuyến bay với các tiêu chí phức tạp (Vé rẻ nhất, bay buổi sáng, tìm 1 chuyến).
  * Kịch bản 2: Tra cứu quy định chính sách hành lý & giá vé trẻ em (RAG Test).
  * Kịch bản 3: Tra cứu thông tin mã đặt chỗ PNR và kiểm tra ghế trống trên sơ đồ.
  * Kịch bản 4: Kiểm thử hội thoại đa ngôn ngữ và gửi ảnh thẻ căn cước.

---

### SLIDE 21: KẾT QUẢ KIỂM THỬ CHỨC NĂNG AI (FUNCTIONAL RESULTS)

| STT | Kịch bản kiểm thử | Yêu cầu đầu vào | Kết quả thực thi | Trạng thái |
|---|---|---|---|---|
| 1 | Tìm chuyến bay Hà Nội - Sài Gòn | "Tìm chuyến bay từ Hà Nội đi Sài Gòn ngày mai" | Gọi `search_flight`, trả về danh sách thẻ chuyến bay | **Thành công** |
| 2 | Tra cứu vé rẻ nhất | "Tìm 1 chuyến vé rẻ nhất từ Đà Nẵng đi Hà Nội" | Gọi `search_flight` với `limit: 1`, `sort_by: price_asc` | **Thành công** |
| 3 | Hỏi chính sách hành lý | "Hành lý xách tay được mang bao nhiêu kg?" | Trả lời chính xác quy định 7kg xách tay miễn phí | **Thành công** |
| 4 | Kiểm thử đa ngôn ngữ | "Do you have flights from Hanoi to Bangkok?" | Nhận diện tiếng Anh và trả lời 100% bằng Tiếng Anh | **Thành công** |
| 5 | Gửi ảnh thẻ căn cước | Khách hàng tải ảnh CCCD | Nhận diện thông tin qua Vision API và chào khách | **Thành công** |

---

### SLIDE 22: THỬ NGHIỆM HIỆU NĂNG & THỜI GIAN PHẢN HỒI (PERFORMANCE METRICS)
* **Thời gian phản hồi trung bình (Average Latency):**
  * Phản hồi câu hỏi thông thường (Không dùng tool): **0.8 - 1.2 giây**.
  * Phản hồi câu hỏi kích hoạt Function Calling (Truy vấn CSDL): **1.5 - 2.3 giây**.
  * Thời gian xuất hiện First Token khi dùng SSE Streaming: **< 400 ms**.
* **Tỷ lệ chính xác định tuyến Tool (Tool Routing Accuracy):** Đạt **96.5%** trên tổng số 200 lượt truy vấn kiểm thử.
* **Độ lấp đầy thông tin câu trả lời:** 99% đáp ứng đúng quy định của hãng SkyLink Airline.

---

### SLIDE 23: ĐÁNH GIÁ ƯU ĐIỂM VÀ HẠN CHẾ DỰ ÁN
* **Ưu điểm vượt trội:**
  * Kiến trúc Decoupled hiện đại, khả năng mở rộng (Scalability) cao.
  * Trợ lý AI có khả năng tương tác trực tiếp với CSDL live, hiển thị giao diện UI phong phú (Flight Cards).
  * Trải nghiệm mượt mà nhờ công nghệ SSE Stream và xử lý đa ngôn ngữ tự động.
* **Hạn chế hiện tại:**
  * Phụ thuộc vào kết nối Internet và API của bên thứ ba (Google Gemini API).
  * Chưa tích hợp tính năng thanh toán tự động hoàn toàn thông qua giọng nói (Voice Agent).

---

### SLIDE 24: KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN TƯƠNG LAI
* **Kết luận:**
  * Đề tài đã hoàn thành xuất sắc các mục tiêu đề ra: Xây dựng thành công nền tảng đặt vé máy bay SkyLink Airline tích hợp Trợ lý AI SkyAI thông minh.
  * Đóng góp một mô hình tham chiếu thực tế cho việc ứng dụng LLM & Agentic AI trong lĩnh vực thương mại điện tử hàng không.
* **Hướng phát triển tương lai:**
  1. **Fine-tuning LLM riêng:** Huấn luyện mô hình AI riêng biệt trên tập dữ liệu hàng không Việt Nam để giảm chi phí API.
  2. **Tích hợp Trợ lý Giọng nói (Voice Assistant):** Hỗ trợ đặt vé bằng giọng nói trực tiếp trên ứng dụng di động.
  3. **Multi-Agent System:** Mở rộng hệ thống thành nhiều Agent chuyên trách (Agent Đổi vé, Agent Khiếu nại, Agent Gợi ý Du lịch).

---

### SLIDE 25: TRANG CẢM ƠN & HỎI ĐÁP (THANK YOU & Q&A)
* **XÂY DỰNG HỆ THỐNG TRỢ LÝ AI HỖ TRỢ KHÁCH HÀNG CHO NỀN TẢNG ĐẶT VÉ MÁY BAY**
* Xin chân thành cảm ơn Quý Thầy Cô và các bạn đã lắng nghe bài thuyết trình!
* **Trân trọng kính mời Quý Thầy Cô đặt câu hỏi thảo luận.**
* **Liên hệ & Demo:** SkyLink Airline Platform - Subsystem SkyAI Assistant.
