@extends('layouts.home')

@section('content')
@php
    use Illuminate\Support\Carbon;

    $jobOfferCount = $favoriteJobOffers->count();
    $classifiedCount = $favoriteClassifieds->count();
    $totalFavorites = $jobOfferCount + $classifiedCount;
    $latestFavorite = $favoriteJobOffers
        ->merge($favoriteClassifieds)
        ->sortByDesc(fn ($item) => optional($item->pivot)->created_at)
        ->first();
    $lastUpdatedAt = optional(optional($latestFavorite)->pivot)->created_at;
@endphp

<div class="container mx-auto px-4 py-10 space-y-12">
    <!-- Hero -->
    <section class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#102347] via-[#123468] to-[#0b1a31] text-white shadow-2xl">
        <div class="absolute inset-0 opacity-20">
            <div class="absolute -right-20 -top-16 w-72 h-72 bg-white/30 rounded-full blur-3xl"></div>
            <div class="absolute right-10 bottom-0 w-60 h-60 bg-white/20 rounded-full blur-2xl"></div>
        </div>

        <div class="relative z-10 px-8 py-12 lg:px-12">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                <div class="max-w-2xl space-y-4">
                    <div class="inline-flex items-center gap-3 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wide border border-white/20">
                        <i class="fas fa-star text-yellow-300"></i>
                        Favoritos personales
                    </div>
                    <h1 class="text-4xl lg:text-5xl font-bold leading-tight">
                        Sigue de cerca tus oportunidades favoritas
                    </h1>
                    <p class="text-white/70 text-lg leading-relaxed">
                        Centralizamos en un solo espacio todas tus ofertas laborales y clasificados guardados para que los retomes cuando quieras.
                    </p>
                    <div class="flex flex-wrap items-center gap-4 text-white/70 text-sm">
                        <div class="inline-flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full bg-lime-300"></span>
                            Actividad reciente ·
                            <span data-last-updated>
                                {{ $lastUpdatedAt ? Carbon::parse($lastUpdatedAt)->diffForHumans() : 'Aún no hay actividad' }}
                            </span>
                        </div>
                        <span class="hidden lg:inline text-white/60">•</span>
                        <a href="{{ route('home') }}" class="inline-flex items-center gap-2 text-white hover:text-[#9fd3ff] transition-colors">
                            <i class="fas fa-arrow-left"></i>
                            Volver al panel principal
                        </a>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto">
                    <div class="bg-white/10 backdrop-blur rounded-2xl p-6 shadow-xl border border-white/10">
                        <p class="text-white/60 text-sm mb-2">Total guardados</p>
                        <p class="text-3xl font-semibold text-white" data-count-target="total" data-format="number">
                            {{ number_format($totalFavorites) }}
                        </p>
                    </div>
                    <div class="bg-white/10 backdrop-blur rounded-2xl p-6 shadow-xl border border-white/10">
                        <p class="text-white/60 text-sm mb-2">Ofertas de trabajo</p>
                        <p class="text-3xl font-semibold text-white" data-count-target="joboffer" data-format="number">
                            {{ number_format($jobOfferCount) }}
                        </p>
                    </div>
                    <div class="bg-white/10 backdrop-blur rounded-2xl p-6 shadow-xl border border-white/10">
                        <p class="text-white/60 text-sm mb-2">Clasificados</p>
                        <p class="text-3xl font-semibold text-white" data-count-target="classified" data-format="number">
                            {{ number_format($classifiedCount) }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="mt-10 flex flex-wrap gap-4">
                <a href="{{ route('job-offers.index') }}" class="inline-flex items-center gap-3 bg-white text-[#102347] font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
                    <i class="fas fa-briefcase"></i>
                    Explorar más ofertas
                </a>
                <a href="{{ route('classifieds.index') }}" class="inline-flex items-center gap-3 bg-white/10 text-white font-semibold px-6 py-3 rounded-xl border border-white/30 hover:bg-white/20 transition-all">
                    <i class="fas fa-bullhorn"></i>
                    Ver clasificados disponibles
                </a>
            </div>
        </div>
    </section>

    <!-- Navegación rápida -->
    <section class="flex flex-wrap gap-4 items-center">
        <a href="#job-offers" class="group inline-flex items-center gap-3 px-5 py-3 rounded-xl border border-[#c5d4f4] text-[#1a2f5b] bg-[#e9efff] hover:bg-white transition-all">
            <i class="fas fa-briefcase group-hover:scale-110 transition-transform text-[#204180]"></i>
            <span>Ofertas de trabajo</span>
        </a>
        <a href="#classifieds" class="group inline-flex items-center gap-3 px-5 py-3 rounded-xl border border-[#cfd7ea] text-[#1f315b] bg-[#eef3ff] hover:bg-white transition-all">
            <i class="fas fa-bullhorn group-hover:scale-110 transition-transform text-[#274378]"></i>
            <span>Clasificados guardados</span>
        </a>
    </section>

    <!-- Ofertas de trabajo -->
    <section id="job-offers" class="space-y-6">
        <header class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
                <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <span class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#ebf1ff] text-[#204180]">
                        <i class="fas fa-briefcase"></i>
                    </span>
                    Tus ofertas laborales favoritas
                </h2>
                <p class="text-gray-500 mt-1">Retoma las vacantes que guardaste para aplicarlas en el mejor momento.</p>
            </div>
            <span class="inline-flex items-center gap-2 bg-[#eaf1ff] border border-[#cadeff] text-[#1f315b] px-4 py-2 rounded-full text-sm font-semibold"
                  data-count-target="joboffer" data-singular="favorita" data-plural="favoritas" data-prefix="" data-format="label">
                {{ $jobOfferCount }} favorita{{ $jobOfferCount === 1 ? '' : 's' }}
            </span>
        </header>

        <div class="space-y-6 {{ $jobOfferCount === 0 ? 'hidden' : '' }}" data-list="joboffer">
            @foreach($favoriteJobOffers as $jobOffer)
                <article class="card-enhanced hover-lift p-6 lg:p-8" data-favorite-card data-type="joboffer">
                    <div class="flex flex-col lg:flex-row gap-6">
                        <div class="flex-1 space-y-4">
                            <div class="flex items-start justify-between gap-4">
                                <div class="space-y-3">
                                    <div class="flex items-center gap-3">
                                        <span class="inline-flex items-center gap-2 px-3 py-1 text-sm font-semibold rounded-full bg-[#e2ecff] text-[#1f315b]">
                                            <i class="fas fa-building"></i>
                                            {{ $jobOffer->company->name }}
                                        </span>
                                        <span class="text-sm text-gray-500 flex items-center gap-2">
                                            <i class="fas fa-clock"></i>
                                            {{ optional($jobOffer->pivot)->created_at ? Carbon::parse($jobOffer->pivot->created_at)->diffForHumans() : $jobOffer->created_at->diffForHumans() }}
                                        </span>
                                    </div>
                                    <a href="{{ route('job-offers.show', $jobOffer->id) }}" class="group block">
                                        <h3 class="text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                                            {{ $jobOffer->title }}
                                        </h3>
                                    </a>
                                    <p class="text-gray-600 leading-relaxed">
                                        {{ Str::limit(strip_tags($jobOffer->description), 200) }}
                                    </p>
                                    <div class="flex flex-wrap gap-2">
                                        <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f2f6ff] text-[#1f315b] text-xs font-semibold">
                                            <i class="fas fa-map-marker-alt"></i>
                                            {{ $jobOffer->location ?? 'Ubicación no disponible' }}
                                        </span>
                                        @foreach($jobOffer->categories->take(3) as $category)
                                            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                                                <i class="fas fa-tag"></i>
                                                {{ $category->name }}
                                            </span>
                                        @endforeach
                                    </div>
                                </div>

                <button onclick="toggleFavorite(this, 'joboffer', {{ $jobOffer->id }}, true)"
                    class="favorite-btn w-12 h-12 rounded-full border border-[#b8c7e6] flex items-center justify-center transition-all duration-300 hover-lift bg-[#e4ecff] text-[#1f315b] hover:bg-[#d7e4ff]"
                                        title="Quitar de favoritos">
                                    <i class="fas fa-heart text-lg"></i>
                                </button>
                            </div>
                        </div>

                        <div class="lg:w-72 space-y-4">
                            <div class="bg-[#f1f5ff] border border-[#d5e1ff] rounded-2xl p-5">
                                <p class="text-xs uppercase tracking-wide text-[#1f3b6d] mb-1 font-semibold">Salario estimado</p>
                                <p class="text-2xl font-bold text-[#0d2344]">{{ $jobOffer->salary_formatted ?? 'A convenir' }}</p>
                                <span class="inline-flex items-center gap-1 text-xs text-[#3964a6] mt-2">
                                    <i class="fas fa-info-circle"></i>
                                    Puede variar según experiencia
                                </span>
                            </div>
                            <a href="{{ route('job-offers.show', $jobOffer->id) }}" class="inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-[#c7d6f6] text-[#1f315b] font-semibold hover:bg-[#f2f6ff] transition-all">
                                <i class="fas fa-eye"></i>
                                Ver detalles
                            </a>
                        </div>
                    </div>
                </article>
            @endforeach
        </div>

    <div class="card-enhanced p-10 text-center space-y-4 {{ $jobOfferCount > 0 ? 'hidden' : '' }}" data-empty-state="joboffer">
            <div class="flex justify-center">
                <div class="w-20 h-20 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center text-4xl">
                    <i class="fas fa-briefcase"></i>
                </div>
            </div>
            <h3 class="text-2xl font-semibold text-gray-700">Aún no has guardado ofertas</h3>
            <p class="text-gray-500 max-w-xl mx-auto">Explora las últimas vacantes y guarda las que quieras comparar con calma o revisar más tarde.</p>
            <a href="{{ route('job-offers.index') }}" class="btn-primary inline-flex items-center gap-3 px-6 py-3 rounded-xl text-white font-semibold hover-lift bg-[#1f315b] hover:bg-[#1a2b4f]">
                <i class="fas fa-search"></i>
                Descubrir ofertas
            </a>
        </div>
    </section>

    <!-- Clasificados -->
    <section id="classifieds" class="space-y-6 pt-4 border-t border-gray-100">
        <header class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
                <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <span class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#eef3ff] text-[#1f315b]">
                        <i class="fas fa-bullhorn"></i>
                    </span>
                    Clasificados guardados
                </h2>
                <p class="text-gray-500 mt-1">Mantén cerca los servicios o anuncios que planeas revisar con detalle.</p>
            </div>
            <span class="inline-flex items-center gap-2 bg-[#eef3ff] border border-[#cfd7ea] text-[#1f315b] px-4 py-2 rounded-full text-sm font-semibold"
                  data-count-target="classified" data-singular="favorito" data-plural="favoritos" data-prefix="" data-format="label">
                {{ $classifiedCount }} favorito{{ $classifiedCount === 1 ? '' : 's' }}
            </span>
        </header>

        <div class="space-y-6 {{ $classifiedCount === 0 ? 'hidden' : '' }}" data-list="classified">
            @foreach($favoriteClassifieds as $classified)
                <article class="card-enhanced hover-lift p-6 lg:p-8" data-favorite-card data-type="classified">
                    <div class="flex flex-col lg:flex-row gap-6">
                        <div class="flex-1 space-y-4">
                            <div class="flex items-start justify-between gap-4">
                                <div class="space-y-3">
                                    <div class="flex items-center gap-3 flex-wrap">
                                        <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e2ecff] text-[#1f315b] text-sm font-semibold">
                                            {{ $classified->company?->business_name ?? $classified->company?->name ?? $classified->unemployed?->name ?? 'Publicación individual' }}
                                        </span>
                                        <span class="text-sm text-gray-500 flex items-center gap-2">
                                            <i class="fas fa-clock"></i>
                                            {{ optional($classified->pivot)->created_at ? Carbon::parse($classified->pivot->created_at)->diffForHumans() : $classified->created_at->diffForHumans() }}
                                        </span>
                                    </div>
                                    <a href="{{ route('classifieds.show', $classified->id) }}" class="group block">
                                        <h3 class="text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                                            {{ $classified->title }}
                                        </h3>
                                    </a>
                                    <p class="text-gray-600 leading-relaxed">
                                        {{ Str::limit(strip_tags($classified->description), 220) }}
                                    </p>
                                    <div class="flex flex-wrap gap-2">
                                        <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f2f6ff] text-[#1f315b] text-xs font-semibold">
                                            <i class="fas fa-map-marker-alt"></i>
                                            {{ $classified->location ?? 'Ubicación no disponible' }}
                                        </span>
                                        @foreach($classified->categories->take(3) as $category)
                                            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                                                <i class="fas fa-tag"></i>
                                                {{ $category->name }}
                                            </span>
                                        @endforeach
                                        @if($classified->salary)
                                            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fff4e6] text-[#9a6a2a] text-xs font-semibold">
                                                <i class="fas fa-dollar-sign"></i>
                                                ${{ number_format($classified->salary, 0, ',', '.') }}
                                            </span>
                                        @endif
                                    </div>
                                </div>

                <button onclick="toggleFavorite(this, 'classified', {{ $classified->id }}, true)"
                    class="favorite-btn w-12 h-12 rounded-full border border-[#b8c7e6] flex items-center justify-center transition-all duration-300 hover-lift bg-[#e4ecff] text-[#1f315b] hover:bg-[#d7e4ff]"
                                        title="Quitar de favoritos">
                                    <i class="fas fa-heart text-lg"></i>
                                </button>
                            </div>
                        </div>

                        <div class="lg:w-72 space-y-4">
                            <div class="bg-[#f1f5ff] border border-[#d5e1ff] rounded-2xl p-5">
                                <p class="text-xs uppercase tracking-wide text-[#1f3b6d] mb-1 font-semibold">Contacto</p>
                                <p class="text-base text-[#0d2344]">
                                    {{ $classified->contact_email ?? $classified->contact_phone ?? 'Ver detalles para más información' }}
                                </p>
                            </div>
                            <a href="{{ route('classifieds.show', $classified->id) }}" class="inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-[#c7d6f6] text-[#1f315b] font-semibold hover:bg-[#f2f6ff] transition-all">
                                <i class="fas fa-eye"></i>
                                Ver detalles del clasificado
                            </a>
                        </div>
                    </div>
                </article>
            @endforeach
        </div>

    <div class="card-enhanced p-10 text-center space-y-4 {{ $classifiedCount > 0 ? 'hidden' : '' }}" data-empty-state="classified">
            <div class="flex justify-center">
                <div class="w-20 h-20 rounded-3xl bg-[#eef3ff] text-[#1f315b] flex items-center justify-center text-4xl">
                    <i class="fas fa-bullhorn"></i>
                </div>
            </div>
            <h3 class="text-2xl font-semibold text-gray-700">Sin clasificados favoritos por ahora</h3>
            <p class="text-gray-500 max-w-xl mx-auto">Guarda los anuncios que más te llamen la atención para hacer seguimiento o contactarte cuando te quede mejor.</p>
            <a href="{{ route('classifieds.index') }}" class="inline-flex items-center gap-3 px-6 py-3 rounded-xl border border-[#c7d6f6] text-[#1f315b] font-semibold hover:bg-[#eef3ff] transition-all">
                <i class="fas fa-search"></i>
                Explorar clasificados
            </a>
        </div>
    </section>
</div>
@endsection

@push('scripts')
<script>
    const favoritesState = {
        joboffer: {{ $jobOfferCount }},
        classified: {{ $classifiedCount }},
    };

    const numberFormatter = new Intl.NumberFormat('es-CO');

    function formatCount(count, element) {
        if (element.dataset.format === 'number') {
            return numberFormatter.format(count);
        }

        const singular = element.dataset.singular || '';
        const plural = element.dataset.plural || singular + 's';
        const prefix = element.dataset.prefix || '';
        const suffix = element.dataset.suffix || '';

        return `${prefix}${count} ${count === 1 ? singular : plural}${suffix}`.trim();
    }

    function updateCountDisplays(type) {
        const count = favoritesState[type];
        document.querySelectorAll(`[data-count-target="${type}"]`).forEach((element) => {
            element.textContent = formatCount(count, element);
        });

        const total = favoritesState.joboffer + favoritesState.classified;
        document.querySelectorAll('[data-count-target="total"]').forEach((element) => {
            element.textContent = formatCount(total, element);
        });

        const list = document.querySelector(`[data-list="${type}"]`);
        const empty = document.querySelector(`[data-empty-state="${type}"]`);

        if (list) {
            if (count === 0) {
                list.classList.add('hidden');
                if (empty) empty.classList.remove('hidden');
            } else {
                list.classList.remove('hidden');
                if (empty) empty.classList.add('hidden');
            }
        }
    }

    function markActivity() {
        const label = document.querySelector('[data-last-updated]');
        if (label) {
            label.textContent = 'Actualizado hace un momento';
        }
    }

    function toggleFavorite(button, type, id, removeElement = false) {
        const currentEvent = window.event;
        if (currentEvent) {
            currentEvent.stopPropagation();
        }

        if (removeElement && !confirm('¿Quieres quitar este elemento de tus favoritos?')) {
            return;
        }

        button.style.opacity = '0.6';
        button.style.pointerEvents = 'none';

        fetch("{{ route('favorites.toggle', [], false) }}", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                'Accept': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({ type, id }),
        })
            .then(async (response) => {
                const contentType = response.headers.get('content-type') || '';
                const payload = contentType.includes('application/json')
                    ? await response.json().catch(() => ({}))
                    : {};

                if (!response.ok || payload.error) {
                    const error = new Error(payload.error || 'No se pudo cambiar el estado de favorito.');
                    error.status = response.status;
                    throw error;
                }

                return payload;
            })
            .then((data) => {
                if (!data.isFavorite && removeElement) {
                    const card = button.closest('[data-favorite-card]');
                    if (card) {
                        card.style.transition = 'all 0.25s ease-out';
                        card.style.transform = 'translateX(20px)';
                        card.style.opacity = '0';
                        setTimeout(() => {
                            card.remove();
                            favoritesState[type] = Math.max(0, favoritesState[type] - 1);
                            updateCountDisplays(type);
                            markActivity();
                        }, 200);
                    }
                }
            })
            .catch((error) => {
                console.error('Error al quitar favorito:', error);

                if (error.status === 401) {
                    alert('Tu sesión expiró. Inicia sesión nuevamente para administrar tus favoritos.');
                } else if (error.status === 403) {
                    alert('Solo los candidatos pueden marcar favoritos.');
                } else if (error.status === 404) {
                    alert('El elemento ya no está disponible.');
                } else {
                    alert(error.message || 'No se pudo cambiar el estado de favorito.');
                }
            })
            .finally(() => {
                button.style.opacity = '1';
                button.style.pointerEvents = 'auto';
            });
    }
</script>
@endpush
