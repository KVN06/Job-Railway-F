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
                    <i class="fas fa-building text-2xl text-white"></i>
                </div>
                <h1 class="text-3xl font-bold text-gray-800 mb-2">Formulario de Empresa</h1>
                <p class="text-gray-600">Registra tu empresa en nuestra plataforma</p>
            </div>

            <form action="{{ route('agg-company') }}" method="POST">
                @csrf

                <!-- Nombre de la Empresa -->
                <div class="mb-6">
                    <label for="name" class="block text-gray-700 font-medium mb-2 flex items-center">
                        <i class="fas fa-building mr-2 text-blue-500"></i>
                        Nombre de la Empresa
                        <span class="text-red-500 ml-1">*</span>
                    </label>
                    <div class="relative">
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value="{{ old('name') }}"
                            placeholder="Ej: Tech Solutions S.A.S."
                            required
                            autofocus
                            class="w-full border-2 border-gray-200 rounded-xl py-4 pl-12 pr-4 text-gray-800 placeholder-gray-400
                                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-300"
                        >
                        <div class="absolute top-4 left-4 text-gray-400">
                            <i class="fas fa-city"></i>
                        </div>
                    </div>
                </div>

                <!-- Email -->
                <div class="mb-6">
                    <label for="email" class="block text-gray-700 font-medium mb-2 flex items-center">
                        <i class="fas fa-envelope mr-2 text-blue-500"></i>
                        Correo Electrónico
                        <span class="text-red-500 ml-1">*</span>
                    </label>
                    <div class="relative">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value="{{ old('email') }}"
                            placeholder="contacto@empresa.com"
                            required
                            class="w-full border-2 border-gray-200 rounded-xl py-4 pl-12 pr-4 text-gray-800 placeholder-gray-400
                                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-300"
                        >
                        <div class="absolute top-4 left-4 text-gray-400">
                            <i class="fas fa-at"></i>
                        </div>
                    </div>
                </div>

                <!-- NIT -->
                <div class="mb-6">
                    <label for="nit" class="block text-gray-700 font-medium mb-2 flex items-center">
                        <i class="fas fa-id-card mr-2 text-blue-500"></i>
                        NIT
                        <span class="text-red-500 ml-1">*</span>
                    </label>
                    <div class="relative">
                        <input
                            type="text"
                            id="nit"
                            name="nit"
                            value="{{ old('nit') }}"
                            placeholder="Ej: 900123456-7"
                            required
                            class="w-full border-2 border-gray-200 rounded-xl py-4 pl-12 pr-4 text-gray-800 placeholder-gray-400
                                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-300"
                        >
                        <div class="absolute top-4 left-4 text-gray-400">
                            <i class="fas fa-hashtag"></i>
                        </div>
                    </div>
                </div>

                <!-- Sitio Web (Opcional) -->
                <div class="mb-6">
                    <label for="website" class="block text-gray-700 font-medium mb-2 flex items-center">
                        <i class="fas fa-globe mr-2 text-blue-500"></i>
                        Sitio Web
                        <span class="text-gray-400 text-sm ml-2">(Opcional)</span>
                    </label>
                    <div class="relative">
                        <input
                            type="url"
                            id="website"
                            name="website"
                            value="{{ old('website') }}"
                            placeholder="https://www.empresa.com"
                            class="w-full border-2 border-gray-200 rounded-xl py-4 pl-12 pr-4 text-gray-800 placeholder-gray-400
                                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-300"
                        >
                        <div class="absolute top-4 left-4 text-gray-400">
                            <i class="fas fa-link"></i>
                        </div>
                    </div>
                </div>

                <!-- Descripción -->
                <div class="mb-8">
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
                            placeholder="Describe tu empresa, servicios que ofrece, valores corporativos y cultura organizacional..."
                            required
                            class="w-full border-2 border-gray-200 rounded-xl py-4 pl-12 pr-4 text-gray-800 placeholder-gray-400
                                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-300 resize-none"
                        >{{ old('description') }}</textarea>
                        <div class="absolute top-4 left-4 text-gray-400">
                            <i class="fas fa-file-text"></i>
                        </div>
                    </div>
                </div>

                <!-- Nota de campos obligatorios -->
                <p class="text-sm text-gray-500 mb-6 flex items-center">
                    <i class="fas fa-info-circle mr-2"></i>
                    Los campos marcados con <span class="text-red-500 mx-1">*</span> son obligatorios
                </p>

                <!-- Botón de envío -->
                <button
                    type="submit"
                    class="w-full btn-primary text-white font-semibold py-4 rounded-xl shadow-soft
                           focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 hover-lift mb-6"
                >
                    <i class="fas fa-check-circle mr-2"></i>
                    REGISTRAR EMPRESA
                </button>

            </form>
        </div>
    </div>

@endsection