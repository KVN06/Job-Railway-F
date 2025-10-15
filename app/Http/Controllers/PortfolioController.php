<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PortfolioController extends Controller
{
    public function __construct()
    {
        // Asegurar que solo usuarios autenticados accedan a estas rutas
        $this->middleware('auth');
    }
    // Mostrar formulario para crear un nuevo portafolio
    public function create()
    {
        return view('portfolio.create');
    }

    // Guardar un nuevo portafolio en la base de datos
    public function store(Request $request)
{
    // Validación de campos
    $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'nullable|string',
        'url_proyect' => 'required|url',
        'url_pdf' => 'nullable|file|mimes:pdf|max:2048',
    ]);

    // Crear nuevo portafolio
    $user = Auth::user();
    if (!$user) {
        return redirect()->route('login');
    }

    if (!$user->unemployed) {
        // Si el usuario no tiene perfil desempleado, redirigimos al formulario para crearlo
        return redirect()->route('unemployed-form')->with('error', 'Por favor completa tu perfil de desempleado antes de agregar un portafolio.');
    }

    $portfolio = new Portfolio();
    $portfolio->unemployed_id = $user->unemployed->id;
    $portfolio->title = $request->title;
    $portfolio->description = $request->description;
    $portfolio->url_proyect = $request->url_proyect;

    // Si se subió un archivo PDF, lo almacenamos
    if ($request->hasFile('url_pdf')) {
        $file = $request->file('url_pdf');
        $nombreArchivo = 'pdf_' . time() . '.' . $file->guessExtension();
        $file->storeAs('public/portfolios', $nombreArchivo);
        $portfolio->url_pdf = $nombreArchivo;
    }

    $portfolio->save();

    return redirect()->route('portfolios.index');
}

    // Mostrar todos los portafolios del usuario desempleado actual
    public function list()
    {
        $user = Auth::user();
        if (!$user) {
            return redirect()->route('login');
        }

        if (!$user->unemployed) {
            return redirect()->route('unemployed-form')->with('error', 'Por favor completa tu perfil de desempleado para ver tus portafolios.');
        }

        $portfolios = Portfolio::where('unemployed_id', $user->unemployed->id)->get();
        return view('portfolio.list', compact('portfolios'));
    }

    // Mostrar formulario para editar un portafolio existente
    public function edit($id)
    {
        $portfolio = Portfolio::findOrFail($id);
        return view('portfolio.edit', compact('portfolio'));
    }

    // Actualizar los datos de un portafolio existente
    public function update(Request $request, $id)
    {
        // Validar campos requeridos
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'url_proyect' => 'required|url',
            'url_pdf' => 'nullable|file|mimes:pdf|max:2048',
        ]);

        // Actualizar portafolio
        $portfolio = Portfolio::findOrFail($id);
        $portfolio->title = $request->title;
        $portfolio->description = $request->description;
        $portfolio->file_url = $request->file_url;
        $portfolio->save();

        return redirect()->route('portfolios.index');
    }

    // Eliminar un portafolio
    public function destroy($id)
    {
        $portfolio = Portfolio::findOrFail($id);
        $portfolio->delete();

        return redirect()->route('portfolios.index');
    }
}
