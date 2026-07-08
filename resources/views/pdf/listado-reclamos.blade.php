@extends('pdf.layouts.general')

@section('titulo', 'Listado de Reclamos')

@section('content')
<div style="width: 100%;">

    <div class="section-title">Reclamos registrados</div>

    <table>
        <thead>
            <tr>
                <th>Fecha</th>
                <th>Propiedad</th>
                <th>Usuario</th>
                <th>Estado</th>
                <th>Detalle</th>
            </tr>
        </thead>
        <tbody>
            @forelse($reclamos as $reclamo)
            <tr>
                <td>{{ $reclamo->fecha?->format('d/m/Y H:i') }}</td>
                <td>{{ $reclamo->propiedad?->lote }} - {{ $reclamo->propiedad?->manzana }}</td>
                <td>{{ $reclamo->user?->name }}</td>
                <td>{{ $reclamo->estado->label() }}</td>
                <td>{{ $reclamo->detalle }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="5" style="text-align: center;">No hay reclamos registrados.</td>
            </tr>
            @endforelse
        </tbody>
    </table>

</div>
@endsection
