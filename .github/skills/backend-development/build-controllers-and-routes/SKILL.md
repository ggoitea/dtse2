---
name: build-controllers-and-routes
description: 'Activar siempre que se creen o modifiquen controladores, rutas, Form Requests, API Resources o casos de uso. Cubre la arquitectura completa de la capa HTTP: controladores delgados, casos de uso en Modules, Resources como DTOs frontend/backend, validación en Form Requests y autorización con Gates. También cubre la convención de rutas agrupadas por contexto.'
license: MIT
metadata:
    author: ggoitea
---

# Build Controllers and Routes

---

## 0. Migraciones

### Generación

```bash
php artisan make:migration create_{tabla}_table --no-interaction
```

### Reglas de columnas

- Usar los tipos de columna más específicos: `boolean`, `unsignedInteger`, `foreignId`, `uuid`, etc.
- **NUNCA usar `$table->string()` para columnas cuyo dominio está definido por un Enum de PHP.** Usar siempre `$table->enum()`.

### Columnas con Enum de PHP (regla clave)

Cuando el usuario especifique que un campo trabaja con un enum (o cuando el campo tiene valores fijos de dominio representados por una clase Enum), usar:

```php
use App\Enums\{Contexto}\{NombreEnum};

$table->enum('estado', array_column(NombreEnum::cases(), 'value'));
$table->enum('tipo', array_column(TipoEnum::cases(), 'value'));
```

- `array_column(EnumClass::cases(), 'value')` extrae automáticamente todos los valores válidos del Enum, de modo que si el Enum crece, la migración es la fuente de verdad.
- El modelo **siempre** debe declarar el cast correspondiente:

```php
protected function casts(): array
{
    return [
        'estado' => NombreEnum::class,
        'tipo'   => TipoEnum::class,
    ];
}
```

### Ejemplo canónico completo

```php
<?php

use App\Enums\AccessoFisico\CredencialEstadoEnum;
use App\Enums\AccessoFisico\AccesoTipoEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('credenciales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('propiedad_id')->constrained('propiedades')->cascadeOnDelete();

            // ✅ Columna enum: referencia los valores desde la clase Enum de PHP
            $table->enum('tipo', array_column(AccesoTipoEnum::cases(), 'value'));
            $table->date('vigente_desde')->nullable();
            $table->date('vigente_hasta')->nullable();
            $table->enum('estado', array_column(CredencialEstadoEnum::cases(), 'value'));

            $table->uuid('codigo_qr')->unique();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('credenciales');
    }
};
```

Y el modelo correspondiente:

```php
use App\Enums\AccessoFisico\AccesoTipoEnum;
use App\Enums\AccessoFisico\CredencialEstadoEnum;

class Credencial extends Model
{
    protected function casts(): array
    {
        return [
            'tipo'   => AccesoTipoEnum::class,
            'estado' => CredencialEstadoEnum::class,
        ];
    }
}
```

### Soft Deletes

Agregar `$table->softDeletes()` cuando el modelo use `SoftDeletes`.

---

---

## Principio Central

Los controladores **solo** orquestan: reciben la petición, llaman a un caso de uso y devuelven la respuesta. **Ninguna lógica de negocio vive en el controlador.** Todo el procesamiento va en `app/Modules`.

---

## Reglas Duras (nunca violar)

- **NUNCA** escribir lógica de negocio en un controlador. Si la lógica no es transformar la request o construir la respuesta, pertenece a un caso de uso.
- **NUNCA** usar `$request->validate()` inline. Toda validación va en un Form Request.
- **NUNCA** usar `$request->all()`. Solo `$request->validated()` en métodos que reciben un Form Request.
- **NUNCA** usar `string $id` + `findOrFail()` cuando se puede usar Route Model Binding.
- **NUNCA** hardcodear URLs. Usar siempre rutas nombradas con `route()`.
- **SIEMPRE** aplicar `Gate::authorize()` en cada método del controlador que requiera autorización.
- **SIEMPRE** retornar `Inertia::render()` desde el método `index()` como vista principal del dominio.
- **SIEMPRE** envolver props costosas en `fn () =>` para que Inertia las evalúe de forma diferida.
- **SIEMPRE** generar archivos con Artisan. No crear controladores, requests ni resources a mano.

---

---

## 1. Controladores

### Generación

```bash
php artisan make:controller {Contexto}/{DominioController} --resource --no-interaction
```

