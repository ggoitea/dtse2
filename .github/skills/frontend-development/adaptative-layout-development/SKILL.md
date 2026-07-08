---
name: adaptative-layout-development
description: "MANDATORY DEFAULT LAYOUT for all new pages. Always activate this skill when scaffolding any new page (index.tsx, show.tsx, create.tsx, edit.tsx) or when the user asks to create a page, build a view, add mobile support, migrate an existing page, add a FAB, or add bottom navigation. This is the standard layout for the entire application — every new page must use AdaptiveLayout. Exceptions: auth pages (login, register), error pages (404, 500), and already-specialized system layouts. Triggers: any new page creation, 'adapt to mobile', 'migrate to AdaptiveLayout', 'responsive layout', 'mobile layout', 'FAB button', 'bottom nav'."
---

# Adaptive Layout Development

Este skill define cómo implementar el `AdaptiveLayout` en cualquier página de la aplicación para que sea completamente funcional tanto en móvil como en escritorio.

## Arquitectura del sistema

El layout detecta automáticamente si el usuario está en móvil o escritorio:

- **Escritorio**: renderiza `AppLayout` + `PageSection` (layout estándar con sidebar)
- **Móvil**: renderiza un layout oscuro con `Header`, `BottomNav`, y `FloatingActionButton` (FAB)

## Estructura de archivos del layout

```
resources/js/layouts/
├── adaptative-layout.tsx          ← componente principal (exporta AdaptiveLayout)
└── adaptative/
    ├── Header.tsx                 ← header fijo superior (ícono + título + acciones)
    ├── BottomNav.tsx              ← navegación fija inferior
    └── FloatingActionButton.tsx   ← FAB para acciones rápidas en móvil
```

## Paso 1 — Imports requeridos

```tsx
import { router } from '@inertiajs/react';
import { [IconoLucide], Plus } from 'lucide-react';
import { useRef, useState } from 'react';

import { AdaptiveTable } from '@/components/blocks/adaptive-table';
import type { CollectionData, DataTableRef } from '@/components/blocks/data-table';
import { usePermissions } from '@/hooks/use-permissions';
import { AdaptiveLayout } from '@/layouts/adaptative-layout';
import { create, index } from '@/routes/[modulo]';
import type { [Tipo] } from './types/[tipo]';
```

## Paso 2 — Plantilla base de una página index

```tsx
import { router } from '@inertiajs/react';
import { [IconoLucide], Plus } from 'lucide-react';
import { useRef, useState } from 'react';

import { AdaptiveTable } from '@/components/blocks/adaptive-table';
import type { CollectionData, DataTableRef } from '@/components/blocks/data-table';
import { usePermissions } from '@/hooks/use-permissions';
import { AdaptiveLayout } from '@/layouts/adaptative-layout';
import { create, index } from '@/routes/[modulo]';

import [Tipo]MobileCard from './components/index-mobile-card';
import { columns } from './components/index-columns';

type Props = {
    [items]: CollectionData<[Tipo]>;
};

export default function [Nombre]Index({ [items] }: Props) {
    const tableRef = useRef<DataTableRef>(null);
    const [processing, setProcessing] = useState(false);
    const { can } = usePermissions();

    const handlePageChange = (page: number) => {
        router.reload({
            onStart: () => setProcessing(true),
            data: { page },
            onFinish: () => setProcessing(false),
        });
    };

    const can_create = can('crear.[modulo]');

    const goToCreate = () => {
        router.visit(create.url());
    };

    const prefetchToCreate = () => {
        router.prefetch?.(create.url());
    };

    return (
        <AdaptiveLayout
            pageTitle="[Título visible]"
            pageDescription="[Descripción de la sección]"
            browserTitle="[Título de pestaña]"
            icon={[IconoLucide]}
            breadcrumbs={[{ title: '[Nombre del módulo]', href: index.url() }]}
            quickActions={[
                {
                    id: 'new-[item]',
                    label: 'Nuevo [Nombre]',
                    icon: Plus,
                    onClick: goToCreate,
                    prefetch: prefetchToCreate,
                    color: 'primary',
                    show: can_create,
                },
            ]}
        >
            <AdaptiveTable
                ref={tableRef}
                columns={columns}
                data={[items]}
                MobileTemplate={[Tipo]MobileCard}
                onPageChange={handlePageChange}
            />
        </AdaptiveLayout>
    );
}
```

