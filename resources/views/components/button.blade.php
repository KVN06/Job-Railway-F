@props([
    'variant' => 'primary',
    'size' => 'md',
    'icon' => null,
    'href' => null,
    'type' => 'button'
])

@php
    $variantClasses = [
        'primary' => 'btn-primary text-white shadow-soft',
        'secondary' => 'btn-secondary text-white shadow-soft',
        'success' => 'btn-success text-white shadow-soft',
        'danger' => 'bg-red-600 hover:bg-red-700 text-white shadow-soft',
        'outline' => 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
        'ghost' => 'text-gray-700 hover:bg-gray-100',
    ];

    $sizeClasses = [
        'sm' => 'px-4 py-2 text-sm',
        'md' => 'px-6 py-3',
        'lg' => 'px-8 py-4 text-lg',
    ];

    $baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 hover-lift ' .
                   ($variantClasses[$variant] ?? $variantClasses['primary']) . ' ' .
                   ($sizeClasses[$size] ?? $sizeClasses['md']);
@endphp

@if($href)
    <a href="{{ $href }}" {{ $attributes->merge(['class' => $baseClasses]) }}>
        @if($icon)
            <i class="{{ $icon }} mr-2"></i>
        @endif
        {{ $slot }}
    </a>
@else
    <button type="{{ $type }}" {{ $attributes->merge(['class' => $baseClasses]) }}>
        @if($icon)
            <i class="{{ $icon }} mr-2"></i>
        @endif
        {{ $slot }}
    </button>
@endif
