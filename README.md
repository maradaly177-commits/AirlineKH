# ✈️ Hệ Thống Quản Lý Và Đặt Vé Máy Bay Trực Tuyến (Flight Booking System)

> **Mô hình kiến trúc:** Web API (Decoupled Architecture) 
> **Công nghệ lõi:** Laravel 11 (Backend) + ReactJS Vite (Frontend) + MySQL
> **Design Pattern:** Service - Repository Pattern

## 📖 1. Giới Thiệu Dự Án
Dự án được xây dựng nhằm tối ưu hóa quy trình đặt chỗ, quản lý chuyến bay và các dịch vụ hàng không đi kèm. Hệ thống tách biệt hoàn toàn Frontend và Backend để đảm bảo tính mở rộng, hiệu suất cao và chuẩn hóa quy trình làm việc nhóm theo mô hình doanh nghiệp.

### 🌟 Tính năng cốt lõi:
- **Người dùng:** Tìm kiếm chuyến bay thời gian thực, chọn chỗ ngồi trực quan (Seat Map), mua dịch vụ bổ trợ, thanh toán và làm thủ tục trực tuyến (Check-in).
- **Quản trị viên:** Quản lý đội bay, lên lịch trình chuyến bay, thiết lập sơ đồ ghế ngồi và thống kê doanh thu.

---

## 🛠️ 2. Quy Trình Cài Đặt Môi Trường (Local Setup)

**Yêu cầu hệ thống:** PHP >= 8.2, Composer, Node.js (v18+), MySQL (v8.0+).

### 2.1. Cài đặt Backend (Laravel)
```bash
# Di chuyển vào thư mục backend
cd airline-backend

# Cài đặt thư viện PHP
composer install

# Khởi tạo file môi trường
cp .env.example .env
php artisan key:generate
///////////////////////////////////////////////////////////////////////////////////
Cấu hình Database: Mở file .env, tìm và sửa các dòng sau cho khớp với máy cá nhân:

DB_DATABASE=airline_db (Nhớ tạo database này trong phpMyAdmin trước)

DB_USERNAME=root

DB_PASSWORD= (Để trống nếu dùng XAMPP mặc định)
/////////////////////////////////////////////////////////////////////////////
# Khởi tạo bảng và đổ 50 chuyến bay mẫu
php artisan migrate:fresh --seed

# Chạy Server
php artisan serve


Cài đặt Frontend (ReactJS)
# Mở terminal mới và di chuyển vào thư mục frontend
cd airline-frontend

# Cài đặt thư viện Node
npm install

# Chạy Server Frontend
npm run dev


3. Quy trình làm việc với Git (BẮT BUỘC TUÂN THỦ)
Bước 1: Cập nhật code mới nhất từ Lead
git checkout develop
git pull origin develop

Bước 2: Tạo nhánh riêng để làm tính năng
# Ví dụ: feature/api-login
git checkout -b feature/ten-chuc-nang

Bước 3: Đẩy code lên để Review
git add .
git commit -m "Feat: Hoàn thành API [Tên chức năng]"
git push origin feature/ten-chuc-nang

Bước 4: Lên GitHub tạo Pull Request (PR) vào nhánh develop và nhờ thành viên trong nhóm vào để check code.





Admin: admin@skylink.com / Pass: 123456
