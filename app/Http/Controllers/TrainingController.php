<?php

namespace App\Http\Controllers;

use App\Models\Training;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;

class TrainingController extends Controller
{
    // Método para vista pública
    public function index()
    {
                // Usar paginación para que la vista pueda renderizar los links
        $trainings = Training::latest()->paginate(10)->withQueryString();

        return view('training.index', compact('trainings'));
    }

    // Métodos para admin
    public function create()
    {
        return view('admin.trainings.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'provider' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'link' => 'nullable|url',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        Training::create($request->all());

        return redirect()->route('admin.trainings.index')
                         ->with('success', 'Capacitación creada exitosamente');
    }

    public function show($id)
    {
        $training = Training::findOrFail($id);
        return view('admin.trainings.show', compact('training'));
    }

    public function edit($id)
    {
        $training = Training::findOrFail($id);
        return view('admin.trainings.edit', compact('training'));
    }

    public function update(Request $request, $id)
    {
        $training = Training::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'provider' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'link' => 'nullable|url',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $training->update($request->all());

        return redirect()->route('admin.trainings.index')
                         ->with('success', 'Capacitación actualizada exitosamente');
    }

    public function destroy($id)
    {
        $training = Training::findOrFail($id);
        $this->authorizeTraining($training);
        $training->delete();

        return redirect()->route('admin.trainings.index')
                         ->with('success', 'Capacitación eliminada exitosamente');
    }
}