> `AdaptiveTable` gestiona internamente el switch entre tabla de escritorio y cards de móvil — no se necesita `useIsMobile()` en la página.
> Para páginas con búsqueda y/o filtros, pasar `InputSimpleSearch` y `FilterPopover` dentro del prop `header` de `AdaptiveTable`. Ver skill `generate-a-table-in-the-view` para las plantillas completas.

## Paso 3 — Crear el componente MobileCard del módulo

Cada módulo necesita su propio template de card para móvil como prop `MobileTemplate` de `AdaptiveTable`. Acceder a los datos vía `row.original` con el tipo del modelo para mejor type-safety:

```tsx
// resources/js/pages/[modulo]/components/index-mobile-card.tsx
import type { Row } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';

import type { [Tipo] } from '../types/[tipo]';

export default function [Tipo]MobileCard({ row }: { row: Row<[Tipo]> }) {
    const item = row.original;

    return (
        <div className="group cursor-pointer rounded-2xl border border-border bg-muted p-5 transition-transform active:scale-[0.98]">
            <div className="mb-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <p className="truncate text-base font-semibold">
                        {item.[campo_principal]}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {item.[campo_secundario]}
                    </p>
                </div>
                <Badge variant="outline">{item.[campo_badge]}</Badge>
            </div>
            <div className="flex flex-col gap-1 border-t border-border pt-3 text-sm">
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">[Etiqueta]</span>
                    <span>{item.[campo_extra]}</span>
                </div>
            </div>
        </div>
    );
}
```

> Cuando una columna tiene un renderer especial en `index-columns.tsx` (ej. acciones con menú), usar `renderCell` importado de `@/components/blocks/mobile-grid`.
> Ver el skill `generate-a-table-in-the-view` para plantillas completas y el ejemplo canónico en `vigilancia/historial-ingresos/components/index-mobile-card.tsx`.

## Paso 4 — Props de AdaptiveLayout

| Prop | Tipo | Descripción |
|---|---|---|
| `pageTitle` | `string` | Título visible en header móvil y desktop |
| `pageDescription` | `string` | Subtítulo (solo desktop) |
| `browserTitle` | `string` | Título de la pestaña del navegador |
| `icon` | `ComponentType` | Ícono de lucide-react mostrado en el header móvil |
| `quickActions` | `QuickAction[]` | Acciones del FAB en móvil y botones en desktop |
| `breadcrumbs` | `{ title, href }[]` | Breadcrumbs del layout de escritorio |
| `children` | `ReactNode` | Contenido principal |
| `headerActions` | `ReactNode` | Acciones adicionales en el header móvil |
| `zoneActions` | `ReactNode` | Zona de acciones sobre el contenido en móvil |

## Paso 5 — Estructura de QuickAction

```tsx
interface QuickAction {
    id: string;           // identificador único
    label: string;        // texto del botón
    icon: LucideIcon;     // ícono de lucide-react
    onClick: () => void;  // acción al hacer clic
    prefetch?: () => void; // función de prefetch (onMouseOver en desktop, onTouchStart en móvil)
    color?: string;       // 'primary' | cualquier string (no tiene efecto funcional)
    show?: boolean;       // oculta la acción si es false
}
```

## Paso 6 — Búsqueda con `InputSimpleSearch`

Para páginas que necesitan búsqueda, pasar `InputSimpleSearch` dentro del prop `header` de `AdaptiveTable`. El componente gestiona su propio debounce interno (700 ms):

```tsx
import InputSimpleSearch from '@/components/blocks/input-simple-search';

// En la página:
const handleSearch = (value: string) => {
    tableRef.current?.resetPagination();
    router.reload({
        onStart: () => setProcessing(true),
        data: { ...filtros, buscar: value, page: 1 },
        onFinish: () => setProcessing(false),
    });
};

// En el JSX:
<AdaptiveTable
    ref={tableRef}
    columns={columns}
    data={items}
    MobileTemplate={ItemMobileCard}
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
```

> Activar el skill `generate-a-table-in-the-view` para obtener las plantillas completas con búsqueda y/o filtros avanzados.

## Navegación inferior (BottomNav)

El `BottomNav` usa el array `accesoRapido` de `resources/js/config/menu.tsx`. Para añadir una sección a la navegación inferior móvil, agregar un ítem al array:

```tsx
// resources/js/config/menu.tsx
import { index as [modulo]Index } from '@/routes/[modulo]';

export const accesoRapido: NavItemBottomMobile[] = [
    // ... ítems existentes ...
    {
        title: '[Nombre]',
        href: [modulo]Index(),
        icon: [IconoLucide],
        isActive: false,
        can: ['[permiso]'],
    },
];
```

