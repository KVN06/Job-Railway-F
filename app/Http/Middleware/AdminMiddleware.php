<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Verificar si el usuario está autenticado
        if (!Auth::check()) {
            return redirect()->route('login')->with('error', 'Debes iniciar sesión.');
        }

        // Verificar si el usuario es admin
        if (Auth::user()->type !== 'admin') {
            return redirect('/')->with('error', 'No tienes permisos de administrador.');
        }

        return $next($request);
    }
}