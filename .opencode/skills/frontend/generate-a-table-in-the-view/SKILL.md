---
name: generate-a-table-in-the-view
description: 'Genera una tabla con paginación server-side en cualquier vista de un módulo (index.tsx, show.tsx u otras). Activar cuando se pida crear una tabla, listado o vista con DataTable. Preguntar siempre en qué vista va, si tendrá búsqueda simple y/o filtros avanzados antes de generar. Crea: {vista}.tsx, components/{vista}-columns.tsx, components/{vista}-row-actions.tsx.'
license: MIT
compatibility: opencode
metadata:
    audience: maintainers
    workflow: github
---

# Generar tabla en la vista

## Cuando usar este skill

Actívalo cuando el usuario pida:

- Crear una tabla o listado en cualquier vista (index, show, u otras)
- Generar una vista con tabla y paginación
- Agregar una tabla con o sin filtros a un módulo

---

## Paso 0 — Preguntar antes de generar

**Antes de escribir cualquier código, hacer estas preguntas obligatorias:**

1. **¿En qué vista va la tabla?** (ej. `index`, `show`, `reporte`, `historial`) — determina el nombre de los archivos
2. **¿Cuál es el nombre del modelo/entidad que lista la tabla?** (ej. `Paciente`, `Turno`)
3. **¿Qué columnas debe mostrar la tabla?** (ej. `nombre`, `email`, `estado`)
4. **¿Tendrá búsqueda rápida (campo de texto para buscar)?** (InputSimpleSearch — opcional)
5. **¿Tendrá filtros avanzados?** (FilterPopover — siempre preguntar)
    - Si sí: **¿Qué campos son filtrables y qué tipo de control usa cada uno?**
        - `Select` → lista de opciones fijas
        - `Input type="number"` → valor numérico
        - `Input type="text"` → texto libre
        - `DatePicker` → fecha
6. **¿Qué acciones tendrá cada fila?** (ej. Ver, Editar, Eliminar)
7. **¿Qué información clave se debe mostrar en la tarjeta mobile?** (máx. 3-4 campos; es la vista resumida que verán los usuarios en celular)

> No generar ningún archivo hasta tener respuestas a todas las preguntas.

---

## Estructura de archivos

El nombre de los archivos de componentes se deriva del nombre de la vista (`{vista}`):

```
resources/js/pages/{contexto}/{dominio}/
├── {vista}.tsx                          ← página donde vive la tabla
└── components/
    ├── {vista}-columns.tsx              ← definición de columnas
    ├── {vista}-row-actions.tsx          ← acciones por fila (siempre)
    └── {vista}-mobile-card.tsx          ← template card para móvil (siempre)
```

**Ejemplos según vista:**

| Vista       | Archivo principal | Columnas                | Acciones fila               | Template móvil              |
| ----------- | ----------------- | ----------------------- | --------------------------- | --------------------------- |
| `index`     | `index.tsx`       | `index-columns.tsx`     | `index-row-actions.tsx`     | `index-mobile-card.tsx`     |
| `show`      | `show.tsx`        | `show-columns.tsx`      | `show-row-actions.tsx`      | `show-mobile-card.tsx`      |
| `historial` | `historial.tsx`   | `historial-columns.tsx` | `historial-row-actions.tsx` | `historial-mobile-card.tsx` |

> Nombres de carpetas y archivos en español, separados por guion medio.

> Si la tabla está **embebida dentro de una vista existente** (ej. una sección dentro de `show.tsx`), solo crear `{vista}-columns.tsx`, `{vista}-row-actions.tsx` y `{vista}-mobile-card.tsx` en `components/` e importarlos en el archivo ya existente.

---

## Componentes base utilizados

