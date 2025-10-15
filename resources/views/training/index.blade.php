@extends('layouts.home')

@section('content')
<div class="container mx-auto px-4 py-8">
    <!-- Header mejorado con animaciones -->
    <div class="mb-8 animate-fade-in-up">
        <x-card padding="p-8" class="mb-6">
            <div class="flex flex-col md:flex-row justify-between items-center gap-6">
                <div class="text-center md:text-left">
                    <h1 class="text-3xl md:text-4xl font-bold mb-3">
                        <span class="bg-gradient-to-r from-blue-800 via-blue-900 to-slate-800 bg-clip-text text-transparent inline-flex items-center">
                            <i class="fas fa-graduation-cap mr-3 text-blue-900"></i>
                            Capacitaciones
                        </span>
                    </h1>
                    <p class="text-gray-600 text-lg max-w-2xl">Explora oportunidades de formación y desarrollo profesional</p>
                </div>
            </div>
        </x-card>
    </div>

    @if(session('success'))
    <div class="bg-gradient-primary text-white p-4 rounded-xl mb-6 shadow-soft animate-slide-in">
            <div class="flex items-center">
                <i class="fas fa-check-circle mr-2"></i>
                {{ session('success') }}
            </div>
        </div>
    @endif

    <!-- LISTADO DE CAPACITACIONES -->
    <section class="space-y-6" id="training-insights">
        <div class="grid grid-cols-1 gap-6 animate-slide-in">
            @forelse($trainings as $item)
                @php
                    $startDate = $item->start_date ? \Carbon\Carbon::parse($item->start_date)->format('d/m/Y') : null;
                    $endDate = $item->end_date ? \Carbon\Carbon::parse($item->end_date)->format('d/m/Y') : null;
                    $isUpcoming = $item->start_date ? \Carbon\Carbon::parse($item->start_date)->isFuture() : false;
                    $isFinished = $item->end_date ? \Carbon\Carbon::parse($item->end_date)->isPast() : false;
                @endphp

                <x-card variant="enhanced" hover padding="p-0" class="overflow-hidden">
                    <div class="flex flex-col md:flex-row">
                        <!-- Contenido principal -->
                        <div class="flex-1 p-6">
                            <div class="flex items-start justify-between mb-4">
                                <div class="flex-1">
                                    <h2 class="text-2xl font-bold text-gray-900 mb-3 group">
                                        <span class="group inline-flex items-center">
                                            {{ $item->title }}
                                            @if($item->link)
                                                <i class="fas fa-external-link-alt ml-2 text-blue-900 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-0 group-hover:translate-x-1"></i>
                                            @endif
                                        </span>
                                    </h2>

                                    <div class="flex items-center mb-4 group cursor-pointer">
                                        <div class="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                                            <i class="fas fa-building text-white text-xl"></i>
                                        </div>
                                        <div>
                                            <p class="text-gray-800 font-semibold text-lg">{{ $item->provider ?? 'Proveedor no especificado' }}</p>
                                            <p class="text-sm text-gray-500 flex items-center">
                                                <i class="fas fa-graduation-cap text-blue-900 mr-1"></i>
                                                Programa de capacitación
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div class="ml-4">
                                    <span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-primary text-white">
                                        <i class="fas fa-graduation-cap mr-2"></i>
                                        {{ $isFinished ? 'Finalizada' : ($isUpcoming ? 'Próxima' : 'En curso') }}
                                    </span>
                                </div>
                            </div>

                            <!-- Descripción -->
                            @if($item->description)
                                <div class="mb-4">
                                    <p class="text-gray-700 leading-relaxed">{{ \Illuminate\Support\Str::limit($item->description, 200) }}</p>
                                </div>
                            @endif

                            <div class="flex flex-wrap items-center gap-4 mb-4">
                                @if($item->start_date)
                                    <div class="flex items-center text-gray-700 bg-blue-100 px-3 py-2 rounded-lg">
                                        <i class="fas fa-play-circle text-blue-900 mr-2"></i>
                                        <span class="font-medium">Inicio: {{ $startDate }}</span>
                                    </div>
                                @endif
                                @if($item->end_date)
                                    <div class="flex items-center text-gray-700 bg-blue-100 px-3 py-2 rounded-lg">
                                        <i class="fas fa-stop-circle text-blue-900 mr-2"></i>
                                        <span class="font-medium">Fin: {{ $endDate }}</span>
                                    </div>
                                @endif
                                <div class="flex items-center text-gray-600 bg-blue-100 px-3 py-2 rounded-lg">
                                    <i class="fas fa-clock text-blue-900 mr-2"></i>
                                    <span class="text-sm">{{ \Carbon\Carbon::parse($item->created_at)->diffForHumans() }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Sidebar con información y acciones -->
                        <div class="md:w-72 bg-white p-6 flex flex-col justify-between border-t border-blue-900/20 md:border-t-0 md:border-l md:border-blue-900/20">
                            <div class="space-y-3">
                                <!-- Información de estado -->
                                <div class="rounded-xl p-4 shadow-sm border border-blue-900/20 bg-white">
                                    <p class="text-xs text-gray-500 mb-1 uppercase tracking-wide font-semibold">Estado del Programa</p>
                                    <p class="text-2xl font-bold text-gray-900 mb-2">
                                        {{ $isFinished ? 'Finalizada' : ($isUpcoming ? 'Próxima' : 'Activa') }}
                                    </p>
                                    <div class="flex items-center text-xs text-gray-500">
                                        <i class="fas fa-lightbulb mr-1"></i>
                                        {{ $isUpcoming ? 'Planificar participación' : 'Repasar contenidos' }}
                                    </div>
                                </div>

                                <!-- Información adicional -->
                                <div class="rounded-xl p-4 shadow-sm border border-blue-900/20 bg-white">
                                    <p class="text-xs text-gray-500 mb-2 uppercase tracking-wide font-semibold">Disponibilidad</p>
                                    <div class="flex items-center text-sm text-gray-700 mb-1">
                                        <i class="fas fa-link text-blue-900 mr-2 w-4"></i>
                                        <span>{{ $item->link ? 'Enlace disponible' : 'Sin enlace' }}</span>
                                    </div>
                                    <div class="flex items-center text-sm text-gray-700">
                                        <i class="fas fa-calendar text-blue-900 mr-2 w-4"></i>
                                        <span>{{ $isUpcoming ? 'Inicia pronto' : ($isFinished ? 'Completada' : 'En progreso') }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Botones de acción -->
                            <div class="text-right flex flex-col items-end space-y-2 mt-3">
                                @if($item->link)
                                    <a href="{{ $item->link }}"
                                       target="_blank" rel="noopener noreferrer"
                                       class="btn-primary text-white px-6 py-3 rounded-xl hover-lift transition-all duration-300 text-sm font-medium shadow-soft w-full flex items-center justify-center group">
                                        <i class="fas fa-external-link-alt mr-2 group-hover:scale-110 transition-transform"></i>
                                        Ver Capacitación
                                    </a>
                                @else
                                    <span class="text-blue-900 text-sm w-full text-center py-3 bg-blue-100 rounded-xl">
                                        <i class="fas fa-ban mr-1"></i>
                                        Sin enlace disponible
                                    </span>
                                @endif
                            </div>
                        </div>
                    </div>
                </x-card>
            @empty
                <x-card variant="enhanced" class="text-center py-12 animate-fade-in-up">
                    <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-graduation-cap text-3xl text-gray-400"></i>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">No hay capacitaciones disponibles</h3>
                    <p class="text-gray-600">Actualmente no hay capacitaciones publicadas.</p>
                </x-card>
            @endforelse

            @if(method_exists($trainings, 'links'))
                <div class="mt-8 flex justify-center animate-fade-in-up">
                    <div class="bg-white rounded-xl shadow-soft p-4 border border-blue-900/30">
                        {{ $trainings->links('pagination::tailwind') }}
                    </div>
                </div>
            @endif
        </div>
    </section>
</div>

<style>
    /* Animaciones */
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
        animation: fadeInUp 0.6s ease-out;
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    .animate-slide-in {
        animation: slideIn 0.6s ease-out;
    }

    /* Hover effects */
    .hover-lift {
        transition: all 0.3s ease;
    }

    .hover-lift:hover {
        transform: translateY(-2px);
    }

    .shadow-soft {
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    /* Gradiente principal y botones usan la paleta global (definida en app.css) */
</style>
@endsection
