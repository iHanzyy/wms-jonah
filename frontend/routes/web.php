<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Session management routes
    Route::post('/sessions', [DashboardController::class, 'store'])->name('sessions.store');
    Route::put('/sessions/{session}', [DashboardController::class, 'update'])->name('sessions.update');
    Route::delete('/sessions/{session}', [DashboardController::class, 'destroy'])->name('sessions.destroy');
    
    // Session control routes
    Route::get('/sessions/{session}/qr', [DashboardController::class, 'getQr'])->name('sessions.qr');
    Route::post('/sessions/{session}/start', [DashboardController::class, 'startSession'])->name('sessions.start');
    Route::post('/sessions/{session}/stop', [DashboardController::class, 'stopSession'])->name('sessions.stop');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