| Componente                                                 | Import                                    | Siempre                          |
| ---------------------------------------------------------- | ----------------------------------------- | -------------------------------- |
| `AdaptiveTable`                                            | `@/components/blocks/adaptive-table`      | ✅                               |
| `CollectionData`, `DataTableRef`                           | `@/components/blocks/data-table`          | ✅                               |
| `renderCell`                                               | `@/components/blocks/mobile-grid`         | Solo si se usa en MobileTemplate |
| `InputSimpleSearch`                                        | `@/components/blocks/input-simple-search` | Solo si hay búsqueda             |
| `FilterPopover`, `FilterComponentProps`, `FilterItemProps` | `@/components/blocks/filter-popover`      | Solo si hay filtros              |
| `FieldGroup`, `Field`, `FieldLabel`                        | `@/components/ui/field`                   | Solo si hay filtros              |

> `AdaptiveTable` maneja internamente el switch móvil/desktop (usa `useIsMobile()` y decide si renderiza la tabla o la grilla de cards). No tiene props de búsqueda ni de estado de carga — esas responsabilidades las asume `InputSimpleSearch` que se pasa dentro del prop `header`.
> El MobileTemplate puede acceder a los datos vía `row.original` (acceso directo al objeto) o via `renderCell(row, 'columna')` (delega al renderer de TanStack). Preferir `row.original` cuando se necesita lógica condicional basada en los datos.

---

## Plantilla: `{vista}.tsx`

### Sin búsqueda ni filtros

```tsx
import { router } from '@inertiajs/react';
import { [IconoLucide] } from 'lucide-react';
import { useRef, useState } from 'react';

import { AdaptiveTable } from '@/components/blocks/adaptive-table';
import type { CollectionData, DataTableRef } from '@/components/blocks/data-table';
import { AdaptiveLayout } from '@/layouts/adaptative-layout';
import { index } from '@/routes/{modulo}';
import type { {Modelo} } from './{vista}/types/{tipo}';

import { columns } from './components/{vista}-columns';
import {Modelo}MobileCard from './components/{vista}-mobile-card';

interface Props {
    {modelos}: CollectionData<{Modelo}>;
}

export default function {Modelo}{Vista}Page({ {modelos} }: Props) {
    const tableRef = useRef<DataTableRef>(null);
    const [processing, setProcessing] = useState(false);

    const handlePageChange = (page: number) => {
        router.reload({
            onStart: () => setProcessing(true),
            data: { page },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AdaptiveLayout
            pageTitle="{Título de la página}"
            pageDescription="{Descripción breve}"
            browserTitle="{Título del navegador}"
            icon={[IconoLucide]}
            breadcrumbs={[{ title: '{Nombre de la vista}', href: index.url() }]}
        >
            <AdaptiveTable
                ref={tableRef}
                columns={columns}
                data={{modelos}}
                MobileTemplate={{Modelo}MobileCard}
                onPageChange={handlePageChange}
            />
        </AdaptiveLayout>
    );
}
```

---

### Con búsqueda rápida (sin filtros avanzados)

Pasar `InputSimpleSearch` dentro del prop `header` de `AdaptiveTable`. El componente `InputSimpleSearch` ya gestiona su propio debounce interno (700 ms) — no se necesita `useDebouncer` en la página.

```tsx
import { router } from '@inertiajs/react';
import { [IconoLucide] } from 'lucide-react';
import { useRef, useState } from 'react';

import { AdaptiveTable } from '@/components/blocks/adaptive-table';
import type { CollectionData, DataTableRef } from '@/components/blocks/data-table';
import InputSimpleSearch from '@/components/blocks/input-simple-search';
import { AdaptiveLayout } from '@/layouts/adaptative-layout';
import { index } from '@/routes/{modulo}';
import type { {Modelo} } from './{vista}/types/{tipo}';

import { columns } from './components/{vista}-columns';
import {Modelo}MobileCard from './components/{vista}-mobile-card';

interface Props {
    {modelos}: CollectionData<{Modelo}>;
    filtros: {
        buscar: string | null;
    };
}

export default function {Modelo}{Vista}Page({ filtros, {modelos} }: Props) {
    const tableRef = useRef<DataTableRef>(null);
    const [processing, setProcessing] = useState(false);

    const handleSearch = (value: string) => {
        tableRef.current?.resetPagination();
        router.reload({
            onStart: () => setProcessing(true),
            data: { ...filtros, buscar: value, page: 1 },
            onFinish: () => setProcessing(false),
        });
    };

    const handlePageChange = (page: number) => {
        router.reload({
            onStart: () => setProcessing(true),
            data: { page },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AdaptiveLayout
            pageTitle="{Título}"
            pageDescription="{Descripción}"
            browserTitle="{Título del navegador}"
            icon={[IconoLucide]}
            breadcrumbs={[{ title: '{Nombre de la vista}', href: index.url() }]}
        >
            <AdaptiveTable
                ref={tableRef}
                columns={columns}
                data={{modelos}}
                MobileTemplate={{Modelo}MobileCard}
                onPageChange={handlePageChange}
                header={
                    <InputSimpleSearch
                        className="max-w-xs"
                        placeholder="Buscar..."
                        value={filtros.buscar ?? ''}
                        processing={processing}
                        onSearch={handleSearch}
                    />
                }
            />
        </AdaptiveLayout>
    );
}
```

