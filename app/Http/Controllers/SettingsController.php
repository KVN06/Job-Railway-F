<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class SettingsController extends Controller
{
    /**
     * Show the user preferences form.
     */
    public function edit(Request $request)
    {
        $user = $request->user();

        return view('settings.index', [
            'user' => $user,
        ]);
    }

    /**
     * Update the user preferences.
     */
    public function updatePreferences(Request $request): RedirectResponse
    {
        $anchor = $request->input('redirect_to', '#notificaciones');

        $validator = Validator::make($request->all(), [
            'notify_email' => ['sometimes', 'boolean'],
            'notify_platform' => ['sometimes', 'boolean'],
            'dark_mode' => ['sometimes', 'boolean'],
            'theme' => ['sometimes', Rule::in(['light', 'dark'])],
            'redirect_to' => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return redirect()->to(route('settings.edit') . $anchor)
                ->withErrors($validator, 'preferences')
                ->withInput($request->except(['current_password', 'password', 'password_confirmation']));
        }

        $validated = $validator->validated();

        $user = $request->user();

        if ($request->has('notify_email')) {
            $user->notify_email = (bool) $validated['notify_email'];
        }

        if ($request->has('notify_platform')) {
            $user->notify_platform = (bool) $validated['notify_platform'];
        }

        if (array_key_exists('theme', $validated)) {
            $user->dark_mode = $validated['theme'] === 'dark';
        } elseif ($request->has('dark_mode')) {
            $user->dark_mode = (bool) $validated['dark_mode'];
        }

        $user->save();

        return redirect()->to(route('settings.edit') . $anchor)
            ->with('success', 'Tus preferencias se actualizaron correctamente.')
            ->with('success_anchor', $anchor);
    }

    /**
     * Update basic account information (name and email).
     */
    public function updateProfile(Request $request): RedirectResponse
    {
        $user = $request->user();

        $anchor = $request->input('redirect_to', '#cuenta');

        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'current_password' => ['nullable', 'string'],
            'redirect_to' => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return redirect()->to(route('settings.edit') . $anchor)
                ->withErrors($validator, 'profile')
                ->withInput($request->except([]));
        }

        $validated = $validator->validated();
        $emailChanged = array_key_exists('email', $validated) && $validated['email'] !== $user->email;

        if ($emailChanged) {
            if (empty($validated['current_password']) || !Hash::check($validated['current_password'], $user->password)) {
                return redirect()->to(route('settings.edit') . $anchor)
                    ->withErrors([
                        'current_password' => 'Debes ingresar tu contraseña actual para cambiar el correo.',
                    ], 'profile')
                    ->withInput($request->except(['current_password']));
            }

            if ($user->getAttribute('email_verified_at') !== null) {
                $user->email_verified_at = null;
            }
        }

        unset($validated['redirect_to'], $validated['current_password']);

        $user->fill($validated)->save();

        if ($emailChanged && $user instanceof MustVerifyEmail) {
            $user->sendEmailVerificationNotification();
        }

        return redirect()->to(route('settings.edit') . $anchor)
            ->with('success', 'Información de la cuenta actualizada correctamente.')
            ->with('success_anchor', $anchor);
    }

    /**
     * Update the user password ensuring the current one matches.
     */
    public function updatePassword(Request $request): RedirectResponse
    {
        $anchor = $request->input('redirect_to', '#seguridad');

        $validator = Validator::make($request->all(), [
            'current_password' => ['required'],
            'password' => ['required', 'confirmed', Password::min(8)],
            'redirect_to' => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return redirect()->to(route('settings.edit') . $anchor)
                ->withErrors($validator, 'password')
                ->withInput($request->except(['current_password', 'password', 'password_confirmation']));
        }

        $validated = $validator->validated();

        $user = $request->user();

        if (!Hash::check($validated['current_password'], $user->password)) {
            return redirect()->to(route('settings.edit') . $anchor)
                ->withErrors([
                'current_password' => 'La contraseña actual no es correcta.',
            ], 'password')
                ->withInput($request->except(['current_password', 'password', 'password_confirmation']))
                ->with('error_section', 'seguridad');
        }

        $user->password = $validated['password'];
        $user->save();

        return redirect()->to(route('settings.edit') . $anchor)
            ->with('success', 'Contraseña actualizada correctamente.')
            ->with('success_anchor', $anchor);
    }

    /**
     * Close all other active sessions for the user after confirming password.
     */
    public function logoutAllSessions(Request $request): RedirectResponse
    {
        $anchor = $request->input('redirect_to', '#zona-peligro');

        $validator = Validator::make($request->all(), [
            'current_password' => ['required'],
            'redirect_to' => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return redirect()->to(route('settings.edit') . $anchor)
                ->withErrors($validator, 'logout')
                ->withInput($request->except(['current_password']));
        }

        $validated = $validator->validated();

        $user = $request->user();

        if (!Hash::check($validated['current_password'], $user->password)) {
            return redirect()->to(route('settings.edit') . $anchor)
                ->withErrors([
                'current_password' => 'La contraseña no coincide.',
            ], 'logout')
                ->withInput($request->except(['current_password']))
                ->with('error_section', 'zona-peligro');
        }

        Auth::logoutOtherDevices($validated['current_password']);

        return redirect()->to(route('settings.edit') . $anchor)
            ->with('success', 'Se cerraron las sesiones en otros dispositivos.')
            ->with('success_anchor', $anchor);
    }

    /**
     * Permanently delete the authenticated user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $user = $request->user();

        $anchor = $request->input('redirect_to', '#zona-peligro');

        $validator = Validator::make($request->all(), [
            'current_password' => ['required'],
            'email_confirm' => ['required', 'email'],
            'confirm' => ['required', 'string'],
            'acknowledge' => ['accepted'],
            'redirect_to' => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return redirect()->to(route('settings.edit') . $anchor)
                ->withErrors($validator, 'delete')
                ->withInput($request->except(['current_password']));
        }

        $validated = $validator->validated();

        if (!Hash::check($validated['current_password'], $user->password)) {
            return redirect()->to(route('settings.edit') . $anchor)
                ->withErrors([
                'current_password' => 'La contraseña actual no es correcta.',
            ], 'delete')
                ->with('error_section', 'zona-peligro');
        }

        if (strcasecmp($validated['email_confirm'], $user->email) !== 0) {
            return redirect()->to(route('settings.edit') . $anchor)
                ->withErrors([
                'email_confirm' => 'El correo no coincide con el asociado a la cuenta.',
            ], 'delete')
                ->with('error_section', 'zona-peligro');
        }

        if (strtoupper($validated['confirm']) !== 'ELIMINAR') {
            return redirect()->to(route('settings.edit') . $anchor)
                ->withErrors([
                'confirm' => 'Debes escribir "ELIMINAR" para confirmar.',
            ], 'delete')
                ->with('error_section', 'zona-peligro');
        }

        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        $user->delete();

        return redirect()->route('landing')->with('status', 'Tu cuenta ha sido eliminada correctamente.');
    }
}
