<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use App\Http\Middleware\AdminMiddleware;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Middleware existente
        $router = $this->app['router'];
        $router->aliasMiddleware('admin', AdminMiddleware::class);

        // Forzar URL base al usar Google localmente
        if ($this->app->environment('local')) {
            URL::forceRootUrl('http://localhost:8000');
        }
    }
}

