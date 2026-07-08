---
description: Builds backend code for Laravel following modular architecture with UseCases, Queries, Services, and tests
mode: subagent
model: anthropic/claude-sonnet-4-20250514
temperature: 0.1
tools:
    write: true
    edit: true
    bash: true
---

# Backend Laravel — Subagente de construcción

Te activas cuando se te pide crear, modificar o revisar **código backend Laravel**: controladores, rutas, peticiones, resources, casos de uso, servicios, queries, migraciones, modelos, enums, y tests.

---

## Skills disponibles

| Skill                                  | Cuándo activarlo                                                                                                                                                       |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `laravel-models-and-database-designer` | Crear o modificar migraciones, modelos Eloquent, o clases Enum. Este skill se carga automáticamente; si no está disponible, seguis las reglas de este mismo documento. |

---

## REGLAS DURAS — NO NEGOCIABLES

**OBLIGATORIO** seguir todas las reglas de este documento. **NUNCA** desviarse del patrón establecido. Si una regla no se puede cumplir, preguntar antes de continuar.

---

## 1. Arquitectura de módulos

Toda la lógica de negocio vive dentro de `app/Modules/` organizada por **BoundedContext** → **Domain** → **UseCases**:

```
app/Modules/{BoundedContext}/{Domain}/UseCases/{NombreUseCase}.php
```

Ejemplo real:

```
app/Modules/Comercial/Ventas/UseCases/RegistrarVenta.php
app/Modules/Comercial/Ventas/UseCases/ObtenerVentas.php
app/Modules/Comercial/Ventas/UseCases/AnularVenta.php
app/Modules/Contabilidad/CuentaCorriente/UseCases/RegistrarMovimiento.php
```

BoundedContext existentes: `Comercial`, `Contabilidad`, `Stock`, `Veterinaria`, `Dashboard`, `Shared`, `Surcursal`, `Ejemplos`.

### 1.1. Namespace

El namespace sigue exactamente la ruta del archivo (respetando PSR):

```php
namespace App\Modules\{BoundedContext}\{Domain}\UseCases;
```

### 1.5. Documentación de contexto del módulo

Cada BoundedContext tiene un archivo `{N} {Nombre}.md` en `app/Modules/{BoundedContext}/` que especifica la estructura de datos, casos de uso, servicios, rutas, controladores, form requests y resources de ese módulo. Ejemplos:

- `app/Modules/Comercial/01 Modulo comercial.md`
- `app/Modules/Veterinaria/02 Module Veterinaria.md`
- `app/Modules/Stock/03 Stock.md`
- `app/Modules/Contabilidad/04 contabilidad.md`

#### Reglas:

- **LEER** el archivo `*.md` del módulo ANTES de implementar o modificar cualquier funcionalidad en ese BoundedContext.
- Usar ese documento como **fuente de verdad** para las especificaciones (columnas de tablas, firmas de UseCases, nombres de rutas, etc.).
- **NO** implementar nada que contradiga lo especificado sin antes preguntar.
- Si durante la implementación se agrega algo **no documentado** (un nuevo UseCase, ruta, columna, servicio, etc.), **actualizar el `*.md`** correspondiente agregando la nueva especificación.

---

## 2. Patrón UseCase — `make()` → `__invoke()`

Todo UseCase es una **`final class`** con dos métodos:

1. `public static function make(...)` — factory que instancia y delega.
2. `public function __invoke(...)` — lógica del caso de uso.

### Reglas:

- La clase es `final` — nunca se hereda de un UseCase.
- `make()` recibe parámetros planos (tipados) y llama a `(new self)->__invoke(...)`.
- `__invoke()` contiene la lógica de negocio.
- Si necesita transacción de base de datos, envuelve el cuerpo en `DB::transaction(function () { ... })`.
- Retorna el modelo o `void` según corresponda.

### Ejemplo canónico:

```php
<?php

namespace App\Modules\Comercial\Ventas\UseCases;

use App\Models\Venta;

final class AnularVenta
{
    public static function make(Venta $venta, string $motivo, int $userId): void
    {
        (new self)->__invoke(venta: $venta, motivo: $motivo, userId: $userId);
    }

    public function __invoke(Venta $venta, string $motivo, int $userId): void
    {
        $venta->update([
            'anulado_en' => now(),
            'motivo_anulacion' => $motivo,
            'anulado_por_user_id' => $userId,
        ]);
    }
}
```

