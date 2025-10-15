@extends('layouts.home')

@section('content')
<main class="container mx-auto py-8 px-6">
    <div class="decorative-pattern fixed inset-0 pointer-events-none"></div>

    <section class="relative gradient-primary text-white rounded-2xl p-8 mb-8 overflow-hidden animate-fade-in-up">
        <div class="absolute top-0 right-0 w-48 h-48 bg-white opacity-5 rounded-full -mr-24 -mt-24"></div>
        <div class="absolute bottom-0 left-0 w-36 h-36 bg-white opacity-5 rounded-full -ml-18 -mb-18"></div>
        <div class="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
            <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center shadow-inner">
                    <i class="fas fa-cog text-2xl"></i>
                </div>
                <div>
                    <h1 class="text-2xl md:text-3xl font-extrabold mb-1">Configuración</h1>
                    <p class="opacity-90">Personaliza tu experiencia en la plataforma</p>
                </div>
            </div>
            <a href="{{ route('home') }}" class="btn-primary text-white px-4 py-2 rounded-xl shadow-soft hover-lift">
                <i class="fas fa-home mr-2"></i> Volver al inicio
            </a>
        </div>
    </section>

    @php
        $successMessage = session('success');
        $successAnchor = session('success_anchor');
        $errorBags = session('errors');
        $hasAnyErrors = $errorBags ? collect($errorBags->getBags())->contains(fn($bag) => $bag->any()) : false;
    @endphp
    @if($successMessage && !$successAnchor)
        <div class="mb-6 rounded-xl border border-green-200 bg-green-50 text-green-800 px-4 py-3 flex items-center gap-3">
            <i class="fas fa-check-circle"></i>
            <span>{{ $successMessage }}</span>
        </div>
    @endif
    @if ($hasAnyErrors)
        <div class="fixed top-20 right-6 z-50 bg-red-600 text-white px-4 py-3 rounded-xl shadow-soft animate-fade-in-up">
            <i class="fas fa-exclamation-triangle mr-2"></i> Revisa los campos del formulario
        </div>
    @endif

    <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <aside class="lg:col-span-1">
            <div class="card-enhanced p-6 lg:sticky lg:top-24">
                <div class="flex items-center gap-3 mb-5">
                    <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <i class="fas fa-user text-gray-500"></i>
                    </div>
                    <div class="truncate">
                        <div class="font-semibold text-gray-800 truncate">{{ $user->name }}</div>
                        @php
                            $email = $user->email;
                            $parts = explode('@', $email);
                            $local = $parts[0] ?? '';
                            $domain = $parts[1] ?? '';
                            $maskedLocal = strlen($local) ? substr($local,0,1) . str_repeat('*', max(strlen($local)-1, 1)) : '';
                            $domainParts = explode('.', $domain);
                            $domainName = $domainParts[0] ?? '';
                            $tld = isset($domainParts[1]) ? '.' . $domainParts[1] : '';
                            $maskedDomain = strlen($domainName) ? substr($domainName,0,1) . str_repeat('*', max(strlen($domainName)-1, 1)) : '';
                            $maskedEmail = $maskedLocal . '@' . $maskedDomain . $tld;
                        @endphp
                        <div class="text-sm text-gray-500 truncate">{{ $maskedEmail }}</div>
                    </div>
                </div>
                <div class="space-y-2 text-sm mb-5">
                    <div class="flex items-center text-gray-600"><i class="fas fa-id-badge w-4 mr-2 text-blue-700"></i> Rol: <span class="ml-1 font-medium">{{ $user->type_label }}</span></div>
                    <div class="flex items-center text-gray-600"><i class="fas fa-calendar-alt w-4 mr-2 text-blue-700"></i> Miembro desde: <span class="ml-1">{{ optional($user->created_at)->format('d/m/Y') }}</span></div>
                </div>
                <nav class="space-y-1" id="settingsNav">
                    <a href="#cuenta" class="group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 text-gray-700">
                        <i class="fas fa-user-cog text-blue-700 w-5 text-center"></i>
                        <span class="font-medium">Cuenta</span>
                    </a>
                    <a href="#notificaciones" class="group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 text-gray-700">
                        <i class="fas fa-bell text-blue-700 w-5 text-center"></i>
                        <span class="font-medium">Notificaciones</span>
                    </a>
                    <a href="#apariencia" class="group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 text-gray-700">
                        <i class="fas fa-paint-brush text-blue-700 w-5 text-center"></i>
                        <span class="font-medium">Apariencia</span>
                    </a>
                    <a href="#seguridad" class="group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 text-gray-700">
                        <i class="fas fa-shield-alt text-blue-700 w-5 text-center"></i>
                        <span class="font-medium">Seguridad</span>
                    </a>
                    <a href="#zona-peligro" class="group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 text-gray-700">
                        <i class="fas fa-exclamation-triangle text-red-600 w-5 text-center"></i>
                        <span class="font-medium">Zona de peligro</span>
                    </a>
                </nav>
            </div>
        </aside>

        <section class="lg:col-span-2 space-y-8">
            <div id="cuenta" class="card-enhanced p-6 scroll-mt-24">
                <div class="flex items-start justify-between mb-4">
                    <div>
                        <h2 class="text-lg font-semibold text-gray-800">Cuenta</h2>
                        <p class="text-sm text-gray-500">Información básica de tu perfil</p>
                    </div>
                    <span class="badge-secondary">Editar</span>
                </div>
                @if($successMessage && $successAnchor === '#cuenta')
                    <div class="mb-4 rounded-xl border border-green-200 bg-green-50 text-green-800 px-4 py-3 flex items-center gap-3">
                        <i class="fas fa-check-circle"></i>
                        <span>{{ $successMessage }}</span>
                    </div>
                @endif
                <form id="profileForm" method="POST" action="{{ route('settings.profile.update') }}" class="space-y-4" novalidate>
                    <input type="hidden" name="_token" value="{{ csrf_token() }}">
                    @method('PATCH')
                    <input type="hidden" name="redirect_to" value="#cuenta">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="text-sm text-gray-600">Nombre</label>
                            <input name="name" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200" value="{{ old('name', $user->name) }}" required>
                            @error('name', 'profile')<p class="text-red-600 text-xs mt-1">{{ $message }}</p>@enderror
                        </div>
                        <div>
                            <label class="text-sm text-gray-600">Email</label>
                            <!-- Email no editable: readonly to prevent changes after registration. -->
                            <input name="email" type="email" readonly aria-readonly="true" title="El correo no puede cambiarse una vez registrado. Contacta al soporte para asistencia." class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 cursor-not-allowed bg-gray-50" value="{{ old('email', $user->email) }}">
                            <p class="text-xs text-gray-500 mt-1">El correo no se puede cambiar después del registro. Si necesitas actualizarlo, contacta al equipo de soporte.</p>
                            @error('email', 'profile')<p class="text-red-600 text-xs mt-1">{{ $message }}</p>@enderror
                        </div>
                        <div class="md:col-span-2">
                            <label class="text-sm text-gray-600">Contraseña actual <span class="text-xs text-gray-400">(solo necesaria si cambias el correo)</span></label>
                            <input name="current_password" type="password" class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200" autocomplete="current-password">
                            @error('current_password', 'profile')<p class="text-red-600 text-xs mt-1">{{ $message }}</p>@enderror
                        </div>
                    </div>
                    <div class="pt-2 flex items-center gap-3">
                        <button class="btn-primary text-white px-4 py-2 rounded-xl shadow-soft hover-lift" type="submit">
                            <i class="fas fa-save mr-2"></i> Guardar cambios
                        </button>
                        <a href="{{ route('messages') }}" class="text-sm text-gray-500 hover:text-blue-700">¿Necesitas ayuda?</a>
                    </div>
                </form>
            </div>

            <div id="notificaciones" class="card-enhanced p-6 scroll-mt-24">
                <div class="flex items-start justify-between mb-4">
                    <div>
                        <h2 class="text-lg font-semibold text-gray-800">Notificaciones</h2>
                        <p class="text-sm text-gray-500">Preferencias de avisos</p>
                    </div>
                </div>
                @if($successMessage && $successAnchor === '#notificaciones')
                    <div class="mb-4 rounded-xl border border-green-200 bg-green-50 text-green-800 px-4 py-3 flex items-center gap-3">
                        <i class="fas fa-check-circle"></i>
                        <span>{{ $successMessage }}</span>
                    </div>
                @endif
                <form id="notificationsForm" method="POST" action="{{ route('settings.update') }}" class="space-y-4" aria-label="Preferencias de notificaciones" novalidate>
                    <input type="hidden" name="_token" value="{{ csrf_token() }}">
                    @method('PATCH')
                    <input type="hidden" name="redirect_to" value="#notificaciones">
                    <div class="space-y-3">
                        <label class="flex items-center gap-3">
                            <input type="hidden" name="notify_email" value="0">
                            <input type="checkbox" name="notify_email" value="1" class="h-4 w-4 text-blue-700" {{ old('notify_email', (int) $user->notify_email) ? 'checked' : '' }}>
                            <span class="text-gray-700">Recibir avisos por correo electrónico</span>
                        </label>
                        <p class="text-xs text-gray-500">Te enviaremos emails solo para eventos importantes (postulaciones, entrevistas, cambios de estado).</p>
                    </div>
                    <div class="space-y-3">
                        <label class="flex items-center gap-3">
                            <input type="hidden" name="notify_platform" value="0">
                            <input type="checkbox" name="notify_platform" value="1" class="h-4 w-4 text-blue-700" {{ old('notify_platform', (int) $user->notify_platform) ? 'checked' : '' }}>
                            <span class="text-gray-700">Mostrar notificaciones dentro de la plataforma</span>
                        </label>
                        <p class="text-xs text-gray-500">Aparecerán en la campana del header cuando haya novedades.</p>
                    </div>
                    <div class="pt-2 flex items-center gap-3">
                        <button class="btn-primary text-white px-4 py-2 rounded-xl shadow-soft hover-lift" type="submit">
                            <i class="fas fa-save mr-2"></i> Guardar preferencias
                        </button>
                        <a href="{{ route('notifications.index') }}" class="text-sm text-gray-500 hover:text-blue-700 inline-flex items-center">
                            <i class="fas fa-bell mr-1"></i> Ver notificaciones
                        </a>
                    </div>
                </form>
            </div>

            <div id="apariencia" class="card-enhanced p-6 scroll-mt-24">
                <div class="flex items-start justify-between mb-4">
                    <div>
                        <h2 class="text-lg font-semibold text-gray-800">Apariencia</h2>
                        <p class="text-sm text-gray-500">Elige el tema de la interfaz</p>
                    </div>
                </div>
                @if($successMessage && $successAnchor === '#apariencia')
                    <div class="mb-4 rounded-xl border border-green-200 bg-green-50 text-green-800 px-4 py-3 flex items-center gap-3">
                        <i class="fas fa-check-circle"></i>
                        <span>{{ $successMessage }}</span>
                    </div>
                @endif
                <form id="appearanceForm" method="POST" action="{{ route('settings.update') }}" class="space-y-4" aria-label="Preferencias de apariencia" novalidate>
                    <input type="hidden" name="_token" value="{{ csrf_token() }}">
                    @method('PATCH')
                    <input type="hidden" name="redirect_to" value="#apariencia">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        @php $themePreference = old('theme', $user->dark_mode ? 'dark' : 'light'); @endphp
                        <label class="relative border rounded-xl p-4 flex items-start gap-3 cursor-pointer hover:border-blue-300 transition {{ $themePreference === 'light' ? 'ring-2 ring-blue-200' : '' }}">
                            <input type="radio" name="theme" value="light" class="mt-1" {{ $themePreference === 'light' ? 'checked' : '' }}>
                            <div>
                                <div class="font-medium text-gray-800">Claro</div>
                                <div class="text-xs text-gray-500">Fondo claro con alto contraste.</div>
                            </div>
                            <span class="absolute top-3 right-3 text-blue-700" aria-hidden="true"><i class="fas fa-sun"></i></span>
                        </label>
                        <label class="relative border rounded-xl p-4 flex items-start gap-3 cursor-pointer hover:border-blue-300 transition {{ $themePreference === 'dark' ? 'ring-2 ring-blue-200' : '' }}">
                            <input type="radio" name="theme" value="dark" class="mt-1" {{ $themePreference === 'dark' ? 'checked' : '' }}>
                            <div>
                                <div class="font-medium text-gray-800">Oscuro</div>
                                <div class="text-xs text-gray-500">Fondo oscuro ideal para poca luz.</div>
                            </div>
                            <span class="absolute top-3 right-3 text-blue-700" aria-hidden="true"><i class="fas fa-moon"></i></span>
                        </label>
                    </div>
                    <div class="flex items-center gap-3">
                        <button class="btn-primary text-white px-4 py-2 rounded-xl shadow-soft hover-lift" type="submit">
                            <i class="fas fa-palette mr-2"></i> Guardar tema
                        </button>
                        <div class="text-xs text-gray-500">Se aplica a todo el sitio y se guarda en tu perfil.</div>
                    </div>
                </form>
            </div>

            <div id="seguridad" class="card-enhanced p-6 scroll-mt-24">
                <div class="flex items-start justify-between mb-4">
                    <div>
                        <h2 class="text-lg font-semibold text-gray-800">Seguridad</h2>
                        <p class="text-sm text-gray-500">Protege tu cuenta</p>
                    </div>
                </div>
                @if($successMessage && $successAnchor === '#seguridad')
                    <div class="mb-4 rounded-xl border border-green-200 bg-green-50 text-green-800 px-4 py-3 flex items-center gap-3">
                        <i class="fas fa-check-circle"></i>
                        <span>{{ $successMessage }}</span>
                    </div>
                @endif
                <form id="passwordForm" method="POST" action="{{ route('settings.password.update') }}" class="space-y-4" novalidate>
                    <input type="hidden" name="_token" value="{{ csrf_token() }}">
                    @method('PATCH')
                    <input type="hidden" name="redirect_to" value="#seguridad">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label class="text-sm text-gray-600">Contraseña actual</label>
                            <input name="current_password" type="password" class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200" required>
                            @error('current_password', 'password')<p class="text-red-600 text-xs mt-1">{{ $message }}</p>@enderror
                        </div>
                        <div>
                            <label class="text-sm text-gray-600">Nueva contraseña</label>
                            <input name="password" type="password" class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200" minlength="8" required>
                            @error('password', 'password')<p class="text-red-600 text-xs mt-1">{{ $message }}</p>@enderror
                        </div>
                        <div>
                            <label class="text-sm text-gray-600">Confirmar nueva</label>
                            <input name="password_confirmation" type="password" class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200" minlength="8" required>
                        </div>
                    </div>
                    <p class="text-xs text-gray-500">La contraseña debe tener al menos 8 caracteres.</p>
                    <div class="pt-2">
                        <button class="btn-primary text-white px-4 py-2 rounded-xl shadow-soft hover-lift" type="submit">
                            <i class="fas fa-key mr-2"></i> Actualizar contraseña
                        </button>
                    </div>
                </form>
            </div>

            <div id="zona-peligro" class="card-enhanced p-6 scroll-mt-24">
                <div class="flex items-start justify-between mb-4">
                    <div>
                        <h2 class="text-lg font-semibold text-gray-800">Zona de peligro</h2>
                        <p class="text-sm text-gray-500">Acciones sensibles</p>
                    </div>
                </div>
                @if($successMessage && $successAnchor === '#zona-peligro')
                    <div class="mb-4 rounded-xl border border-green-200 bg-green-50 text-green-800 px-4 py-3 flex items-center gap-3">
                        <i class="fas fa-check-circle"></i>
                        <span>{{ $successMessage }}</span>
                    </div>
                @endif
                <div class="space-y-5">
                    <form id="logoutAllForm" method="POST" action="{{ route('settings.logout-all') }}" class="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-center" novalidate>
                        <input type="hidden" name="_token" value="{{ csrf_token() }}">
                        <input type="hidden" name="redirect_to" value="#zona-peligro">
                        <div>
                            <label class="text-sm text-gray-600">Confirma tu contraseña para cerrar sesión en todos los dispositivos</label>
                            <div class="mt-1 flex gap-3 items-center">
                                <input type="password" name="current_password" placeholder="Contraseña actual" autocomplete="current-password" class="border border-gray-200 rounded-lg px-3 py-2 w-full" required>
                                <button class="px-4 py-2 rounded-xl bg-red-500 text-white shadow-soft hover:opacity-90 whitespace-nowrap" type="submit">
                                    <i class="fas fa-sign-out-alt mr-2"></i> Cerrar sesión global
                                </button>
                            </div>
                            @error('current_password', 'logout')<p class="text-red-600 text-xs mt-1">{{ $message }}</p>@enderror
                        </div>
                    </form>

                    <form id="deleteAccountForm" method="POST" action="{{ route('settings.destroy') }}" class="space-y-3" novalidate>
                        <input type="hidden" name="_token" value="{{ csrf_token() }}">
                        @method('DELETE')
                        <input type="hidden" name="redirect_to" value="#zona-peligro">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label class="text-sm text-gray-600">Contraseña actual</label>
                                <input type="password" name="current_password" autocomplete="current-password" class="border border-gray-200 rounded-lg px-3 py-2 w-full" required>
                                @error('current_password', 'delete')<p class="text-red-600 text-xs mt-1">{{ $message }}</p>@enderror
                            </div>
                            <div>
                                    <label class="text-sm text-gray-600">Correo de tu cuenta</label>
                                    <!-- Campo no editable: muestra el correo registrado y no permite cambios desde la UI -->
                                    <input type="email" name="email_confirm" inputmode="email" autocomplete="off" spellcheck="false" readonly aria-readonly="true" title="El correo no puede cambiarse una vez registrado. Para modificarlo, contacta al soporte." class="border border-gray-200 rounded-lg px-3 py-2 w-full cursor-not-allowed bg-gray-50" value="{{ old('email_confirm', $user->email) }}" required>
                                    <p class="text-xs text-gray-500 mt-1">Este campo está fijado al correo con el que te registraste. Si necesitas cambiarlo, contacta al equipo de soporte.</p>
                                    @error('email_confirm', 'delete')<p class="text-red-600 text-xs mt-1">{{ $message }}</p>@enderror
                            </div>
                            <div class="md:col-span-2">
                                <label class="text-sm text-gray-600">Escribe ELIMINAR para confirmar</label>
                                <input type="text" name="confirm" placeholder="ELIMINAR" inputmode="text" autocomplete="off" class="border border-gray-200 rounded-lg px-3 py-2 w-full tracking-widest uppercase" required>
                                @error('confirm', 'delete')<p class="text-red-600 text-xs mt-1">{{ $message }}</p>@enderror
                            </div>
                            <div class="md:col-span-2">
                                <label class="inline-flex items-center gap-2 text-sm text-gray-600">
                                    <input type="checkbox" name="acknowledge" value="1" class="h-4 w-4"> Entiendo que esta acción es irreversible y desactivará mi cuenta.
                                </label>
                                @error('acknowledge', 'delete')<p class="text-red-600 text-xs mt-1">{{ $message }}</p>@enderror
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <button id="deleteAccountBtn" class="px-4 py-2 rounded-xl bg-red-600 text-white shadow-soft opacity-60 cursor-not-allowed" type="submit" disabled>
                                <i class="fas fa-user-slash mr-2"></i> Eliminar cuenta
                            </button>
                            <span class="text-xs text-gray-500">Por seguridad, completa todos los campos para habilitar el botón.</span>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    </section>
