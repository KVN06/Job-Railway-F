<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Registro | Job Opportunity</title>

    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <style>
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translate3d(0, 24px, 0);
            }
            to {
                opacity: 1;
                transform: translate3d(0, 0, 0);
            }
        }

        @keyframes subtleFloat {
            0%, 100% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-6px);
            }
        }

        .fade-in-up {
            opacity: 0;
            animation: fadeInUp 0.9s ease-out forwards;
            animation-delay: var(--fade-delay, 0s);
        }

        .floating-card {
            animation: subtleFloat 6s ease-in-out infinite;
        }

        .glass-card {
            position: relative;
            overflow: hidden;
            background:
                linear-gradient(140deg, rgba(255, 255, 255, 0.38) 10%, rgba(255, 255, 255, 0.16) 50%, rgba(148, 163, 184, 0.12) 100%),
                rgba(15, 23, 42, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.42);
            border-radius: 28px;
            box-shadow:
                0 30px 90px -40px rgba(8, 15, 40, 0.72),
                0 14px 45px -30px rgba(37, 99, 235, 0.45),
                inset 0 1px 0 rgba(255, 255, 255, 0.65),
                inset 0 0 0 1px rgba(15, 23, 42, 0.06);
            backdrop-filter: blur(38px) saturate(165%);
            -webkit-backdrop-filter: blur(38px) saturate(165%);
            isolation: isolate;
            transition: box-shadow 0.4s ease, border-color 0.4s ease;
        }

        .glass-card::before {
            content: "";
            position: absolute;
            inset: -45% 15% 55% -20%;
            background:
                radial-gradient(circle at 25% 20%, rgba(255, 255, 255, 0.82) 0%, transparent 70%);
            opacity: 0.85;
            pointer-events: none;
            mix-blend-mode: screen;
            z-index: 0;
        }

        .glass-card::after {
            content: "";
            position: absolute;
            inset: 58% -32% -38% 32%;
            background:
                radial-gradient(circle at 75% 80%, rgba(56, 189, 248, 0.35) 0%, transparent 70%),
                radial-gradient(circle at bottom, rgba(30, 64, 175, 0.2) 0%, transparent 76%);
            opacity: 0.8;
            pointer-events: none;
            mix-blend-mode: lighten;
            z-index: 0;
        }

        .glass-card:hover {
            border-color: rgba(255, 255, 255, 0.62);
            box-shadow:
                0 42px 140px -48px rgba(10, 17, 40, 0.85),
                0 20px 60px -32px rgba(56, 189, 248, 0.55),
                inset 0 1px 0 rgba(255, 255, 255, 0.82),
                inset 0 0 0 1px rgba(15, 23, 42, 0.05);
        }

        .glass-card > * {
            position: relative;
            z-index: 1;
        }
    </style>
