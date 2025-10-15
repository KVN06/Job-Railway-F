@extends('layouts.home')

@section('content')

<div class="container mx-auto px-4 py-8 animate-fade-in-up">
    <div class="max-w-3xl mx-auto">
        
        <!-- Mensajes de error generales -->
        @if ($errors->any())
            <div class="mb-6 p-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 rounded-xl shadow-soft">
                <div class="flex items-start space-x-3">
                    <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <i class="fas fa-exclamation-triangle text-red-600"></i>
                    </div>
                    <div>
                        <p class="font-semibold mb-2 text-red-800">¡Oops! Algo salió mal.</p>
                        <ul class="space-y-1 text-sm">
                            @foreach ($errors->all() as $error)
                                <li class="flex items-center">
                                    <i class="fas fa-dot-circle mr-2 text-xs text-red-500"></i>
                                    {{ $error }}
                                </li>
                            @endforeach
                        </ul>
                    </div>
                </div>
            </div>
        @endif

        <div class="card-enhanced p-8 hover-lift">
            <!-- Header del formulario -->
            <div class="text-center mb-8">
                <div class="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-edit text-2xl text-white"></i>
                </div>
                <h1 class="text-3xl font-bold text-gray-800 mb-2">Editar Oferta de Trabajo</h1>
                <p class="text-gray-600">Actualiza la información de tu vacante</p>
            </div>

            <!-- Formulario -->
            <form action="{{ route('job-offers.update', $jobOffer) }}" method="POST">
                @csrf
                @method('PUT')

                <!-- Título -->
                <div class="mb-6">
                    <label for="title" class="block text-gray-700 font-medium mb-2 flex items-center">
                        <i class="fas fa-heading mr-2 text-blue-500"></i>
                        Título de la Oferta
                        <span class="text-red-500 ml-1">*</span>
                    </label>
                    <div class="relative">
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value="{{ old('title', $jobOffer->title) }}"
                            placeholder="Ej: Desarrollador Full Stack Senior"
                            required
                            autofocus
                            class="w-full border-2 border-gray-200 rounded-xl py-4 pl-12 pr-4 text-gray-800 placeholder-gray-400
                                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-300
                                   @error('title') border-red-500 @enderror"
                        >
                        <div class="absolute top-4 left-4 text-gray-400">
                            <i class="fas fa-briefcase"></i>
                        </div>
                    </div>
                    @error('title')
                        <p class="mt-2 text-sm text-red-600 flex items-center">
                            <i class="fas fa-exclamation-circle mr-1"></i>
                            {{ $message }}
                        </p>
                    @enderror
                </div>

                <!-- Descripción -->
                <div class="mb-6">
                    <label for="description" class="block text-gray-700 font-medium mb-2 flex items-center">
                        <i class="fas fa-align-left mr-2 text-blue-500"></i>
                        Descripción
                        <span class="text-red-500 ml-1">*</span>
                    </label>
                    <div class="relative">
                        <textarea
                            id="description"
                            name="description"
                            rows="5"
                            placeholder="Describe las responsabilidades, requisitos y beneficios del puesto..."
                            required
                            class="w-full border-2 border-gray-200 rounded-xl py-4 pl-12 pr-4 text-gray-800 placeholder-gray-400
                                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-300 resize-none
                                   @error('description') border-red-500 @enderror"
                        >{{ old('description', $jobOffer->description) }}</textarea>
                        <div class="absolute top-4 left-4 text-gray-400">
                            <i class="fas fa-file-text"></i>
                        </div>
                    </div>
                    @error('description')
                        <p class="mt-2 text-sm text-red-600 flex items-center">
                            <i class="fas fa-exclamation-circle mr-1"></i>
                            {{ $message }}
                        </p>
                    @enderror
                </div>

                <!-- Salario y Ubicación en Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <!-- Salario -->
                    <div>
                        <label for="salary" class="block text-gray-700 font-medium mb-2 flex items-center">
                            <i class="fas fa-dollar-sign mr-2 text-blue-500"></i>
                            Salario
                            <span class="text-gray-400 text-sm ml-2">(Opcional)</span>
                        </label>
                        <div class="relative">
                            <input
                                type="number"
                                id="salary"
                                name="salary"
                                value="{{ old('salary', $jobOffer->salary) }}"
                                placeholder="Ej: 3000000"
                                min="0"
                                step="100000"
                                class="w-full border-2 border-gray-200 rounded-xl py-4 pl-12 pr-4 text-gray-800 placeholder-gray-400
                                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-300
                                       @error('salary') border-red-500 @enderror"
                            >
                            <div class="absolute top-4 left-4 text-gray-400">
                                <i class="fas fa-money-bill-wave"></i>
                            </div>
                        </div>
                        @error('salary')
                            <p class="mt-2 text-sm text-red-600 flex items-center">
                                <i class="fas fa-exclamation-circle mr-1"></i>
                                {{ $message }}
                            </p>
                        @enderror
                    </div>

                    <!-- Ubicación -->
                    <div>
                        <label for="location" class="block text-gray-700 font-medium mb-2 flex items-center">
                            <i class="fas fa-map-marker-alt mr-2 text-blue-500"></i>
                            Ubicación
                            <span class="text-red-500 ml-1">*</span>
                        </label>
                        <div class="relative">
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value="{{ old('location', $jobOffer->location) }}"
                                placeholder="Ej: Bogotá, Colombia"
                                required
                                class="w-full border-2 border-gray-200 rounded-xl py-4 pl-12 pr-4 text-gray-800 placeholder-gray-400
                                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-300
                                       @error('location') border-red-500 @enderror"
                            >
                            <div class="absolute top-4 left-4 text-gray-400">
                                <i class="fas fa-location-dot"></i>
                            </div>
                        </div>
                        @error('location')
                            <p class="mt-2 text-sm text-red-600 flex items-center">
                                <i class="fas fa-exclamation-circle mr-1"></i>
                                {{ $message }}
                            </p>
                        @enderror
                    </div>
                </div>

                <!-- Geolocalización con Mapa -->
                <div class="mb-6">
                    <label class="block text-gray-700 font-medium mb-3 flex items-center">
                        <i class="fas fa-map-pin mr-2 text-blue-500"></i>
                        Geolocalización
                        <span class="text-gray-400 text-sm ml-2">(Opcional - Haz clic en el mapa)</span>
                    </label>
                    
                    <!-- Mapa interactivo -->
                    <div class="border-2 border-gray-200 rounded-xl overflow-hidden @error('geolocation') border-red-500 @enderror">
                        <div id="map" style="height: 400px; width: 100%;"></div>
                    </div>
                    
                    <!-- Campo oculto para las coordenadas -->
                    <input type="hidden" id="geolocation" name="geolocation" value="{{ old('geolocation', $jobOffer->geolocation) }}">
                    
                    <!-- Información de coordenadas seleccionadas -->
                    <div id="coordinates-info" class="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-xl {{ old('geolocation', $jobOffer->geolocation) ? '' : 'hidden' }}">
                        <p class="text-sm text-blue-700 flex items-center">
                            <i class="fas fa-check-circle mr-2"></i>
                            <span>Coordenadas seleccionadas: <strong id="coords-display">{{ old('geolocation', $jobOffer->geolocation) }}</strong></span>
                            <button type="button" onclick="clearLocation()" class="ml-auto text-red-600 hover:text-red-700 text-xs font-medium">
                                <i class="fas fa-times-circle mr-1"></i>
                                Limpiar
                            </button>
                        </p>
                    </div>
                    
                    <p class="mt-2 text-xs text-gray-500 flex items-center">
                        <i class="fas fa-info-circle mr-1"></i>
                        Haz clic en el mapa para actualizar la ubicación de la oferta laboral
                    </p>
                    
                    @error('geolocation')
                        <p class="mt-2 text-sm text-red-600 flex items-center">
                            <i class="fas fa-exclamation-circle mr-1"></i>
                            {{ $message }}
                        </p>
                    @enderror
                </div>

                <!-- Categorías -->
                <div class="mb-8">
                    <label class="block text-gray-700 font-medium mb-3 flex items-center">
                        <i class="fas fa-tags mr-2 text-blue-500"></i>
                        Categorías
                        <span class="text-gray-400 text-sm ml-2">(Selecciona una o más)</span>
                    </label>
                    <div class="border-2 border-gray-200 rounded-xl p-5 bg-gray-50 max-h-64 overflow-y-auto @error('categories') border-red-500 @enderror">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            @foreach($categories as $category)
                                <label class="flex items-center p-3 bg-white rounded-lg hover:bg-blue-50 cursor-pointer transition-colors border border-gray-200 hover:border-blue-300">
                                    <input 
                                        type="checkbox" 
                                        name="categories[]" 
                                        value="{{ $category->id }}" 
                                        id="category_{{ $category->id }}" 
                                        class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                                        {{ in_array($category->id, old('categories', $jobOffer->categories->pluck('id')->toArray())) ? 'checked' : '' }}
                                    >
                                    <span class="ml-3 text-sm text-gray-700 font-medium">
                                        <i class="fas fa-tag mr-1 text-blue-500 text-xs"></i>
                                        {{ $category->name }}
                                    </span>
                                </label>
                            @endforeach
                        </div>
                    </div>
                    @error('categories')
                        <p class="mt-2 text-sm text-red-600 flex items-center">
                            <i class="fas fa-exclamation-circle mr-1"></i>
                            {{ $message }}
                        </p>
                    @enderror
                </div>

                <!-- Nota de campos obligatorios -->
                <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <p class="text-sm text-blue-700 flex items-center">
                        <i class="fas fa-info-circle mr-2"></i>
                        Los campos marcados con <span class="text-red-500 mx-1">*</span> son obligatorios
                    </p>
                </div>

                <!-- Botones de acción -->
                <div class="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                    <a href="{{ route('job-offers.show', $jobOffer) }}" 
                       class="w-full sm:w-auto text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center">
                        <i class="fas fa-times-circle mr-2"></i>
                        Cancelar
                    </a>
                    <button
                        type="submit"
                        class="w-full sm:w-auto btn-primary text-white font-semibold py-4 px-8 rounded-xl shadow-soft
                               focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 hover-lift flex items-center justify-center"
                    >
                        <i class="fas fa-save mr-2"></i>
                        Actualizar Oferta
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<style>
    .gradient-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .card-enhanced {
        background: white;
        border-radius: 1rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    
    .hover-lift {
        transition: all 0.3s ease;
    }
    
    .hover-lift:hover {
        transform: translateY(-4px);
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
    
    .btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .btn-primary:hover {
        background: linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%);
    }
    
    .shadow-soft {
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
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
        animation: fadeInUp 0.5s ease-out;
    }
</style>

<!-- Leaflet CSS -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

<!-- Leaflet JavaScript -->
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<script>
let map;
let marker;

function initMap() {
    // Coordenadas por defecto: Popayán, Cauca, Colombia
    let defaultLat = 2.4448;
    let defaultLng = -76.6147;
    
    // Verificar si hay coordenadas de la oferta existente
    const existingGeolocation = "{{ old('geolocation', $jobOffer->geolocation ?? '') }}";
    if (existingGeolocation && existingGeolocation.trim() !== '') {
        try {
            const coords = existingGeolocation.split(',');
            const parsedLat = parseFloat(coords[0]);
            const parsedLng = parseFloat(coords[1]);
            
            if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
                defaultLat = parsedLat;
                defaultLng = parsedLng;
            }
        } catch (e) {
            console.log('Error parsing existing coordinates');
        }
    }
    
    // Inicializar el mapa
    map = L.map('map').setView([defaultLat, defaultLng], 13);
    
    // Agregar tiles de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Si hay coordenadas existentes, agregar marcador
    if (existingGeolocation && existingGeolocation.trim() !== '') {
        addMarker(defaultLat, defaultLng);
    }
    
    // Evento click en el mapa
    map.on('click', function(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        addMarker(lat, lng);
    });
}

