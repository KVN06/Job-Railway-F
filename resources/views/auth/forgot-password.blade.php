<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Recuperar contraseña</title>
</head>
<body>
    <h2>¿Olvidaste tu contraseña?</h2>

    @if (session('status'))
        <p style="color: green;">{{ session('status') }}</p>
    @endif

    <form method="POST" action="{{ route('password.email') }}">
        @csrf
        <label>Correo electrónico:</label>
        <input type="email" name="email" required>
        @error('email')
            <p style="color: red;">{{ $message }}</p>
        @enderror
        <button type="submit">Enviar enlace de recuperación</button>
    </form>
</body>
</html>
