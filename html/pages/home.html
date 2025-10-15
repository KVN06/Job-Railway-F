@extends('layouts.home')

@section('content')

@if(auth()->check() && auth()->user()->type === 'company')

    <main class="container mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-12">
        @php
            $authUser = auth()->user();
            $company = $authUser?->company;

            $jobOffers = collect();
            $totalOffers = 0;
            $activeOffers = 0;
            $applicationsCount = 0;

            if ($company) {
                $jobOfferIds = $company->jobOffers()->pluck('id');
                $totalOffers = $jobOfferIds->count();
                $activeOffers = $company->jobOffers()->where('status', 'active')->count();
                $applicationsCount = \App\Models\JobApplication::whereIn('job_offer_id', $jobOfferIds)->count();
                $jobOffers = $company->jobOffers()->withCount('jobApplications')->latest()->get();
            }

            $activityRate = $totalOffers > 0 ? round(($activeOffers / $totalOffers) * 100) : 0;
            $hasStatsData = $totalOffers > 0 || $applicationsCount > 0;
        @endphp

        <!-- HERO PRINCIPAL -->
        <section>
            <x-card variant="gradient" class="relative overflow-hidden">
                <div class="absolute -top-20 -right-12 w-72 h-72 bg-white/10 blur-3xl rounded-full"></div>
                <div class="absolute bottom-0 left-0 w-64 h-64 bg-white/10 blur-3xl rounded-full"></div>

                <div class="relative z-10 flex flex-col lg:flex-row items-center lg:items-start gap-10">
                    <div class="flex-1 text-center lg:text-left space-y-6">
                        <div class="inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/30 text-white/90 text-sm uppercase tracking-wide">
                            <i class="fas fa-rocket mr-2"></i>
                            Panel de empresa
                        </div>
                        <h1 class="text-4xl md:text-5xl font-bold text-white leading-tight">
                            Impulsa el crecimiento de <span class="text-white/80">{{ $company?->name ?? $authUser->name }}</span>
                        </h1>
                        <p class="text-white/80 text-lg max-w-2xl">
                            Centraliza tus vacantes, sigue el progreso de los candidatos y toma decisiones con datos en tiempo real. Te ayudamos a crear equipos excepcionales.
                        </p>
                        <div class="flex flex-col sm:flex-row gap-4 sm:items-center">
                            <x-button
                                href="{{ route('job-offers.create') }}"
                                variant="primary"
                                size="lg"
                                icon="fas fa-plus-circle"
                                class="btn-primary text-white shadow-xl"
                            >
                                Publicar nueva oferta
                            </x-button>
                            <x-button
                                href="{{ route('job-offers.index') }}"
                                variant="primary"
                                size="lg"
                                icon="fas fa-list-check"
                                class="btn-primary text-white shadow-xl"
                            >
                                Administrar vacantes
                            </x-button>
                        </div>

                        @unless($company)
                            <div class="max-w-xl">
                                <x-alert variant="warning" icon="fas fa-circle-info" class="mt-6 bg-white/10 text-white border-white/30">
                                    Completa la información de tu empresa para desbloquear las estadísticas y agilizar la publicación de ofertas.
                                    <a href="{{ route('company-form') }}" class="underline font-semibold">Completar perfil empresarial</a>.
                                </x-alert>
                            </div>
                        @endunless
                    </div>

                    <div class="w-full max-w-sm">
                        <div class="bg-white/10 border border-white/20 rounded-3xl p-7 backdrop-blur">
                            <p class="text-white/70 text-sm uppercase tracking-widest mb-6">Resumen rápido</p>
                            <div class="space-y-5">
                                <div class="flex items-center justify-between text-white">
                                    <div>
                                        <p class="text-sm text-white/70">Ofertas activas</p>
                                        <p class="text-3xl font-bold">{{ $activeOffers }}</p>
                                    </div>
                                    <span class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15"><i class="fas fa-briefcase"></i></span>
                                </div>
                                <div class="flex items-center justify-between text-white">
                                    <div>
                                        <p class="text-sm text-white/70">Postulaciones recibidas</p>
                                        <p class="text-3xl font-bold">{{ $applicationsCount }}</p>
                                    </div>
                                    <span class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15"><i class="fas fa-users"></i></span>
                                </div>
                                <div class="flex items-center justify-between text-white">
                                    <div>
                                        <p class="text-sm text-white/70">Tasa de actividad</p>
                                        <p class="text-3xl font-bold">{{ $activityRate }}%</p>
                                    </div>
                                    <span class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15"><i class="fas fa-chart-line"></i></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </x-card>
        </section>

        <!-- ESTADÍSTICAS PRINCIPALES -->
        <section>
            @if ($company)
                @if ($hasStatsData)
                    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 animate-fade-in-up">
                        <x-card hover class="group">
                            <div class="flex flex-col items-center text-center space-y-4">
                                <span class="inline-flex w-16 h-16 items-center justify-center rounded-2xl bg-gradient-primary text-white group-hover:scale-110 transition">
                                    <i class="fas fa-bullseye"></i>
                                </span>
                                <p class="text-4xl font-extrabold text-gray-900">{{ $activeOffers }}</p>
                                <p class="text-gray-600 font-semibold">Ofertas activas</p>
                                <x-badge variant="success" size="sm" icon="fas fa-check-circle">Publicadas</x-badge>
                            </div>
                        </x-card>

                        <x-card hover class="group">
                            <div class="flex flex-col items-center text-center space-y-4">
                                <span class="inline-flex w-16 h-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 group-hover:scale-110 transition">
                                    <i class="fas fa-user-group"></i>
                                </span>
                                <p class="text-4xl font-extrabold text-gray-900">{{ $applicationsCount }}</p>
                                <p class="text-gray-600 font-semibold">Postulaciones totales</p>
                                <x-badge variant="primary" size="sm" icon="fas fa-user-plus" class="badge-primary">Candidatos</x-badge>
                            </div>
                        </x-card>

                        <x-card hover class="group">
                            <div class="flex flex-col items-center text-center space-y-4">
                                <span class="inline-flex w-16 h-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 group-hover:scale-110 transition">
                                    <i class="fas fa-file-signature"></i>
                                </span>
                                <p class="text-4xl font-extrabold text-gray-900">{{ $totalOffers }}</p>
                                <p class="text-gray-600 font-semibold">Vacantes creadas</p>
                                <x-badge variant="success" size="sm" icon="fas fa-history">Historial</x-badge>
                            </div>
                        </x-card>

                        <x-card hover class="group">
                            <div class="flex flex-col items-center text-center space-y-4">
                                <span class="inline-flex w-16 h-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-700 group-hover:scale-110 transition">
                                    <i class="fas fa-percent"></i>
                                </span>
                                <p class="text-4xl font-extrabold text-gray-900">{{ $activityRate }}%</p>
                                <p class="text-gray-600 font-semibold">Tasa de actividad</p>
                                <x-badge variant="{{ $activityRate >= 70 ? 'success' : ($activityRate >= 40 ? 'warning' : 'danger') }}" size="sm" icon="fas fa-chart-pie">
                                    {{ $activityRate >= 70 ? 'Excelente' : ($activityRate >= 40 ? 'Buena' : 'Mejorable') }}
                                </x-badge>
                            </div>
                        </x-card>
                    </div>
                @else
                    <x-card class="text-center py-14 animate-fade-in-up">
                        <div class="max-w-2xl mx-auto space-y-6">
                            <span class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 text-2xl">
                                <i class="fas fa-paper-plane"></i>
                            </span>
                            <h3 class="text-2xl font-bold text-gray-900">Aún no tienes actividad registrada</h3>
                            <p class="text-gray-600">
                                Publica tu primera oferta para comenzar a recibir postulaciones y desbloquear estadísticas detalladas.
                            </p>
                            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                                <x-button href="{{ route('job-offers.create') }}" variant="primary" icon="fas fa-plus-circle" size="lg">
                                    Publicar primera oferta
                                </x-button>
                            </div>
                        </div>
                    </x-card>
                @endif
            @else
                <div class="max-w-3xl mx-auto">
                    <x-alert variant="info" icon="fas fa-info-circle">
                        Completa el registro de tu empresa para visualizar estadísticas de ofertas y postulaciones.
                        <a href="{{ route('company-form') }}" class="underline font-semibold">Ir al formulario de empresa</a>.
                    </x-alert>
                </div>
            @endif
        </section>

        <!-- ACCIONES -->
        <section class="space-y-8">
            <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                <div>
                    <h2 class="text-3xl font-bold text-gray-900">Acciones recomendadas</h2>
                    <p class="text-gray-600 mt-2 max-w-xl">Mantén tu pipeline activo con estos atajos para publicar, gestionar y seguir a tus candidatos.</p>
                </div>
                <x-badge variant="primary" icon="fas fa-bolt">Optimiza tu tiempo</x-badge>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <x-card hover class="relative overflow-hidden border border-blue-900/30 bg-white">
                    <div class="absolute -top-6 -right-6 w-28 h-28 bg-blue-200/60 rounded-full blur-2xl"></div>
                    <div class="relative z-10 space-y-5">
                        <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl gradient-primary text-white">
                            <i class="fas fa-file-circle-plus"></i>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold text-blue-900">Publicar oferta</h3>
                            <p class="text-blue-900/80 mt-2">Define requisitos, beneficios y recibe candidatos en minutos.</p>
                        </div>
                        <ul class="space-y-2 text-sm text-blue-900/70">
                            <li class="flex items-center gap-2"><i class="fas fa-check"></i> Plantillas prearmadas</li>
                            <li class="flex items-center gap-2"><i class="fas fa-check"></i> Visibilidad inmediata</li>
                        </ul>
                        <x-button href="{{ route('job-offers.create') }}" variant="primary" icon="fas fa-arrow-right" class="btn-primary">
                            Crear oferta
                        </x-button>
                    </div>
                </x-card>

                <x-card hover class="relative overflow-hidden border border-blue-900/30 bg-white">
                    <div class="absolute -top-6 -right-6 w-28 h-28 bg-indigo-200/60 rounded-full blur-2xl"></div>
                    <div class="relative z-10 space-y-5">
                        <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl gradient-primary text-white">
                            <i class="fas fa-users-gear"></i>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold text-indigo-900">Revisar postulaciones</h3>
                            <p class="text-indigo-900/80 mt-2">Clasifica candidatos, deja notas internas y coordina entrevistas.</p>
                        </div>
                        <ul class="space-y-2 text-sm text-blue-900/70">
                            <li class="flex items-center gap-2"><i class="fas fa-check"></i> Filtros avanzados</li>
                            <li class="flex items-center gap-2"><i class="fas fa-check"></i> Trazabilidad de estados</li>
                        </ul>
                        <x-button
                            href="{{ \Illuminate\Support\Facades\Route::has('job-applications.index-company') ? route('job-applications.index-company') : route('job-offers.index') }}"
                            variant="primary"
                            icon="fas fa-arrow-right"
                            class="btn-primary"
                        >
                            Gestionar postulaciones
                        </x-button>
                    </div>
                </x-card>

                <x-card hover class="relative overflow-hidden border border-blue-900/30 bg-white">
                    <div class="absolute -top-6 -right-6 w-28 h-28 bg-purple-200/60 rounded-full blur-2xl"></div>
                    <div class="relative z-10 space-y-5">
                        <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl gradient-primary text-white">
                            <i class="fas fa-building"></i>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold text-purple-900">Perfil de empresa</h3>
                            <p class="text-purple-900/80 mt-2">Refuerza tu marca empleadora con una presentación atractiva.</p>
                        </div>
                        <ul class="space-y-2 text-sm text-blue-900/70">
                            <li class="flex items-center gap-2"><i class="fas fa-check"></i> Información centralizada</li>
                            <li class="flex items-center gap-2"><i class="fas fa-check"></i> Imagen destacada</li>
                        </ul>
                        <x-button href="{{ route('company-form') }}" variant="primary" icon="fas fa-arrow-right" class="bg-purple-600 hover:bg-purple-700">
                            Actualizar perfil
                        </x-button>
                    </div>
                </x-card>
            </div>
        </section>

        <!-- INSIGHTS -->
        <section class="space-y-8">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h2 class="text-3xl font-bold text-gray-900">Ideas para fortalecer tu atracción de talento</h2>
                    <p class="text-gray-600 mt-2 max-w-3xl">Incorpora estas mejores prácticas y recursos recomendados para atraer candidatos más calificados y cerrar vacantes con rapidez.</p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <x-card hover class="border border-blue-900/30 bg-white">
                    <div class="space-y-3">
                        <span class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600"><i class="fas fa-pen-nib"></i></span>
                        <h3 class="text-xl font-bold text-gray-900">Historias de impacto</h3>
                        <p class="text-gray-600">Incluye testimonios de tu equipo y describe desafíos reales para captar perfiles alineados con tu cultura.</p>
                        <ul class="text-sm text-gray-500 space-y-2">
                            <li class="flex items-center gap-2"><i class="fas fa-check-circle text-emerald-500"></i> Humaniza tu propuesta de valor</li>
                            <li class="flex items-center gap-2"><i class="fas fa-check-circle text-emerald-500"></i> Muestra oportunidades de desarrollo</li>
                        </ul>
                    </div>
                </x-card>

                <x-card hover class="border border-blue-900/30 bg-white">
                    <div class="space-y-3">
                        <span class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-100 text-amber-600"><i class="fas fa-hourglass-half"></i></span>
                        <h3 class="text-xl font-bold text-gray-900">Tiempo de respuesta</h3>
                        <p class="text-gray-600">Configura recordatorios internos para contactar candidatos en menos de 48 horas y mejorar la experiencia.</p>
                        <ul class="text-sm text-gray-500 space-y-2">
                            <li class="flex items-center gap-2"><i class="fas fa-check-circle text-amber-500"></i> Automatiza correos de seguimiento</li>
                            <li class="flex items-center gap-2"><i class="fas fa-check-circle text-amber-500"></i> Etiqueta perfiles prioritarios</li>
                        </ul>
                    </div>
                </x-card>

                <x-card hover class="border border-blue-900/30 bg-white">
                    <div class="space-y-3">
                        <span class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-sky-100 text-sky-600"><i class="fas fa-graduation-cap"></i></span>
                        <h3 class="text-xl font-bold text-gray-900">Recursos de capacitación</h3>
                        <p class="text-gray-600">Fortalece a tu equipo con talleres y cursos en habilidades digitales, liderazgo y metodología ágil.</p>
                        <ul class="text-sm text-gray-500 space-y-2">
                            <li class="flex items-center gap-2"><i class="fas fa-check-circle text-sky-500"></i> Metodologías ágiles</li>
                            <li class="flex items-center gap-2"><i class="fas fa-check-circle text-sky-500"></i> Entrevistas efectivas</li>
                            <li class="flex items-center gap-2"><i class="fas fa-check-circle text-sky-500"></i> Onboarding</li>
                        </ul>
                    </div>
                </x-card>
            </div>
        </section>

    </main>