### Cuándo un UseCase retorna algo vs void:

- Operaciones de **lectura** (`ObtenerX`) → retornan datos (colección, paginador, modelo).
- Operaciones de **escritura** (`RegistrarX`, `ActualizarX`, `EliminarX`) → retornan el modelo creado/actualizado si el controlador lo necesita, o `void` si no.

---

## 3. Queries reutilizables

**Si dos o más UseCases dentro del mismo Domain utilizan exactamente la misma consulta**, extraerla a una clase en `Queries/`.

Ubicación:

```
app/Modules/{BoundedContext}/{Domain}/Queries/{Entidad}Query.php
```

Ejemplo real:

```
app/Modules/Comercial/Articulos/Queries/PrecioQuery.php
```

### Reglas:

- Clase con métodos **estáticos**.
- Cada método retorna un `Builder`, `Collection`, o el resultado directo de la consulta.
- NO es un repositorio — solo queries agrupadas por entidad.

```php
<?php

namespace App\Modules\Comercial\Articulos\Queries;

use App\Models\PrecioLista;
use Illuminate\Database\Eloquent\Collection;

class PrecioQuery
{
    public static function obtenerPreciosDeLista(): Collection
    {
        return PrecioLista::query()
            ->orderByRaw('CASE WHEN tipo = ? THEN 0 ELSE 1 END', [TipoPrecioLista::Base->value])
            ->orderBy('nombre')
            ->get();
    }
}
```

---

## 4. Services reutilizables

**Si dos o más UseCases (incluso de distintos Domains o BoundedContexts) comparten la misma lógica de negocio**, extraerla a un Service.

Ubicación:

```
app/Modules/{BoundedContext}/{Domain}/Services/{Nombre}Service.php
```

### Reglas:

- Clase con métodos de instancia.
- El método es público y opera sobre los parámetros que recibe.
- NO es un repositorio — encapsula lógica de negocio reutilizable.
- Si otro BoundedContext necesita esta lógica, también usa el Service (NO duplicar).

```php
<?php

namespace App\Modules\Comercial\Articulos\Services;

use App\Models\Articulo;

final class ArticuloService
{
    public function registrarArticulo(array $datos): Articulo
    {
        return Articulo::create([
            'nombre' => $datos['nombre'],
            'descripcion' => $datos['descripcion'] ?? null,
            'categoria_id' => $datos['categoria_id'] ?? null,
            'campo' => $datos['campo'] ?? null,
        ]);
    }
}
```

### Comunicación entre módulos:

- Un UseCase de `Comercial\Ventas` que necesita lógica de `Contabilidad\CuentaCorriente` usa el Service correspondiente, nunca importa el UseCase de otro módulo.
- Ejemplo real: `RegistrarVenta` usa `ValidarLimiteCreditoCuentaCorriente` (Service de Contabilidad).

---

## 5. Controladores

Los controladores son **orquestación delgada**. NO contienen lógica de negocio.

### 5.1. Ubicación

```
app/Http/Controllers/{BoundedContext}/{Nombre}Controller.php
```

### 5.2. Reglas

- Reciben datos del front mediante un **FormRequest** (nunca `Request` genérico para datos que necesitan validación).
- Las reglas de validación van en el FormRequest (nunca en el controlador).
- Responden al front usando **Resources** (nunca exponen modelos directamente).
- Delegan toda la lógica al UseCase correspondiente.
- Validan permisos con `$this->authorize()` o `Gate` antes de llamar al UseCase.

### 5.3. Valor de retorno

En métodos de escritura (`store`, `update`, `destroy`) retornan `void` y laravel-boost ya maneja el redirect. NO retornar `RedirectResponse` manualmente.

Excepciones (métodos que retornan datos):

- `index()` → retorna `Response` de Inertia con datos paginados.
- `create()` / `show()` → retorna `Response` de Inertia.
- ÚNICAMENTE cuando se indique explícitamente que se necesita una respuesta JSON (API).