El namespace del contexto organiza los controladores: `App\Http\Controllers\Clinica\PacienteController`.

### Estructura canónica

```php
namespace App\Http\Controllers\Clinica;

use App\Http\Controllers\Controller;
use App\Http\Requests\Clinica\StorePacienteRequest;
use App\Http\Resources\Clinica\PacienteResource;
use App\Modules\Clinica\Pacientes\UseCases\CrearPaciente;
use App\Modules\Clinica\Pacientes\UseCases\ObtenerPacientes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class PacienteController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Paciente::class);

        $page = $request->integer('pacientesPage', 1);
        $filtros = [
            'buscar' => $request->input('buscar'),
        ];

        return Inertia::render('clinica/pacientes/index', [
            'filtros'   => $filtros,
            // fn () => para carga diferida: Inertia solo ejecuta si la prop se necesita
            'pacientes' => fn () => PacienteResource::collection(
                ObtenerPacientes::make(page: $page, filtros: $filtros)
            ),
        ]);
    }

    public function show(Paciente $paciente)
    {
        Gate::authorize('view', $paciente);

        return Inertia::render('clinica/pacientes/show', [
            'paciente' => fn () => new PacienteResource($paciente),
        ]);
    }

    // store: recibe Form Request (valida automáticamente), delega al caso de uso
    public function store(StorePacienteRequest $request)
    {
        Gate::authorize('create', Paciente::class);

        $paciente = CrearPaciente::make(...$request->validated());

        return redirect()->route('clinica.pacientes.show', $paciente);
    }
}
```

### Cuándo usar `fn () =>` vs función normal

| Situación                                           | Usar                             |
| --------------------------------------------------- | -------------------------------- |
| Llamada directa a un caso de uso o Resource         | `fn () => UseCase::make(...)`    |
| Se necesitan variables preparadas antes de pasarlas | `function () use ($var) { ... }` |

---

---

## 2. Casos de Uso (Modules)

### Ubicación

```
app/Modules/
    {BoundedContext}/
        {Dominio}/
            Queries/       ← consultas complejas reutilizables
            Services/      ← servicios de dominio
            UseCases/
                Crear{Dominio}.php
                Obtener{Dominio}s.php
                Actualizar{Dominio}.php
                Eliminar{Dominio}.php
    Shared/
        Domain/
            PaginadoValueObject.php
```

### Estructura obligatoria

```php
namespace App\Modules\Clinica\Pacientes\UseCases;

final class ObtenerPacientes
{
    public static function make(int $page = 1, int $porPagina = 25, array $filtros = []): Collection|LengthAwarePaginator
    {
        $paginado = new PaginadoValueObject(pagina: $page, porPagina: $porPagina, nombreDePagina: 'pacientesPage');
        return (new self())->__invoke(filtros: $filtros, paginado: $paginado);
    }

    public function __invoke(array $filtros = [], ?PaginadoValueObject $paginado = null): Collection|LengthAwarePaginator
    {
        $filtros = array_merge(['buscar' => null], $filtros);

        $query = Paciente::query()
            ->when($filtros['buscar'], fn (Builder $q, $v) => $q->where('nombre', 'like', "%{$v}%"));

        return $paginado
            ? $query->paginate($paginado->porPagina, pageName: $paginado->nombreDePagina, page: $paginado->pagina)
            : $query->get();
    }
}
```

- Los casos de uso son **siempre `final`**.
- **No reciben `Request`** ni ningún objeto HTTP — son PHP puro.
- `make()` es el factory estático que recibe parámetros simples; `__invoke()` es el ejecutor con la lógica.

---

---

## 3. API Resources

### Generación

```bash
php artisan make:resource {Contexto}/{DominioResource} --no-interaction
```

### Criterio para `parent::toArray()` vs mapeo explícito

Los Resources son el **único** punto de salida de datos hacia el frontend.

- Usar `parent::toArray($request)` **solo si** todos los campos del modelo coinciden en nombre con lo que espera el frontend.
- Mapear explícitamente cuando los nombres difieren, se expone un subconjunto, o se incluyen relaciones o campos calculados.

```php
// Usar parent::toArray() SOLO si todos los campos del modelo
// coinciden exactamente en nombre con lo que espera el frontend
class PacienteResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return parent::toArray($request);
    }
}

// Mapear explícitamente cuando:
// - Se renombran campos (modelo ≠ frontend)
// - Se expone un subconjunto de campos
// - Se incluyen campos calculados o relaciones
class PacienteResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'nombre'      => $this->full_name,   // renombrado
            'especie'     => $this->especie,
            'propietario' => new PropietarioResource($this->whenLoaded('propietario')),
            'created_at'  => $this->created_at,
        ];
    }
}
```

