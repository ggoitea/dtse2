---
name: laravel-models-and-database-designer
description: Diseño de la base de datos, escribiendo migraciones, modelos y enums para Laravel
license: MIT
compatibility: opencode
---

# Diseñador de Modelos y Base de Datos para Laravel

---

## Propósito

Activar este skill cuando se vaya a:

- Crear o modificar **migraciones** (tablas, columnas, índices, claves foráneas).
- Crear o modificar **modelos Eloquent** (propiedades, casts, relaciones).
- Crear **clases Enum** que representen dominios de valores fijos.

---

## REGLAS DURAS — NO NEGOCIABLES

**OBLIGATORIO** seguir todas las reglas de este documento. **NUNCA** desviarse del patrón establecido. Si una regla no se puede cumplir, preguntar antes de continuar.

---

## 1. Modelo ⇄ Tabla — Siempre juntos

- **Cuando te pidan crear un modelo**, debes crear también su migración (tabla). Nunca un modelo sin tabla.
- **Cuando te pidan crear una tabla** (migración), **preguntar siempre** si también necesita el modelo. Asumir que sí hasta que el usuario diga lo contrario.
- **NUNCA** crear un modelo sin su migración correspondiente, ni viceversa, sin confirmación explícita.

---

## 2. Columnas Enum

Cuando una columna representa un dominio de valores fijos:

### 2.1. Crear la clase Enum

Ubicar en `app/Enums/` directamente o dentro de una subcarpeta por contexto si el dominio lo amerita:

```
app/Enums/{Contexto}/NombreEnum.php
```

Ejemplo de ruta: `app/Enums/Veterinaria/ConsultaEstadoEnum.php`

### 2.2. Usar el Enum en la migración

**NUNCA** usar `$table->string()` para columnas cuyo dominio está definido por un Enum. Usar siempre `$table->enum()` con `array_column()`:

```php
use App\Enums\{Contexto}\{NombreEnum};

$table->enum('estado', array_column(NombreEnum::cases(), 'value'));
```

### 2.3. Castear el Enum en el modelo

El modelo **siempre** debe declarar el cast correspondiente:

```php
protected function casts(): array
{
    return [
        'estado' => NombreEnum::class,
    ];
}
```

### 2.4. Validación con Rule::in()

En los Form Requests, usar `Rule::in(array_column(NombreEnum::cases(), 'value'))` — nunca strings literales.

---

## 3. Estructura obligatoria del Enum

Toda clase Enum debe cumplir este patrón:

```php
enum NombreEnum: string
{
    case ValorUno = 'valor_uno';
    case ValorDos = 'valor_dos';

    public function label(): string
    {
        return match ($this) {
            self::ValorUno => 'Valor Uno',
            self::ValorDos => 'Valor Dos',
        };
    }

    public static function toOptions(): array
    {
        return array_map(
            fn(self $enum) => [
                'value' => $enum->value,
                'label' => $enum->label(),
            ],
            self::cases()
        );
    }
}
```

Reglas:
- **Siempre** `string` backed: `enum FooEnum: string`
- Los `case` usan **PascalCase** para el nombre, **snake_case** para el valor.
- `label()` retorna el texto legible para humanos (en español).
- `toOptions()` retorna `array` de arrays con las keys `value` y `label`, ideal para selects del frontend.

---

## 4. Modelos Eloquent

### 4.1. PHPDoc obligatorio

**Siempre** incluir bloque PHPDoc con `@property` para **todas** las columnas de la tabla. Los tipos deben reflejar los casts:

```php
use App\Enums\Veterinaria\ConsultaEstadoEnum;

/**
 * @property int $id
 * @property int $cliente_id
 * @property ConsultaEstadoEnum $estado
 * @property string|null $diagnostico
 * @property \Illuminate\Support\Carbon|null $fecha_consulta
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class Consulta extends Model
{
```

### 4.2. Casts

Declarar **siempre** el método `casts()` (no la propiedad `$casts`). Incluir casts para enums, fechas, decimales, etc.:

```php
protected function casts(): array
{
    return [
        'estado'         => ConsultaEstadoEnum::class,
        'fecha_consulta' => 'date',
        'total'          => 'decimal:2',
    ];
}
```

### 4.3. $fillable

Declarar `$fillable` con todos los campos asignables masivamente. **NUNCA** usar `$guarded`.

### 4.4. Relaciones tipadas

Todas las relaciones deben declarar el tipo de retorno (`BelongsTo`, `HasMany`, `HasOne`, `BelongsToMany`, etc.) e importar la clase desde `Illuminate\Database\Eloquent\Relations`:

```php
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

public function cliente(): BelongsTo
{
    return $this->belongsTo(Cliente::class);
}

public function items(): HasMany
{
    return $this->hasMany(VentaItem::class);
}
```

---

