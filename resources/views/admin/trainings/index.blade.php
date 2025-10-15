@extends('admin.layout')

@section('title', 'Gestión de Capacitaciones')

@section('content')

<div class="animate-fade-in-up">
    <!-- Header con botón de nueva capacitación -->
    <div class="mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
                <h1 class="text-3xl font-bold text-gray-800 mb-2">Capacitaciones</h1>
                <p class="text-gray-600">Administra los cursos y programas de formación</p>
            </div>
            <div class="mt-4 md:mt-0">
                <a href="{{ route('admin.trainings.create') }}" 
                   class="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 
                          text-white px-6 py-3 rounded-xl shadow-soft transition-all duration-300 hover-lift font-medium">
                    <i class="fas fa-plus-circle text-lg"></i>
                    <span>Nueva Capacitación</span>
                </a>
            </div>
        </div>

        <!-- Estadísticas -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div class="card-enhanced p-5 hover-lift">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500 mb-1">Total Capacitaciones</p>
                        <p class="text-2xl font-bold text-gray-800">{{ $trainings->total() }}</p>
                    </div>
                    <div class="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                        <i class="fas fa-graduation-cap text-white text-xl"></i>
                    </div>
                </div>
            </div>

            <div class="card-enhanced p-5 hover-lift">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500 mb-1">Con Enlace</p>
                        <p class="text-2xl font-bold text-gray-800">{{ $trainings->whereNotNull('link')->count() }}</p>
                    </div>
                    <div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                        <i class="fas fa-link text-white text-xl"></i>
                    </div>
                </div>
            </div>

            <div class="card-enhanced p-5 hover-lift">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500 mb-1">Activas</p>
                        <p class="text-2xl font-bold text-gray-800">{{ $trainings->filter(function($training) {
                            return $training->end_date && now()->lte(\Carbon\Carbon::parse($training->end_date));
                        })->count() }}</p>
                    </div>
                    <div class="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                        <i class="fas fa-calendar-check text-white text-xl"></i>
                    </div>
                </div>
            </div>

            <div class="card-enhanced p-5 hover-lift">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500 mb-1">Proveedores</p>
                        <p class="text-2xl font-bold text-gray-800">{{ $trainings->unique('provider')->count() }}</p>
                    </div>
                    <div class="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
                        <i class="fas fa-building text-white text-xl"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Tabla de capacitaciones -->
    <div class="card-enhanced overflow-hidden">
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                        <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            <i class="fas fa-heading mr-2 text-purple-500"></i>Título
                        </th>
                        <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            <i class="fas fa-building mr-2 text-purple-500"></i>Proveedor
                        </th>
                        <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            <i class="fas fa-calendar-alt mr-2 text-purple-500"></i>Fechas
                        </th>
                        <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            <i class="fas fa-link mr-2 text-purple-500"></i>Enlace
                        </th>
                        <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            <i class="fas fa-signal mr-2 text-purple-500"></i>Estado
                        </th>
                        <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            <i class="fas fa-clock mr-2 text-purple-500"></i>Creación
                        </th>
                        <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            <i class="fas fa-cog mr-2 text-purple-500"></i>Acciones
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    @forelse($trainings as $training)
                    <tr class="hover:bg-gray-50 transition-colors duration-200">
                        <td class="px-6 py-4">
                            <div class="flex items-center space-x-3">
                                <div class="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <i class="fas fa-graduation-cap text-purple-600"></i>
                                </div>
                                <div class="max-w-xs">
                                    <div class="text-sm font-semibold text-gray-900">{{ $training->title }}</div>
                                    <div class="text-xs text-gray-500 mt-1 truncate">
                                        {{ Str::limit($training->description, 60) }}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            @if($training->provider)
                                <div class="flex items-center text-sm text-gray-700">
                                    <i class="fas fa-university text-gray-400 mr-2"></i>
                                    {{ $training->provider }}
                                </div>
                            @else
                                <span class="text-xs text-gray-400 italic">No especificado</span>
                            @endif
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm space-y-1">
                                @if($training->start_date)
                                    <div class="flex items-center text-green-600">
                                        <i class="fas fa-play-circle mr-1 text-xs"></i>
                                        <span class="font-medium">{{ \Carbon\Carbon::parse($training->start_date)->format('d/m/Y') }}</span>
                                    </div>
                                @endif
                                @if($training->end_date)
                                    <div class="flex items-center text-red-600">
                                        <i class="fas fa-stop-circle mr-1 text-xs"></i>
                                        <span class="font-medium">{{ \Carbon\Carbon::parse($training->end_date)->format('d/m/Y') }}</span>
                                    </div>
                                @endif
                                @if(!$training->start_date && !$training->end_date)
                                    <span class="text-xs text-gray-400 italic">Sin fechas</span>
                                @endif
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            @if($training->link)
                                <a href="{{ $training->link }}" target="_blank" 
                                   class="inline-flex items-center px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-medium transition-all hover-lift">
                                    <i class="fas fa-external-link-alt mr-1.5"></i>
                                    Ver enlace
                                </a>
                            @else
                                <span class="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg text-xs">
                                    <i class="fas fa-minus-circle mr-1.5"></i>
                                    Sin enlace
                                </span>
                            @endif
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            @php
                                $now = now();
                                $startDate = $training->start_date ? \Carbon\Carbon::parse($training->start_date) : null;
                                $endDate = $training->end_date ? \Carbon\Carbon::parse($training->end_date) : null;
                                
                                $status = 'gray';
                                $statusText = 'Sin fecha';
                                $icon = 'fa-question-circle';
                                $bgClass = 'bg-gray-100';
                                $textClass = 'text-gray-700';
                                
                                if ($startDate && $endDate) {
                                    if ($now->between($startDate, $endDate)) {
                                        $status = 'green';
                                        $statusText = 'En curso';
                                        $icon = 'fa-circle-play';
                                        $bgClass = 'bg-gradient-to-r from-green-100 to-green-200';
                                        $textClass = 'text-green-700';
                                    } elseif ($now->lt($startDate)) {
                                        $status = 'blue';
                                        $statusText = 'Próxima';
                                        $icon = 'fa-clock';
                                        $bgClass = 'bg-gradient-to-r from-blue-100 to-blue-200';
                                        $textClass = 'text-blue-700';
                                    } else {
                                        $status = 'gray';
                                        $statusText = 'Finalizada';
                                        $icon = 'fa-circle-check';
                                        $bgClass = 'bg-gray-100';
                                        $textClass = 'text-gray-600';
                                    }
                                } elseif ($startDate && $now->lt($startDate)) {
                                    $status = 'blue';
                                    $statusText = 'Próxima';
                                    $icon = 'fa-clock';
                                    $bgClass = 'bg-gradient-to-r from-blue-100 to-blue-200';
                                    $textClass = 'text-blue-700';
                                } elseif ($endDate && $now->gt($endDate)) {
                                    $status = 'gray';
                                    $statusText = 'Finalizada';
                                    $icon = 'fa-circle-check';
                                    $bgClass = 'bg-gray-100';
                                    $textClass = 'text-gray-600';
                                }
                            @endphp
                            <span class="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg {{ $bgClass }} {{ $textClass }} shadow-sm">
                                <i class="fas {{ $icon }} mr-1.5"></i>
                                {{ $statusText }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-700 font-medium">
                                <i class="far fa-calendar-alt text-gray-400 mr-1"></i>
                                {{ $training->created_at->format('d/m/Y') }}
                            </div>
                            <div class="text-xs text-gray-500 mt-0.5">
                                <i class="far fa-clock text-gray-400 mr-1"></i>
                                {{ $training->created_at->format('H:i') }}
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center space-x-2">
                                <a href="{{ route('training.public.index', $training->id) }}" 
                                   class="w-8 h-8 flex items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-all hover-lift" 
                                   title="Ver detalles">
                                    <i class="fas fa-eye text-sm"></i>
                                </a>
                                <a href="{{ route('admin.trainings.edit', $training->id) }}" 
                                   class="w-8 h-8 flex items-center justify-center bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded-lg transition-all hover-lift"
                                   title="Editar">
                                    <i class="fas fa-edit text-sm"></i>
                                </a>
                                <form action="{{ route('admin.trainings.destroy', $training->id) }}" method="POST" class="inline">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" 
                                            class="w-8 h-8 flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-all hover-lift"
                                            onclick="return confirm('¿Estás seguro de eliminar esta capacitación?')"
                                            title="Eliminar">
                                        <i class="fas fa-trash-alt text-sm"></i>
                                    </button>
                                </form>
                            </div>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="7" class="px-6 py-12 text-center">
                            <div class="flex flex-col items-center justify-center">
                                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <i class="fas fa-graduation-cap text-3xl text-gray-400"></i>
                                </div>
                                <p class="text-gray-500 font-medium">No hay capacitaciones disponibles</p>
                                <p class="text-sm text-gray-400 mt-1">Crea una nueva capacitación para comenzar</p>
                                <a href="{{ route('admin.trainings.create') }}" 
                                   class="mt-4 inline-flex items-center px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-all">
                                    <i class="fas fa-plus mr-2"></i>
                                    Nueva Capacitación
                                </a>
                            </div>
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <!-- Paginación mejorada -->
        @if($trainings->hasPages())
        <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div class="text-sm text-gray-700">
                    Mostrando 
                    <span class="font-medium text-gray-900">{{ $trainings->firstItem() }}</span>
                    a 
                    <span class="font-medium text-gray-900">{{ $trainings->lastItem() }}</span>
                    de 
                    <span class="font-medium text-gray-900">{{ $trainings->total() }}</span>
                    resultados
                </div>
                <div>
                    {{ $trainings->links() }}
                </div>
            </div>
        </div>
        @endif
    </div>
</div>

@endsection