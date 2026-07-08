---
name: frontend-http-requests
description: 'Gestiona peticiones HTTP al backend en frontend Inertia + React. Activar cuando se pida: enviar un formulario, crear/editar/eliminar registros, redirigir, recargar datos o hacer peticiones AJAX. Cubre: useForm (POST/PUT/PATCH/DELETE), router.visit(), router.reload(), useHttp, siempre con Wayfinder para rutas.'
license: MIT
compatibility: opencode
metadata:
    audience: maintainers
    workflow: github
---

# Frontend HTTP Requests

## Cuando usar este skill

Actívalo cuando el usuario pida:

- Enviar un formulario (crear, editar, eliminar)
- Redirigir a otra página
- Recargar datos de la vista actual
- Hacer peticiones AJAX sin redirección (useHttp)
- Conectar un botón/acción a un endpoint del backend

---

## Paso 0 — Preguntar antes de generar

**Hacer estas preguntas antes de escribir código:**

1. **¿Qué tipo de petición necesita?**
    - Formulario con envío de datos → `useForm` (POST / PUT / PATCH / DELETE)
    - Solo navegación o recarga → `router.visit()` / `router.reload()`
    - Petición asíncrona sin redirección → `useHttp`
2. **¿Cuál es la ruta/acción del backend?** (para obtener el import de Wayfinder)
3. **¿Qué debe pasar al completarse con éxito?** (`onSuccess`)
    - Redirigir a otra ruta → `router.visit(ruta.url())`
    - Recargar datos de la misma vista → `router.reload()`
    - Cerrar modal / limpiar estado / otra acción local

> No generar nada hasta tener respuestas claras.

---

## Regla fundamental: Wayfinder para TODAS las rutas

**Nunca usar strings hardcodeados como URLs.** Siempre importar desde `@/actions/` o `@/routes/`.

```ts
// ✅ Correcto
import {
    store,
    update,
    destroy,
} from '@/actions/App/Http/Controllers/PacienteController';
import { show } from '@/routes/paciente';

// ❌ Incorrecto
form.post('/pacientes');
router.visit('/pacientes/1');
```

| Necesito                 | Método Wayfinder                               |
| ------------------------ | ---------------------------------------------- |
| URL como string          | `.url()` → `store.url()`                       |
| Atributos para `<Form>`  | `.form()` → `store.form()`                     |
| Objeto `{ url, method }` | directamente → `store()`                       |
| Con parámetros de ruta   | `update.url(id)`                               |
| Con query params         | `store.url(undefined, { query: { page: 1 } })` |

---

## Caso 1: Formularios con `useForm`

### Cuándo usar

Cuando la vista necesita enviar datos al backend: crear, editar, eliminar registros.

### Estructura obligatoria

**1. Definir la interface del formulario**

```ts
interface {Modelo}Form {
    nombre: string;
    email: string;
    // Un campo por cada dato que se envía al backend
}
```

**2. Definir `defaultForm`**

Función que devuelve el estado inicial. Recibe el modelo cuando se edita, `null` cuando se crea.

```ts
// Crear (sin modelo)
const defaultForm = (): {Modelo}Form => ({
    nombre: '',
    email: '',
});

// Editar (con modelo existente)
const defaultForm = ({modelo}: {Modelo} | null): {Modelo}Form => ({
    nombre: {modelo}?.nombre ?? '',
    email: {modelo}?.email ?? '',
});
```

**3. Inicializar `useForm`**

```ts
const form = useForm<{Modelo}Form>(defaultForm());
// O al editar:
const form = useForm<{Modelo}Form>(defaultForm({modelo}));
```

**4. Handler de envío**

```ts
// POST — crear
const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.post(store.url(), {
        onSuccess: () => router.visit(index.url()),
        // onSuccess: () => router.reload(),    ← si se queda en la misma vista
    });
};

// PUT — reemplazar completo
const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.put(update.url({ modelo }.id), {
        onSuccess: () => router.visit(show.url({ modelo }.id)),
    });
};

// PATCH — actualización parcial
const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.patch(update.url({ modelo }.id), {
        onSuccess: () => router.reload(),
    });
};

// DELETE — eliminar
const handleDelete = () => {
    form.delete(destroy.url({ modelo }.id), {
        onSuccess: () => router.visit(index.url()),
    });
};
```

### Plantilla completa (crear/editar)

```tsx
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { store, update } from '@/actions/App/Http/Controllers/{Modulo}/{Modelo}Controller';
import { index } from '@/routes/{modulo}';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import type { {Modelo} } from '@/types';

// ── Tipos ─────────────────────────────────────────────────────────────
interface {Modelo}Form {
    nombre: string;
    // ...campos del formulario
}

// ── Estado inicial ─────────────────────────────────────────────────────
const defaultForm = ({modelo}: {Modelo} | null = null): {Modelo}Form => ({
    nombre: {modelo}?.nombre ?? '',
    // ...
});

// ── Componente ─────────────────────────────────────────────────────────
interface Props {
    {modelo}?: {Modelo};
}

export default function {Modelo}Form({ {modelo} }: Props) {
    const isEditing = !!{modelo};
    const form = useForm<{Modelo}Form>(defaultForm({modelo} ?? null));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            form.put(update.url({modelo}.id), {
                onSuccess: () => router.visit(index.url()),
            });
        } else {
            form.post(store.url(), {
                onSuccess: () => router.visit(index.url()),
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                    id="nombre"
                    value={form.data.nombre}
                    onChange={(e) => form.setData('nombre', e.target.value)}
                />
                <InputError message={form.errors.nombre} />
            </div>

            <Button type="submit" disabled={form.processing}>
                {form.processing ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
            </Button>
        </form>
    );
}
```

