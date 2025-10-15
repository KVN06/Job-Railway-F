<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Dashboard') - Admin Panel</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .animate-fade-in-up {
            animation: fadeInUp 0.5s ease-out;
        }
        
        .gradient-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .gradient-sidebar {
            background: linear-gradient(180deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%);
        }
        
        .card-enhanced {
            background: white;
            border-radius: 1rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            transition: all 0.3s ease;
        }
        
        .hover-lift:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        .nav-link {
            transition: all 0.3s ease;
        }
        
        .nav-link:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateX(4px);
        }
        
        .nav-link.active {
            background: rgba(255, 255, 255, 0.15);
            border-left: 4px solid #60a5fa;
        }
    </style>
</head>
<body class="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
    <div class="flex h-screen">
        <!-- Sidebar -->
        <div class="w-64 gradient-sidebar text-white flex flex-col shadow-2xl">
            <!-- Logo y Usuario -->
            <div class="p-6 border-b border-white/10">
                <div class="flex items-center space-x-3 mb-4">
                    <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <i class="fas fa-crown text-2xl text-yellow-300"></i>
                    </div>
                    <div>
                        <h1 class="text-xl font-bold">Admin Panel</h1>
                        <p class="text-blue-200 text-xs">Sistema de Gestión</p>
                    </div>
                </div>
                <div class="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                    <p class="text-sm font-medium truncate">{{ Auth::user()->name }}</p>
                    <p class="text-xs text-blue-200 truncate">{{ Auth::user()->email }}</p>
                </div>
            </div>
            
            <!-- Navegación -->
            <nav class="mt-4 flex-1 px-3 space-y-1">
                <a href="{{ route('admin.dashboard') }}" 
                   class="nav-link flex items-center space-x-3 py-3 px-4 rounded-lg {{ request()->routeIs('admin.dashboard') ? 'active' : '' }}">
                    <i class="fas fa-chart-line w-5"></i>
                    <span class="font-medium">Dashboard</span>
                </a>
                
                <a href="{{ route('admin.classifieds.index') }}" 
                   class="nav-link flex items-center space-x-3 py-3 px-4 rounded-lg {{ request()->routeIs('admin.classifieds*') ? 'active' : '' }}">
                    <i class="fas fa-file-alt w-5"></i>
                    <span class="font-medium">Clasificados</span>
                </a>
                
                <a href="{{ route('admin.job-offers.index') }}" 
                   class="nav-link flex items-center space-x-3 py-3 px-4 rounded-lg {{ request()->routeIs('admin.job-offers*') ? 'active' : '' }}">
                    <i class="fas fa-briefcase w-5"></i>
                    <span class="font-medium">Ofertas Laborales</span>
                </a>
                
                <a href="{{ route('admin.trainings.index') }}" 
                   class="nav-link flex items-center space-x-3 py-3 px-4 rounded-lg {{ request()->routeIs('admin.trainings*') ? 'active' : '' }}">
                    <i class="fas fa-graduation-cap w-5"></i>
                    <span class="font-medium">Capacitaciones</span>
                </a>
                
            </nav>

            <!-- Cerrar Sesión -->
            <div class="p-4 border-t border-white/10">
                <form action="{{ route('logout') }}" method="POST" class="w-full">
                    @csrf
                    <button type="submit" 
                            class="w-full flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-xl transition-all duration-300 hover-lift font-medium shadow-lg"
                            title="Cerrar Sesión">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>Cerrar Sesión</span>
                    </button>
                </form>
            </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1 overflow-auto">
            <!-- Header -->
            <header class="bg-white shadow-sm border-b border-gray-200">
                <div class="px-8 py-5 flex justify-between items-center">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-800">
                            @yield('title', 'Dashboard')
                        </h2>
                        <p class="text-sm text-gray-500 mt-1">
                            <i class="far fa-calendar-alt mr-1"></i>
                            {{ now()->locale('es')->isoFormat('dddd, D [de] MMMM [de] YYYY') }}
                        </p>
                    </div>
                    
                    <div class="flex items-center space-x-4">
                        <!-- Email del usuario (desktop) -->
                        <div class="hidden md:flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg">
                            <i class="fas fa-user-circle text-blue-600 text-xl"></i>
                            <span class="text-sm text-gray-700">{{ Auth::user()->email }}</span>
                        </div>
                        
                        <!-- Botón de cerrar sesión móvil -->
                        <form action="{{ route('logout') }}" method="POST" class="md:hidden">
                            @csrf
                            <button type="submit" 
                                    class="flex items-center justify-center w-10 h-10 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                    title="Cerrar Sesión">
                                <i class="fas fa-sign-out-alt"></i>
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            <!-- Main Content Area -->
            <main class="p-8">
                <!-- Mensajes de éxito -->
                @if(session('success'))
                    <div class="mb-6 p-5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 rounded-xl shadow-soft animate-fade-in-up">
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <i class="fas fa-check-circle text-green-600 text-xl"></i>
                            </div>
                            <div>
                                <p class="font-semibold text-green-800">¡Éxito!</p>
                                <p class="text-sm">{{ session('success') }}</p>
                            </div>
                        </div>
                    </div>
                @endif

                <!-- Mensajes de error -->
                @if(session('error'))
                    <div class="mb-6 p-5 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 rounded-xl shadow-soft animate-fade-in-up">
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <i class="fas fa-exclamation-circle text-red-600 text-xl"></i>
                            </div>
                            <div>
                                <p class="font-semibold text-red-800">¡Error!</p>
                                <p class="text-sm">{{ session('error') }}</p>
                            </div>
                        </div>
                    </div>
                @endif

                <!-- Contenido de la página -->
                @yield('content')
            </main>
        </div>
    </div>
</body>
</html>