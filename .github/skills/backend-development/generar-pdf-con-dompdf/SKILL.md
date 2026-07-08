---
name: generar-pdf-con-dompdf
description: 'Activar cuando se necesite generar un PDF con domPDF. Cubre la arquitectura completa: vista Blade que extiende el layout genérico, UseCase que instancia el wrapper y retorna stream o descarga, e integración desde el controlador. SIEMPRE leer este skill antes de crear cualquier vista PDF o UseCase de PDF.'
license: MIT
metadata:
    author: proyecto
---

# Generación de PDF con domPDF

## REGLAS DURAS (no negociables)

1. **Toda vista PDF extiende el layout genérico** `pdf.layouts.general`. Nunca crear un HTML completo desde cero.
2. **Toda vista PDF vive en `resources/views/pdf/`**. Nunca en otras carpetas de views.
3. **Toda lógica de generación de PDF vive en un UseCase** dentro de `app/Modules/{Contexto}/{Dominio}/UseCases/`. Nunca en el controlador.
4. **El UseCase de PDF es siempre `final`** y sigue el patrón `make()` + `__invoke()`.
5. **El UseCase de PDF retorna `Illuminate\Http\Response`** (no `string`, no `Barryvdh\DomPDF\PDF`).
6. **Usar `App::make('dompdf.wrapper')`** para instanciar el wrapper. No usar la facade `PDF::` directamente.
7. **Nombre de la vista**: `pdf.{nombre-en-kebab-case}` (ej: `pdf.listado-propiedades`, `pdf.ficha-paciente`).
8. **Nombre del UseCase de PDF**: `Obtener{Dominio}EnPDF` (ej: `ObtenerPropiedadesEnPDF`, `ObtenerPacienteEnPDF`).

---

## Estructura de archivos

```
resources/views/pdf/
├── layouts/
│   └── general.blade.php     ← layout genérico (NO modificar salvo mejoras globales)
├── listado-propiedades.blade.php
├── ficha-paciente.blade.php
└── {nombre-pdf}.blade.php    ← tu nueva vista

app/Modules/{Contexto}/{Dominio}/UseCases/
└── Obtener{Dominio}EnPDF.php  ← tu nuevo UseCase
```

---

## Layout genérico — `pdf.layouts.general`

El layout ya incluye:
- **Header**: logo de la empresa + título del informe + fecha de impresión + QR opcional.
- **CSS predefinido** listo para usar en la vista.
- **Tres puntos de personalización** vía secciones Blade.

### Secciones personalizables

| Sección | Propósito | Predeterminado |
|---|---|---|
| `@section('titulo')` | Título del informe en el header | Variable `$titulo` o `'Informe de Servicio'` |
| `@section('info')` | Texto secundario del header (derecha) | Fecha de impresión |
| `@yield('content')` | Cuerpo del PDF — **obligatorio** | — |

### Variable opcional: QR Code

Para incluir un QR en el header, pasar `$qrCode` como base64 desde el UseCase:

```php
use SimpleSoftwareIO\QrCode\Facades\QrCode;

$qrCode = base64_encode(
    QrCode::format('png')->size(200)->generate($url)
);

$pdf->loadView('pdf.mi-vista', [
    'datos'  => $datos,
    'qrCode' => $qrCode,
]);
```

### Clases CSS disponibles

| Clase | Uso |
|---|---|
| `.title` | Título principal (14pt, bold, uppercase) |
| `.section-title` | Subtítulo de sección con borde izquierdo gris |
| `.label` | Etiqueta de campo (8pt, bold, gris) |
| `.value` | Valor del campo |
| `.text-right` | Alineación a la derecha |
| `.info-box` | Columna izquierda (49% ancho) para datos side-by-side |
| `.info-box-last` | Columna derecha (49% ancho) sin margen derecho |
| `.summary-table` | Tabla de resumen con header oscuro y centrado |
| `.grand-total` | Fila de total general (fondo oscuro, texto blanco) |
| `.badge` | Badge genérico (fondo gris claro) |
| `.badge-responsable` | Badge oscuro para responsables |
| `.badge-ayudante` | Badge gris para roles secundarios |
| `.clear` | Clearfix para elementos flotados |

