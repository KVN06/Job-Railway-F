@extends('admin.layout')

@section('title', 'Editar Capacitación')

@section('content')
<div class="max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Editar Capacitación</h1>

    <form action="{{ route('admin.trainings.update', $training->id) }}" method="POST" class="bg-white rounded-lg shadow p-6">
        @csrf
        @method('PUT')
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Título -->
            <div class="md:col-span-2">
                <label for="title" class="block text-sm font-medium text-gray-700">Título *</label>
                <input type="text" name="title" id="title" required
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                       value="{{ old('title', $training->title) }}">
                @error('title')
                    <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                @enderror
            </div>

            <!-- Proveedor -->
            <div>
                <label for="provider" class="block text-sm font-medium text-gray-700">Proveedor</label>
                <input type="text" name="provider" id="provider"
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                       value="{{ old('provider', $training->provider) }}">
                @error('provider')
                    <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                @enderror
            </div>

            <!-- Enlace -->
            <div>
                <label for="link" class="block text-sm font-medium text-gray-700">Enlace</label>
                <input type="url" name="link" id="link"
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                       value="{{ old('link', $training->link) }}">
                @error('link')
                    <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                @enderror
            </div>

            <!-- Fecha Inicio -->
            <div>
                <label for="start_date" class="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
                <input type="date" name="start_date" id="start_date"
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                       value="{{ old('start_date', $training->start_date) }}">
                @error('start_date')
                    <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                @enderror
            </div>

            <!-- Fecha Fin -->
            <div>
                <label for="end_date" class="block text-sm font-medium text-gray-700">Fecha de Fin</label>
                <input type="date" name="end_date" id="end_date"
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                       value="{{ old('end_date', $training->end_date) }}">
                @error('end_date')
                    <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                @enderror
            </div>

            <!-- Descripción -->
            <div class="md:col-span-2">
                <label for="description" class="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea name="description" id="description" rows="4"
                          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">{{ old('description', $training->description) }}</textarea>
                @error('description')
                    <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                @enderror
            </div>
        </div>

        <div class="flex gap-4 mt-6">
            <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                Actualizar Capacitación
            </button>
            <a href="{{ route('admin.trainings.index') }}" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
                Cancelar
            </a>
        </div>
    </form>

    <!-- Información adicional -->
    <div class="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Información de la Capacitación</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
                <span class="font-medium text-gray-700">Creado:</span>
                <span class="text-gray-600">{{ $training->created_at->format('d/m/Y H:i') }}</span>
            </div>
            <div>
                <span class="font-medium text-gray-700">Última actualización:</span>
                <span class="text-gray-600">{{ $training->updated_at->format('d/m/Y H:i') }}</span>
            </div>
            <div class="md:col-span-2">
                <span class="font-medium text-gray-700">Estado actual:</span>
                @php
                    $now = now();
                    $startDate = $training->start_date ? \Carbon\Carbon::parse($training->start_date) : null;
                    $endDate = $training->end_date ? \Carbon\Carbon::parse($training->end_date) : null;
                    
                    $status = 'gray';
                    $statusText = 'Sin fecha';
                    
                    if ($startDate && $endDate) {
                        if ($now->between($startDate, $endDate)) {
                            $status = 'green';
                            $statusText = 'En curso';
                        } elseif ($now->lt($startDate)) {
                            $status = 'blue';
                            $statusText = 'Próxima';
                        } else {
                            $status = 'gray';
                            $statusText = 'Finalizada';
                        }
                    }
                @endphp
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-{{ $status }}-100 text-{{ $status }}-800">
                    {{ $statusText }}
                </span>
            </div>
        </div>
    </div>
</div>
@endsection