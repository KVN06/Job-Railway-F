@extends('admin.layout')

@section('title', 'Gestión de Clasificados')

@section('content')

<div class="animate-fade-in-up">
    <!-- Header con estadísticas resumidas -->
    <div class="mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
                <h1 class="text-3xl font-bold text-gray-800 mb-2">Clasificados</h1>
                <p class="text-gray-600">Gestiona todas las publicaciones de clasificados</p>
            </div>
            <div class="mt-4 md:mt-0 flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl shadow-soft">
                <i class="fas fa-list-check text-xl"></i>
                <div>
                    <p class="text-xs text-blue-100">Total de Clasificados</p>
                    <p class="text-2xl font-bold">{{ $classifieds->total() }}</p>
                </div>
            </div>
        </div>

        <!-- Estadísticas en cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="card-enhanced p-5 hover-lift">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500 mb-1">Total Publicaciones</p>
                        <p class="text-2xl font-bold text-gray-800">{{ $classifieds->total() }}</p>
                    </div>
                    <div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                        <i class="fas fa-file-alt text-white text-xl"></i>
                    </div>
                </div>
            </div>

            <div class="card-enhanced p-5 hover-lift">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500 mb-1">Por Empresas</p>
                        <p class="text-2xl font-bold text-gray-800">{{ $classifieds->where('company_id', '!=', null)->count() }}</p>
                    </div>
                    <div class="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center">
                        <i class="fas fa-building text-white text-xl"></i>
                    </div>
                </div>
            </div>

            <div class="card-enhanced p-5 hover-lift">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500 mb-1">Por Desempleados</p>
                        <p class="text-2xl font-bold text-gray-800">{{ $classifieds->where('unemployed_id', '!=', null)->count() }}</p>
                    </div>
                    <div class="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                        <i class="fas fa-user-tie text-white text-xl"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Tabla de clasificados -->
    <div class="card-enhanced overflow-hidden">
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                        <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            <i class="fas fa-heading mr-2 text-blue-500"></i>Título
                        </th>
                        <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            <i class="fas fa-user mr-2 text-blue-500"></i>Creado por
                        </th>
                        <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            <i class="fas fa-tag mr-2 text-blue-500"></i>Tipo
                        </th>
                        <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            <i class="fas fa-map-marker-alt mr-2 text-blue-500"></i>Ubicación
                        </th>
                        <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            <i class="fas fa-dollar-sign mr-2 text-blue-500"></i>Salario
                        </th>
                        <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            <i class="fas fa-folder mr-2 text-blue-500"></i>Categorías
                        </th>
                        <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            <i class="fas fa-calendar mr-2 text-blue-500"></i>Fecha
                        </th>
                        <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            <i class="fas fa-cog mr-2 text-blue-500"></i>Acciones
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    @forelse($classifieds as $classified)
                    <tr class="hover:bg-gray-50 transition-colors duration-200">
                        <td class="px-6 py-4">
                            <div class="text-sm font-semibold text-gray-900">{{ $classified->title }}</div>
                            <div class="text-xs text-gray-500 mt-1 truncate max-w-xs">
                                {{ Str::limit($classified->description, 60) }}
                            </div>
                        </td>
                        <td class="px-6 py-4">
                            @if($classified->company)
                                <div class="flex items-start space-x-2">
                                    <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <i class="fas fa-building text-blue-600 text-xs"></i>
                                    </div>
                                    <div>
                                        <div class="text-sm font-medium text-gray-900">
                                            {{ $classified->company->user->name ?? 'N/A' }}
                                        </div>
                                        <div class="text-xs text-gray-500">
                                            {{ $classified->company->user->email ?? '' }}
                                        </div>
                                        <span class="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                                            Empresa
                                        </span>
                                    </div>
                                </div>
                            @elseif($classified->unemployed)
                                <div class="flex items-start space-x-2">
                                    <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <i class="fas fa-user text-green-600 text-xs"></i>
                                    </div>
                                    <div>
                                        <div class="text-sm font-medium text-gray-900">
                                            {{ $classified->unemployed->user->name ?? 'N/A' }}
                                        </div>
                                        <div class="text-xs text-gray-500">
                                            {{ $classified->unemployed->user->email ?? '' }}
                                        </div>
                                        <span class="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                                            Desempleado
                                        </span>
                                    </div>
                                </div>
                            @else
                                <span class="text-sm text-gray-400">N/A</span>
                            @endif
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg shadow-sm
                                {{ $classified->company_id ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' : 'bg-gradient-to-r from-green-500 to-green-600 text-white' }}">
                                <i class="fas {{ $classified->company_id ? 'fa-building' : 'fa-user-tie' }} mr-1.5"></i>
                                {{ $classified->company_id ? 'Empresa' : 'Desempleado' }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center text-sm text-gray-700">
                                <i class="fas fa-location-dot text-gray-400 mr-2"></i>
                                {{ $classified->location }}
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            @if($classified->salary)
                                <div class="flex items-center text-sm font-semibold text-green-600">
                                    <i class="fas fa-money-bill-wave mr-2"></i>
                                    ${{ number_format($classified->salary, 0, ',', '.') }}
                                </div>
                            @else
                                <span class="text-xs text-gray-400 italic">No especificado</span>
                            @endif
                        </td>
                        <td class="px-6 py-4">
                            <div class="flex flex-wrap gap-1 max-w-xs">
                                @forelse($classified->categories as $category)
                                    <span class="inline-block bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm">
                                        <i class="fas fa-tag text-gray-500 mr-1"></i>
                                        {{ $category->name }}
                                    </span>
                                @empty
                                    <span class="text-xs text-gray-400 italic">Sin categorías</span>
                                @endforelse
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-700 font-medium">
                                <i class="far fa-calendar-alt text-gray-400 mr-1"></i>
                                {{ $classified->created_at->format('d/m/Y') }}
                            </div>
                            <div class="text-xs text-gray-500 mt-0.5">
                                <i class="far fa-clock text-gray-400 mr-1"></i>
                                {{ $classified->created_at->format('H:i') }}
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center space-x-2">
                                <a href="{{ route('classifieds.show', $classified->id) }}" 
                                   target="_blank"
                                   class="w-8 h-8 flex items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-all hover-lift" 
                                   title="Ver detalles">
                                    <i class="fas fa-eye text-sm"></i>
                                </a>
                                <a href="{{ route('admin.classifieds.edit', $classified->id) }}" 
                                   class="w-8 h-8 flex items-center justify-center bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded-lg transition-all hover-lift"
                                   title="Editar">
                                    <i class="fas fa-edit text-sm"></i>
                                </a>
                                <form action="{{ route('admin.classifieds.destroy', $classified->id) }}" method="POST" class="inline">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" 
                                            class="w-8 h-8 flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-all hover-lift"
                                            onclick="return confirm('¿Estás seguro de eliminar este clasificado?')"
                                            title="Eliminar">
                                        <i class="fas fa-trash-alt text-sm"></i>
                                    </button>
                                </form>
                            </div>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="8" class="px-6 py-12 text-center">
                            <div class="flex flex-col items-center justify-center">
                                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <i class="fas fa-inbox text-3xl text-gray-400"></i>
                                </div>
                                <p class="text-gray-500 font-medium">No hay clasificados disponibles</p>
                                <p class="text-sm text-gray-400 mt-1">Los clasificados publicados aparecerán aquí</p>
                            </div>
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <!-- Paginación mejorada -->
        @if($classifieds->hasPages())
        <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
            {{ $classifieds->links() }}
        </div>
        @endif
    </div>
</div>

@endsection