> **Nota domPDF**: No usar `display: flex` ni `display: grid`. domPDF solo soporta CSS 2.1.
> Para columnas lado a lado, usar `display: inline-block` con `vertical-align: top`.

---

## Patrón de vista Blade para PDF

```blade
@extends('pdf.layouts.general')

@props([
    'titulo' => 'Título del Informe',
])

{{-- Opcional: sobrescribir info del header --}}
{{-- @section('info')
<div>Período: {{ $periodo }}</div>
@endsection --}}

@section('content')
<div style="width: 100%;">

    <div class="section-title">Nombre de la sección</div>

    <table>
        <thead>
            <tr>
                <th>Columna 1</th>
                <th>Columna 2</th>
                <th>Columna 3</th>
            </tr>
        </thead>
        <tbody>
            @forelse($items as $item)
            <tr>
                <td>{{ $item->campo1 }}</td>
                <td>{{ $item->campo2 }}</td>
                <td>{{ $item->campo3 }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="3" style="text-align: center;">No hay registros.</td>
            </tr>
            @endforelse
        </tbody>
    </table>

</div>
@endsection
```

---

## Patrón de UseCase para PDF

```php
<?php

namespace App\Modules\{Contexto}\{Dominio}\UseCases;

use App\Modules\{Contexto}\{Dominio}\Queries\{Dominio}Query;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\App;

final class Obtener{Dominio}EnPDF
{
    public static function make(array $filtros = []): Response
    {
        return (new self)->__invoke(filtros: $filtros);
    }

    public function __invoke(array $filtros = []): Response
    {
        $filtros = array_merge([
            'buscar' => null,
        ], $filtros);

        $items = {Dominio}Query::obtener{Dominio}s(filtros: $filtros)
            ->get();

        $pdf = App::make('dompdf.wrapper');
        $pdf->loadView('pdf.{nombre-vista}', ['items' => $items]);

        return $pdf->stream('{nombre-archivo}.pdf');
    }
}
```

### `stream()` vs `download()`

| Método | Comportamiento | Cuándo usar |
|---|---|---|
| `$pdf->stream('archivo.pdf')` | Abre el PDF en el navegador (inline) | Vista previa, reportes consultados en pantalla |
| `$pdf->download('archivo.pdf')` | Fuerza la descarga del archivo | Exportaciones, archivos que el usuario debe guardar |

---

## Ejemplo completo — Listado de propiedades

### Vista: `resources/views/pdf/listado-propiedades.blade.php`

```blade
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
```

### UseCase: `app/Modules/Propiedades/Propiedad/UseCases/ObtenerPropiedadesEnPDF.php`

```php
<?php

namespace App\Modules\Propiedades\Propiedad\UseCases;

use App\Modules\Propiedades\Propiedad\Queries\PropiedadQuery;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\App;

final class ObtenerPropiedadesEnPDF
{
    public static function make(array $filtros = []): Response
    {
        return (new self)->__invoke(filtros: $filtros);
    }

    public function __invoke(array $filtros = []): Response
    {
        $filtros = array_merge([
            'buscar' => null,
        ], $filtros);

        $propiedades = PropiedadQuery::obtenerPropiedades(filtros: $filtros)
            ->get();

        $pdf = App::make('dompdf.wrapper');
        $pdf->loadView('pdf.listado-propiedades', ['propiedades' => $propiedades]);

        return $pdf->stream('listado-propiedades.pdf');
    }
}
```

---

## Integración desde el controlador

El controlador **solo delega** al UseCase y retorna la respuesta directamente. No instancia el wrapper, no llama a `loadView`, no toca domPDF.

```php
public function exportarPDF(Request $request): Response
{
    Gate::authorize('exportar', Propiedad::class);

    return ObtenerPropiedadesEnPDF::make(filtros: [
        'buscar' => $request->input('buscar'),
    ]);
}
```

---

## Checklist antes de entregar

- [ ] La vista está en `resources/views/pdf/` y extiende `pdf.layouts.general`.
- [ ] El UseCase es `final`, retorna `Illuminate\Http\Response` y usa `App::make('dompdf.wrapper')`.
- [ ] El controlador solo delega al UseCase y no tiene lógica de PDF.
- [ ] Se eligió `stream()` o `download()` según el caso de uso funcional.
- [ ] No se usaron propiedades CSS no soportadas por domPDF (flex, grid, CSS 3).
