# Multi-stage Dockerfile cho SkyLink Airline (Laravel 12 + React Vite)
FROM php:8.2-fpm-alpine

# Cài đặt các extension hệ thống cần thiết
RUN apk add --no-cache \
    nginx \
    supervisor \
    curl \
    git \
    nodejs \
    npm \
    libpng-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    oniguruma-dev

# Cài đặt PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Cài đặt Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Thiết lập thư mục làm việc
WORKDIR /var/www

# Copy toàn bộ source code
COPY . /var/www

# Cài đặt PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Build Frontend React
WORKDIR /var/www/client
RUN npm install && npm run build

# Quay lại thư mục gốc và phân quyền
WORKDIR /var/www
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
RUN chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Expose port HTTP & HTTPS
EXPOSE 80 443

CMD ["php-fpm"]
