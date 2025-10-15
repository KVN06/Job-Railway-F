<?php

namespace App\Http\Controllers;

use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use App\Models\Unemployed;
use App\Models\Company;
use Illuminate\Support\Facades\Auth;
use Exception;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class GoogleController extends Controller
{
    public function redirectToGoogle(Request $request)
    {
        if ($request->has('type')) {
            session(['google_user_type' => $request->type]);
        } else {
            // Si no viene tipo, es login (no registro)
            session(['is_login_attempt' => true]);
        }
        
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            
            // Buscar usuario existente
            $user = User::where('email', $googleUser->getEmail())->first();

            if (!$user) {
                // USUARIO NUEVO
                
                // Verificar si es un intento de LOGIN (no registro)
                if (session('is_login_attempt')) {
                    session()->forget('is_login_attempt');
                    return redirect('/login')->withErrors([
                        'email' => 'Este correo no está registrado. Por favor regístrate primero.'
                    ]);
                }

                // Es REGISTRO - verificar que tenga tipo seleccionado
                $userType = session('google_user_type');
                
                if (!$userType) {
                    // Si no tiene tipo, redirigir al registro para que elija
                    return redirect('/register')->withErrors([
                        'email' => 'Por favor selecciona el tipo de cuenta antes de registrarte con Google.'
                    ]);
                }
                
                // Crear usuario con el tipo seleccionado
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'password' => Hash::make(Str::random(24)),
                    'type' => $userType,
                    'email_verified_at' => now(),
                ]);

                session()->forget('google_user_type');
                Auth::login($user);

                // Redirigir al formulario correspondiente
                if ($user->type == 'unemployed') {
                    return redirect()->route('unemployed-form');
                } else {
                    return redirect()->route('company-form');
                }

            } else {
                // USUARIO EXISTENTE - Solo iniciar sesión
                session()->forget(['google_user_type', 'is_login_attempt']);
                Auth::login($user);
                
                // Verificar si ya tiene perfil completo
                if ($user->type == 'unemployed') {
                    $hasProfile = Unemployed::where('user_id', $user->id)->exists();
                    if (!$hasProfile) {
                        return redirect()->route('unemployed-form');
                    }
                } else if ($user->type == 'company') {
                    $hasProfile = Company::where('user_id', $user->id)->exists();
                    if (!$hasProfile) {
                        return redirect()->route('company-form');
                    }
                }

                return redirect()->intended(route('home'));
            }

        } catch (Exception $e) {
            session()->forget(['google_user_type', 'is_login_attempt']);
            return redirect('/login')->withErrors('Error al iniciar sesión con Google: ' . $e->getMessage());
        }
    }
}