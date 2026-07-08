@extends('pdf.layouts.general')

@props(['titulo' => 'Listado de Accesos'])

@section('content')
<div style="width: 100%;">

    <div class="section-title">Accesos registrados</div>

    <table>
        <thead>
            <tr>
                <th>Fecha</th>
                <th>Propiedad</th>
                <th>Guardia</th>
                <th>Movimiento</th>
                <th>Tipo</th>
                <th>Documento</th>
            </tr>
        </thead>
        <tbody>
            @forelse($accesos as $acceso)
            <tr>
                <td>{{ $acceso->acceso_at?->format('d/m/Y H:i') }}</td>
                <td>{{ $acceso->propiedad?->lote }} - {{ $acceso->propiedad?->manzana }}</td>
                <td>{{ $acceso->guardia?->nombre }}</td>
                <td>{{ $acceso->movimiento->label() }}</td>
                <td>{{ $acceso->tipo->label() }}</td>
                <td>{{ $acceso->documento_tipo->label() }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="6" style="text-align: center;">No hay accesos registrados.</td>
            </tr>
            @endforelse
        </tbody>
    </table>

</div>
@endsection
