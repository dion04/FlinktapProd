<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Schedule daily batch count update
Schedule::command('batch:update-counts')
    ->daily()
    ->description('Update batch counts to reflect only active resolve codes');
