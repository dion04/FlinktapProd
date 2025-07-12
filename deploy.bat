@echo off
echo 🚀 Starting Laravel deployment for shared hosting...

echo 📦 Installing Composer dependencies...
call composer install --optimize-autoloader --no-dev --no-scripts

echo 🔑 Generating application key...
call php artisan key:generate --force

echo 📦 Installing npm dependencies...
call npm install

echo 🏗️ Building production assets...
call npm run build

echo 🗂️ Optimizing configurations...
call php artisan config:cache
call php artisan route:cache
call php artisan view:cache

echo 🗄️ Running database migrations...
call php artisan migrate --force

echo 🔗 Creating storage link...
call php artisan storage:link

echo ✅ Deployment completed successfully!
echo 📝 Don't forget to:
echo    1. Update your .env file with correct database credentials
echo    2. Update APP_URL in .env to your domain
echo    3. Point your domain to the /public folder
echo    4. Ensure PHP version is 8.2 or higher on your hosting

pause
