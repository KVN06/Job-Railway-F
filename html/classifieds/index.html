@extends('layouts.home')

@section('content')
@php
    use Illuminate\Support\Str;

    $user = auth()->user();
    $categories = \App\Models\Category::orderBy('name')->get();
    $totalClassifieds = \App\Models\Classified::count();
    $todayClassifieds = \App\Models\Classified::whereDate('created_at', now())->count();
    $favoriteClassifieds = $user?->unemployed?->favoriteClassifieds()->count() ?? 0;
@endphp

<main class="container mx-auto px-4 py-10 space-y-12">

    @if(session('success'))
        <x-alert variant="success" icon="fas fa-check-circle" class="animate-fade-in-up">
            {{ session('success') }}
        </x-alert>
    @endif

    <!-- HERO PRINCIPAL -->
    <section class="animate-fade-in-up">
        <x-card variant="gradient" class="relative overflow-hidden">
            <div class="absolute -top-20 -right-12 w-72 h-72 bg-white/10 blur-3xl rounded-full"></div>
            <div class="absolute bottom-0 left-0 w-64 h-64 bg-white/10 blur-3xl rounded-full"></div>

            <div class="relative z-10 flex flex-col lg:flex-row items-center lg:items-start gap-10">
                <div class="flex-1 text-center lg:text-left space-y-6">
                    <div class="inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/30 text-white/90 text-sm uppercase tracking-wide">
                        <i class="fas fa-bullhorn mr-2"></i>
                        Mercado de clasificados
                    </div>
                    <div class="space-y-4">
                        <h1 class="text-4xl md:text-5xl font-bold text-white leading-tight">
                            Descubre anuncios relevantes y oportunidades únicas
                        </h1>
                        <p class="text-white/80 text-lg max-w-3xl">
                            Filtra por ubicación, categoría y palabras clave para encontrar rápidamente el clasificado que estás buscando. Guarda tus favoritos para hacer seguimiento cuando quieras.
                        </p>
                    </div>

                    <div class="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-start justify-center">
                        @if($user && ($user->company || $user->unemployed))
                            <x-button
                                href="{{ route('classifieds.create') }}"
                                variant="primary"
                                size="lg"
                                icon="fas fa-plus-circle"
                                class="bg-white text-blue-700 hover:bg-gray-100 shadow-xl"
                            >
                                Publicar clasificado
                            </x-button>
                        @endif

                        @if($user?->unemployed)
                            <x-button
                                href="{{ route('favorites.index') }}"
                                variant="primary"
                                size="lg"
                                icon="fas fa-heart"
                                class="bg-white/10 border border-white/40 text-white hover:bg-white/20"
                            >
                                Mis favoritos ({{ $favoriteClassifieds }})
                            </x-button>
                        @endif
                    </div>
                </div>

                <div class="w-full max-w-sm">
                    <div class="bg-white/10 border border-white/20 rounded-3xl p-7 backdrop-blur space-y-5 text-white">
                        <p class="text-white/70 text-sm uppercase tracking-widest">Resumen rápido</p>
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-white/70">Clasificados activos</p>
                                <p class="text-3xl font-bold">{{ number_format($totalClassifieds) }}</p>
                            </div>
                            <span class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15"><i class="fas fa-layer-group"></i></span>
                        </div>
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-white/70">Publicaciones de hoy</p>
                                <p class="text-3xl font-bold">{{ $todayClassifieds }}</p>
                            </div>
                            <span class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15"><i class="fas fa-calendar-day"></i></span>
                        </div>
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-white/70">Favoritos guardados</p>
                                <p class="text-3xl font-bold">{{ $favoriteClassifieds }}</p>
                            </div>
                            <span class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15"><i class="fas fa-heart"></i></span>
                        </div>
                    </div>
                </div>
            </div>
        </x-card>
    </section>

    <!-- FILTROS -->
    <section class="animate-fade-in-up">
        <x-card class="shadow-soft">
            <form method="GET" action="{{ route('classifieds.index') }}" class="space-y-6">
                <div class="flex flex-wrap items-center gap-3">
                    <x-badge variant="primary" size="sm" icon="fas fa-filter">Filtrado inteligente</x-badge>
                    @if(request()->filled('location'))
                        <span class="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm">Ubicación: {{ request('location') }}</span>
                    @endif
                    @if(request()->filled('category_id'))
                        @php
                            $selectedCategory = $categories->firstWhere('id', (int) request('category_id'));
                        @endphp
                        @if($selectedCategory)
                            <span class="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm">Categoría: {{ $selectedCategory->name }}</span>
                        @endif
                    @endif
                    @if(request()->filled('search'))
                        <span class="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm">Buscar: {{ request('search') }}</span>
                    @endif
                    @if(request()->anyFilled(['location','category_id','search']))
                        <a href="{{ route('classifieds.index') }}" class="text-sm text-gray-500 hover:text-gray-700">Limpiar filtros</a>
                    @endif
                </div>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div class="col-span-1">
                        <label for="location" class="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <i class="fas fa-location-dot text-blue-600"></i>
                            Ubicación
                        </label>
                        <input
                            type="text"
                            name="location"
                            id="location"
                            value="{{ request('location') }}"
                            placeholder="Ciudad, país o remoto"
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        >
                    </div>

                    <div class="col-span-1">
                        <label for="category_id" class="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <i class="fas fa-tags text-purple-500"></i>
                            Categoría
                        </label>
                        <select
                            name="category_id"
                            id="category_id"
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        >
                            <option value="">Todas las categorías</option>
                            @foreach($categories as $category)
                                <option value="{{ $category->id }}" {{ (string) request('category_id') === (string) $category->id ? 'selected' : '' }}>
                                    {{ $category->name }}
                                </option>
                            @endforeach
                        </select>
                    </div>

                    <div class="col-span-1">
                        <label for="search" class="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <i class="fas fa-magnifying-glass text-blue-500"></i>
                            Palabras clave
                        </label>
                        <input
                            type="text"
                            name="search"
                            id="search"
                            placeholder="Título, descripción o empresa"
                            value="{{ request('search') }}"
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        >
                    </div>

                    <div class="col-span-1 flex items-end">
                        <x-button type="submit" variant="primary" icon="fas fa-search" class="w-full">
                            Buscar clasificados
                        </x-button>
                    </div>
                </div>
            </form>
        </x-card>
    </section>

    <!-- LISTADO DE CLASIFICADOS -->
    <section class="space-y-6">
        <div class="grid grid-cols-1 gap-6 animate-slide-in">
            @forelse($classifieds as $classified)
                @php
                    $isFavorite = false;
                    $isOwner = false;
                    if ($user?->unemployed) {
                        $isOwner = $user->unemployed->id === $classified->unemployed_id;
                        $isFavorite = ! $isOwner && $user->unemployed->favoriteClassifieds->contains($classified);
                    }
                    if ($user?->company) {
                        $isOwner = $isOwner || $user->company->id === $classified->company_id;
                    }
                @endphp

                <x-card variant="enhanced" hover class="overflow-hidden">
                    <div class="flex flex-col md:flex-row">
                        <div class="flex-1 p-6 space-y-5">
                            <div class="flex items-start justify-between gap-4">
                                <div class="space-y-3">
                                    <a href="{{ route('classifieds.show', $classified->id) }}" class="group inline-flex items-center gap-2">
                                        <span class="text-2xl font-bold text-gray-900 group-hover:text-blue-700 transition">
                                            {{ $classified->title }}
                                        </span>
                                        <i class="fas fa-arrow-right text-blue-600 opacity-0 group-hover:opacity-100 transition"></i>
                                    </a>
                                    <div class="flex items-center gap-3">
                                        <span class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 text-white">
                                            <i class="{{ $classified->company ? 'fas fa-building' : 'fas fa-user' }}"></i>
                                        </span>
                                        <div>
                                            <p class="text-gray-800 font-semibold">
                                                {{ $classified->company->business_name ?? $classified->company->name ?? $classified->unemployed->name ?? 'Clasificado' }}
                                            </p>
                                            <p class="text-sm text-gray-500 flex items-center gap-1">
                                                <i class="fas fa-shield-check text-emerald-500"></i>
                                                {{ $classified->company ? 'Empresa verificada' : 'Publicado por la comunidad' }}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <x-badge variant="primary" size="sm" icon="fas fa-bullhorn">
                                    Clasificado
                                </x-badge>
                            </div>

                            <div class="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                <span class="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100">
                                    <i class="fas fa-location-dot text-blue-600"></i>
                                    {{ $classified->location ?? 'Ubicación no especificada' }}
                                </span>
                                <span class="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100">
                                    <i class="fas fa-clock text-gray-500"></i>
                                    {{ $classified->created_at->diffForHumans() }}
                                </span>
                                @if($classified->salary)
                                    <span class="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700">
                                        <i class="fas fa-wallet"></i>
                                        ${{ number_format($classified->salary, 2) }}
                                    </span>
                                @else
                                    <span class="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 text-slate-600">
                                        <i class="fas fa-comments"></i>
                                        A convenir
                                    </span>
                                @endif
                            </div>

                            @if($classified->categories->isNotEmpty())
                                <div class="flex flex-wrap gap-2">
                                    @foreach($classified->categories as $category)
                                        <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                                            <i class="fas fa-tag"></i>
                                            {{ $category->name }}
                                        </span>
                                    @endforeach
                                </div>
                            @endif

                            <p class="text-gray-600 leading-relaxed">
                                {{ Str::limit(strip_tags($classified->description), 220) }}
                            </p>
                        </div>

                        <div class="md:w-72 bg-gradient-to-br from-gray-50 to-blue-50 p-6 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col justify-between gap-6">
                            <div class="space-y-4">
                                @if($user?->unemployed && ! $isOwner)
                                    <button
                                        onclick="toggleFavorite(this, 'classified', {{ $classified->id }})"
                                        class="favorite-btn w-full h-12 rounded-lg flex items-center justify-center transition-all duration-300 hover-lift {{ $isFavorite ? 'bg-red-100 text-red-600 border-2 border-red-200' : 'bg-white text-gray-500 border-2 border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200' }}"
                                    >
                                        <i class="fas fa-heart text-lg mr-2"></i>
                                        <span class="font-semibold">{{ $isFavorite ? 'Guardado' : 'Guardar' }}</span>
                                    </button>
                                @endif

                                @if($classified->salary)
                                    <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                                        <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Oferta económica</p>
                                        <p class="text-2xl font-bold text-gray-900">${{ number_format($classified->salary, 2) }}</p>
                                        <p class="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                            <i class="fas fa-info-circle"></i>
                                            Referencial, puede variar según experiencia
                                        </p>
                                    </div>
                                @endif
                            </div>

                            <div class="space-y-3">
                                @if($isOwner)
                                    <div class="flex flex-col gap-2">
                                        <x-button
                                            href="{{ route('classifieds.edit', $classified->id) }}"
                                            variant="secondary"
                                            size="sm"
                                            icon="fas fa-edit"
                                            class="w-full"
                                        >
                                            Editar clasificado
                                        </x-button>
                                        <form action="{{ route('classifieds.destroy', $classified->id) }}" method="POST" onsubmit="return confirm('¿Estás seguro que deseas eliminar este clasificado?')">
                                            @csrf
                                            @method('DELETE')
                                            <x-button
                                                type="submit"
                                                variant="danger"
                                                size="sm"
                                                icon="fas fa-trash"
                                                class="w-full"
                                            >
                                                Eliminar
                                            </x-button>
                                        </form>
                                    </div>
                                @else
                                    <x-button
                                        href="{{ route('classifieds.show', $classified->id) }}"
                                        variant="primary"
                                        icon="fas fa-eye"
                                        class="w-full"
                                    >
                                        Ver detalles
                                    </x-button>
                                @endif
                            </div>
                        </div>
                    </div>
                </x-card>
            @empty
                <x-card class="text-center py-12 animate-fade-in-up">
                    <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-bullhorn text-3xl text-gray-400"></i>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">No se encontraron clasificados</h3>
                    <p class="text-gray-600 mb-6">Revisa los filtros aplicados o crea un nuevo clasificado para iniciar el movimiento.</p>
                    @if($user && ($user->company || $user->unemployed))
                        <x-button href="{{ route('classifieds.create') }}" variant="primary" icon="fas fa-plus" size="lg">
                            Publicar primer clasificado
                        </x-button>
                    @else
                        <x-button href="{{ route('classifieds.index') }}" variant="outline" icon="fas fa-rotate">
                            Reiniciar búsqueda
                        </x-button>
                    @endif
                </x-card>
            @endforelse
        </div>

        @if($classifieds->hasPages())
            <div class="flex justify-center">
                <div class="bg-white rounded-xl shadow-soft p-4 border border-blue-900/30">
                    {{ $classifieds->links() }}
                </div>
            </div>
        @endif
    </section>

