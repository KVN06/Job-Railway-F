@extends('admin.layout')

@section('title', 'Gestión de Ofertas Laborales')

@section('content')

<div class="animate-fade-in-up">
    <!-- Header con estadísticas resumidas -->
    <div class="mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
                <h1 class="text-3xl font-bold text-gray-800 mb-2">Ofertas Laborales</h1>
                <p class="text-gray-600">Gestiona todas las oportunidades de empleo</p>
            </div>
            <div class="mt-4 md:mt-0 flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl shadow-soft">
                <i class="fas fa-briefcase text-xl"></i>
                <div>
                    <p class="text-xs text-green-100">Total de Ofertas</p>
                    <p class="text-2xl font-bold">{{ $jobOffers->total() }}</p>
                </div>
            </div>
        </div>

        <!-- Estadísticas Rápidas -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div class="card-enhanced p-5 hover-lift">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500 mb-1">Total Ofertas</p>
                        <p class="text-2xl font-bold text-gray-800">{{ $jobOffers->total() }}</p>
                    </div>
                    <div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                        <i class="fas fa-briefcase text-white text-xl"></i>
                    </div>
                </div>
            </div>

            <div class="card-enhanced p-5 hover-lift">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500 mb-1">Empresas</p>
                        <p class="text-2xl font-bold text-gray-800">{{ $jobOffers->unique('company_id')->count() }}</p>
                    </div>
                    <div class="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                        <i class="fas fa-building text-white text-xl"></i>
                    </div>
                </div>
            </div>

            <div class="card-enhanced p-5 hover-lift">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500 mb-1">Con Salario</p>
                        <p class="text-2xl font-bold text-gray-800">{{ $jobOffers->where('salary', '>', 0)->count() }}</p>
                    </div>
                    <div class="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                        <i class="fas fa-money-bill-wave text-white text-xl"></i>
                    </div>
                </div>
            </div>

            <div class="card-enhanced p-5 hover-lift">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500 mb-1">Este Mes</p>
                        <p class="text-2xl font-bold text-gray-800">{{ $jobOffers->where('created_at', '>=', now()->subMonth())->count() }}</p>
                    </div>
                    <div class="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                        <i class="fas fa-calendar-check text-white text-xl"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Tabla de ofertas laborales -->
    <div class="card-enhanced overflow-hidden">
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                        <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            <i class="fas fa-heading mr-2 text-green-500"></i>Título
                        </th>
                        <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            <i class="fas fa-building mr-2 text-green-500"></i>Empresa
                        </th>
                        <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            <i class="fas fa-map-marker-alt mr-2 text-green-500"></i>Ubicación
                        </th>
                        <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            <i class="fas fa-dollar-sign mr-2 text-green-500"></i>Salario
                        </th>
                        <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            <i class="fas fa-folder mr-2 text-green-500"></i>Categorías
                        </th>
                        <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            <i class="fas fa-calendar mr-2 text-green-500"></i>Fecha
                        </th>
                        <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            <i class="fas fa-cog mr-2 text-green-500"></i>Acciones
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    @forelse($jobOffers as $jobOffer)
                    <tr class="hover:bg-gray-50 transition-colors duration-200">
                        <td class="px-6 py-4">
                            <div class="flex items-center space-x-3">
                                <div class="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <i class="fas fa-briefcase text-green-600"></i>
                                </div>
                                <div>
                                    <div class="text-sm font-semibold text-gray-900">{{ $jobOffer->title }}</div>
                                    <div class="text-xs text-gray-500 mt-1 truncate max-w-xs">
                                        {{ Str::limit($jobOffer->description, 60) }}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4">
                            <div class="flex items-start space-x-2">
                                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <i class="fas fa-building text-blue-600 text-xs"></i>
                                </div>
                                <div>
                                    <div class="text-sm font-medium text-gray-900">
                                        {{ $jobOffer->company->user->name ?? 'N/A' }}
                                    </div>
                                    <div class="text-xs text-gray-500">
                                        {{ $jobOffer->company->user->email ?? '' }}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center text-sm text-gray-700">
                                <i class="fas fa-location-dot text-gray-400 mr-2"></i>
                                {{ $jobOffer->location }}
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            @if($jobOffer->salary)
                                <div class="flex items-center text-sm font-semibold text-green-600">
                                    <i class="fas fa-money-bill-wave mr-2"></i>
                                    ${{ number_format($jobOffer->salary, 0, ',', '.') }}
                                </div>
                            @else
                                <span class="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg">
                                    <i class="fas fa-minus-circle mr-1"></i>
                                    No especificado
                                </span>
                            @endif
                        </td>
                        <td class="px-6 py-4">
                            <div class="flex flex-wrap gap-1 max-w-xs">
                                @forelse($jobOffer->categories as $category)
                                    <span class="inline-block bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg px-2.5 py-1 text-xs font-medium text-blue-700 shadow-sm">
                                        <i class="fas fa-tag text-blue-500 mr-1"></i>
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
                                {{ $jobOffer->created_at->format('d/m/Y') }}
                            </div>
                            <div class="text-xs text-gray-500 mt-0.5">
                                <i class="far fa-clock text-gray-400 mr-1"></i>
                                {{ $jobOffer->created_at->format('H:i') }}
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center space-x-2">
                                <a href="{{ route('job-offers.show', $jobOffer->id) }}" 
                                   target="_blank"
                                   class="w-8 h-8 flex items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-all hover-lift" 
                                   title="Ver oferta">
                                    <i class="fas fa-eye text-sm"></i>
                                </a>
                                <form action="{{ route('admin.job-offers.destroy', $jobOffer->id) }}" method="POST" class="inline">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" 
                                            class="w-8 h-8 flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-all hover-lift"
                                            onclick="return confirm('¿Estás seguro de eliminar esta oferta laboral?')"
                                            title="Eliminar oferta">
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
                                    <i class="fas fa-briefcase text-3xl text-gray-400"></i>
                                </div>          
                                <p class="text-gray-500 font-medium">No hay ofertas laborales disponibles</p>
                                <p class="text-sm text-gray-400 mt-1">Las ofertas publicadas aparecerán aquí</p>
                            </div>
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <!-- Paginación mejorada -->
        @if($jobOffers->hasPages())
        <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div class="text-sm text-gray-700">
                    Mostrando 
                    <span class="font-medium text-gray-900">{{ $jobOffers->firstItem() }}</span>
                    a 
                    <span class="font-medium text-gray-900">{{ $jobOffers->lastItem() }}</span>
                    de 
                    <span class="font-medium text-gray-900">{{ $jobOffers->total() }}</span>
                    resultados
                </div>
                <div>
                    {{ $jobOffers->links() }}
                </div>
            </div>
        </div>
        @endif
    </div>

    <!-- Información adicional -->
    <div class="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card-enhanced p-6 hover-lift">
            <div class="flex items-center mb-4">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                    <i class="fas fa-chart-pie text-white"></i>
                </div>
                <h3 class="text-lg font-bold text-gray-800">Resumen de Ofertas</h3>
            </div>
            <div class="space-y-3">
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span class="text-sm text-gray-600 flex items-center">
                        <i class="fas fa-check-circle text-green-500 mr-2"></i>
                        Ofertas activas
                    </span>
                    <span class="font-semibold text-gray-900">{{ $jobOffers->count() }}</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span class="text-sm text-gray-600 flex items-center">
                        <i class="fas fa-building text-blue-500 mr-2"></i>
                        Empresas participantes
                    </span>
                    <span class="font-semibold text-gray-900">{{ $jobOffers->unique('company_id')->count() }}</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span class="text-sm text-gray-600 flex items-center">
                        <i class="fas fa-money-bill-wave text-green-500 mr-2"></i>
                        Ofertas con salario
                    </span>
                    <span class="font-semibold text-gray-900">{{ $jobOffers->where('salary', '>', 0)->count() }}</span>
                </div>
            </div>
        </div>
        
        <div class="card-enhanced p-6 hover-lift">
            <div class="flex items-center mb-4">
                <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <i class="fas fa-bolt text-white"></i>
                </div>
                <h3 class="text-lg font-bold text-gray-800">Acciones Rápidas</h3>
            </div>
            <div class="space-y-3">
                <a href="{{ route('job-offers.index') }}" 
                   target="_blank"
                   class="flex items-center justify-between w-full bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 px-4 py-3 rounded-lg transition-all hover-lift text-sm font-medium">
                    <span class="flex items-center">
                        <i class="fas fa-external-link-alt mr-2"></i>
                        Ver ofertas en sitio público
                    </span>
                    <i class="fas fa-arrow-right"></i>
                </a>
                <button class="flex items-center justify-between w-full bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-700 px-4 py-3 rounded-lg transition-all hover-lift text-sm font-medium">
                    <span class="flex items-center">
                        <i class="fas fa-download mr-2"></i>
                        Exportar listado
                    </span>
                    <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </div>
    </div>
</div>

@endsection