@extends('pdf.layouts.general')



@props([
'titulo' => 'Propiedades Registradas',
])

@section('content')
<div style="width: 100%;">

    <div class="section-title">Lista de propiedades</div>
    <table>
        <thead>
            <tr>
                <th>Lote</th>
                <th>Manzana</th>
                <th>Descripción</th>
                <th>Propietario</th>
                <th>DNI</th>
                <th>Teléfono</th>
                <th>Teléfono alternativo</th>
            </tr>
        </thead>
        <tbody>
            @forelse($propiedades as $propiedad)
            <tr>
                <td>{{ $propiedad->lote }}</td>
                <td>{{ $propiedad->manzana }}</td>
                <td>{{ $propiedad->descripcion }}</td>
                <td>{{ $propiedad->propietario?->nombre }}</td>
                <td>{{ number_format($propiedad->propietario?->dni, 0, ',', '.') }}</td>
                <td>{{ $propiedad->propietario?->telefono }}</td>
                <td>{{ $propiedad->propietario?->secundario_telefono }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="6" style="text-align: center;">No hay propiedades registradas.</td>
            </tr>
            @endforelse
        </tbody>
    </table>
</div>
@endsection