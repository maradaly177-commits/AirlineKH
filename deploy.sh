#!/bin/bash
set -e

# Load environment & NVM paths for non-interactive SSH
source ~/.profile 2>/dev/null || true
source ~/.bashrc 2>/dev/null || true
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
export PATH=$PATH:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin

echo "🚀 [CI/CD] Bắt đầu quá trình tự động Deploy AirlineKH..."

cd /var/www/AirlineKH

echo "📥 1. Kéo code mới từ GitHub..."
git config --global --add safe.directory /var/www/AirlineKH
git reset --hard HEAD
git pull origin main

if ! command -v git-lfs >/dev/null 2>&1; then
    echo "📥 Đang cài đặt git-lfs..."
    sudo apt-get update -y && sudo apt-get install -y git-lfs
    git lfs install
fi
git lfs pull

echo "⚙️ 2. Cập nhật Backend Laravel..."
sudo chown -R ubuntu:www-data /var/www/AirlineKH
sudo chmod -R 777 storage bootstrap/cache

composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan config:clear
php artisan route:clear
php artisan cache:clear

echo "📦 3. Build Frontend React..."
cd /var/www/AirlineKH/client
export NODE_OPTIONS="--max-old-space-size=2048"
npm install --no-audit --prefer-offline || npm install
npm run build
cp -f /var/www/AirlineKH/client/public/hero.mp4 /var/www/AirlineKH/client/dist/hero.mp4 2>/dev/null || true

echo "🔄 4. Khởi động lại dịch vụ..."
cd /var/www/AirlineKH
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache

sudo systemctl restart php8.2-fpm 2>/dev/null || sudo systemctl restart php8.3-fpm 2>/dev/null || sudo systemctl restart php-fpm
sudo systemctl restart nginx
pm2 restart airline-queue 2>/dev/null || true

echo "✅ [SUCCESS] Deploy hoàn tất 100%! Website đã cập nhật phiên bản mới nhất."
