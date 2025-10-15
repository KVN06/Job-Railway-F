@extends('layouts.home')

@section('content')
<div class="container mx-auto px-4 py-8">
    <!-- Navegación -->
    <div class="mb-6">
        <a href="{{ route('job-offers.index') }}" class="text-blue-600 hover:text-blue-800 flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Volver a ofertas laborales
        </a>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Información principal -->
        <div class="lg:col-span-2">
            <div class="bg-white rounded-lg shadow-sm p-6 mb-6 border border-blue-900/30">
                <!-- Header -->
                <div class="flex justify-between items-start mb-6">
                    <div class="flex-1">
                        <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ $jobOffer->title }}</h1>
                        <div class="flex items-center text-gray-600 mb-4">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                            <span class="text-lg font-semibold">{{ $jobOffer->company->name }}</span>
                        </div>
                        <div class="flex items-center text-gray-500 mb-2">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            <span>{{ $jobOffer->location }}</span>
                        </div>
                        <div class="flex items-center text-gray-500">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span>Publicado {{ $jobOffer->created_at->diffForHumans() }}</span>
                        </div>
                    </div>

                    <!-- Acciones y formulario de postulación -->
                    <div class="flex flex-col items-end space-y-2">
                        @if(auth()->user()?->unemployed)
                            <button onclick="toggleFavorite(this, 'joboffer', {{ $jobOffer->id }})"
                                class="favorite-btn w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover-lift border {{ $isFavorite ? 'bg-red-100 text-red-600 border-red-200' : 'bg-gray-100 text-gray-400 border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200' }}">
                                <i class="fas fa-heart text-lg"></i>
                            </button>
                        @endif

                        @php
                            $canManageOffer = auth()->user()?->isCompany()
                                && auth()->user()?->company
                                && auth()->user()->company->id === $jobOffer->company_id;
                        @endphp

                        @if($canManageOffer)
                            <div class="flex space-x-2">
                                <a href="{{ route('job-offers.edit', $jobOffer->id) }}" class="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors">
                                    Editar
                                </a>
                                <form action="{{ route('job-offers.destroy', $jobOffer->id) }}" method="POST" style="display:inline;" onsubmit="return confirm('¿Estás seguro que deseas eliminar esta oferta laboral?')">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                                        Eliminar
                                    </button>
                                </form>
                            </div>
                        @endif
                    </div>
                </div>

                <!-- Categorías -->
                @if($jobOffer->categories->count() > 0)
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold text-gray-800 mb-2">Categorías</h3>
                        <div class="flex flex-wrap gap-2">
                            @foreach($jobOffer->categories as $category)
                                <span class="inline-block bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-semibold">
                                    {{ $category->name }}
                                </span>
                            @endforeach
                        </div>
                    </div>
                @endif

                <!-- Descripción -->
                <div class="mb-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-3">Descripción del puesto</h3>
                    <div class="prose max-w-none text-gray-700">
                        {!! nl2br(e($jobOffer->description)) !!}
                    </div>
                </div>

                <!-- Mapa -->
                <div class="mb-6">
                    <div class="flex items-center justify-between mb-3">
                        <h3 class="text-lg font-semibold text-gray-800">Ubicación</h3>
                        <button
                            onclick="openMapModal()"
                            class="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105">
                            <i class="fas fa-expand-arrows-alt"></i>
                            <span class="text-sm font-medium">Ampliar Mapa</span>
                        </button>
                    </div>
                    <div id="map" class="w-full h-64 rounded-lg border-2 border-gray-200 shadow-sm"></div>
                    @if(!$jobOffer->geolocation)
                        <p class="text-sm text-gray-500 mt-2 flex items-center">
                            <i class="fas fa-info-circle mr-1"></i>
                            Mostrando ubicación aproximada de Popayán (coordenadas específicas no disponibles)
                        </p>
                    @endif
                </div>
            </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1">
            <!-- Información de la empresa -->
            <div class="bg-white rounded-lg shadow-sm p-6 mb-6 border border-blue-900/30">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Información de la empresa</h3>
                <div class="space-y-3">
                    <div>
                        <span class="font-medium text-gray-700">Empresa:</span>
                        <p class="text-gray-600">{{ $jobOffer->company->name }}</p>
                    </div>
                    @if($jobOffer->company->business_name)
                        <div>
                            <span class="font-medium text-gray-700">Razón social:</span>
                            <p class="text-gray-600">{{ $jobOffer->company->business_name }}</p>
                        </div>
                    @endif
                    @if($jobOffer->company->description)
                        <div>
                            <span class="font-medium text-gray-700">Descripción:</span>
                            <p class="text-gray-600">{{ Str::limit($jobOffer->company->description, 150) }}</p>
                        </div>
                    @endif
                    @if($jobOffer->company->website)
                        <div>
                            <span class="font-medium text-gray-700">Sitio web:</span>
                            <a href="{{ $jobOffer->company->website }}" target="_blank" class="text-blue-600 hover:text-blue-800">
                                {{ $jobOffer->company->website }}
                            </a>
                        </div>
                    @endif
                </div>
            </div>

            <!-- Detalles del trabajo -->
            <div class="bg-white rounded-lg shadow-sm p-6 mb-6 border border-blue-900/30">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Detalles del trabajo</h3>
                <div class="space-y-3">
                    <div class="flex justify-between">
                        <span class="font-medium text-gray-700">Salario:</span>
                        <span class="text-green-600 font-semibold">{{ $jobOffer->salary_formatted }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="font-medium text-gray-700">Ubicación:</span>
                        <span class="text-gray-600">{{ $jobOffer->location }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="font-medium text-gray-700">Publicado:</span>
                        <span class="text-gray-600">{{ $jobOffer->created_at->format('d/m/Y') }}</span>
                    </div>
                </div>
            </div>

            <!-- Tarjeta de aplicar (solo visible para cesantes) -->
            @if(auth()->user()?->unemployed)
                <div class="bg-white rounded-lg shadow-sm p-6 border border-blue-900/30">
                    <h3 class="text-lg font-semibold text-gray-800 mb-3">Aplicar a esta oferta</h3>

                    @if(session('success'))
                        <div class="bg-green-100 text-green-800 p-2 rounded mb-2">{{ session('success') }}</div>
                    @endif
                    @if(session('error'))
                        <div class="bg-red-100 text-red-800 p-2 rounded mb-2">{{ session('error') }}</div>
                    @endif

                    @php
                        $existingApplication = $jobOffer->applications()->where('unemployed_id', auth()->user()->unemployed->id)->first();
                    @endphp

                    @if($existingApplication)
                        <div class="mb-4">
                            <div class="gradient-primary rounded-lg p-4 md:p-5 shadow-md overflow-hidden">
                                <div class="flex items-center gap-3">
                                    <div class="w-12 h-12 rounded-full flex items-center justify-center bg-white/10 flex-shrink-0">
                                        <i class="fas fa-check text-white text-lg"></i>
                                    </div>
                                    <div class="flex-1 text-white">
                                        <p class="font-semibold text-white leading-tight">Ya has postulado a esta oferta.</p>
                                        @if($existingApplication->cv_url)
                                            <a href="{{ $existingApplication->cv_url }}" target="_blank" class="inline-block mt-1 text-white/90 underline hover:text-white">Ver CV subido</a>
                                        @endif
                                    </div>
                                </div>
                            </div>
                        </div>
                    @else
                        <form action="{{ route('job-applications.store') }}" method="POST" enctype="multipart/form-data" class="space-y-3">
                            @csrf
                            <input type="hidden" name="unemployed_id" value="{{ auth()->user()->unemployed->id }}">
                            <input type="hidden" name="job_offer_id" value="{{ $jobOffer->id }}">
                            <div>
                                <label for="message" class="block text-sm font-medium text-gray-700">Mensaje (opcional)</label>
                                <textarea name="message" id="message" rows="3" maxlength="2000" class="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2"></textarea>
                            </div>
                            <div>
                                <label for="cv" class="block text-sm font-medium text-gray-700">CV (opcional, PDF/DOC/DOCX, máx. 5MB)</label>
                                <input type="file" name="cv" id="cv" accept=".pdf,.doc,.docx" class="mt-1 block w-full border border-gray-200 rounded px-2 py-1">
                            </div>
                            <button type="submit" class="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-semibold">Postularme a esta oferta</button>
                        </form>
                    @endif
                </div>
            @endif
        </div>
    </div>
</div>

<!-- Modal del Mapa Ampliado -->
<div id="mapModal" class="fixed inset-0 hidden overflow-y-auto" style="background-color: rgba(0, 0, 0, 0.8); z-index: 9999;">
    <div class="flex items-center justify-center min-h-screen px-4">
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl animate-fade-in-up">
            <!-- Header del Modal -->
            <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-2xl">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <i class="fas fa-map-marked-alt text-white text-lg"></i>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold text-white">{{ $jobOffer->title }}</h3>
                            <p class="text-sm text-blue-100">{{ $jobOffer->company->name }}</p>
                        </div>
                    </div>
                    <button onclick="closeMapModal()" class="text-white hover:bg-white/20 rounded-lg p-2 transition-all">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
            </div>

            <!-- Cuerpo del Modal con Mapa -->
            <div class="p-6">
                <div id="modalMap" class="w-full rounded-xl overflow-hidden border-2 border-gray-200" style="height: 600px;"></div>

                <!-- Información adicional -->
                <div class="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div class="flex items-start space-x-3">
                        <i class="fas fa-info-circle text-blue-600 mt-1"></i>
                        <div class="flex-1">
                            <p class="text-sm text-blue-800 font-medium mb-1">Información de ubicación</p>
                            <p class="text-xs text-blue-600">{{ $jobOffer->location }}</p>
                            @if($jobOffer->geolocation)
                                @php
                                    $coords = explode(',', $jobOffer->geolocation);
                                    $lat = trim($coords[0] ?? '');
                                    $lng = trim($coords[1] ?? '');
                                @endphp
                                <p class="text-xs text-blue-500 mt-1">Coordenadas: {{ $lat }}, {{ $lng }}</p>
                            @else
                                <p class="text-xs text-blue-500 mt-1">Ubicación aproximada (Popayán)</p>
                            @endif
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer del Modal -->
            <div class="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end space-x-3">
                <button onclick="closeMapModal()" class="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all font-medium">
                    <i class="fas fa-times mr-2"></i>
                    Cerrar
                </button>
            </div>
        </div>
    </div>
</div>
@endsection

@push('styles')
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<style>
.gradient-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in-up {
    animation: fadeInUp 0.3s ease-out;
}
</style>
@endpush

@push('scripts')
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
let map;
let marker;
let modalMap = null;
let modalMarker = null;

function initMap() {
    // Coordenadas fijas de Popayán, Cauca, Colombia
    let lat = 2.4448;
    let lng = -76.6147;

    @if($jobOffer->geolocation)
        // Si hay geolocalización específica, intentar usarla
        try {
            const coords = "{{ $jobOffer->geolocation }}".split(',');
            const parsedLat = parseFloat(coords[0]);
            const parsedLng = parseFloat(coords[1]);

            // Solo usar las coordenadas si son válidas
            if (!isNaN(parsedLat) && !isNaN(parsedLng) && parsedLat !== 0 && parsedLng !== 0) {
                lat = parsedLat;
                lng = parsedLng;
            }
        } catch (e) {
            console.log('Error parsing coordinates, using Popayán default');
        }
    @endif

    console.log('Initializing map with coordinates:', lat, lng);

    // Inicializar el mapa con Leaflet
    map = L.map('map').setView([lat, lng], 15);

    // Agregar tiles de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Crear marcador
    marker = L.marker([lat, lng]).addTo(map);

    // Crear popup con información
    const popupContent = `
        <div class="p-2">
            <h3 class="font-semibold text-gray-800">{{ $jobOffer->title }}</h3>
            <p class="text-gray-600">{{ $jobOffer->company->name }}</p>
            <p class="text-sm text-gray-500">{{ $jobOffer->location }}</p>
            <p class="text-xs text-blue-500">Coords: ${lat.toFixed(6)}, ${lng.toFixed(6)}</p>
        </div>
    `;

    marker.bindPopup(popupContent).openPopup();
}

function openMapModal() {
    const modal = document.getElementById('mapModal');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Pequeño delay para que el modal se renderice antes de inicializar el mapa
    setTimeout(() => {
        initModalMap();
    }, 100);
}

function initModalMap() {
    // Coordenadas fijas de Popayán, Cauca, Colombia
    let lat = 2.4448;
    let lng = -76.6147;

    @if($jobOffer->geolocation)
        try {
            const coords = "{{ $jobOffer->geolocation }}".split(',');
            const parsedLat = parseFloat(coords[0]);
            const parsedLng = parseFloat(coords[1]);

            if (!isNaN(parsedLat) && !isNaN(parsedLng) && parsedLat !== 0 && parsedLng !== 0) {
                lat = parsedLat;
                lng = parsedLng;
            }
        } catch (e) {
            console.log('Error parsing coordinates for modal map');
        }
    @endif

    // Destruir mapa anterior si existe
    if (modalMap) {
        modalMap.remove();
        modalMap = null;
    }

    // Crear nuevo mapa
    modalMap = L.map('modalMap').setView([lat, lng], 15);

    // Agregar tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(modalMap);

    // Crear marcador con popup
    const popupContent = `
        <div class="p-3">
            <h3 class="font-bold text-gray-800 text-lg mb-2">{{ $jobOffer->title }}</h3>
            <p class="text-gray-600 mb-1"><i class="fas fa-building mr-2 text-blue-500"></i>{{ $jobOffer->company->name }}</p>
            <p class="text-gray-600 mb-2"><i class="fas fa-map-marker-alt mr-2 text-red-500"></i>{{ $jobOffer->location }}</p>
            <p class="text-xs text-gray-500 mt-2">Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}</p>
        </div>
    `;

    modalMarker = L.marker([lat, lng]).addTo(modalMap);
    modalMarker.bindPopup(popupContent).openPopup();

    // Forzar actualización del tamaño del mapa
    setTimeout(() => {
        modalMap.invalidateSize();
    }, 200);
}

function closeMapModal() {
    const modal = document.getElementById('mapModal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';

    // Destruir mapa al cerrar
    if (modalMap) {
        modalMap.remove();
        modalMap = null;
        modalMarker = null;
    }
}

// Cerrar modal con ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeMapModal();
    }
});

// Inicializar el mapa cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    initMap();
});

function toggleFavorite(button, type, id) {
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
        button.classList.toggle('bg-gray-100', !isFavorite);
        button.classList.toggle('text-gray-400', !isFavorite);
        button.classList.toggle('border-gray-200', !isFavorite);
        button.classList.toggle('hover:bg-red-50', !isFavorite);
        button.classList.toggle('hover:text-red-500', !isFavorite);
        button.classList.toggle('hover:border-red-200', !isFavorite);

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
