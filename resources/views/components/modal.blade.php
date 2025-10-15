@props([
    'name' => 'modal',
    'title' => '',
    'size' => 'md',
    'showClose' => true
])

@php
    $sizeClasses = [
        'sm' => 'max-w-md',
        'md' => 'max-w-2xl',
        'lg' => 'max-w-4xl',
        'xl' => 'max-w-6xl',
        'full' => 'max-w-full mx-4',
    ];

    $modalSize = $sizeClasses[$size] ?? $sizeClasses['md'];
@endphp

<div
    x-data="{ show: false }"
    x-show="show"
    x-on:open-modal-{{ $name }}.window="show = true"
    x-on:close-modal-{{ $name }}.window="show = false"
    x-on:keydown.escape.window="show = false"
    class="fixed inset-0 z-50 overflow-y-auto"
    style="display: none;"
>
    <!-- Backdrop -->
    <div
        x-show="show"
        x-transition:enter="transition ease-out duration-300"
        x-transition:enter-start="opacity-0"
        x-transition:enter-end="opacity-100"
        x-transition:leave="transition ease-in duration-200"
        x-transition:leave-start="opacity-100"
        x-transition:leave-end="opacity-0"
        class="fixed inset-0 bg-black bg-opacity-50"
        @click="show = false"
    ></div>

    <!-- Modal -->
    <div class="flex items-center justify-center min-h-screen p-4">
        <div
            x-show="show"
            x-transition:enter="transition ease-out duration-300"
            x-transition:enter-start="opacity-0 transform scale-90"
            x-transition:enter-end="opacity-100 transform scale-100"
            x-transition:leave="transition ease-in duration-200"
            x-transition:leave-start="opacity-100 transform scale-100"
            x-transition:leave-end="opacity-0 transform scale-90"
            class="bg-white rounded-2xl shadow-2xl w-full {{ $modalSize }} relative"
            @click.stop
        >
            <!-- Header -->
            @if($title || $showClose)
                <div class="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 class="text-xl font-bold text-gray-900">{{ $title }}</h3>
                    @if($showClose)
                        <button
                            @click="show = false"
                            class="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    @endif
                </div>
            @endif

            <!-- Content -->
            <div class="p-6">
                {{ $slot }}
            </div>
        </div>
    </div>
</div>