</main>

@push('scripts')
<script>
document.querySelectorAll('#settingsNav a').forEach(a => {
    a.addEventListener('click', e => {
        const href = a.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

const sections = ['#cuenta','#notificaciones','#apariencia','#seguridad','#zona-peligro']
    .map(id => document.querySelector(id))
    .filter(Boolean);
const navLinks = Array.from(document.querySelectorAll('#settingsNav a'));
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = '#' + entry.target.id;
            navLinks.forEach(link => {
                link.classList.remove('bg-blue-50','text-blue-800');
                if (link.getAttribute('href') === id) {
                    link.classList.add('bg-blue-50','text-blue-800');
                }
            });
        }
    });
}, { rootMargin: '-40% 0px -55% 0px', threshold: 0.1 });
sections.forEach(section => observer.observe(section));

const deleteForm = document.getElementById('deleteAccountForm');
const deleteBtn = document.getElementById('deleteAccountBtn');
if (deleteForm && deleteBtn) {
    const checkButton = () => {
        const pwd = deleteForm.querySelector('input[name="current_password"]').value.trim();
        const email = deleteForm.querySelector('input[name="email_confirm"]').value.trim();
        const confirmTxt = deleteForm.querySelector('input[name="confirm"]').value.trim().toUpperCase();
        const ack = deleteForm.querySelector('input[name="acknowledge"]').checked;
        const enabled = pwd.length > 0 && email.length > 0 && confirmTxt === 'ELIMINAR' && ack;
        deleteBtn.disabled = !enabled;
        deleteBtn.classList.toggle('opacity-60', !enabled);
        deleteBtn.classList.toggle('cursor-not-allowed', !enabled);
    };
    deleteForm.querySelectorAll('input').forEach(input => input.addEventListener('input', checkButton));
    checkButton();
}

const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (csrfToken) {
    document.querySelectorAll('form').forEach(form => {
        let tokenInput = form.querySelector('input[name="_token"]');
        if (!tokenInput) {
            tokenInput = document.createElement('input');
            tokenInput.type = 'hidden';
            tokenInput.name = '_token';
            form.appendChild(tokenInput);
        }
        tokenInput.value = csrfToken;
    });
}
</script>
@endpush
@endsection
