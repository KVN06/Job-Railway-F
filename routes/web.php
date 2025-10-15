<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UnemployedController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\JobOfferController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\JobApplicationController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\TrainingController;
use App\Http\Controllers\ClassifiedController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\GoogleController;


// Rutas públicas
Route::view('/', 'pages.landing')->name('landing');
Route::get('/login', [UserController::class, 'showLoginForm'])->name('login');
Route::view('/home', 'pages.home')->middleware('auth')->name('home');

Route::get('auth/google', [GoogleController::class, 'redirectToGoogle'])->name('google.login');
Route::get('auth/google/callback', [GoogleController::class, 'handleGoogleCallback'])->name('google.callback');

// Usuario
Route::get('/register', [UserController::class, 'create'])->name('register');
Route::post('/crearUsuario', [UserController::class, 'agg_user'])->name('create-user');
Route::post('/inicia-sesion', [UserController::class, 'login'])->name('inicia-sesion');
Route::post('/logout', [UserController::class, 'logout'])->name('logout');

// Mensajes (solo auth)
Route::middleware('auth')->group(function () {
    Route::get('/messages', [MessageController::class, 'index'])->name('messages');
    Route::get('/message/create', [MessageController::class, 'create'])->name('message-form');
    Route::post('/message/send', [MessageController::class, 'send_message'])->name('send-message');

    // Notificaciones
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{id}/mark-as-read', [NotificationController::class, 'markAsRead'])->name('notifications.mark-as-read');
    Route::get('/notifications/unread-count', [NotificationController::class, 'getUnreadCount'])->name('notifications.unread-count');

    // Configuración de usuario
    Route::get('/settings', [SettingsController::class, 'edit'])->name('settings.edit');
    Route::patch('/settings', [SettingsController::class, 'updatePreferences'])->name('settings.update');
    Route::patch('/settings/profile', [SettingsController::class, 'updateProfile'])->name('settings.profile.update');
    Route::patch('/settings/password', [SettingsController::class, 'updatePassword'])->name('settings.password.update');
    Route::post('/settings/logout-all', [SettingsController::class, 'logoutAllSessions'])->name('settings.logout-all');
    Route::delete('/settings', [SettingsController::class, 'destroy'])->name('settings.destroy');
});

// Unemployed
Route::get('/unemployed-form', [UnemployedController::class, 'create'])->name('unemployed-form');
Route::post('/agg-unemployed', [UnemployedController::class, 'agg_unemployed'])->name('agg-unemployed');

// Company
Route::get('/company-form', [CompanyController::class, 'create'])->name('company-form');
Route::post('/agg-company', [CompanyController::class, 'agg_company'])->name('agg-company');

// Portfolios
Route::get('/portfolio-list', [PortfolioController::class, 'list'])->name('portfolios.index');
Route::get('/portfolio-form', [PortfolioController::class, 'create'])->name('portfolio-form');
Route::post('/agg-portfolio', [PortfolioController::class, 'store'])->name('agg-portfolio');
Route::get('/portfolio-edit/{id}', [PortfolioController::class, 'edit'])->name('edit-portfolio');
Route::post('/portfolio-update/{id}', [PortfolioController::class, 'update'])->name('update-portfolio');
Route::delete('/portfolio-delete/{id}', [PortfolioController::class, 'destroy'])->name('delete-portfolio');

// Job Offers
Route::get('/joboffers', [JobOfferController::class, 'index'])->name('job-offers.index');
Route::get('/crear', [JobOfferController::class, 'create'])->name('job-offers.create');
Route::post('/joboffers', [JobOfferController::class, 'store'])->name('job-offers.store');
Route::get('/joboffers/{jobOffer}', [JobOfferController::class, 'show'])->name('job-offers.show');
Route::get('/joboffers/{jobOffer}/editar', [JobOfferController::class, 'edit'])->name('job-offers.edit');
Route::put('/joboffers/{jobOffer}', [JobOfferController::class, 'update'])->name('job-offers.update');
Route::delete('/joboffers/{jobOffer}', [JobOfferController::class, 'destroy'])->name('job-offers.destroy');



// Postulaciones (Job Applications)
Route::middleware(['auth'])->group(function () {
    Route::get('/job-applications/create', [JobApplicationController::class, 'create'])->name('job-applications.create');
    Route::post('/job-applications', [JobApplicationController::class, 'store'])->name('job-applications.store');
    Route::patch('/job-applications/{id}/status', [JobApplicationController::class, 'updateStatus'])->name('job-applications.update-status');
    Route::get('/job-applications/company', [JobApplicationController::class, 'indexCompany'])->name('job-applications.index-company');
    Route::get('/job-applications/unemployed', [JobApplicationController::class, 'indexUnemployed'])->name('job-applications.index-unemployed');
    Route::get('/job-applications/{id}/download-cv', [JobApplicationController::class, 'downloadCv'])->name('job-applications.download-cv');

    // Rutas para entrevistas (programar y ver)
    Route::get('/interviews/{applicationId}', [\App\Http\Controllers\InterviewController::class, 'index'])->name('interviews.index');
    Route::post('/interviews/{applicationId}', [\App\Http\Controllers\InterviewController::class, 'store'])->name('interviews.store');

    Route::resource('classifieds', ClassifiedController::class);


    // Trainings
    Route::get('/trainings', [TrainingController::class, 'index'])->name('training.public.index');

});

