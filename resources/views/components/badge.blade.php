@props([
    'variant' => 'default',
    'size' => 'md',
    'icon' => null
])

@php
    $variantClasses = [
        'default' => 'bg-gray-100 text-gray-800',
        'primary' => 'bg-blue-100 text-blue-800',
        'success' => 'bg-green-100 text-green-800',
        'warning' => 'bg-yellow-100 text-yellow-800',
        'danger' => 'bg-red-100 text-red-800',
        'pending' => 'badge-pending',
        'under_review' => 'badge-under-review',
        'accepted' => 'badge-accepted',
        'rejected' => 'badge-rejected',
    ];

    $sizeClasses = [
        'sm' => 'px-2 py-1 text-xs',
        'md' => 'px-3 py-1 text-sm',
        'lg' => 'px-4 py-2 text-base',
    ];

    $baseClasses = 'inline-flex items-center font-semibold rounded-full ' .
                   ($variantClasses[$variant] ?? $variantClasses['default']) . ' ' .
                   ($sizeClasses[$size] ?? $sizeClasses['md']);
@endphp

<span {{ $attributes->merge(['class' => $baseClasses]) }}>
    @if($icon)
        <i class="{{ $icon }} mr-1.5"></i>
    @endif
    {{ $slot }}
</span>