### Tipo TypeScript correspondiente

Cada Resource **debe** tener su tipo TypeScript. La ubicación depende del alcance:

- **Global** (usado en múltiples páginas/contextos): `resources/js/types/{dominio}.ts`, re-exportado en `resources/js/types/index.ts`.
- **Local** (usado en una sola página): `resources/js/pages/{contexto}/{dominio}/types/{dominio}.d.ts`.

```typescript
export type Paciente = {
    id: number;
    nombre: string;
    especie: string;
    created_at: string;
};
```

El tipo debe reflejar exactamente lo que retorna el Resource, **no** el modelo de base de datos.

---

---

## 4. Form Requests

### Generación

```bash
php artisan make:request {Contexto}/Store{Dominio}Request --no-interaction
# Para actualizaciones:
php artisan make:request {Contexto}/Update{Dominio}Request --no-interaction
```

### Estructura obligatoria

```php
namespace App\Http\Requests\Clinica;

class StorePacienteRequest extends FormRequest
{
    // authorize() siempre retorna true.
    // La autorización real se hace con Gate::authorize() en el controlador.
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre'  => ['required', 'string', 'max:255'],
            'especie' => ['required', 'string', 'in:perro,gato,otro'],
        ];
    }
}
```

- `authorize()` **siempre retorna `true`** en el Form Request. El Gate va en el controlador.
- Las reglas usan **siempre notación de array** `['required', 'string']`, nunca string con pipes.

---

---

## 5. Rutas

### Web (`routes/web.php`)

```php
Route::middleware(['auth', 'verified'])->group(function () {

    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::prefix('clinica')->name('clinica.')->group(function () {
        // CRUD completo
        Route::resource('pacientes', Clinica\PacienteController::class);

        // CRUD parcial — declarar explícitamente las acciones
        Route::resource('citas', Clinica\CitaController::class)
            ->only(['index', 'store', 'destroy']);

        // Acciones fuera del CRUD — verbo HTTP declarativo + nombre descriptivo
        Route::post('pacientes/{paciente}/archivar', [Clinica\PacienteController::class, 'archivar'])
            ->name('pacientes.archivar');
    });
});
```

### API (`routes/api.php`)

El archivo se crea cuando sea necesario. Usa `Route::apiResource()` y responde con Resources, nunca con `Inertia::render()`.

```php
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('v1')->name('api.v1.')->group(function () {
        Route::apiResource('pacientes', Api\V1\PacienteController::class);
    });
});
```

### Reglas de rutas

- **`Route::resource()`** para CRUD estándar; **`Route::apiResource()`** para APIs.
- **Verbos HTTP declarativos** para acciones fuera del CRUD. No usar rutas genéricas.
- **Nombres con punto** → `contexto.dominio.accion` (ej. `clinica.pacientes.archivar`).
- **URLs en kebab-case** → `Route::prefix('historia-clinica')`.
- Rutas protegidas **siempre** dentro del grupo `auth` + `verified`.
- Rutas públicas (bienvenida, login) **fuera** del grupo de middleware.

---

---

## Flujo Obligatorio al Crear una Feature

Seguir este orden, cada paso depende del anterior:

1. **Ruta** → agregar en `routes/web.php` dentro del grupo/contexto. Usar `Route::resource()`.
2. **Controlador** → `php artisan make:controller {Contexto}/{DominioController} --resource --no-interaction`.
3. **Form Request(s)** → `php artisan make:request {Contexto}/Store{Dominio}Request --no-interaction` (y `Update` si aplica).
4. **Resource** → `php artisan make:resource {Contexto}/{DominioResource} --no-interaction`.
5. **Tipo TypeScript** → crear `{dominio}.d.ts` en la ubicación correcta (local o global) reflejando exactamente el Resource.
6. **Caso(s) de uso** → crear en `app/Modules/{BoundedContext}/{Dominio}/UseCases/` con la estructura `make()` + `__invoke()`.
7. **Implementar controlador** → inyectar Form Requests, llamar casos de uso, aplicar Gates, retornar Inertia con Resources.
8. **Formatear** → `vendor/bin/pint --dirty --format agent`.
