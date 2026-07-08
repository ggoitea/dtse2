# Plan: Página completa de consulta + Vacunas

## 1. Migración vacunas

`database/migrations/2026_07_02_000006_create_vacunas_table.php`

```php
Schema::create('vacunas', function (Blueprint $table) {
    $table->id();
    $table->foreignId('paciente_id')->constrained('pacientes')->cascadeOnDelete();
    $table->foreignId('consulta_medica_id')->nullable()->constrained('consulta_medicas')->nullOnDelete();
    $table->string('vacuna');
    $table->string('lote')->nullable();
    $table->string('fabricante')->nullable();
    $table->date('fecha_aplicacion');
    $table->date('proxima_dosis')->nullable();
    $table->text('observaciones')->nullable();
    $table->timestamps();
});
```

## 2. Modelo Vacuna

`app/Models/Vacuna.php` — fillable: todos los campos, casts: `fecha_aplicacion`/`proxima_dosis` → `date`, relaciones: `paciente()`, `consultaMedica()`

Agregar a `Paciente.php`:
```php
public function vacunas(): HasMany
{
    return $this->hasMany(Vacuna::class);
}
```

## 3. Actualizar RegistrarConsulta

Modificar para aceptar `?array $medicamentos = null` y crear todo en `DB::transaction`:

```php
public function __invoke(
    int $pacienteId,
    string $detalle,
    ?string $inicioVisita,
    ?string $finVisita,
    string $medico,
    ?string $tratamiento,
    float $peso,
    ?array $medicamentos = null,
): ConsultaMedica {
    return DB::transaction(function () use ($pacienteId, $detalle, $inicioVisita, $finVisita, $medico, $tratamiento, $peso, $medicamentos) {
        $consulta = ConsultaMedica::create([...]);
        
        if ($medicamentos) {
            foreach ($medicamentos as $m) {
                $consulta->medicamentos()->create([
                    'medicamento' => $m['medicamento'],
                    'concentracion' => $m['concentracion'],
                    'frecuencia' => $m['frecuencia'],
                    'duracion' => $m['duracion'],
                    'via' => $m['via'] ?? null,
                    'indicaciones' => $m['indicaciones'] ?? null,
                ]);
            }
        }
        
        return $consulta->fresh(['medicamentos']);
    });
}
```

## 4. Nuevos UseCases

### RegistrarVacuna
`app/Modules/Veterinaria/ConsultasMedicas/UseCases/RegistrarVacuna.php`

```php
final class RegistrarVacuna
{
    public static function make(
        int $pacienteId,
        string $vacuna,
        string $fechaAplicacion,
        ?int $consultaMedicaId = null,
        ?string $lote = null,
        ?string $fabricante = null,
        ?string $proximaDosis = null,
        ?string $observaciones = null,
    ): Vacuna { ... }
}
```

### ObtenerVacunasPorPaciente
`app/Modules/Veterinaria/ConsultasMedicas/UseCases/ObtenerVacunasPorPaciente.php`

```php
final class ObtenerVacunasPorPaciente
{
    public static function make(int $pacienteId): Collection { ... }
    // ->where('paciente_id', $pacienteId)->with('consultaMedica')->orderBy('fecha_aplicacion', 'desc')->get()
}
```

## 5. Controller — métodos nuevos

En `ConsultaMedicaController.php`:

```php
public function create(Paciente $paciente): Response
{
    return Inertia::render('veterinaria/pacientes/consulta-medica-create', [
        'paciente' => $paciente->load('cliente'),
    ]);
}

public function store(Request $request): RedirectResponse
{
    $validated = $request->validate([
        'paciente_id' => 'required|exists:pacientes,id',
        'detalle' => 'required|string',
        'inicio_visita' => 'nullable|date',
        'fin_visita' => 'nullable|date|after_or_equal:inicio_visita',
        'medico' => 'required|string|max:255',
        'tratamiento' => 'nullable|string',
        'peso' => 'required|numeric|min:0|max:999.99',
        'medicamentos' => 'nullable|array',
        'medicamentos.*.medicamento' => 'required|string|max:255',
        'medicamentos.*.concentracion' => 'required|string|max:255',
        'medicamentos.*.frecuencia' => 'required|string|max:255',
        'medicamentos.*.duracion' => 'required|string|max:255',
        'medicamentos.*.via' => 'nullable|string|max:255',
        'medicamentos.*.indicaciones' => 'nullable|string',
    ]);

    $consulta = RegistrarConsulta::make(
        pacienteId: (int) $validated['paciente_id'],
        detalle: $validated['detalle'],
        inicioVisita: $validated['inicio_visita'] ?? null,
        finVisita: $validated['fin_visita'] ?? null,
        medico: $validated['medico'],
        tratamiento: $validated['tratamiento'] ?? null,
        peso: (float) $validated['peso'],
        medicamentos: $validated['medicamentos'] ?? null,
    );

    return redirect()
        ->route('veterinaria.pacientes.historia-clinica', $consulta->paciente_id)
        ->with('success', 'Consulta registrada exitosamente.');
}

public function obtenerVacunas(Paciente $paciente): Response
{
    $vacunas = ObtenerVacunasPorPaciente::make(pacienteId: $paciente->id);
    
    return Inertia::render('veterinaria/pacientes/historia-clinica', [
        'historia' => ObtenerHistoriaClinica::make(pacienteId: $paciente->id),
        'vacunas' => $vacunas,
        'gravedadOptions' => GravedadEnum::toOptions(),
        'tipoDiagnosticoOptions' => TipoDiagnosticoEnum::toOptions(),
        'tipoCirugiaOptions' => TipoCirugiaEnum::toOptions(),
    ]);
}

public function registrarVacuna(Request $request): RedirectResponse
{
    $validated = $request->validate([
        'paciente_id' => 'required|exists:pacientes,id',
        'vacuna' => 'required|string|max:255',
        'lote' => 'nullable|string|max:255',
        'fabricante' => 'nullable|string|max:255',
        'fecha_aplicacion' => 'required|date',
        'proxima_dosis' => 'nullable|date|after_or_equal:fecha_aplicacion',
        'observaciones' => 'nullable|string',
        'consulta_medica_id' => 'nullable|exists:consulta_medicas,id',
    ]);

    RegistrarVacuna::make(
        pacienteId: (int) $validated['paciente_id'],
        vacuna: $validated['vacuna'],
        fechaAplicacion: $validated['fecha_aplicacion'],
        consultaMedicaId: isset($validated['consulta_medica_id']) ? (int) $validated['consulta_medica_id'] : null,
        lote: $validated['lote'] ?? null,
        fabricante: $validated['fabricante'] ?? null,
        proximaDosis: $validated['proxima_dosis'] ?? null,
        observaciones: $validated['observaciones'] ?? null,
    );

    return redirect()->back()->with('success', 'Vacuna registrada exitosamente.');
}
```

## 6. Rutas

En `routes/web.php` dentro del grupo `veterinaria`, ANTES del resource de pacientes:

```php
Route::get('pacientes/{paciente}/consultas/create', [ConsultaMedicaController::class, 'create'])
    ->name('pacientes.consultas.create');
Route::get('pacientes/{paciente}/vacunas', [ConsultaMedicaController::class, 'obtenerVacunas'])
    ->name('pacientes.vacunas');
Route::post('consultas-medicas/registrar-vacuna', [ConsultaMedicaController::class, 'registrarVacuna'])
    ->name('consultas-medicas.registrar-vacuna');
```

Y actualizar store a ruta nombrada para redirect:
```php
Route::post('consultas-medicas', [ConsultaMedicaController::class, 'store'])
    ->name('consultas-medicas.store');
```

Después: `php artisan migrate && php artisan wayfinder:generate`

## 7. Frontend — Página create consulta

`resources/js/pages/veterinaria/pacientes/consulta-medica-create.tsx`

- Usar `AdaptiveLayout` con breadcrumbs y quick action "Volver"
- Formulario completo:
  - Médico (input)
  - Peso (input number)
  - Inicio/Fin visita (datetime-local)
  - Detalle / Razón de visita (textarea)
  - Tratamiento (textarea)
  - Medicamentos: sección dinámica con botón "Agregar medicamento"
    - Cada item: row con inputs para medicamento, concentración, frecuencia, duración, vía (select corto: oral/tópica/IM/IV/SC), indicaciones
    - Botón "Eliminar" por item
  - Submit button "Registrar consulta"
- Usar `useForm` de Inertia, post a `store` route

## 8. Frontend — Actualizar historia-clinica.tsx

- Cambiar quick action "Nueva consulta" de abrir drawer a:
  ```tsx
  onClick: () => router.visit(createRoute(paciente.id).url),
  ```
- Agregar sección "Vacunas" después del historial:
  - Card con historial de vacunas (tabla simple con nombre, fecha, lote, próxima dosis)
  - Botón "Registrar vacuna" que abre drawer con formulario
  - Props: `vacunas: Vacuna[]` desde el servidor

## 9. Frontend — Vacuna form drawer

`resources/js/pages/veterinaria/pacientes/components/registrar-vacuna-drawer.tsx`

Drawer lateral con:
- Vacuna (input)
- Lote (input)
- Fabricante (input)
- Fecha de aplicación (date)
- Próxima dosis (date, nullable)
- Observaciones (textarea)
- Submit → POST a `registrarVacuna`

## 10. Frontend — Types

Agregar a `types/consulta-medica.d.ts`:
```ts
export interface Vacuna {
    id: number;
    paciente_id: number;
    consulta_medica_id: number | null;
    vacuna: string;
    lote: string | null;
    fabricante: string | null;
    fecha_aplicacion: string;
    proxima_dosis: string | null;
    observaciones: string | null;
}
```

## 11. Limpieza

Eliminar `consulta-medica-form-drawer.tsx` (ya no se usa).