</head>
<body class="relative min-h-screen bg-neutral-950 text-neutral-50">
    <div class="fixed inset-0 -z-20">
        <img src="https://i.pinimg.com/1200x/f0/e4/ab/f0e4abce10532cb8fd7943db5ff2bd40.jpg" alt="Fondo Job Opportunity" class="h-full w-full object-cover" />
        <div class="absolute inset-0 bg-slate-900/70 mix-blend-multiply"></div>
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-900/60 via-slate-900/40 to-slate-950/80"></div>
    </div>

    <header class="relative z-10 border-b border-white/10 bg-neutral-950/70 backdrop-blur">
        <div class="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5 fade-in-up">
            <a href="{{ url('/') }}" class="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-300 transition hover:text-white">
                Job Opportunity
            </a>

            <nav class="hidden items-center gap-6 text-sm font-medium text-neutral-200 md:flex">
                <a href="{{ route('landing') }}" class="transition hover:text-white">Inicio</a>
                <a href="{{ route('job-offers.index') }}" class="transition hover:text-white">Ofertas</a>
                <a href="{{ route('training.index') }}" class="transition hover:text-white">Capacitaciones</a>
                <a href="{{ url('/Companies') }}" class="transition hover:text-white">Empresas</a>
            </nav>

            <div class="flex items-center gap-3">
                <a href="{{ route('login') }}" class="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10">
                    <i class="fas fa-arrow-right-to-bracket"></i>
                    Iniciar sesión
                </a>
                <a href="{{ route('register') }}" class="hidden items-center gap-2 rounded-full btn-primary px-4 py-2 text-sm font-semibold text-white shadow-lg transition md:inline-flex">
                    <i class="fas fa-user-plus"></i>
                    Crear cuenta
                </a>
            </div>
        </div>
    </header>

    <main class="relative z-10 px-4 py-16 sm:px-6 lg:px-8">
        <section class="mx-auto flex w-full max-w-6xl flex-col gap-12">
            @if ($errors->any())
                <div class="mx-auto w-full max-w-3xl rounded-2xl border border-red-400/40 bg-red-500/10 p-5 text-red-100 backdrop-blur">
                    <div class="flex items-start gap-4">
                        <span class="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white shadow-lg">
                            <i class="fas fa-circle-exclamation"></i>
                        </span>
                        <div>
                            <p class="text-base font-semibold">Por favor revisa el formulario:</p>
                            <ul class="mt-2 space-y-1 text-sm">
                                @foreach ($errors->all() as $error)
                                    <li class="flex items-center gap-2"><i class="fas fa-dot-circle text-[10px]"></i>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                    </div>
                </div>
            @endif

            @if (session('status'))
                <div class="mx-auto w-full max-w-3xl rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-5 text-emerald-100 backdrop-blur">
                    <div class="flex items-start gap-4">
                        <span class="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
                            <i class="fas fa-check"></i>
                        </span>
                        <div>
                            <p class="text-base font-semibold">{{ session('status') }}</p>
                        </div>
                    </div>
                </div>
            @endif

            <div class="relative grid w-full overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-2xl backdrop-blur-xl transition hover:border-white/20 hover:shadow-3xl lg:grid-cols-2 fade-in-up" style="--fade-delay: 0.2s;">
                <aside class="order-last flex flex-col justify-center bg-neutral-950/60 p-10 text-neutral-100 floating-card lg:order-first">
                    <span class="inline-flex w-fit items-center gap-2 rounded-full bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-200">¿Por qué registrarte?</span>
                    <h2 class="mt-6 text-3xl font-bold sm:text-4xl">Impulsa tu búsqueda laboral con herramientas profesionales</h2>
                    <p class="mt-4 text-base leading-relaxed text-neutral-200/80">Optimiza tu perfil, conecta con empresas que confían en nuestra plataforma y obtén visibilidad ante cientos de reclutadores.</p>

                    <div class="mt-10 grid gap-4 sm:grid-cols-2">
                        <div class="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg">
                            <i class="fas fa-user-tie text-xl text-sky-300"></i>
                            <h3 class="mt-3 text-lg font-semibold">Perfiles destacados</h3>
                            <p class="mt-2 text-sm text-neutral-200/70">Tu CV se convierte en una página profesional que resalta tus habilidades y logros.</p>
                        </div>
                        <div class="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg">
                            <i class="fas fa-bullseye text-xl text-sky-300"></i>
                            <h3 class="mt-3 text-lg font-semibold">Coincidencias inteligentes</h3>
                            <p class="mt-2 text-sm text-neutral-200/70">Recomendamos vacantes alineadas con tu experiencia y aspiraciones.</p>
                        </div>
                        <div class="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg sm:col-span-2">
                            <i class="fas fa-chalkboard-teacher text-xl text-sky-300"></i>
                            <h3 class="mt-3 text-lg font-semibold">Capacitaciones exclusivas</h3>
                            <p class="mt-2 text-sm text-neutral-200/70">Accede a talleres y recursos creados por especialistas en empleabilidad.</p>
                        </div>
                    </div>

                    <div class="mt-8 grid gap-4 sm:grid-cols-2">
                        <div class="rounded-2xl border border-white/10 bg-white/5 p-5 shadow">
                            <span class="text-2xl font-bold text-white">{{ number_format($jobsAvailable ?? 0) }}</span>
                            <p class="text-sm text-neutral-200/70">Trabajos disponibles</p>
                        </div>
                        <div class="rounded-2xl border border-white/10 bg-white/5 p-5 shadow">
                            <span class="text-2xl font-bold text-white">{{ number_format($companiesCount ?? 0) }}</span>
                            <p class="text-sm text-neutral-200/70">Empresas registradas</p>
                        </div>
                    </div>
                </aside>

                <div class="relative glass-card p-10 text-neutral-900">
                    <div class="absolute -top-16 right-10 hidden h-32 w-32 rounded-full bg-sky-400/20 blur-3xl sm:block"></div>
                    <div class="mb-8 flex flex-col gap-3">
                        <div class="inline-flex items-center gap-2 self-start rounded-full bg-neutral-900/90 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-neutral-100">
                            <i class="fas fa-briefcase"></i>
                            Job Opportunity
                        </div>
                        <h1 class="text-3xl font-bold text-neutral-900 sm:text-4xl">Crea tu cuenta</h1>
                        <p class="text-base text-neutral-600">Regístrate para acceder a oportunidades, gestionar postulaciones y recibir recomendaciones.</p>
                    </div>

                    <div class="grid gap-4 sm:grid-cols-2">
    <!-- Google para Cesante -->
    <a href="{{ route('google.login', ['type' => 'unemployed']) }}"
       class="group flex items-center justify-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:border-neutral-300 hover:bg-neutral-50">
        <span class="flex h-9 w-9 items-center justify-center rounded-full bg-white text-neutral-900 shadow-inner">
            <i class="fab fa-google text-lg"></i>
        </span>
        Registrarse como Cesante
    </a>

    <!-- Google para Empresa -->
    <a href="{{ route('google.login', ['type' => 'company']) }}"
       class="group flex items-center justify-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:border-neutral-300 hover:bg-neutral-50">
        <span class="flex h-9 w-9 items-center justify-center rounded-full bg-white text-neutral-900 shadow-inner">
            <i class="fab fa-google text-lg"></i>
        </span>
        Registrarse como Empresa
    </a>
