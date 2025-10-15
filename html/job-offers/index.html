@extends('layouts.home')

@section('content')
<div class="container mx-auto px-4 py-8">
    <!-- Header mejorado con componentes -->
    <div class="mb-8 animate-fade-in-up">
        <x-card padding="p-8" class="mb-6">
            <div class="flex flex-col md:flex-row justify-between items-center gap-6">
                <div class="text-center md:text-left">
                    <h1 class="text-3xl md:text-4xl font-bold mb-3">
                        <span class="bg-gradient-to-r from-blue-800 to-gray-700 bg-clip-text text-transparent">
                            <i class="fas fa-briefcase mr-3"></i>
                            Ofertas de Trabajo
                        </span>
                    </h1>
                    <p class="text-gray-600 text-lg">Descubre oportunidades que se adapten a tu perfil profesional</p>
                </div>
                <div class="flex items-center gap-3">
                    @if(auth()->user()?->unemployed)
                        <x-button
                            href="{{ route('favorites.index') }}"
                            variant="secondary"
                            icon="fas fa-heart"
                        >
                            Mis Favoritos
                        </x-button>
                    @endif

                    @if(auth()->user()?->isCompany())
                        <x-button
                            href="{{ route('job-offers.create') }}"
                            variant="primary"
                            icon="fas fa-plus"
                        >
                            Crear Nueva Oferta
                        </x-button>
                    @endif
                </div>
            </div>
        </x-card>
    </div>

    <div class="grid grid-cols-1 gap-6 animate-slide-in">
        @forelse($jobOffers as $jobOffer)
            <x-card variant="enhanced" hover padding="p-0" class="overflow-hidden">
                @php
                    $hasApplied = false;
                    if (auth()->check() && auth()->user()?->unemployed) {
                        try {
                            $hasApplied = $jobOffer->applications()->where('unemployed_id', auth()->user()->unemployed->id)->exists();
                        } catch (\Throwable $e) {
                            $hasApplied = false;
                        }
                    }
                @endphp

                <div class="flex flex-col md:flex-row">
                    <!-- Contenido principal -->
                    <div class="flex-1 p-6">
                        <div class="flex items-start justify-between mb-4">
                            <div class="flex-1">
                                <h2 class="text-2xl font-bold text-gray-900 mb-3">
                                    <a href="{{ route('job-offers.show', $jobOffer->id) }}" class="hover:text-blue-700 transition-colors group inline-flex items-center">
                                        {{ $jobOffer->title }}
                                        <i class="fas fa-arrow-right ml-2 text-blue-700 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-0 group-hover:translate-x-1"></i>
                                    </a>
                                </h2>

                                <div class="flex items-center mb-4 group cursor-pointer">
                                    <div class="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                                        <i class="fas fa-building text-white text-xl"></i>
                                    </div>
                                    <div>
                                        <p class="text-gray-800 font-semibold text-lg">{{ $jobOffer->company->name }}</p>
                                        <p class="text-sm text-gray-500 flex items-center">
                                            <i class="fas fa-check-circle text-green-600 mr-1"></i>
                                            Empresa verificada
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div class="ml-4">
                                <x-badge :variant="$jobOffer->offer_type === 'contract' ? 'primary' : 'warning'" size="lg">
                                    @if($jobOffer->offer_type === 'contract')
                                        <i class="fas fa-file-contract mr-1"></i> Contrato
                                    @elseif($jobOffer->offer_type === 'classified')
                                        <i class="fas fa-newspaper mr-1"></i> Clasificado
                                    @else
                                        {{ ucfirst($jobOffer->offer_type) }}
                                    @endif
                                </x-badge>
                            </div>
                        </div>

                        <div class="flex flex-wrap items-center gap-4 mb-4">
                            <div class="flex items-center text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
                                <i class="fas fa-map-marker-alt text-blue-600 mr-2"></i>
                                <span class="font-medium">{{ $jobOffer->location }}</span>
                            </div>
                            @if($jobOffer->geolocation)
                                <div class="flex items-center text-gray-600 bg-blue-50 px-3 py-2 rounded-lg">
                                    <i class="fas fa-globe text-blue-600 mr-2"></i>
                                    <span class="text-sm">Ver en mapa</span>
                                </div>
                            @endif
                            <div class="flex items-center text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                                <i class="fas fa-clock text-gray-500 mr-2"></i>
                                <span class="text-sm">{{ $jobOffer->created_at->diffForHumans() }}</span>
                            </div>
                        </div>

                        <div class="mb-4">
                            @foreach($jobOffer->categories as $category)
                                <x-badge variant="default" class="mr-2 mb-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border border-blue-200">
                                    <i class="fas fa-tag mr-1"></i>
                                    {{ $category->name }}
                                </x-badge>
                            @endforeach
                        </div>
                    </div>

                    <!-- Sidebar con acciones -->
                    <div class="md:w-64 bg-gradient-to-br from-gray-50 to-blue-50 p-6 flex flex-col justify-between border-l border-gray-100">
                        <div>
                            <!-- Botón de favoritos -->
                            @if(auth()->user()?->unemployed)
                                @php
                                    $isFavorite = auth()->user()->unemployed
                                        ->favoriteJobOffers()
                                        ->where('favoritable_id', $jobOffer->id)
                                        ->exists();
                                @endphp
                                <button onclick="toggleFavorite(this, 'joboffer', {{ $jobOffer->id }})"
                                    class="favorite-btn mb-4 w-full h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover-lift {{ $isFavorite ? 'bg-red-100 text-red-600 border-2 border-red-300' : 'bg-white text-gray-400 border-2 border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200' }}">
                                    <i class="fas fa-heart text-xl mr-2"></i>
                                    <span class="font-semibold">{{ $isFavorite ? 'Guardado' : 'Guardar' }}</span>
                                </button>
                            @endif

                            <!-- Información de salario -->
                            <div class="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-200">
                                <p class="text-xs text-gray-500 mb-1 uppercase tracking-wide font-semibold">Salario Ofrecido</p>
                                <p class="text-2xl font-bold text-gray-900 mb-2">{{ $jobOffer->salary_formatted }}</p>
                                <div class="flex items-center text-xs text-gray-500">
                                    <i class="fas fa-info-circle mr-1"></i>
                                    Según experiencia
                                </div>
                            </div>

                            <!-- Estado de postulación -->
                            @if($hasApplied)
                                <x-alert type="success" :dismissible="false" class="text-sm">
                                    Ya aplicaste a esta oferta
                                </x-alert>
                            @endif
                        </div>

                        <!-- Botones de acción para empresas -->
                        @php
                            $canManageOffer = auth()->user()?->isCompany()
                                && auth()->user()?->company
                                && auth()->user()->company->id === $jobOffer->company_id;
                        @endphp

                        @if($canManageOffer)
                            <div class="space-y-2">
                                <x-button
                                    href="{{ route('job-offers.edit', $jobOffer->id) }}"
                                    variant="secondary"
                                    size="sm"
                                    icon="fas fa-edit"
                                    class="w-full"
                                >
                                    Editar
                                </x-button>
                                <form action="{{ route('job-offers.destroy', $jobOffer->id) }}" method="POST" onsubmit="return confirm('¿Estás seguro que deseas eliminar esta oferta laboral?')">
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
                            <!-- Si ya aplicó, mostrar botón deshabilitado; si no, mostrar Ver Detalles -->
                            @if(auth()->check() && auth()->user()?->unemployed && $hasApplied)
                                <button disabled class="mt-3 w-full px-6 py-3 rounded-xl text-sm font-semibold flex items-center justify-center bg-slate-200 text-slate-500 border border-slate-200 cursor-not-allowed shadow-inner">
                                    <i class="fas fa-check mr-2"></i>
                                    Ya te postulaste
                                </button>
                            @else
                                <a href="{{ route('job-offers.show', $jobOffer->id) }}"
                                   class="mt-3 btn-primary text-white px-6 py-2 rounded-xl hover-lift transition-all duration-300 text-sm font-medium shadow-soft w-full flex items-center justify-center">
                                    <i class="fas fa-eye mr-2"></i>
                                    Ver Detalles
                                </a>
                            @endif
                        @endif
                    </div>
                </div>
            </x-card>
        @empty
            <div class="card-enhanced p-12 text-center animate-fade-in-up">
                <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-briefcase text-3xl text-gray-400"></i>
                </div>
                <h3 class="text-xl font-semibold text-gray-800 mb-2">No se encontraron ofertas</h3>
                <p class="text-gray-600 mb-6">Actualmente no hay ofertas de trabajo disponibles que coincidan con tus criterios.</p>
                @if(auth()->user()?->isCompany())
                    <a href="{{ route('job-offers.create') }}" class="btn-primary text-white px-6 py-3 rounded-xl hover-lift inline-flex items-center">
                        <i class="fas fa-plus mr-2"></i>
                        Publicar Primera Oferta
                    </a>
                @else
                    <button onclick="location.reload()" class="btn-secondary text-white px-6 py-3 rounded-xl hover-lift inline-flex items-center">
                        <i class="fas fa-refresh mr-2"></i>
                        Actualizar Lista
                    </button>
                @endif
            </div>
        @endforelse
    </div>

    <!-- Paginación mejorada -->
    @if($jobOffers->hasPages())
        <div class="mt-8 flex justify-center">
            <div class="bg-white rounded-xl shadow-soft p-4 border border-blue-900/30">
                {{ $jobOffers->links() }}
            </div>
        </div>
    @endif
</div>

<!-- Estilos adicionales para favoritos -->
<style>
.favorite-btn .star-filled,
.favorite-btn .star-outline {
    transition: all 0.3s ease;
}

.favorite-btn:hover {
    transform: scale(1.1);
}
</style>
@endsection

@push('scripts')
<script>
function toggleFavorite(button, type, id) {
    const label = button.querySelector('span');
    const heartIcon = button.querySelector('i');

    button.dataset.originalText = label ? label.textContent : button.dataset.originalText;

    // Mostrar estado de carga
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
        button.classList.toggle('border-red-300', isFavorite);
        button.classList.toggle('bg-white', !isFavorite);
        button.classList.toggle('text-gray-400', !isFavorite);
        button.classList.toggle('border-gray-200', !isFavorite);
        button.classList.toggle('hover:bg-red-50', !isFavorite);
        button.classList.toggle('hover:text-red-500', !isFavorite);
        button.classList.toggle('hover:border-red-200', !isFavorite);

        if (label) {
            label.textContent = isFavorite ? 'Guardado' : 'Guardar';
        }

        if (heartIcon) {
            heartIcon.classList.toggle('text-red-500', isFavorite);
            heartIcon.classList.toggle('text-gray-400', !isFavorite);
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


