<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CompanyController extends Controller
{
    public function create()
    {
        $company = Auth::user()?->company;

        return view('forms.company-form', compact('company'));
    }

    public function agg_company(Request $request)
    {
        $data = $request->validate(
            [
                'name' => ['required', 'string', 'max:255'],
                'email' => ['nullable', 'email', 'max:255'],
                'nit' => ['nullable', 'string', 'max:50'],
                'website' => ['nullable', 'url', 'max:255'],
                'description' => ['required', 'string'],
            ],
            [],
            [
                'name' => 'nombre de la empresa',
                'email' => 'correo electrónico',
                'nit' => 'NIT',
                'website' => 'sitio web',
                'description' => 'descripción',
            ]
        );

        $user = Auth::user();

        abort_unless($user, 403);

        $company = Company::updateOrCreate(
            ['user_id' => $user->id],
            [
                'user_id' => $user->id,
                'name' => $data['name'],
                'company_name' => $data['name'],
                'email' => $data['email'] ?? null,
                'nit' => $data['nit'] ?? null,
                'website' => $data['website'] ?? null,
                'description' => $data['description'],
            ]
        );

        return redirect()->route('home')->with('success', 'Empresa registrada correctamente.');
    }
}
