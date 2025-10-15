@props([
    'type' => 'info',
    'dismissible' => true,
    'icon' => null
])

@php
    $typeConfig = [
        'success' => [
            'class' => 'alert-success',
            'icon' => 'fas fa-check-circle'
        ],
        'error' => [
            'class' => 'alert-error',
            'icon' => 'fas fa-exclamation-circle'
        ],
        'warning' => [
            'class' => 'alert-warning',
            'icon' => 'fas fa-exclamation-triangle'
        ],
        'info' => [
            'class' => 'alert-info',
            'icon' => 'fas fa-info-circle'
        ],
    ];

    $config = $typeConfig[$type] ?? $typeConfig['info'];
    $displayIcon = $icon ?? $config['icon'];
@endphp

<div {{ $attributes->merge(['class' => $config['class'] . ' mb-6 animate-fade-in-up']) }} x-data="{ show: true }" x-show="show" x-transition>
    <div class="flex items-start">
        <i class="{{ $displayIcon }} text-xl mr-3 mt-0.5"></i>
        <div class="flex-1">
            {{ $slot }}
        </div>
        @if($dismissible)
            <button @click="show = false" class="ml-4 text-current opacity-70 hover:opacity-100 transition-opacity">
                <i class="fas fa-times"></i>
            </button>
        @endif
    </div>
</div>