function addMarker(lat, lng) {
    // Remover marcador anterior si existe
    if (marker) {
        map.removeLayer(marker);
    }
    
    // Crear nuevo marcador
    marker = L.marker([lat, lng], {
        draggable: true
    }).addTo(map);
    
    // Actualizar coordenadas cuando se arrastra el marcador
    marker.on('dragend', function(e) {
        const position = marker.getLatLng();
        updateCoordinates(position.lat, position.lng);
    });
    
    // Crear popup
    const popupContent = `
        <div class="p-2">
            <h3 class="font-semibold text-gray-800">Ubicación actualizada</h3>
            <p class="text-xs text-gray-500 mt-1">Lat: ${lat.toFixed(6)}</p>
            <p class="text-xs text-gray-500">Lng: ${lng.toFixed(6)}</p>
            <p class="text-xs text-blue-500 mt-2">
                <i class="fas fa-info-circle"></i> Puedes arrastrar el marcador
            </p>
        </div>
    `;
    
    marker.bindPopup(popupContent).openPopup();
    
    // Actualizar campo oculto y mostrar información
    updateCoordinates(lat, lng);
}

function updateCoordinates(lat, lng) {
    const coordsString = `${lat.toFixed(6)},${lng.toFixed(6)}`;
    document.getElementById('geolocation').value = coordsString;
    document.getElementById('coords-display').textContent = coordsString;
    document.getElementById('coordinates-info').classList.remove('hidden');
}

function clearLocation() {
    // Limpiar marcador
    if (marker) {
        map.removeLayer(marker);
        marker = null;
    }
    
    // Limpiar campo y ocultar información
    document.getElementById('geolocation').value = '';
    document.getElementById('coordinates-info').classList.add('hidden');
    
    // Centrar mapa en ubicación por defecto
    map.setView([2.4448, -76.6147], 13);
}

// Inicializar mapa cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    initMap();
});
</script>

@endsection 