---

### Con búsqueda rápida Y filtros avanzados (caso completo)

`InputSimpleSearch` y `FilterPopover` van juntos dentro del prop `header` de `AdaptiveTable`. El layout del header es un `div` flex que los alinea horizontalmente.

```tsx
import { router } from '@inertiajs/react';
import { [IconoLucide] } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';

import { AdaptiveTable } from '@/components/blocks/adaptive-table';
import type { CollectionData, DataTableRef } from '@/components/blocks/data-table';
import FilterPopover, {
    type FilterComponentProps,
    type FilterItemProps,
} from '@/components/blocks/filter-popover';
import InputSimpleSearch from '@/components/blocks/input-simple-search';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
// Importar controles UI según los filtros definidos (Select, Input, etc.)
import { AdaptiveLayout } from '@/layouts/adaptative-layout';
import { index } from '@/routes/{modulo}';
import type { {Modelo} } from './{vista}/types/{tipo}';

import { columns } from './components/{vista}-columns';
import {Modelo}MobileCard from './components/{vista}-mobile-card';

// ── Componentes de filtro ──────────────────────────────────────────────
// Un componente por cada campo filtrable. Ejemplo con Select:
const {Campo}Filter = ({ onValueChange, value }: FilterComponentProps) => (
    <FieldGroup>
        <Field>
            <FieldLabel>{Etiqueta}</FieldLabel>
            <Select value={value ?? ''} onValueChange={onValueChange}>
                <SelectTrigger>
                    <SelectValue placeholder="Selecciona..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="opcion1">Opción 1</SelectItem>
                    <SelectItem value="opcion2">Opción 2</SelectItem>
                </SelectContent>
            </Select>
        </Field>
    </FieldGroup>
);

// ── Props ──────────────────────────────────────────────────────────────
interface Props {
    {modelos}: CollectionData<{Modelo}>;
    filtros: {
        buscar: string | null;
        {campo1}?: string | null;
        // Un campo por cada filtro avanzado
    };
}

// ── Página ─────────────────────────────────────────────────────────────
export default function {Modelo}{Vista}Page({ filtros, {modelos} }: Props) {
    const tableRef = useRef<DataTableRef>(null);
    const [processing, setProcessing] = useState(false);

    // Definir un item por cada filtro avanzado
    const componentesDeFiltro: FilterItemProps[] = useMemo(
        () => [
            {
                key: '{campo1}',
                value: filtros.{campo1} ?? null,
                component: {Campo}Filter,
            },
            // ...agregar más filtros
        ],
        [filtros],
    );

    // InputSimpleSearch maneja debounce internamente (700 ms)
    const handleSearch = (value: string) => {
        tableRef.current?.resetPagination();
        router.reload({
            onStart: () => setProcessing(true),
            data: { ...filtros, buscar: value, page: 1 },
            onFinish: () => setProcessing(false),
        });
    };

    // onApply recibe todos los filtros del popover de una vez (sin debounce)
    const handleApplyFilters = (data: Record<string, string | number | null>) => {
        tableRef.current?.resetPagination();
        router.reload({
            onStart: () => setProcessing(true),
            data: { ...filtros, ...data, page: 1 },
            onFinish: () => setProcessing(false),
        });
    };

    const handlePageChange = (page: number) => {
        router.reload({
            onStart: () => setProcessing(true),
            data: { page },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AdaptiveLayout
            pageTitle="{Título}"
            pageDescription="{Descripción}"
            browserTitle="{Título del navegador}"
            icon={[IconoLucide]}
            breadcrumbs={[{ title: '{Nombre de la vista}', href: index.url() }]}
        >
            <AdaptiveTable
                ref={tableRef}
                columns={columns}
                data={{modelos}}
                MobileTemplate={{Modelo}MobileCard}
                onPageChange={handlePageChange}
                header={
                    <div className="flex w-full flex-row items-center justify-between gap-4">
                        <InputSimpleSearch
                            className="max-w-xs"
                            placeholder="Buscar..."
                            value={filtros.buscar ?? ''}
                            processing={processing}
                            onSearch={handleSearch}
                        />
                        <FilterPopover
                            items={componentesDeFiltro}
                            onApply={handleApplyFilters}
                        />
                    </div>
                }
            />
        </AdaptiveLayout>
    );
}
```