// Companies
Route::get('/Companies', [CompanyController::class, 'index'])->name('index');
Route::get('/Company/{company}', [CompanyController::class, 'show'])->name('show');

// Trainings
Route::get('/capacitaciones', [TrainingController::class, 'index'])->name('training.index');
Route::middleware('auth')->group(function () {
    Route::get('/capacitaciones/crear', [TrainingController::class, 'create'])->name('training.create');
    Route::post('/capacitaciones', [TrainingController::class, 'store'])->name('training.store');
    Route::get('/capacitaciones/{id}/editar', [TrainingController::class, 'edit'])->name('training.edit');
    Route::put('/capacitaciones/{id}', [TrainingController::class, 'update'])->name('training.update');
    Route::delete('/capacitaciones/{id}', [TrainingController::class, 'destroy'])->name('training.destroy');
});



Route::middleware(['auth'])->group(function () {
    Route::resource('classifieds', ClassifiedController::class);
});

// corrigiendo esto
// Route::post('/favorites/toggle', [FavoriteController::class, 'toggle'])->name('favorites.toggle');
Route::post('/favorites/toggle', [FavoriteController::class, 'toggle'])->middleware('auth')->name('favorites.toggle');
Route::get('/favorites', [FavoriteController::class, 'index'])->middleware('auth')->name('favorites.index');
Route::post('/favorites/classifieds/{classified}/toggle', [FavoriteController::class, 'toggleClassified'])->middleware(['auth'])->name('favorites.classifieds.toggle');

use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;

// Mostrar formulario "¿Olvidaste tu contraseña?"
Route::get('/forgot-password', [PasswordResetLinkController::class, 'create'])
    ->name('password.request');

// Enviar correo con enlace de recuperación
Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
    ->name('password.email');

// Mostrar formulario de nueva contraseña (desde el enlace del correo)
Route::get('/reset-password/{token}', [NewPasswordController::class, 'create'])
    ->name('password.reset');

// Guardar nueva contraseña
Route::post('/reset-password', [NewPasswordController::class, 'store'])
    ->name('password.update');


    // Grupo de rutas ADMIN
Route::prefix('admin')->name('admin.')->middleware(['auth', 'admin'])->group(function () {

    // Dashboard
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');

    // Clasificados - SOLO index, edit, update, destroy
    Route::get('/classifieds', [AdminController::class, 'classifieds'])->name('classifieds.index');
    Route::get('/classifieds/{classified}/edit', [ClassifiedController::class, 'edit'])->name('classifieds.edit');
    Route::put('/classifieds/{classified}', [ClassifiedController::class, 'update'])->name('classifieds.update');
    Route::delete('/classifieds/{classified}', [ClassifiedController::class, 'destroy'])->name('classifieds.destroy');

    // Ofertas Laborales - SOLO index, edit, update, destroy
    Route::get('/job-offers', [AdminController::class, 'jobOffers'])->name('job-offers.index');
    Route::get('/job-offers/{jobOffer}/edit', [JobOfferController::class, 'edit'])->name('job-offers.edit');
    Route::put('/job-offers/{jobOffer}', [JobOfferController::class, 'update'])->name('job-offers.update');
    Route::delete('/job-offers/{jobOffer}', [JobOfferController::class, 'destroy'])->name('job-offers.destroy');

       // Capacitaciones - RUTAS EXPLÍCITAS
    Route::get('/trainings', [AdminController::class, 'trainings'])->name('trainings.index');
    Route::get('/trainings/create', [TrainingController::class, 'create'])->name('trainings.create');
    Route::post('/trainings', [TrainingController::class, 'store'])->name('trainings.store');
    Route::get('/trainings/{id}', [TrainingController::class, 'show'])->name('trainings.show');
    Route::get('/trainings/{id}/edit', [TrainingController::class, 'edit'])->name('trainings.edit');
    Route::put('/trainings/{id}', [TrainingController::class, 'update'])->name('trainings.update');
    Route::delete('/trainings/{id}', [TrainingController::class, 'destroy'])->name('trainings.destroy');







    // Usuarios - TODAS las rutas
    Route::resource('users', UserController::class)->names([
        'index' => 'users.index',
        'create' => 'users.create',
        'store' => 'users.store',
        'show' => 'users.show',
        'edit' => 'users.edit',
        'update' => 'users.update',
        'destroy' => 'users.destroy'
    ]);
});
