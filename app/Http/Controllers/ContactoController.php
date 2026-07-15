<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactoRequest;
use App\Modules\Contacto\UseCases\RegistrarContacto;
use Illuminate\Http\RedirectResponse;

class ContactoController extends Controller
{
    public function store(ContactoRequest $request): RedirectResponse
    {
        RegistrarContacto::make($request->validated());

        return back()->with('success', 'Mensaje enviado correctamente.');
    }
}
