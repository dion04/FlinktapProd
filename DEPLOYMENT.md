# FlinktapProd - Hostinger Shared Hosting Deployment Guide

## Prerequisites
- PHP 8.2 or higher
- MySQL database
- Node.js and npm (for building assets locally)
- Composer

## Deployment Steps for Hostinger Shared Hosting

### 1. Prepare Your Local Project

1. **Clone/Download** this repository to your local machine
2. **Install dependencies** locally:
   ```bash
   composer install
   npm install
   ```

3. **Build production assets**:
   ```bash
   npm run build
   ```

4. **Generate application key**:
   ```bash
   php artisan key:generate
   ```

### 2. Configure Environment

1. **Update `.env` file** with your Hostinger database credentials:
   ```env
   APP_URL=https://yourdomain.com
   DB_HOST=localhost
   DB_DATABASE=your_database_name
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

2. **Set up social authentication** (if using):
   - Update GitHub, Google, and Apple client credentials in `.env`

### 3. Upload to Hostinger

#### Option A: Upload entire project to root
1. Upload all files to your domain's root directory
2. The root `.htaccess` will handle redirecting to the `public` folder

#### Option B: Upload public folder to root (Recommended)
1. Upload the contents of the `public` folder to your domain's root directory
2. Upload all other folders (app, bootstrap, config, etc.) one level up from root
3. Update `public/index.php` to point to the correct paths:
   ```php
   require __DIR__.'/../vendor/autoload.php';
   $app = require_once __DIR__.'/../bootstrap/app.php';
   ```

### 4. Database Setup

1. **Create database** in Hostinger control panel
2. **Import database** or run migrations:
   ```bash
   php artisan migrate --force
   ```

### 5. Final Configuration

1. **Set permissions**:
   - `storage/` folder: 755 or 777
   - `bootstrap/cache/` folder: 755 or 777

2. **Create storage link**:
   ```bash
   php artisan storage:link
   ```

3. **Cache configurations**:
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

### 6. Verify Installation

1. Visit your domain
2. Check that:
   - Laravel welcome page or your app loads
   - CSS/JS assets are loading
   - Database connections work
   - Social authentication works (if configured)

## Quick Deployment Script

For faster deployment, you can use the included scripts:

**Windows:**
```bash
deploy.bat
```

**Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh
```

## Troubleshooting

### Common Issues:

1. **500 Internal Server Error**
   - Check file permissions (storage and bootstrap/cache folders)
   - Verify .env configuration
   - Check error logs in cPanel

2. **Assets not loading**
   - Ensure `npm run build` was executed
   - Check APP_URL in .env matches your domain
   - Verify Vite assets are in public/build folder

3. **Database connection errors**
   - Double-check database credentials in .env
   - Ensure database exists in Hostinger panel

4. **Social auth not working**
   - Update redirect URIs in social app settings
   - Verify client IDs and secrets in .env

## File Structure for Shared Hosting

```
your-domain.com/
├── .htaccess (redirects to public)
├── app/
├── bootstrap/
├── config/
├── database/
├── resources/
├── routes/
├── storage/
├── vendor/
├── .env
├── composer.json
└── public/ (or contents moved to root)
    ├── index.php
    ├── .htaccess
    └── build/ (Vite assets)
```

## Security Notes

- Never expose `.env` files
- Use HTTPS in production
- Regularly update dependencies
- Monitor error logs
- Use strong database passwords

## Support

For deployment issues:
1. Check Hostinger documentation
2. Verify PHP version compatibility
3. Check error logs in cPanel
4. Ensure all dependencies are installed