## 5. Claves foráneas — Cascade vs Restrict

La regla para definir `onDelete` en claves foráneas es:

### 5.1. Relación directa (composición) — `cascadeOnDelete()`

Cuando el hijo **pertenece** al padre y **no tiene sentido sin él**. Ejemplo típico: una Orden y sus Items.

```php
// VentaItem pertenece a Venta — si la venta se elimina, los items también
$table->foreignId('venta_id')->constrained('ventas')->cascadeOnDelete();
```

Casos comunes:
- `venta_id` → `ventas` (items de venta)
- `compra_id` → `compras` (items de compra)
- `consulta_id` → `consultas` (diagnósticos, recetas)
- `paciente_id` → `pacientes` (consultas, internaciones)
- `cliente_id` → `clientes` (mascotas del cliente)

### 5.2. Relación indirecta (referencia) — `restrictOnDelete()`

Cuando la FK solo **referencia** a otra entidad pero no es una relación de pertenencia jerárquica. Ejemplo: `creado_por_user_id`, `articulo_id` en un ítem de venta.

```php
// Solo referencia, no es composición — no eliminar en cascada
$table->foreignId('creado_por_user_id')->constrained('users')->restrictOnDelete();
$table->foreignId('articulo_id')->constrained('articulos')->restrictOnDelete();
$table->foreignId('precio_lista_id')->constrained('precio_listas')->restrictOnDelete();
```

Casos comunes:
- `creado_por_user_id`, `actualizado_por_user_id`
- `articulo_id`, `producto_id`, `servicio_id`
- `precio_lista_id`, `categoria_id`
- `ubicacion_id`, `proveedor_id`

### 5.3. Duda

Si no estás seguro de qué tipo de relación es, **preguntar**. No asumir.

---

## 6. Ejemplo canónico completo

### Migración

```php
<?php

use App\Enums\Veterinaria\ConsultaEstadoEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('consultas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paciente_id')->constrained('pacientes')->cascadeOnDelete();
            $table->foreignId('creado_por_user_id')->constrained('users')->restrictOnDelete();
            $table->enum('estado', array_column(ConsultaEstadoEnum::cases(), 'value'));
            $table->text('diagnostico')->nullable();
            $table->date('fecha_consulta');
            $table->decimal('total', 13, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('consultas');
    }
};
```

### Enum

```php
<?php

namespace App\Enums\Veterinaria;

enum ConsultaEstadoEnum: string
{
    case Pendiente = 'pendiente';
    case EnCurso = 'en_curso';
    case Finalizada = 'finalizada';
    case Cancelada = 'cancelada';

    public function label(): string
    {
        return match ($this) {
            self::Pendiente  => 'Pendiente',
            self::EnCurso    => 'En curso',
            self::Finalizada => 'Finalizada',
            self::Cancelada  => 'Cancelada',
        };
    }

    public static function toOptions(): array
    {
        return array_map(
            fn(self $enum) => [
                'value' => $enum->value,
                'label' => $enum->label(),
            ],
            self::cases()
        );
    }
}
```

### Modelo

```php
<?php

namespace App\Models;

use App\Enums\Veterinaria\ConsultaEstadoEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $paciente_id
 * @property int $creado_por_user_id
 * @property ConsultaEstadoEnum $estado
 * @property string|null $diagnostico
 * @property \Illuminate\Support\Carbon $fecha_consulta
 * @property string $total
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class Consulta extends Model
{
    use HasFactory;

    protected $fillable = [
        'paciente_id',
        'creado_por_user_id',
        'estado',
        'diagnostico',
        'fecha_consulta',
        'total',
    ];

    protected function casts(): array
    {
        return [
            'estado'         => ConsultaEstadoEnum::class,
            'fecha_consulta' => 'date',
            'total'          => 'decimal:2',
        ];
    }

    public function paciente(): BelongsTo
    {
        return $this->belongsTo(Paciente::class);
    }

    public function creadoPor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creado_por_user_id');
    }
}
```

---

## 7. Formateo obligatorio

Después de crear o modificar cualquier archivo PHP, ejecutar:

```bash
vendor/bin/pint --format agent
```

---

## Checklist de verificación

Antes de dar por terminada la tarea, verificar:

- [ ] ¿La migración tiene `up()` y `down()` completos?
- [ ] ¿Las columnas enum usan `array_column(Enum::cases(), 'value')`?
- [ ] ¿Las claves foráneas usan `cascadeOnDelete()` para relaciones directas y `restrictOnDelete()` para indirectas?
- [ ] ¿El enum tiene `label()` y `toOptions()`?
- [ ] ¿El modelo tiene PHPDoc con `@property` para todas las columnas?
- [ ] ¿El modelo declara `casts()`, `$fillable`, y relaciones tipadas?
- [ ] ¿Se ejecutó `vendor/bin/pint --format agent`?