## ⛔ PROHIBIDO — Nunca hagas esto

Estas reglas son **absolutas**. Violarlas invalida la implementación completa.

1. **NUNCA uses `AppLayout` o `PageSection` en páginas nuevas.** `AdaptiveLayout` los reemplaza por completo. Usar `PageSection` en una nueva página es un error crítico.
2. **NUNCA hardcodees URLs** (`href="/clientes"`). Siempre usar Wayfinder: `import { index } from '@/routes/[modulo]'`.
3. **NUNCA uses `DataTable` + `MobileGrid` separados en páginas nuevas.** Usar `AdaptiveTable` que gestiona el switch internamente.
4. **NUNCA omitas el componente `[tipo]-mobile-card.tsx`** en el directorio `components/` del módulo. Es la prop `MobileTemplate` requerida por `AdaptiveTable`.
5. **NUNCA uses strings hardcodeados para permisos** (`can('admin')`). Los permisos deben venir del backend como constantes o literales definidos. Verificar siempre con `usePermissions()`.
6. **NUNCA uses `<a href>` estándar para navegar**. Siempre `router.visit()` de Inertia.
7. **NUNCA pases `quickActions` vacío si la página tiene acciones**. Si hay una acción de creación, debe ir en `quickActions` — nunca como botón suelto fuera del layout.

---

## ✅ OBLIGATORIO — Siempre

Estos requisitos deben estar presentes en TODA página que use `AdaptiveLayout`:

1. **Pasar `breadcrumbs`** al layout con la ruta correcta usando Wayfinder.
2. **Usar `AdaptiveTable`** para cualquier listado — nunca `DataTable` + `MobileGrid` por separado.
3. **Crear `[tipo]-mobile-card.tsx`** en el directorio `components/` del módulo como prop `MobileTemplate`.
4. **Pasar `quickActions`** al layout con todas las acciones principales (crear, exportar, etc.).
5. **No hay ninguna URL hardcodeada** — todo usa Wayfinder (`@/routes/[modulo]`).
6. **La navegación usa `router.visit()`**, no `<a href>`.
7. **Respetar permisos con `can()`** del hook `usePermissions()` en el campo `show` de cada `QuickAction`.

---

## Este es el layout por defecto de la aplicación

> **`AdaptiveLayout` es el layout estándar para TODA página nueva de la aplicación.**
> No existe excepción para páginas de gestión de datos (index, show, create, edit).
>
> La única excepción son las páginas de autenticación (`/login`, `/register`, etc.),
> páginas de error (`404`, `500`) y vistas de configuración de sistema que ya usen
> un layout especializado. Cualquier otra página nueva **DEBE usar `AdaptiveLayout`**.

---

## Archivos de referencia

- Layout principal: `resources/js/layouts/adaptative-layout.tsx`
- Header móvil: `resources/js/layouts/adaptative/Header.tsx`
- FAB: `resources/js/layouts/adaptative/FloatingActionButton.tsx`
- Navegación inferior: `resources/js/layouts/adaptative/BottomNav.tsx`
- AdaptiveTable: `resources/js/components/blocks/adaptive-table.tsx`
- **Ejemplo canónico (index con búsqueda y filtros)**: `resources/js/pages/vigilancia/historial-ingresos/index.tsx`
- Card móvil de ejemplo: `resources/js/pages/vigilancia/historial-ingresos/components/index-mobile-card.tsx`
- Menú de acceso rápido: `resources/js/config/menu.tsx`

---

## Checklist de verificación — antes de cerrar la tarea

Antes de dar la tarea por finalizada, verificar que **todos** estos ítems estén cumplidos:

- [ ] La página importa y usa `AdaptiveLayout` como componente raíz
- [ ] Se usa `AdaptiveTable` para el listado (no `DataTable` + `MobileGrid` por separado)
- [ ] Se creó `[tipo]-mobile-card.tsx` en `components/` del módulo como `MobileTemplate`
- [ ] `quickActions` incluye todas las acciones principales con `show` ligado a permisos
- [ ] No hay ninguna URL hardcodeada — todo usa Wayfinder (`@/routes/[modulo]`)
- [ ] No se importa `PageSection` ni `AppLayout` en el archivo
- [ ] La navegación usa `router.visit()`, no `<a href>`

