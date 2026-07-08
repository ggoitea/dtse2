---
name: backend-logica-de-negocio
description: 'Genera lógica de negocio (UseCases, Queries, Services) dentro de app/Modules/ siguiendo la arquitectura modular del proyecto. ACTIVA cuando el usuario necesite crear o modificar un UseCase, extraer un query, crear un servicio de dominio, o trabajar dentro de app/Modules/. NO usar para controladores, modelos, migraciones o rutas.'
license: MIT
metadata:
    author: proyecto
---

# Lógica de Negocio — Módulos

## REGLAS DURAS (no negociables)

Estas reglas se aplican siempre. Salirse de ellas está prohibido sin aprobación explícita del usuario.

1. **TODO el código de lógica de negocio vive dentro de `app/Modules/`**. Nunca en `app/Http/`, `app/Services/` raíz, ni en ningún otro directorio fuera de `app/Modules/`.
2. **La estructura de carpetas es fija**: `app/Modules/{Contexto}/{Dominio}/`. No crear carpetas base nuevas dentro de `Modules/` sin aprobación.
3. **La carpeta `/UseCases` es obligatoria** en todo dominio. `/Queries` y `/Services` son opcionales.
4. **No crear subcarpetas adicionales** dentro de `UseCases`, `Queries` o `Services`.
5. **Todo en español**: nombres de clases, métodos (salvo `make()`), variables, parámetros y namespaces. La única excepción es el método estático `make()`, que es el estándar del proyecto.
6. **Código compartido entre ≥2 contextos** va en `app/Modules/Shared/`. Nunca duplicar en cada contexto.

---

## Estructura de carpetas

```
app/Modules/
├── {Contexto}/              # ej: Veterinaria, Clientes, Inventario
│   └── {Dominio}/           # ej: Pacientes, Consultas, Productos
│       ├── UseCases/        # SIEMPRE presente
│       ├── Queries/         # OPCIONAL — queries complejos o reutilizados
│       └── Services/        # OPCIONAL — lógica de dominio reutilizable
└── Shared/
    └── Domain/              # Value Objects, contratos, helpers compartidos
```

### Regla de namespace

El namespace PHP debe reflejar exactamente la estructura de carpetas:

```php
namespace App\Modules\{Contexto}\{Dominio}\UseCases;
namespace App\Modules\{Contexto}\{Dominio}\Queries;
namespace App\Modules\{Contexto}\{Dominio}\Services;
namespace App\Modules\Shared\Domain;
```

---

## Patrón UseCase

Cada caso de uso es una clase `final` con:

- **`static make()`** — punto de entrada público, llamado desde el controlador. Puede tener firma simplificada con valores por defecto. Delega a `__invoke()`.
- **`__invoke()`** — contiene toda la lógica real. Recibe los parámetros completos. Es el método a testear.

### Plantilla

```php
<?php

namespace App\Modules\{Contexto}\{Dominio}\UseCases;

final class {NombreEnEspanol}
{
    public static function make(/* parámetros simplificados con defaults */): {ReturnType}
    {
        return (new self())->__invoke(/* mapear parámetros */);
    }

    public function __invoke(/* parámetros completos */): {ReturnType}
    {
        // lógica aquí
    }
}
```

### Reglas del patrón UseCase

- La clase DEBE ser `final`.
- El nombre describe la acción en español: `CrearPaciente`, `ObtenerConsultas`, `ActualizarInventario`.
- `make()` es el único método público estático. No agregar otros métodos estáticos.
- `__invoke()` es el único método de instancia público.
- Si se necesitan helpers privados, agregarlos como métodos privados de instancia.
- No inyectar dependencias en el constructor salvo que sean necesarias para testing (repositorios, etc.).

### Ejemplo — UseCase de escritura

```php
<?php

namespace App\Modules\Clientes\Pacientes\UseCases;

use App\Models\Paciente;

final class CrearPaciente
{
    public static function make(
        string $nombre,
        string $especie,
        int $propietarioId,
    ): Paciente {
        return (new self())->__invoke(
            nombre: $nombre,
            especie: $especie,
            propietarioId: $propietarioId,
        );
    }

    public function __invoke(
        string $nombre,
        string $especie,
        int $propietarioId,
    ): Paciente {
        return Paciente::create([
            'nombre'         => $nombre,
            'especie'        => $especie,
            'propietario_id' => $propietarioId,
        ]);
    }
}
```

### Ejemplo — UseCase de consulta con filtros y paginación

```php
<?php

namespace App\Modules\Clientes\Pacientes\UseCases;

use App\Models\Paciente;
use App\Modules\Shared\Domain\PaginadoValueObject;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

final class ObtenerPacientes
{
    /**
     * @return Collection<int, Paciente>|LengthAwarePaginator
     */
    public static function make(int $pagina = 1, int $porPagina = 25, array $filtros = []): Collection|LengthAwarePaginator
    {
        $paginado = new PaginadoValueObject(pagina: $pagina, porPagina: $porPagina, nombreDePagina: 'pacientesPage');
        return (new self())->__invoke(filtros: $filtros, paginado: $paginado);
    }

    /**
     * @return Collection<int, Paciente>|LengthAwarePaginator
     */
    public function __invoke(array $filtros = [], ?PaginadoValueObject $paginado = null): Collection|LengthAwarePaginator
    {
        $filtros = array_merge([
            'buscar'  => null,
            'especie' => null,
        ], $filtros);

        $query = Paciente::query()
            ->when($filtros['buscar'], function (Builder $query, $buscar) {
                $query->whereAny(['nombre', 'chip'], 'like', '%'.$buscar.'%');
            })
            ->when($filtros['especie'], function (Builder $query, $especie) {
                $query->where('especie', $especie);
            });

        if ($paginado) {
            return $query->paginate(
                perPage: $paginado->porPagina,
                page: $paginado->pagina,
                columns: ['*'],
                pageName: $paginado->nombreDePagina,
            )->withQueryString();
        }

        return $query->get();
    }
}
```