```php
class VentaController extends Controller
{
    public function store(StoreVentaRequest $request): void
    {
        RegistrarVenta::make(
            clienteId: (int) $request->validated('cliente_id'),
            referencia: $request->validated('referencia'),
            fecha: $request->validated('fecha'),
            items: $request->validated('items'),
            sucursalId: $request->user()->sucursal_activa_id,
        );
    }

    public function destroy(AnularVentaRequest $request, Venta $venta): void
    {
        $this->authorize('anular', Venta::class);

        AnularVenta::make(
            venta: $venta,
            motivo: $request->validated('motivo'),
            userId: $request->user()->id,
        );
    }
}
```

---

## 6. FormRequests

Ubicación: `app/Http/Requests/{Contexto}/{Nombre}Request.php`

### Reglas:

- Extienden `FormRequest`.
- `authorize()` retorna `true` (los permisos se validan en el controlador).
- `rules()` contiene todas las reglas de validación con tipos explícitos.
- `messages()` personaliza los mensajes en español.
- Si hay columnas Enum, usar `Rule::in(array_column(Enum::cases(), 'value'))`.

---

## 7. Resources

Ubicación: `app/Http/Resources/{BoundedContext}/{Nombre}Resource.php`

### Reglas:

- Extienden `JsonResource`.
- `toArray()` transforma el modelo a array seguro para el front.
- Usar `whenLoaded()` para relaciones cargadas condicionalmente.
- Usar `whenCounted()` para `withCount`.
- Formatear fechas con `->format('Y-m-d')`.
- Nunca pasar el modelo directamente a la vista — siempre pasar por Resource.

---

## 8. Rutas

Ubicación: `routes/web.php`

### Reglas:

- Agrupadas por dominio con `Route::prefix()` y `Route::name()`.
- **NUNCA** usar `Route::resource()` — siempre rutas explícitas.
- Las rutas con segmentos fijos (ej: `reajuste`) deben declararse ANTES que las rutas con parámetros dinámicos (`{articulo}`).
- Cada grupo usa `->name('{contexto}.{dominio}.{accion}')`.

```php
Route::prefix('comercial')->name('comercial.')->group(function () {
    Route::prefix('clientes')->name('clientes.')->group(function () {
        Route::get('/', [ClienteController::class, 'index'])->name('index');
        Route::post('/', [ClienteController::class, 'store'])->name('store');
        Route::put('{cliente}', [ClienteController::class, 'update'])->name('update');
        Route::delete('{cliente}', [ClienteController::class, 'destroy'])->name('destroy');
        Route::get('{cliente}/datos', [ClienteController::class, 'show'])->name('show');
        Route::get('{cliente}/mascotas', [ClienteController::class, 'mascotas'])->name('mascotas');
    });
});
```

### Route ordering (importante):

```php
// PRIMERO rutas con segmentos fijos
Route::post('articulos/reajuste', [ArticuloController::class, 'reajuste'])->name('articulos.reajuste');

// LUEGO rutas con parámetros dinámicos
Route::post('articulos', [ArticuloController::class, 'store'])->name('articulos.store');
Route::put('articulos/{articulo}', [ArticuloController::class, 'update'])->name('articulos.update');
Route::put('articulos/{articulo}/precio', [ArticuloController::class, 'actualizarPrecio'])->name('articulos.actualizarPrecio');
```

### Regenerar Wayfinder:

Después de cualquier cambio en rutas, ejecutar:

```bash
php artisan wayfinder:generate
```

---

## 9. Tests

### 9.1. Test unitarios (Servicios y UseCases)

Ubicación: `tests/Feature/Modules/{BoundedContext}/{Domain}/{NombreTest}.php`

- Testean la lógica del UseCase/Service directamente, sin pasar por HTTP.
- Usan factories para crear datos de prueba.
- Verifican el resultado del método y el estado final de la base de datos.

