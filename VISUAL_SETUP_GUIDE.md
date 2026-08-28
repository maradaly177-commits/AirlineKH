# 📌 FRESH CLONE - VISUAL STEP BY STEP

```
Project Mới Clone Từ GitHub
        │
        ▼
┌─────────────────────────────────────────────┐
│  Bước 1: Thiết Lập Backend (Terminal 1)     │
└─────────────────────────────────────────────┘
        │
        ├─ cd AirlineKH
        ├─ composer install              ⏱️  ~3 phút
        ├─ copy .env.example .env
        ├─ php artisan key:generate
        ├─ php artisan migrate:fresh --seed  ⏱️  ~2 phút
        ├─ php artisan storage:link
        │
        └─ ✅ Backend ready
                │
                ▼
┌─────────────────────────────────────────────┐
│  Bước 2: Thiết Lập Frontend (Terminal 1)    │
└─────────────────────────────────────────────┘
        │
        ├─ cd client
        ├─ npm install                   ⏱️  ~3-5 phút
        ├─ copy .env.example .env
        ├─ cd ..
        │
        └─ ✅ Frontend ready
                │
                ▼
┌─────────────────────────────────────────────┐
│  Bước 3: Cài Ollama (Máy Tính)              │
└─────────────────────────────────────────────┘
        │
        ├─ Download: https://ollama.ai
        ├─ Chạy installer
        ├─ Terminal mới: ollama pull qwen2.5:3b
        │
        └─ ✅ Ollama ready
                │
                ▼
┌─────────────────────────────────────────────┐
│  Bước 4: Chạy 3 Services (3 Terminal)       │
└─────────────────────────────────────────────┘
        │
        ├─ Terminal 1: php artisan serve
        │               (Port 8000 - Backend)
        │
        ├─ Terminal 2: ollama serve
        │               (Port 11434 - AI)
        │
        ├─ Terminal 3: cd client && npm run dev
        │               (Port 5173 - Frontend)
        │
        └─ ✅ All services running
                │
                ▼
         Browser: http://127.0.0.1:5173
                │
                ▼
            🎉 SUCCESS!
```

---

## 🎯 Command Cheat Sheet

### Clone Lần Đầu
```bash
# Terminal (tại C:\Projects hoặc thư mục của bạn)
git clone https://github.com/yourname/AirlineKH.git
cd AirlineKH
```

### Setup Backend
```bash
# Cài composer packages
composer install

# Copy .env template
copy .env.example .env

# Tạo APP_KEY
php artisan key:generate

# Tạo database + migrations + seeders
php artisan migrate:fresh --seed

# Link storage
php artisan storage:link
```

### Setup Frontend
```bash
# Di chuyển vào folder client
cd client

# Cài npm packages
npm install

# Copy .env template
copy .env.example .env

# Quay lại folder gốc
cd ..
```

### Setup Ollama
```bash
# Tải file từ https://ollama.ai

# Chạy ollama service
ollama serve

# Trong terminal khác, tải model
ollama pull qwen2.5:3b
```

### Chạy Ứng Dụng
```bash
# TERMINAL 1
cd AirlineKH
php artisan serve
# Output: Server running at http://127.0.0.1:8000

# TERMINAL 2
ollama serve
# Output: Running...

# TERMINAL 3
cd AirlineKH/client
npm run dev
# Output: Local: http://127.0.0.1:8000
```

---

## 📊 Timeline

| Bước | Công Việc | Thời Gian |
|------|-----------|----------|
| 1 | Clone project | 1 phút |
| 2 | Cài Composer | 3 phút |
| 3 | Tạo Database | 1 phút |
| 4 | Chạy Migrations | 2 phút |
| 5 | Cài npm | 5 phút |
| 6 | Cài Ollama | 5 phút |
| 7 | Chạy Services | 1 phút |
| **TỔNG** | | **~18 phút** |

---

## 📋 Checklist Trước Khi Chạy

- [ ] Đã clone project từ GitHub
- [ ] Đã cài Composer
- [ ] Đã cài Node.js (npm)
- [ ] Đã tạo database `airline_kh`
- [ ] Đã chạy `php artisan migrate:fresh --seed`
- [ ] Đã chạy `npm install` trong folder `client`
- [ ] Đã tải model Ollama: `ollama pull qwen2.5:3b`
- [ ] Đã tạo file `.env` (backend)
- [ ] Đã tạo file `client/.env` (frontend)

---

## 🔍 Các File Quan Trọng Sau Setup

```
AirlineKH/
├── .env                          ✅ (Được tạo, chứa DB config)
├── vendor/                       ✅ (Được tạo, dependencies)
├── storage/app/                  ✅ (Sẵn có, storage files)
├── bootstrap/cache/              ✅ (Sẵn có, cache)
│
├── client/
│   ├── .env                      ✅ (Được tạo, API config)
│   ├── node_modules/             ✅ (Được tạo, dependencies)
│   ├── vite.config.js            ✅ (Đã config proxy)
│   └── src/
│       └── api.jsx               ✅ (API client)
│
├── app/
│   ├── Http/Controllers/
│   │   └── Api/
│   │       └── AI/
│   │           └── AIChatController.php  ✅ (AI endpoint)
│   └── Services/
│       └── AI/                   ✅ (AI logic)
│
└── routes/
    └── api.php                   ✅ (API routes)
```

---

## 🚨 Lỗi + Giải Pháp