</div>

                    <div class="relative my-8 text-center text-sm font-semibold text-neutral-500">
                        <span class="relative z-10 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white px-4 py-2 shadow">
                            <i class="fas fa-pen"></i>
                            O completa el formulario
                        </span>
                        <span class="absolute inset-y-0 left-0 right-0 m-auto h-px w-full bg-gradient-to-r from-transparent via-white/70 to-transparent"></span>
                    </div>

                    <form action="{{ route('create-user') }}" method="POST" class="space-y-6">
                        @csrf
                        <div class="grid gap-5 sm:grid-cols-2">
                            <label class="flex flex-col gap-2">
                                <span class="text-sm font-medium text-neutral-700">Nombre completo</span>
                                <input type="text" name="name" value="{{ old('name') }}" autocomplete="name" placeholder="Tu nombre" required class="form-input w-full rounded-2xl border border-neutral-300/80 bg-white/90 px-4 py-3 text-sm font-medium text-neutral-800 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100">
                                @error('name')
                                    <span class="text-xs font-medium text-red-600">{{ $message }}</span>
                                @enderror
                            </label>
                            <label class="flex flex-col gap-2">
                                <span class="text-sm font-medium text-neutral-700">Correo electrónico</span>
                                <input type="email" name="email" value="{{ old('email') }}" autocomplete="email" placeholder="m@ejemplo.com" required class="form-input w-full rounded-2xl border border-neutral-300/80 bg-white/90 px-4 py-3 text-sm font-medium text-neutral-800 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100">
                                @error('email')
                                    <span class="text-xs font-medium text-red-600">{{ $message }}</span>
                                @enderror
                            </label>
                        </div>

                        <div>
                            <span class="text-sm font-medium text-neutral-700">Contraseña</span>
                            <div class="relative mt-2">
                                <input type="password" id="password" name="password" autocomplete="new-password" placeholder="Mínimo 8 caracteres" required class="form-input w-full rounded-2xl border border-neutral-300/80 bg-white/90 px-4 py-3 pr-14 text-sm font-medium text-neutral-800 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100">
                                <button type="button" id="togglePassword" class="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-700" aria-label="Mostrar u ocultar contraseña">
                                    <i id="eyeIcon" class="fas fa-eye text-base"></i>
                                </button>
                            </div>
                            <p class="mt-1 text-xs text-neutral-500">Debe contener al menos 8 caracteres.</p>
                            @error('password')
                                <span class="text-xs font-medium text-red-600">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="space-y-3">
                            <span class="text-sm font-medium text-neutral-700">Tipo de usuario</span>
                            <div class="grid gap-4 sm:grid-cols-2">
                                <label class="group relative flex h-full cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-white/60 bg-white/80 p-5 text-center shadow transition hover:-translate-y-1 hover:border-sky-400 hover:shadow-lg">
                                    <input type="radio" name="type" value="unemployed" class="peer hidden" {{ old('type') === 'company' ? '' : 'checked' }}>
                                    <span class="flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-sky-600 transition peer-checked:bg-sky-500 peer-checked:text-white"><i class="fas fa-user"></i></span>
                                    <div class="space-y-1">
                                        <strong class="block text-base text-neutral-800">Cesante</strong>
                                        <small class="block text-xs text-neutral-500">Busco oportunidades laborales y capacitaciones profesionales.</small>
                                    </div>
                                    <span class="pointer-events-none absolute inset-0 rounded-2xl border-2 border-sky-500 opacity-0 transition peer-checked:opacity-100"></span>
                                </label>

                                <label class="group relative flex h-full cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-white/60 bg-white/80 p-5 text-center shadow transition hover:-translate-y-1 hover:border-emerald-400 hover:shadow-lg">
                                    <input type="radio" name="type" value="company" class="peer hidden" {{ old('type') === 'company' ? 'checked' : '' }}>
                                    <span class="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 transition peer-checked:bg-emerald-500 peer-checked:text-white"><i class="fas fa-building"></i></span>
                                    <div class="space-y-1">
                                        <strong class="block text-base text-neutral-800">Empresa</strong>
                                        <small class="block text-xs text-neutral-500">Publico ofertas laborales, busco talento calificado y gestiono procesos de reclutamiento.</small>
                                    </div>
                                    <span class="pointer-events-none absolute inset-0 rounded-2xl border-2 border-emerald-500 opacity-0 transition peer-checked:opacity-100"></span>
                                </label>
                            </div>
                            @error('type')
                                <span class="text-xs font-medium text-red-600">{{ $message }}</span>
                            @enderror
                        </div>

                        <button type="submit" class="group relative w-full overflow-hidden rounded-2xl btn-primary px-6 py-4 text-lg font-semibold text-white shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-900">
                            Crear cuenta
                            <span class="absolute inset-0 h-full w-full scale-0 rounded-2xl bg-white/30 opacity-0 transition duration-500 ease-out group-hover:scale-150 group-hover:opacity-100"></span>
                        </button>
                    </form>

                    <p class="mt-6 text-center text-sm text-neutral-600">¿Ya tienes una cuenta?
                        <a href="{{ route('login') }}" class="font-semibold text-blue-900 transition hover:text-blue-700">Inicia sesión</a>
                    </p>
                </div>
            </div>

            <p class="mx-auto max-w-3xl text-center text-xs text-neutral-200/80 fade-in-up" style="--fade-delay: 0.35s;">Al registrarte aceptas nuestros <a href="#" class="font-semibold text-blue-200 hover:text-blue-100">Términos de servicio</a> y <a href="#" class="font-semibold text-blue-200 hover:text-blue-100">Aviso de privacidad</a>.</p>
        </section>
    </main>

    <footer class="relative z-10 border-t border-white/10 bg-neutral-950/80">
        <div class="mx-auto flex w-full max-w-4xl flex-col items-center gap-3 px-6 py-6 text-sm text-neutral-300">
            <p class="font-semibold text-white">Job Opportunity</p>
            <p class="text-center text-neutral-400">Construyendo conexiones reales entre talento y empresas.</p>
            <p class="text-xs text-neutral-500">© {{ date('Y') }} Job Opportunity. Todos los derechos reservados.</p>
        </div>
    </footer>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const passwordInput = document.getElementById('password');
            const togglePassword = document.getElementById('togglePassword');
            const eyeIcon = document.getElementById('eyeIcon');

            if (togglePassword && passwordInput && eyeIcon) {
                togglePassword.addEventListener('click', () => {
                    const isPassword = passwordInput.getAttribute('type') === 'password';
                    passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
                    eyeIcon.classList.toggle('fa-eye');
                    eyeIcon.classList.toggle('fa-eye-slash');
                });
            }
        });
    </script>
</body>
</html>