### Plantilla: acción DELETE (botón simple)

```tsx
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { destroy } from '@/actions/App/Http/Controllers/{Modulo}/{Modelo}Controller';
import { index } from '@/routes/{modulo}';

interface Props {
    {modelo}Id: number;
}

export default function Delete{Modelo}Button({ {modelo}Id }: Props) {
    const form = useForm({});

    const handleDelete = () => {
        form.delete(destroy.url({modelo}Id), {
            onSuccess: () => router.visit(index.url()),
        });
    };

    return (
        <Button variant="destructive" onClick={handleDelete} disabled={form.processing}>
            Eliminar
        </Button>
    );
}
```

---

## Caso 2: Navegación con `router`

### Cuándo usar

- Redirecciones programáticas (sin envío de datos)
- Recargar datos de la vista actual tras una acción (con `useState` para el processing)
- Navegar al hacer clic en un botón de acción

### `router.visit()` — navegar a otra ruta

```ts
import { router } from '@inertiajs/react';
import { show } from '@/routes/{modulo}';

// Navegar
router.visit(show.url(id));

// Con opciones
router.visit(show.url(id), {
    method: 'get', // siempre get para visitas
    preserveScroll: true, // mantener posición del scroll
});
```

### `router.reload()` — recargar datos sin navegar

```ts
import { router } from '@inertiajs/react';
import { useState } from 'react';

const [processing, setProcessing] = useState(false);

router.reload({
    onStart: () => setProcessing(true),
    data: { page: 1, search: valor }, // parámetros enviados como query
    onFinish: () => setProcessing(false),
});
```

> Para GET (búsquedas, filtros, paginación) **siempre** usar `router.reload()` o `router.visit()`, **nunca** `useForm`.

---

## Caso 3: Peticiones AJAX con `useHttp`

### Cuándo usar

Solo cuando se necesita una petición asíncrona **sin redirección ni recarga de página**:
cargar datos extra, toggle inline, acciones parciales de UI que solo actualizan estado local.

```tsx
import { useHttp } from '@inertiajs/react';
import { toggle } from '@/actions/App/Http/Controllers/{Modulo}/{Modelo}Controller';

const http = useHttp();
const [loading, setLoading] = useState(false);

const handleToggle = async () => {
    setLoading(true);
    await http.patch(toggle.url({ modelo }.id));
    setLoading(false);
    // Actualizar estado local o recargar con router.reload()
};
```

---

## Errores de validación

Los errores vienen del backend vía Inertia. **Siempre** mostrar con el componente `InputError`, colocado inmediatamente después del campo correspondiente. **Nunca** usar `<p className="text-sm text-red-500">` ni ningún otro elemento inline.

```tsx
import InputError from '@/components/input-error';
```

### Patrón 1: `useForm` sin destructurar

Cuando se usa `const form = useForm(...)`, acceder a los errores como `form.errors.campo`:

```tsx
const form = useForm<PacienteForm>(defaultForm());

// En el JSX — junto al campo
<Input
    value={form.data.nombre}
    onChange={(e) => form.setData('nombre', e.target.value)}
/>
<InputError message={form.errors.nombre} />
```

### Patrón 2: `useForm` destructurado

Cuando se destructura `useForm`, `errors` está disponible directamente:

```tsx
const { data, setData, errors, setError, clearErrors, reset } = useForm<PropiedadForm>({
    lote: '',
    manzana: '',
});

// En el JSX — junto al campo
<Input
    value={data.lote}
    onChange={(e) => setData('lote', e.target.value)}
/>
<InputError message={errors.lote} />
```

> `InputError` recibe `message: string | undefined` y no renderiza nada si el valor es `undefined`.

### ❌ Patrón prohibido

```tsx
// ❌ NUNCA hacer esto — no usar <p> inline para errores
{
    errors.campo && <p className="text-sm text-red-500">{errors.campo}</p>;
}

// ✅ Siempre usar InputError
<InputError message={errors.campo} />;
```

---

## Estado de carga (`processing`)

| Situación                                           | Usar                                                  |
| --------------------------------------------------- | ----------------------------------------------------- |
| Formulario con `useForm`                            | `form.processing` (vinculado al submit)               |
| Acción de fila / botón suelto con `router.reload()` | `useState<boolean>(false)` con `onStart` / `onFinish` |
| Petición con `useHttp`                              | `useState<boolean>(false)` manual                     |

```tsx
// Con useForm (automático)
<Button disabled={form.processing}>Guardar</Button>;

// Con router.reload() (manual)
const [processing, setProcessing] = useState(false);
router.reload({
    onStart: () => setProcessing(true),
    onFinish: () => setProcessing(false),
});
<Button disabled={processing}>Actualizar</Button>;
```

---

## Reglas de comportamiento (no negociables)

1. **Wayfinder siempre** — ninguna URL como string hardcodeado.
2. **GET nunca con `useForm`** — usar `router.visit()` o `router.reload()`.
3. **`onSuccess` siempre definido** — preguntar al usuario si redirige o recarga; nunca omitir.
4. **`defaultForm` siempre definida** — aunque todos los campos sean vacíos; facilita el reset.
5. **Interface del form siempre tipada** — `useForm<{Modelo}Form>(...)`, nunca `useForm<any>`.
6. **`InputError` es el único componente para errores de validación** — colocarlo junto al campo (`form.errors.{campo}` o `errors.{campo}` si se destructura `useForm`). Nunca usar `<p>` inline para mensajes de error.
7. **`useHttp`** solo para acciones parciales de UI que NO requieren redirección ni recarga completa.
