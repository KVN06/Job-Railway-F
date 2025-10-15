@props([
    'label' => null,
    'name' => '',
    'options' => [],
    'error' => null,
    'icon' => null,
    'placeholder' => 'Selecciona una opción',
    'required' => false,
    'selected' => null
])

<div {{ $attributes->only('class') }}>
    @if($label)
        <label for="{{ $name }}" class="block text-sm font-semibold text-gray-700 mb-2">
            @if($icon)
                <i class="{{ $icon }} text-blue-600 mr-1"></i>
            @endif
            {{ $label }}
            @if($required)
                <span class="text-red-500">*</span>
            @endif
        </label>
    @endif

    <select
        name="{{ $name }}"
        id="{{ $name }}"
        {{ $required ? 'required' : '' }}
        {{ $attributes->except(['class', 'label', 'error', 'icon', 'options', 'placeholder'])->merge([
            'class' => 'form-input-enhanced w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300' . ($error ? ' border-red-500' : '')
        ]) }}
    >
        <option value="">{{ $placeholder }}</option>
        @foreach($options as $value => $label)
            <option value="{{ $value }}" {{ $selected == $value ? 'selected' : '' }}>
                {{ $label }}
            </option>
        @endforeach
    </select>

    @if($error)
        <p class="text-sm text-red-600 mt-1">
            <i class="fas fa-exclamation-circle mr-1"></i>
            {{ $error }}
        </p>
    @endif
</div>
