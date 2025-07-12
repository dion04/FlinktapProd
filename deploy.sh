#!/bin/bash

# Laravel Production Deployment Script for Shared Hosting
echo "🚀 Starting Laravel deployment for shared hosting..."

# Install Composer dependencies (production only)
echo "📦 Installing Composer dependencies..."
composer install --optimize-autoloader --no-dev --no-scripts

# Generate application key if not set
echo "🔑 Generating application key..."
php artisan key:generate --force

# Install npm dependencies
echo "📦 Installing npm dependencies..."
npm install

# Build production assets
echo "🏗️ Building production assets..."
npm run build

# Clear and cache configs
echo "🗂️ Optimizing configurations..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations
echo "🗄️ Running database migrations..."
php artisan migrate --force

# Create storage link
echo "🔗 Creating storage link..."
php artisan storage:link

# Set correct permissions
echo "🔐 Setting permissions..."
chmod -R 755 storage
chmod -R 755 bootstrap/cache

echo "✅ Deployment completed successfully!"
echo "📝 Don't forget to:"
echo "   1. Update your .env file with correct database credentials"
echo "   2. Update APP_URL in .env to your domain"
echo "   3. Point your domain to the /public folder"
echo "   4. Ensure PHP version is 8.2 or higher on your hosting"
