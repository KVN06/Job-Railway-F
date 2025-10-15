@props([
    'size' => 'md',
    'text' => null
])

@php
    $sizeClasses = [
        'sm' => 'w-4 h-4 border-2',
        'md' => 'w-8 h-8 border-3',
        'lg' => 'w-12 h-12 border-4',
        'xl' => 'w-16 h-16 border-4',
    ];

    $spinnerClass = $sizeClasses[$size] ?? $sizeClasses['md'];
@endphp

<div {{ $attributes->merge(['class' => 'flex flex-col items-center justify-center']) }}>
    <div class="loading-spinner {{ $spinnerClass }}"></div>
    @if($text)
        <p class="mt-3 text-gray-600 font-medium">{{ $text }}</p>
    @endif
</div>