@elseif(auth()->check() && auth()->user()->type === 'unemployed')

    <main class="container mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-12">
        @php
            $user = auth()->user();
            $unemployedProfile = $user?->unemployed;
            $totalActiveOffers = \App\Models\JobOffer::active()->count();
            $totalCompanies = \App\Models\Company::count();
            $myApplications = $unemployedProfile?->jobApplications()->count() ?? 0;
            $applicationStatusCounts = $unemployedProfile
                ? $unemployedProfile->jobApplications()
                    ->selectRaw('status, COUNT(*) as total')
                    ->groupBy('status')
                    ->pluck('total', 'status')
                : collect();
            $applicationStats = [
                'pending' => (int) ($applicationStatusCounts['pending'] ?? 0),
                'reviewed' => (int) ($applicationStatusCounts['reviewed'] ?? 0),
                'accepted' => (int) ($applicationStatusCounts['accepted'] ?? 0),
                'rejected' => (int) ($applicationStatusCounts['rejected'] ?? 0),
            ];
            $featuredJobs = \App\Models\JobOffer::with('company')->active()->latest()->take(3)->get();
            $recommendedTrainings = \App\Models\Training::latest()->take(3)->get();
            $recommendedCategories = \App\Models\Category::inRandomOrder()->take(6)->get();
        @endphp

        <!-- HERO -->
        <section>
            <x-card variant="gradient" class="mb-4 overflow-hidden relative">
                <div class="absolute top-0 right-0 h-56 w-56 translate-x-1/3 -translate-y-1/3 rounded-full bg-white/20 blur-3xl"></div>
                <div class="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/3 translate-y-1/3 rounded-full bg-sky-400/30 blur-3xl"></div>

                <div class="relative z-10 mx-auto max-w-4xl py-12 text-center space-y-8">
                    <div class="text-white/90 text-lg font-medium flex flex-col items-center gap-2">
                        <span class="inline-flex items-center gap-2">
                            <i class="fas fa-hand-holding-heart"></i>
                            Hola, <span class="font-semibold">{{ $user->name }}</span>
                        </span>
                        <span class="text-sm text-white/70">Esta es tu base para dar el siguiente paso profesional.</span>
                    </div>

                    <h1 class="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                        Descubre oportunidades, potencia tus habilidades y postula con confianza
                    </h1>

                    <p class="text-white/85 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
                        Te conectamos con empresas verificadas, cursos prácticos y herramientas que te ayudan a destacar frente a los reclutadores.
                    </p>

                    <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <x-button
                            href="{{ route('job-offers.index') }}"
                            variant="primary"
                            size="lg"
                            icon="fas fa-search"
                            class="transform hover:scale-105 transition-transform duration-300 shadow-xl bg-white text-blue-800 hover:bg-gray-100"
                        >
                            Explorar empleos
                        </x-button>
                        <x-button
                            href="{{ route('training.index') }}"
                            variant="primary"
                            size="lg"
                            icon="fas fa-graduation-cap"
                            class="bg-white text-blue-800 hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 border border-transparent"
                        >
                            Ver capacitaciones
                        </x-button>
                    </div>
                </div>
            </x-card>
        </section>

        <!-- RESUMEN RÁPIDO -->
        <section>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <x-card hover class="text-center space-y-4 py-8">
                    <div class="inline-flex w-16 h-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 text-2xl">
                        <i class="fas fa-briefcase"></i>
                    </div>
                    <p class="text-4xl font-extrabold text-gray-900">{{ $totalActiveOffers }}</p>
                    <p class="text-gray-600 font-semibold">Ofertas activas</p>
                    <x-badge variant="primary" size="sm" icon="fas fa-bullhorn">Actualizado</x-badge>
                </x-card>

                <x-card hover class="text-center space-y-4 py-8">
                    <div class="inline-flex w-16 h-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 text-2xl">
                        <i class="fas fa-building"></i>
                    </div>
                    <p class="text-4xl font-extrabold text-gray-900">{{ number_format($totalCompanies) }}{{ $totalCompanies > 50 ? '+' : '' }}</p>
                    <p class="text-gray-600 font-semibold">Empresas confiables</p>
                    <x-badge variant="success" size="sm" icon="fas fa-shield-check">Verificadas</x-badge>
                </x-card>

                <x-card hover class="text-center space-y-4 py-8">
                    <div class="inline-flex w-16 h-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 text-2xl">
                        <i class="fas fa-file-import"></i>
                    </div>
                    <p class="text-4xl font-extrabold text-gray-900">{{ $myApplications }}</p>
                    <p class="text-gray-600 font-semibold">Mis postulaciones</p>
                    <x-badge variant="warning" size="sm" icon="fas fa-paper-plane">Seguimiento</x-badge>
                </x-card>
            </div>
        </section>

        @if($featuredJobs->isNotEmpty())
        <!-- OPORTUNIDADES DESTACADAS -->
        <section class="space-y-6">
            <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                <div>
                    <h2 class="text-3xl font-bold text-gray-900">Oportunidades que podrían interesarte</h2>
                    <p class="text-gray-600 mt-2 max-w-2xl">Explora las últimas vacantes activas publicadas por empresas verificadas.</p>
                </div>
                <x-button href="{{ route('job-offers.index') }}" variant="outline" icon="fas fa-arrow-trend-up">
                    Ver todas las ofertas
                </x-button>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                @foreach($featuredJobs as $job)
                    <x-card hover class="flex flex-col justify-between">
                        <div class="space-y-4">
                            <div class="flex items-start justify-between gap-4">
                                <div>
                                    <p class="text-sm font-semibold text-blue-600 uppercase tracking-wide">{{ optional($job->company)->name ?? 'Empresa confidencial' }}</p>
                                    <h3 class="text-xl font-bold text-gray-900">{{ $job->title }}</h3>
                                </div>
                                <x-badge variant="primary" size="sm" icon="fas fa-location-dot">
                                    {{ $job->location ?? 'Remoto' }}
                                </x-badge>
                            </div>
                            <p class="text-gray-600 leading-relaxed">{{ \Illuminate\Support\Str::limit(strip_tags($job->description), 140) }}</p>
                        </div>

                        <div class="mt-6 flex items-center justify-between text-sm text-gray-500">
                            <div class="flex items-center gap-2">
                                <i class="fas fa-wallet text-green-500"></i>
                                <span>{{ $job->salary_formatted }}</span>
                            </div>
                            <x-button href="{{ route('job-offers.show', $job) }}" variant="primary" size="sm" icon="fas fa-arrow-right">
                                Detalles
                            </x-button>
                        </div>
                    </x-card>
                @endforeach
            </div>
        </section>
        @endif

        <!-- ACCIONES PARA TU BÚSQUEDA -->
        <section class="space-y-8">
            <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                <div>
                    <h2 class="text-3xl font-bold text-gray-900">Impulsa tu perfil profesional</h2>
                    <p class="text-gray-600 mt-2 max-w-xl">Aprovecha estos recursos para posicionarte mejor frente a los reclutadores.</p>
                </div>
                <x-badge variant="primary" icon="fas fa-sparkles">Tu crecimiento</x-badge>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <x-card hover class="relative overflow-hidden border border-blue-100 bg-blue-50">
                    <div class="absolute -top-6 -right-6 w-28 h-28 bg-blue-200/60 rounded-full blur-2xl"></div>
                    <div class="relative z-10 space-y-5">
                        <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white">
                            <i class="fas fa-briefcase"></i>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold text-blue-900">Explorar empleos</h3>
                            <p class="text-blue-900/80 mt-2">Filtra por ubicación, modalidad y rango salarial para encontrar el rol ideal.</p>
                        </div>
                        <x-button href="{{ route('job-offers.index') }}" variant="primary" icon="fas fa-arrow-right" class="bg-blue-600 hover:bg-blue-700">
                            Ver ofertas
                        </x-button>
                    </div>
                </x-card>

                <x-card hover class="relative overflow-hidden border border-emerald-100 bg-emerald-50">
                    <div class="absolute -top-6 -right-6 w-28 h-28 bg-emerald-200/60 rounded-full blur-2xl"></div>
                    <div class="relative z-10 space-y-5">
                        <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-600 text-white">
                            <i class="fas fa-id-card-clip"></i>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold text-emerald-900">Optimiza tu portafolio</h3>
                            <p class="text-emerald-900/80 mt-2">Presenta proyectos, logros y certificaciones en un solo lugar.</p>
                        </div>
                        <x-button href="{{ route('portfolios.index') }}" variant="primary" icon="fas fa-arrow-right" class="bg-emerald-600 hover:bg-emerald-700">
                            Gestionar portafolio
                        </x-button>
                    </div>
                </x-card>

                <x-card hover class="relative overflow-hidden border border-purple-100 bg-purple-50">
                    <div class="absolute -top-6 -right-6 w-28 h-28 bg-purple-200/60 rounded-full blur-2xl"></div>
                    <div class="relative z-10 space-y-5">
                        <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-600 text-white">
                            <i class="fas fa-graduation-cap"></i>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold text-purple-900">Capacítate y crece</h3>
                            <p class="text-purple-900/80 mt-2">Suma nuevas habilidades digitales y blandas para destacar en entrevistas.</p>
                        </div>
                        <x-button href="{{ route('training.index') }}" variant="primary" icon="fas fa-arrow-right" class="bg-purple-600 hover:bg-purple-700">
                            Ver capacitaciones
                        </x-button>
                    </div>
                </x-card>
            </div>
        </section>

        @if($recommendedTrainings->isNotEmpty())
        <!-- CAPACITACIONES RECOMENDADAS -->
        <section class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">Formaciones recomendadas para ti</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                @foreach($recommendedTrainings as $training)
                    @php
                        $startDate = $training->start_date ? \Illuminate\Support\Carbon::parse($training->start_date)->format('d/m/Y') : null;
                        $endDate = $training->end_date ? \Illuminate\Support\Carbon::parse($training->end_date)->format('d/m/Y') : null;
                    @endphp
                    <x-card hover class="flex flex-col justify-between">
                        <div class="space-y-4">
                            <div class="space-y-1">
                                <p class="text-sm font-semibold text-indigo-600 uppercase tracking-wide">{{ $training->provider ?? 'Capacitación' }}</p>
                                <h3 class="text-xl font-bold text-gray-900">{{ $training->title }}</h3>
                            </div>
                            <p class="text-gray-600 leading-relaxed">{{ \Illuminate\Support\Str::limit(strip_tags($training->description), 140) }}</p>
                        </div>
                        <div class="mt-6 space-y-3 text-sm text-gray-500">
                            <div class="flex items-center gap-2">
                                <i class="fas fa-calendar"></i>
                                <span>{{ $startDate ? 'Inicio ' . $startDate : 'Inicio flexible' }}{{ $endDate ? ' · Finaliza ' . $endDate : '' }}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <i class="fas fa-link"></i>
                                <span>{{ $training->link ? 'Modalidad virtual' : 'Consulta disponibilidad' }}</span>
                            </div>
                            <x-button href="{{ $training->link ?? route('training.index') }}" variant="primary" size="sm" icon="fas fa-arrow-up-right-from-square">
                                Conocer más
                            </x-button>
                        </div>
                    </x-card>
                @endforeach
            </div>
        </section>
        @endif

        @if($recommendedCategories->isNotEmpty())
        <!-- CATEGORÍAS DESTACADAS -->
        <section class="space-y-4">
            <h2 class="text-3xl font-bold text-gray-900">Explora categorías populares</h2>
            <p class="text-gray-600">Descubre áreas con alta demanda y filtra las oportunidades que se ajustan a tu perfil.</p>
            <div class="flex flex-wrap gap-3">
                @foreach($recommendedCategories as $category)
                    <span class="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold flex items-center gap-2">
                        <i class="fas fa-hashtag text-gray-500"></i>
                        {{ $category->name }}
                    </span>
                @endforeach
            </div>
        </section>
        @endif

        @if($myApplications > 0)
        <!-- ESTADO DE POSTULACIONES -->
        <section>
            <x-card variant="enhanced" class="border-l-4 border-green-600">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div class="space-y-2">
                        <div class="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                            <i class="fas fa-clipboard-list mr-2"></i>
                            Seguimiento activo
                        </div>
                        <h3 class="text-2xl font-bold text-gray-900">Estado de tus postulaciones</h3>
                        <p class="text-gray-600">Mantén un panorama claro de cada etapa y prioriza tus seguimientos.</p>
                    </div>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                        <div class="text-center p-4 bg-yellow-50 rounded-xl">
                            <p class="text-2xl font-extrabold text-yellow-700">{{ $applicationStats['pending'] }}</p>
                            <p class="text-xs uppercase tracking-wide text-yellow-700">Pendientes</p>
                        </div>
                        <div class="text-center p-4 bg-blue-50 rounded-xl">
                            <p class="text-2xl font-extrabold text-blue-700">{{ $applicationStats['reviewed'] }}</p>
                            <p class="text-xs uppercase tracking-wide text-blue-700">En revisión</p>
                        </div>
                        <div class="text-center p-4 bg-green-50 rounded-xl">
                            <p class="text-2xl font-extrabold text-green-700">{{ $applicationStats['accepted'] }}</p>
                            <p class="text-xs uppercase tracking-wide text-green-700">Aceptadas</p>
                        </div>
                        <div class="text-center p-4 bg-red-50 rounded-xl">
                            <p class="text-2xl font-extrabold text-red-700">{{ $applicationStats['rejected'] }}</p>
                            <p class="text-xs uppercase tracking-wide text-red-700">Rechazadas</p>
                        </div>
                    </div>
                </div>
            </x-card>
        </section>
        @endif

        <!-- CONSEJOS -->
        <section>
            <h2 class="text-3xl font-bold text-gray-900 mb-6">Consejos para destacar en tu búsqueda</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <x-card hover>
                    <div class="space-y-3">
                        <span class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-100 text-purple-600"><i class="fas fa-id-badge"></i></span>
                        <h3 class="text-xl font-bold text-gray-900">Perfil completo</h3>
                        <p class="text-gray-600">Actualiza tu portafolio con proyectos recientes y resultados cuantificables.</p>
                    </div>
                </x-card>

                <x-card hover>
                    <div class="space-y-3">
                        <span class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-100 text-amber-600"><i class="fas fa-paper-plane"></i></span>
                        <h3 class="text-xl font-bold text-gray-900">Personaliza tus aplicaciones</h3>
                        <p class="text-gray-600">Adapta tu CV y carta de presentación resaltando logros relevantes.</p>
                    </div>
                </x-card>

                <x-card hover>
                    <div class="space-y-3">
                        <span class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-100 text-green-600"><i class="fas fa-comments"></i></span>
                        <h3 class="text-xl font-bold text-gray-900">Prepárate para entrevistas</h3>
                        <p class="text-gray-600">Practica tus respuestas y prepara ejemplos concretos de tus experiencias.</p>
                    </div>
                </x-card>
            </div>
        </section>

    </main>

@else

    <p class="text-center text-red-600 mt-20 font-semibold">Tipo de usuario desconocido.</p>

@endif

@endsection