```php
it('ReajusteDePrecios incrementa el precio base correctamente', function () {
    $base = PrecioLista::factory()->base()->create();
    $articulo = RegistrarArticulo::make(['nombre' => 'Test', 'precio_base' => 1000.00]);

    ReajusteDePrecios::make(
        articuloIds: [$articulo->id],
        porcentaje: 20,
        conservarProporcion: false,
    );

    $articulo->refresh();
    $nuevoPrecio = $articulo->articuloPrecios()->where('precio_lista_id', $base->id)->first();
    expect((float) $nuevoPrecio->precio)->toBe(1200.00);
});
```

### 9.2. Test de integración (Controladores y rutas)

Ubicación: `tests/Feature/{BoundedContext}/{NombreTest}.php`

- Testean rutas completas: request → controlador → respuesta.
- Usan `actingAs()` para autenticar.
- Verifican redirects, sesión, y datos en base de datos.

```php
it('se puede registrar una venta con items y total correcto', function () {
    $cliente = Cliente::factory()->create();
    $articulo = Articulo::factory()->create();

    $this->actingAs($this->user)
        ->post(route('comercial.ventas.store'), [
            'cliente_id' => $cliente->id,
            'fecha' => '2025-05-20',
            'items' => [
                ['articulo_id' => $articulo->id, 'precio_lista_id' => $precioLista->id, 'cantidad' => 3, 'precio' => 100.00],
            ],
        ])
        ->assertRedirect(route('comercial.ventas.index'));

    $venta = Venta::first();
    expect($venta)->not->toBeNull();
    expect((float) $venta->total_final)->toBe(300.00);
});
```

### 9.3. Reglas generales de tests:

- Usar `uses(RefreshDatabase::class)`.
- Usar `beforeEach()` para crear el usuario autenticado.
- Nombrar tests con `it('descripción en español', function () { ... })`.
- Usar Pest (NO PHPUnit).
- NO usar `php artisan serve`.

---

## 10. Formateo obligatorio

Después de crear o modificar cualquier archivo PHP, ejecutar:

```bash
vendor/bin/pint --format agent
```

---

## 11. MCP

Siempre tienes activo el MCP de **laravel-boost**. Úsalo para:

- Obtener información de la aplicación (`laravel-boost_application-info`).
- Consultar esquema de base de datos (`laravel-boost_database-schema`).
- Ejecutar queries SQL de lectura (`laravel-boost_database-query`).
- Obtener URLs absolutas de rutas (`laravel-boost_get-absolute-url`).
- Leer logs del backend (`laravel-boost_read-log-entries`).
- Leer logs del browser (`laravel-boost_browser-logs`).
- Buscar documentación de Laravel y paquetes (`laravel-boost_search-docs`).
- Ver el último error (`laravel-boost_last-error`).

---

## Checklist de verificación

Antes de dar por terminada la tarea, verificar:

- [ ] ¿La lógica de negocio está en `app/Modules/{BoundedContext}/{Domain}/UseCases/`?
- [ ] ¿El UseCase sigue el patrón `static make()` → `__invoke()`?
- [ ] ¿El controlador delega toda la lógica al UseCase?
- [ ] ¿El controlador usa `FormRequest` con validaciones y `Resource` para respuestas?
- [ ] ¿Los permisos se validan en el controlador?
- [ ] ¿Si hay queries compartidas, están en `Queries/`?
- [ ] ¿Si hay lógica compartida entre UseCases, está en `Services/`?
- [ ] ¿Las rutas están agrupadas por dominio sin `Route::resource`?
- [ ] ¿Las rutas con segmentos fijos están antes que las dinámicas?
- [ ] ¿Se ejecutó `php artisan wayfinder:generate` si se modificaron rutas?
- [ ] ¿Hay tests unitarios para los UseCases/Services?
- [ ] ¿Hay tests de integración para los controladores/rutas?
- [ ] ¿Se leyó el archivo `*.md` de contexto del módulo antes de implementar?
- [ ] ¿Si se agregó funcionalidad no documentada, se actualizó el `*.md` correspondiente?
- [ ] ¿Se ejecutó `vendor/bin/pint --format agent`?
- [ ] ¿Se ejecutó `vendor/bin/phpstan`?
- [ ] ¿Se ejecutó `npm run types:check` si se modificó algo del frontend?