</main>
@endsection

<!-- Estilos adicionales para favoritos -->
<style>
.favorite-btn .star-filled,
.favorite-btn .star-outline {
    transition: all 0.3s ease;
}

.favorite-btn:hover {
    transform: scale(1.1);
}

main .favorite-btn {
    transition: all 0.3s ease;
}
</style>

@push('scripts')
<script>
function toggleFavorite(button, type, id) {
    const label = button.querySelector('span');
    const icon = button.querySelector('i');

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
    .then(async response => {
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
    .then(data => {
        const isFavorite = Boolean(data.isFavorite);

        button.classList.toggle('bg-red-100', isFavorite);
        button.classList.toggle('text-red-600', isFavorite);
        button.classList.toggle('border-red-200', isFavorite);
        button.classList.toggle('bg-white', !isFavorite);
        button.classList.toggle('text-gray-500', !isFavorite);
        button.classList.toggle('border-gray-200', !isFavorite);
        button.classList.toggle('hover:bg-red-50', !isFavorite);
        button.classList.toggle('hover:text-red-500', !isFavorite);
        button.classList.toggle('hover:border-red-200', !isFavorite);

        if (label) {
            label.textContent = isFavorite ? 'Guardado' : 'Guardar';
        }

        if (icon) {
            icon.classList.toggle('text-red-500', isFavorite);
            icon.classList.toggle('text-gray-400', !isFavorite);
        }
    })
    .catch(error => {
        console.error('Error al cambiar favorito:', error);

        if (error.status === 401) {
            alert('Tu sesión expiró. Inicia sesión nuevamente para guardar favoritos.');
        } else if (error.status === 403) {
            alert('Solo los candidatos pueden marcar favoritos.');
        } else if (error.status === 404) {
            alert('El elemento no fue encontrado.');
        } else {
            alert(error.message || 'No se pudo cambiar el estado de favorito. Por favor, inténtalo de nuevo.');
        }
    })
    .finally(() => {
        button.style.opacity = '1';
        button.style.pointerEvents = 'auto';
    });
}
</script>
@endpush
