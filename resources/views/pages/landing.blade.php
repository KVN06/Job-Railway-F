<!DOCTYPE html>
<html lang="es">
@section('Layout.1', 'Job Opportunity')
@include('includes.links')

<body class="min-h-screen bg-neutral-950 text-white antialiased">
    {{-- Header --}}
    <header class="fixed inset-x-0 top-0 z-50 px-6 py-6 lg:px-10">
        <nav class="mx-auto flex max-w-6xl items-center justify-between text-xs uppercase tracking-widest text-neutral-200">
            <span class="font-semibold">Job Opportunity</span>
            <div class="flex items-center gap-8">
                <a href="{{ route('job-offers.index') }}" class="transition hover:text-white">Ofertas</a>
                <a href="{{ route('register') }}" class="transition hover:text-white">Registro</a>
                <a href="{{ route('login') }}" class="transition hover:text-white">Ingresar</a>
            </div>
        </nav>
    </header>

    {{-- Hero Section --}}
    <section id="hero" class="relative flex min-h-screen items-center overflow-hidden">
        <div class="absolute inset-0 -top-[100%] -bottom-[100%] will-change-transform" data-parallax="0.4">
            <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=85"
                alt="Espacio de trabajo moderno"
                class="h-full w-full object-cover brightness-[0.4]"
            >
            <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60"></div>
        </div>

        <div class="relative z-10 mx-auto max-w-5xl px-6 py-32">
            <div class="max-w-3xl space-y-8">
                <h1 class="text-5xl font-bold leading-tight tracking-tight lg:text-7xl">
                    Conectamos talento con oportunidades
                </h1>
                <p class="text-xl text-neutral-300 lg:text-2xl">
                    Plataforma de empleo diseñada para el territorio. Encuentra ofertas laborales o publica vacantes de forma simple y efectiva.
                </p>
                <div class="flex gap-4">
                    <a href="{{ route('job-offers.index') }}" class="border-2 border-white bg-white px-8 py-3 font-semibold uppercase tracking-wider text-black transition hover:bg-transparent hover:text-white">
                        Ver ofertas
                    </a>
                    <a href="{{ route('register') }}" class="border-2 border-white px-8 py-3 font-semibold uppercase tracking-wider transition hover:bg-white hover:text-black">
                        Registrarse
                    </a>
                </div>
            </div>
        </div>
    </section>

    {{-- Features Section --}}
    <section class="relative bg-neutral-900 px-6 py-32 lg:px-10">
        <div class="mx-auto max-w-6xl">
            <div class="grid gap-16 lg:grid-cols-3">
                <div class="space-y-4">
                    <div class="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-white/20 bg-white/5">
                        <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                    </div>
                    <h3 class="text-2xl font-bold">Para empresas</h3>
                    <p class="text-neutral-400">
                        Publica ofertas laborales, gestiona aplicaciones y encuentra el talento ideal para tu organización.
                    </p>
                </div>
                <div class="space-y-4">
                    <div class="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-white/20 bg-white/5">
                        <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                    </div>
                    <h3 class="text-2xl font-bold">Para candidatos</h3>
                    <p class="text-neutral-400">
                        Explora oportunidades laborales, crea tu perfil profesional y aplica a las mejores vacantes.
                    </p>
                </div>
                <div class="space-y-4">
                    <div class="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-white/20 bg-white/5">
                        <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h3 class="text-2xl font-bold">Resultados</h3>
                    <p class="text-neutral-400">
                        Conexiones efectivas entre talento y oportunidades, diseñadas para el contexto local.
                    </p>
                </div>
            </div>
        </div>
    </section>

    {{-- CTA Section --}}
    <section class="relative flex min-h-[70vh] items-center overflow-hidden">
        <div class="absolute inset-0 -top-[100%] -bottom-[100%] will-change-transform" data-parallax="0.3">
            <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=85"
                alt="Team collaboration"
                class="h-full w-full object-cover brightness-[0.5] grayscale"
            >
        </div>

        <div class="relative z-10 mx-auto max-w-4xl px-6 text-center">
            <h2 class="mb-8 text-4xl font-bold lg:text-6xl">
                Comienza hoy mismo
            </h2>
            <p class="mb-12 text-xl text-neutral-300">
                Únete a nuestra plataforma y descubre nuevas oportunidades profesionales.
            </p>
            <a href="{{ route('register') }}" class="inline-block border-2 border-white bg-white px-10 py-4 text-lg font-semibold uppercase tracking-wider text-black transition hover:bg-transparent hover:text-white">
                Crear cuenta
            </a>
        </div>
    </section>

    {{-- Footer --}}
    <footer class="bg-black px-6 py-16 text-neutral-400 lg:px-10">
        <div class="mx-auto max-w-6xl">
            <div class="mb-12 grid gap-12 md:grid-cols-3">
                <div>
                    <h4 class="mb-4 text-lg font-bold text-white">Job Opportunity</h4>
                    <p class="text-sm">
                        Plataforma de empleo para Popayán y el Cauca. Conectando talento local con oportunidades reales.
                    </p>
                </div>
                <div>
                    <h4 class="mb-4 text-lg font-bold text-white">Enlaces</h4>
                    <ul class="space-y-2 text-sm">
                        <li><a href="{{ route('job-offers.index') }}" class="transition hover:text-white">Ofertas laborales</a></li>
                        <li><a href="{{ route('register') }}" class="transition hover:text-white">Registrarse</a></li>
                        <li><a href="{{ route('login') }}" class="transition hover:text-white">Iniciar sesión</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="mb-4 text-lg font-bold text-white">Contacto</h4>
                    <ul class="space-y-2 text-sm">
                        <li><a href="mailto:contacto@jobopportunity.co" class="transition hover:text-white">contacto@jobopportunity.co</a></li>
                        <li>Popayán, Cauca</li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-neutral-800 pt-8 text-center text-sm">
                <p>&copy; {{ now()->year }} Job Opportunity. Todos los derechos reservados.</p>
            </div>
        </div>
    </footer>

    {{-- Parallax Script --}}
    <script>
        const layers = document.querySelectorAll('[data-parallax]');
        let ticking = false;

        function updateParallax() {
            const scrollY = window.pageYOffset;
            layers.forEach(layer => {
                const speed = parseFloat(layer.dataset.parallax);
                layer.style.transform = `translate3d(0, ${-scrollY * speed}px, 0)`;
            });
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });

        updateParallax();
    </script>
</body>
</html>