### ❌ "No such file or directory" (Database)
```bash
# Tạo database
mysql -u root -e "CREATE DATABASE airline_kh;"

# Thử lại
php artisan migrate:fresh --seed
```

### ❌ "npm: command not found"
```bash
# Cài Node.js: https://nodejs.org (LTS version)
# Verify:
node --version     # v18.x.x hoặc cao hơn
npm --version      # 9.x.x hoặc cao hơn
```

### ❌ "Composer not found"
```bash
# Cài Composer: https://getcomposer.org
# Verify:
composer --version
```

### ❌ "Port 8000 already in use"
```bash
# Thay đổi port backend
php artisan serve --port=8001

# Hoặc frontend
cd client && npm run dev -- --port 5173
```

### ❌ "SQLSTATE Connection Error"
```bash
# Kiểm tra .env file:
# DB_HOST=127.0.0.1  ✅
# DB_DATABASE=airline_kh  ✅
# DB_USERNAME=root  ✅
# DB_PASSWORD=       ✅ (để trống nếu không có password)

# Tạo lại database
php artisan migrate:fresh --seed
```

### ❌ "Ollama connection refused"
```bash
# Chạy Ollama
ollama serve

# Kiểm tra model
ollama list
ollama pull qwen2.5:3b  # Nếu chưa có
```

---

## ✅ Test Kết Quả

### Test 1: Backend API
```bash
# Mở terminal mới, gửi request:
curl http://127.0.0.1:8000/api/airports

# Kết quả: Nên thấy JSON array
# ✅ Backend hoạt động
```

### Test 2: Ollama
```bash
# Mở terminal mới:
curl http://127.0.0.1:11434/api/tags

# Kết quả: Nên thấy JSON với models
# ✅ Ollama hoạt động
```

### Test 3: Frontend
```bash
# Mở browser:
http://127.0.0.1:8000

# Kết quả: Nên thấy trang login
# ✅ Frontend hoạt động
```

### Test 4: Login
```
Email: admin@example.com
Password: password

# Kết quả: Vào được dashboard
# ✅ Authentication hoạt động
```

### Test 5: Chat
```
1. Nhấp icon chat (góc dưới phải)
2. Gửi tin nhắn: "Hello"
3. Đợi 2-3 giây

# Kết quả: Thấy AI response
# ✅ AI chat hoạt động
```

---

## 🎓 Học Thêm

Nếu bạn muốn hiểu rõ hơn:

- **FRESH_CLONE_SETUP.md** - Hướng dẫn chi tiết từng bước
- **QUICK_START.md** - Tóm tắt các lệnh cần chạy
- **FRONTEND_BACKEND_CONNECTION_GUIDE.md** - Kiến trúc chi tiết
- **CONNECTION_CHECKLIST.md** - Danh sách kiểm tra & test

---

## 💾 Một Lệnh Setup Tất Cả (Windows)

Tạo file `setup-all.bat`:

```batch
@echo off
echo Setting up AirlineKH...

cd AirlineKH
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan storage:link

cd client
npm install
copy .env.example .env
cd ..

echo Setup complete!
echo.
echo Next steps:
echo 1. Terminal 1: php artisan serve
echo 2. Terminal 2: ollama serve
echo 3. Terminal 3: cd client && npm run dev
echo 4. Browser: http://127.0.0.1:8000
echo.
pause
```

Chạy:
```bash
setup-all.bat
```

---

## 🏃 Fast Track (Chuyên gia)

```bash
cd AirlineKH
composer install && cp .env.example .env && php artisan key:generate && php artisan migrate:fresh --seed && php artisan storage:link
cd client && npm install && cp .env.example .env && cd ..
```

Sau đó mở 3 terminal:
```bash
# T1
php artisan serve

# T2
ollama serve

# T3
cd client && npm run dev
```

Browser: `http://127.0.0.1:8000`

---

## 📞 FAQ

**Q: Frontend và Backend dùng port như thế nào?**  
A: Backend (Laravel) chạy ở port 8000, Frontend (Vite Dev Server) chạy ở port 5173. Frontend dùng Proxy trong `vite.config.js` để chuyển tiếp các request `/api` tới Backend (port 8000).

**Q: Hai service có thể chạy chung 1 port được không?**  
A: Không! 2 server độc lập không thể lắng nghe cùng 1 TCP port (như 8000). Nếu đặt Frontend port 8000, Vite sẽ bị vòng lặp Proxy chính nó (`ENOBUFS`).

**Q: Database nào?**  
A: MySQL mặc định. Có thể dùng SQLite, PostgreSQL bằng cách sửa `.env`.

**Q: Ollama bắt buộc?**  
A: Nếu muốn AI chat thực. Hoặc đặt `VITE_USE_AI_MOCK=true` để test với dữ liệu giả.

**Q: Lần sau chạy lại?**  
A: Chỉ cần chạy 3 terminal (không cần setup lại):
```bash
# T1: php artisan serve (port 8000)
# T2: ollama serve (port 11434)
# T3: cd client && npm run dev (port 5173)
```

---

## 🎯 Success Criteria

✅ Terminal 1: "Server running at http://127.0.0.1:8000"  
✅ Terminal 2: "Ollama service running"  
✅ Terminal 3: "Local: http://127.0.0.1:5173"  
✅ Browser: Thấy trang login  
✅ Đăng nhập thành công  
✅ Chat widget hoạt động  
✅ AI phản hồi  

---

**Bạn sẽ chạy xong trong khoảng 15-20 phút!** 🚀

Cần hỏi gì thêm không?
