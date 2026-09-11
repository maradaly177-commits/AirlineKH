#!/bin/bash
set -e

echo "🚀 [CI/CD] Bắt đầu quá trình tự động Deploy AirlineKH..."

cd /var/www/AirlineKH

echo "📥 1. Kéo code mới từ GitHub..."
git config --global --add safe.directory /var/www/AirlineKH
git pull origin main

echo "⚙️ 2. Cập nhật Backend Laravel..."
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

sudo chmod -R 775 storage bootstrap/cache
sudo chown -R www-data:www-data storage bootstrap/cache

echo "📦 3. Build Frontend React..."
cd /var/www/AirlineKH/client
export NODE_OPTIONS="--max-old-space-size=2048"
npm install --no-audit --prefer-offline || npm install
npm run build

echo "🔄 4. Khởi động lại dịch vụ..."
sudo systemctl restart php8.2-fpm 2>/dev/null || sudo systemctl restart php8.3-fpm 2>/dev/null || sudo systemctl restart php-fpm
sudo systemctl restart nginx
pm2 restart airline-queue 2>/dev/null || true

echo "✅ [SUCCESS] Deploy hoàn tất 100%! Website đã cập nhật phiên bản mới nhất."