---

## Plantilla: `components/{vista}-mobile-card.tsx`

Cada módulo necesita su propio template de card para móvil. Hay dos formas de acceder a los datos:

- **`row.original`** — acceso directo al objeto tipado. Preferir cuando se necesita lógica condicional o formateo basado en los datos.
- **`renderCell(row, 'columna')`** — delega el render al renderer de TanStack Table (usa la definición de la columna). Útil cuando la columna ya tiene un renderer personalizado (ej. badges, acciones).

```tsx
import type { Row } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';

import type { {Modelo} } from '../types/{tipo}';

export default function {Modelo}MobileCard({ row }: { row: Row<{Modelo}> }) {
    const item = row.original;

    return (
        <div className="group cursor-pointer rounded-2xl border border-border bg-muted p-5 transition-transform active:scale-[0.98]">
            {/* Encabezado: campo principal + badge de estado */}
            <div className="mb-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <p className="truncate text-base font-semibold">
                        {item.{campo_principal}}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {item.{campo_secundario}}
                    </p>
                </div>
                <Badge variant="outline">{item.{campo_estado}.label}</Badge>
            </div>

            {/* Detalle */}
            <div className="flex flex-col gap-1 border-t border-border pt-3 text-sm">
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{Etiqueta}</span>
                    <span>{item.{campo_extra}}</span>
                </div>
            </div>
        </div>
    );
}
```

**Notas:**

- Nombrar el archivo `{vista}-mobile-card.tsx` (no `mobile-grid`).
- Solo incluir los campos más importantes para la vista resumida en mobile (máx. 4-5 campos).
- Cuando una columna tiene un renderer especial en `{vista}-columns.tsx` (ej. acciones, badges con lógica), usar `renderCell` importado de `@/components/blocks/mobile-grid`.

**Ejemplo real** (`vigilancia/historial-ingresos/components/index-mobile-card.tsx`):

```tsx
import type { Row } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';

import type { Acceso } from '../types/acceso';

export default function AccesoMobileCard({ row }: { row: Row<Acceso> }) {
    const acceso = row.original;
    const isIngreso = acceso.movimiento.value === 'ingreso';

    return (
        <div className="border-border bg-muted group cursor-pointer rounded-2xl border p-5 transition-transform active:scale-[0.98]">
            <div className="mb-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <p className="truncate text-base font-semibold">
                        {acceso.nombre ?? '-'}
                    </p>
                    <p className="text-muted-foreground text-sm">
                        DNI: {acceso.dni ?? '-'}
                    </p>
                </div>
                <Badge
                    className={
                        isIngreso
                            ? 'shrink-0 bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400'
                            : 'shrink-0 bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400'
                    }
                    variant="outline"
                >
                    {acceso.movimiento.label}
                </Badge>
            </div>
            <div className="border-border flex flex-col gap-1 border-t pt-3 text-sm">
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Fecha y hora</span>
                    <span>
                        {acceso.fecha ?? '-'}{' '}
                        {acceso.hora ? `· ${acceso.hora}` : ''}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Propiedad</span>
                    <span>
                        L{acceso.propiedad.lote} M{acceso.propiedad.manzana}
                    </span>
                </div>
            </div>
        </div>
    );
}
```

