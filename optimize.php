<?php

/**
 * Production Optimization Script for Shared Hosting
 * Run this after deployment to optimize your Laravel app for production
 */

echo "🚀 Optimizing Laravel for production...\n\n";

// Check if we're in the right directory
if (!file_exists('artisan')) {
    echo "❌ Error: artisan file not found. Please run this script from your Laravel root directory.\n";
    exit(1);
}

// Check PHP version
$phpVersion = PHP_VERSION;
echo "🔍 PHP Version: $phpVersion\n";
if (version_compare($phpVersion, '8.2.0') < 0) {
    echo "⚠️  Warning: PHP 8.2 or higher is recommended for Laravel 12\n";
}

// Check if .env exists
if (!file_exists('.env')) {
    echo "❌ Error: .env file not found. Please create it from .env.example\n";
    exit(1);
}

echo "✅ Environment file found\n";

// Generate app key if not set
echo "🔑 Checking application key...\n";
$envContent = file_get_contents('.env');
if (strpos($envContent, 'APP_KEY=') === false || preg_match('/APP_KEY=\s*$/', $envContent)) {
    echo "🔑 Generating application key...\n";
    exec('php artisan key:generate --force');
} else {
    echo "✅ Application key already set\n";
}

// Check database connection
echo "🗄️  Testing database connection...\n";
exec('php artisan migrate:status 2>&1', $output, $returnCode);
if ($returnCode === 0) {
    echo "✅ Database connection successful\n";
} else {
    echo "⚠️  Warning: Database connection issues detected\n";
    echo "Please check your database credentials in .env\n";
}

// Clear and cache configurations
echo "🗂️  Caching configurations...\n";
exec('php artisan config:cache');
exec('php artisan route:cache');
exec('php artisan view:cache');
echo "✅ Configurations cached\n";

// Check storage permissions
echo "🔐 Checking storage permissions...\n";
$storagePermissions = substr(sprintf('%o', fileperms('storage')), -4);
$cachePermissions = substr(sprintf('%o', fileperms('bootstrap/cache')), -4);

echo "Storage permissions: $storagePermissions\n";
echo "Cache permissions: $cachePermissions\n";

if ($storagePermissions < 755 || $cachePermissions < 755) {
    echo "⚠️  Warning: Insufficient permissions. Please set 755 or 777 for storage and bootstrap/cache\n";
} else {
    echo "✅ Permissions look good\n";
}

// Check if storage link exists
echo "🔗 Checking storage link...\n";
if (is_link('public/storage')) {
    echo "✅ Storage link exists\n";
} else {
    echo "🔗 Creating storage link...\n";
    exec('php artisan storage:link');
}

// Check if Vite assets are built
echo "🏗️  Checking built assets...\n";
if (is_dir('public/build')) {
    $files = array_diff(scandir('public/build'), array('.', '..'));
    if (count($files) > 0) {
        echo "✅ Vite assets found (" . count($files) . " files)\n";
    } else {
        echo "⚠️  Warning: No built assets found. Run 'npm run build' locally\n";
    }
} else {
    echo "⚠️  Warning: Build directory not found. Run 'npm run build' locally\n";
}

// Final checks
echo "\n🎯 Final Checklist:\n";
echo "[ ] Update APP_URL in .env to your domain\n";
echo "[ ] Set up database credentials in .env\n";
echo "[ ] Configure social auth credentials (if using)\n";
echo "[ ] Point domain to public folder or use root .htaccess\n";
echo "[ ] Test all functionality on live site\n";

echo "\n✅ Optimization complete!\n";
echo "📝 Check DEPLOYMENT.md for detailed instructions\n";
