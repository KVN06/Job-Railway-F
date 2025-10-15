@extends('layouts.new-user')

@section('content')

    {{-- Mensajes de error --}}
    @if ($errors->any())
        <div class="mb-6 p-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 rounded-xl shadow-soft max-w-2xl mx-auto animate-fade-in-up">
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

    <div class="max-w-2xl mx-auto animate-fade-in-up">
        <div class="card-enhanced p-8 hover-lift">
            <!-- Header del formulario -->
            <div class="text-center mb-8">
                <div class="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-user-tie text-2xl text-white"></i>
                </div>
                <h1 class="text-3xl font-bold text-gray-800 mb-2">Formulario de Desempleado</h1>
                <p class="text-gray-600">Completa tu perfil profesional</p>
            </div>

            <form action="{{ route('agg-unemployed') }}" method="POST">
                @csrf

                <!-- Profesión -->
                <div class="mb-6">
                    <label for="profession" class="block text-gray-700 font-medium mb-2 flex items-center">
                        <i class="fas fa-briefcase mr-2 text-blue-500"></i>
                        Profesión
                    </label>
                    <div class="relative">
                        <input
                            type="text"
                            id="profession"
                            name="profession"
                            value="{{ old('profession') }}"
                            placeholder="Ej: Desarrollador Web, Diseñador Gráfico"
                            required
                            autofocus
                            class="w-full border-2 border-gray-200 rounded-xl py-4 pl-12 pr-4 text-gray-800 placeholder-gray-400
                                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-300"
                        >
                        <div class="absolute top-4 left-4 text-gray-400">
                            <i class="fas fa-user-graduate"></i>
                        </div>
                    </div>
                </div>

                <!-- Experiencia -->
                <div class="mb-6">
                    <label for="experience" class="block text-gray-700 font-medium mb-2 flex items-center">
                        <i class="fas fa-chart-line mr-2 text-blue-500"></i>
                        Experiencia
                    </label>
                    <div class="relative">
                        <textarea
                            id="experience"
                            name="experience"
                            rows="5"
                            placeholder="Describe tu experiencia laboral, proyectos realizados y habilidades principales..."
                            required
                            class="w-full border-2 border-gray-200 rounded-xl py-4 pl-12 pr-4 text-gray-800 placeholder-gray-400
                                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-300 resize-none"
                        >{{ old('experience') }}</textarea>
                        <div class="absolute top-4 left-4 text-gray-400">
                            <i class="fas fa-file-alt"></i>
                        </div>
                    </div>
                </div>

                <!-- Ubicación -->
                <div class="mb-8">
                    <label for="location" class="block text-gray-700 font-medium mb-2 flex items-center">
                        <i class="fas fa-map-marker-alt mr-2 text-blue-500"></i>
                        Ubicación
                    </label>
                    <div class="relative">
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value="{{ old('location') }}"
                            placeholder="Ej: Bogotá, Colombia"
                            required
                            class="w-full border-2 border-gray-200 rounded-xl py-4 pl-12 pr-4 text-gray-800 placeholder-gray-400
                                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-300"
                        >
                        <div class="absolute top-4 left-4 text-gray-400">
                            <i class="fas fa-location-dot"></i>
                        </div>
                    </div>
                </div>

                <!-- Botón de envío -->
                <button
                    type="submit"
                    class="w-full btn-primary text-white font-semibold py-4 rounded-xl shadow-soft
                           focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 hover-lift mb-6"
                >
                    <i class="fas fa-check-circle mr-2"></i>
                    REGISTRAR DESEMPLEADO
                </button>

                
            </form>
        </div>
    </div>

@endsection