---

## Cuándo extraer a `/Queries`

Mover un query a `/Queries` cuando se cumpla **al menos uno** de estos criterios:

1. **Complejidad**: el query tiene joins, subqueries, aggregates o lógica condicional extensa que hace al UseCase difícil de leer.
2. **Reutilización**: ≥2 UseCases (del mismo dominio o de dominios distintos) necesitan el mismo query.

### Patrón de las clases Query

Las clases Query **no** siguen el patrón `make()` + `__invoke()` de los UseCases. En su lugar usan **métodos estáticos descriptivos** que retornan un `Builder`. Esto permite:

- Tener múltiples métodos en la misma clase Query para distintas variantes de consulta.
- Llamar al método directamente desde cualquier UseCase o Service con un nombre explícito.
- No son necesariamente `final` — pueden ser heredadas si el dominio lo requiere.

```php
// UseCase llamando a un Query
$query = PropiedadQuery::obtenerPropiedades(filtros: $filtros);
```

### Ejemplo de un Query extraído

```php
<?php

namespace App\Modules\Propiedades\Propiedad\Queries;

use App\Models\Propiedad;
use Illuminate\Database\Eloquent\Builder;

class PropiedadQuery
{
    public static function obtenerPropiedades(array $filtros = []): Builder
    {
        $filtros = array_merge([
            'buscar' => null,
        ], $filtros);

        return Propiedad::query()
            ->with('propietario')
            ->join('propietarios', 'propietarios.propiedad_id', '=', 'propiedades.id')
            ->join('personas', 'personas.id', '=', 'propietarios.propietario_id')
            ->when($filtros['buscar'], fn ($q, $v) => $q->where(function ($q) use ($v) {
                $q->where('propiedades.lote', 'like', "%{$v}%")
                    ->orWhere('propiedades.manzana', 'like', "%{$v}%")
                    ->orWhere('personas.nombre', 'like', "%{$v}%")
                    ->orWhere('personas.dni', 'like', "%{$v}%");
            }))
            ->select('propiedades.*');
    }
}
```

---

## Cuándo usar `/Services`

Un Service encapsula lógica de dominio reutilizable que **no es ni un query ni un caso de uso de entrada/salida**. Ejemplos:

- Cálculo de precios con reglas de negocio complejas.
- Validaciones de dominio que se reutilizan en múltiples UseCases.
- Integración con una librería externa (notificaciones, PDF, etc.) limitada a un dominio.

Si la lógica se usa en un único UseCase, mantenerla dentro de `__invoke()` como método privado. Solo extraer cuando sea reutilizada o muy compleja.

```php
<?php

namespace App\Modules\Inventario\Productos\Services;

final class CalcularPrecioConDescuento
{
    public static function make(float $precio, int $porcentaje): float
    {
        return (new self())->__invoke(precio: $precio, porcentaje: $porcentaje);
    }

    public function __invoke(float $precio, int $porcentaje): float
    {
        return round($precio - ($precio * $porcentaje / 100), 2);
    }
}
```

---

## `app/Modules/Shared/`

Contiene código **compartido entre ≥2 contextos diferentes**. Nunca poner aquí código específico de un único contexto.

Estructura sugerida dentro de Shared:

```
app/Modules/Shared/
└── Domain/
    ├── PaginadoValueObject.php   # usado en cualquier consulta paginada
    └── ...                       # otros Value Objects o contratos globales
```

### Regla de Shared

- Si un Value Object, contrato o helper solo lo usa un contexto: **va dentro de ese contexto**, no en Shared.
- Si ya existe en Shared lo que necesitas, **reutiliza, no dupliques**.

---

## Cómo llamar desde un controlador

El controlador siempre llama a `make()`, nunca instancia la clase directamente ni llama a `__invoke()`:

```php
// ✅ Correcto
$pacientes = ObtenerPacientes::make(
    pagina: $request->integer('pagina', 1),
    porPagina: 25,
    filtros: $request->only(['buscar', 'especie']),
);

// ❌ Incorrecto — no instanciar manualmente
$caso = new ObtenerPacientes();
$pacientes = $caso->__invoke(...);
```

---

## Checklist antes de entregar

- [ ] El archivo está en `app/Modules/{Contexto}/{Dominio}/UseCases/` (o `/Queries`, `/Services`)
- [ ] El namespace PHP coincide exactamente con la ruta del archivo
- [ ] La clase es `final`
- [ ] El nombre de la clase es descriptivo y está en español
- [ ] Existe el método `static make()` como punto de entrada
- [ ] `__invoke()` contiene la lógica, no `make()`
- [ ] Variables y parámetros están en español
- [ ] Si hay paginación, se usa `PaginadoValueObject` desde `App\Modules\Shared\Domain`
- [ ] Si el query es complejo o se reutiliza, está en `/Queries`
- [ ] El código comparte lógica con otro contexto → está en `Shared`, no duplicado
- [ ] Se corre `vendor/bin/pint --dirty --format agent` para formatear el código