---

## Plantilla: `components/{vista}-columns.tsx`

```tsx
import type { ColumnDef } from '@tanstack/react-table';
import type { {Modelo} } from '@/types';
import {Vista}RowActions from './{vista}-row-actions';

export const columns: ColumnDef<{Modelo}>[] = [
    {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => <{Vista}RowActions {modelo}={row.original} />,
    },
    {
        accessorKey: 'id',
        header: 'ID',
    },
    // Un objeto por cada columna definida en Paso 0
    {
        accessorKey: '{campo}',
        header: '{Etiqueta}',
    },
];
```

---

## Plantilla: `components/{vista}-row-actions.tsx`

```tsx
import type { {Modelo} } from '@/types';

interface Props {
    {modelo}: {Modelo};
}

export default function {Vista}RowActions({ {modelo} }: Props) {
    return (
        <div className="flex items-center gap-2">
            {/* Agregar botones de acción según Paso 0 */}
        </div>
    );
}
```

---

## Reglas de nomenclatura

| Concepto                        | Regla                                 | Ejemplo                                   |
| ------------------------------- | ------------------------------------- | ----------------------------------------- |
| Nombre de carpeta               | Español, guion medio, minúsculas      | `tabla-de-pacientes`                      |
| Nombre de archivo               | Español, guion medio, minúsculas      | `index-columns.tsx`, `show-columns.tsx`   |
| Nombre del componente de página | PascalCase + `{Vista}Page`            | `PacienteIndexPage`, `PacienteShowPage`   |
| Nombre de la card móvil         | Español + `MobileCard`                | `AccesoMobileCard`, `PropiedadMobileCard` |
| Prop del array de datos         | camelCase plural del modelo           | `pacientes`                               |
| Prop del objeto de filtros      | siempre `filtros`                     | `filtros`                                 |
| Clave en `componentesDeFiltro`  | camelCase igual al campo en `filtros` | `estado`, `genero`                        |

---

## Reglas de comportamiento (no negociables)

1. **`AdaptiveTable` es el único componente permitido para mostrar listados** — nunca usar `DataTable` + `TableSection` directamente en una página nueva.
2. **`{vista}-mobile-card.tsx` siempre se crea** junto a `{vista}-columns.tsx` — es la prop `MobileTemplate` requerida por `AdaptiveTable`.
3. **`processing`** se pasa a `InputSimpleSearch` (no a `AdaptiveTable`). `AdaptiveTable` no acepta esta prop.
4. **`tableRef.current?.resetPagination()`** se llama antes de cada `router.reload` que cambie un filtro o búsqueda (no en `handlePageChange`).
5. **`onApply`** del `FilterPopover` siempre conecta a `handleApplyFilters`, nunca a `console.log`.
6. **`componentesDeFiltro`** siempre usa `useMemo` con `[filtros]` como dependencia (más las props de opciones que usen los componentes de filtro).
7. **`CollectionData<T>`** es el tipo del array de datos (incluye `data` y `meta` con paginación).
8. **`{vista}-row-actions.tsx`** siempre se crea, aunque las acciones estén vacías.
9. **`InputSimpleSearch` maneja debounce internamente** (700 ms). No usar `useDebouncer` en la página para la búsqueda — basta con pasar `onSearch` al componente.
10. **`FilterPopover` e `InputSimpleSearch` van dentro del prop `header`** de `AdaptiveTable`. El prop `header` acepta cualquier `ReactNode` y se renderiza como cabecera de la tabla.
