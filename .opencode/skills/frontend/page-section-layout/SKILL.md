---
name: page-section-layout
description: "Define the hard skeleton structure for single-view section pages using PageSection as the main component. Use when creating a new index page, a section's main view, or any page that follows the standard app layout. Triggers when: building a section page, wiring a page to the sidebar, adding breadcrumbs, adding action buttons to a page header, or when frontend-react-builder scaffolds a new section."
license: MIT
compatibility: opencode
metadata:
    audience: maintainers
    workflow: github
---

# Page Section Layout

Esqueleto obligatorio para cualquier página principal de una sección en esta aplicación.
Toda vista principal (vista única de sección) DEBE seguir esta estructura sin excepción.

## Cuando aplicar

Activa este skill cuando:

- Se crea una nueva página `index.tsx`, `show.tsx`, `create.tsx` o `edit.tsx` para una sección o dominio
- El usuario pide "crear una página para [sección]"
- Se necesita añadir una vista al menú lateral (sidebar)
- Se añaden botones de acción al encabezado de una página
- El agente `frontend-react-builder` scaffolda cualquier nueva sección

---

## Paso 1 — Confirmar título y descripción

Si el usuario **no proporcionó** título ni descripción de la página, sugerirlos y preguntar:

> Propuesta de título: **"[Nombre de la sección]"**
> Propuesta de descripción: **"Gestión de [nombre de la sección] del sistema."**
> ¿Es correcto o deseas ajustarlos?

No avances al siguiente paso hasta tener confirmación (o si el usuario proporciona sus propios valores).

---

## Paso 2 — Estructura del archivo de página

La página utiliza `PageSection` como componente raíz **siempre**.

### Plantilla base (sin botones de acción)

```tsx
import PageSection from "@/components/blocks/page-section";

export default function [NombreSeccion]IndexPage() {
    return (
        <PageSection
            pageTitle="[Título de la sección]"
            pageDescription="[Descripción de la sección]"
            browserTitle="[Título para la pestaña del navegador]"
        >
            {/* Contenido principal */}
        </PageSection>
    );
}

[NombreSeccion]IndexPage.layout = {
    breadcrumbs: [
        {
            title: '[Grupo o módulo]',
        },
        {
            title: '[Nombre de la sección]',
            href: '#',
        },
    ],
};
```

### Plantilla con botones de acción

Cuando la sección requiere acciones principales (crear, exportar, configurar, etc.), declara
un subcomponente `ActionButtons` antes del componente principal y pásalo a `zoneActions`:

```tsx
import PageSection from "@/components/blocks/page-section";
import { Button } from "@/components/ui/button";
import { Plus, Cog } from "lucide-react";

const ActionButtons = () => {
    return (
        <>
            <Button size="sm" variant="outline">
                <Cog /> [Acción secundaria]
            </Button>
            <Button size="sm" variant="default">
                <Plus /> [Acción principal]
            </Button>
        </>
    );
};

export default function [NombreSeccion]IndexPage() {
    return (
        <PageSection
            pageTitle="[Título de la sección]"
            pageDescription="[Descripción de la sección]"
            browserTitle="[Título para la pestaña del navegador]"
            zoneActions={ActionButtons()}
        >
            {/* Contenido principal */}
        </PageSection>
    );
}

[NombreSeccion]IndexPage.layout = {
    breadcrumbs: [
        {
            title: '[Grupo o módulo]',
        },
        {
            title: '[Nombre de la sección]',
            href: '#',
        },
    ],
};
```

### Reglas de los botones de acción

- El botón de **acción principal** (crear, agregar) usa `variant="default"` y va al final (derecha).
- Los botones de **acciones secundarias** (exportar, configurar) usan `variant="outline"` y van antes.
- Siempre incluir un ícono de `lucide-react` junto al texto.
- Tamaño fijo `size="sm"` para todos los botones de la zona de acciones.

---

## Paso 3 — Breadcrumbs

Toda página DEBE declarar `[NombreComponente].layout` con los breadcrumbs al final del archivo.

- El primer elemento es el **grupo/módulo** (sin `href`).
- El último elemento es el **nombre de la sección actual** (con `href: '#'` si es la página activa).

---

## Paso 4 — Registrar en el sidebar (condicional)

Pregunta al usuario: **¿Esta sección debe aparecer en el menú lateral?**

Si la respuesta es sí, modificar `resources/js/components/app-sidebar.tsx` siguiendo el patrón existente:

### 4a. Importar la acción Wayfinder del controlador

```tsx
import { index as index[NombreSeccion] } from '@/actions/App/Http/Controllers/[NombreSeccion]Controller';
```

### 4b. Declarar el array de ítems de navegación

```tsx
const [nombreSeccion]NavItems: NavItem[] = [
    {
        title: '[Nombre visible en el menú]',
        href: index[NombreSeccion](),
        icon: [IconoDeLucide],
    },
];
```

### 4c. Agregar el grupo al `SidebarContent`

Dentro del bloque `{/* contenido del sidebar */}` añadir:

```tsx
<NavMain group='[Nombre del grupo]' items={[nombreSeccion]NavItems} />
```

### Reglas del sidebar

- Importar el ícono adecuado de `lucide-react` que represente semánticamente la sección.
- El nombre del grupo (`group`) agrupa visualmente secciones relacionadas. Reutilizar
  grupos existentes si la sección pertenece a uno ya declarado.
- El orden de los `<NavMain>` en el sidebar refleja la jerarquía de importancia (plataforma
  primero, luego módulos de negocio, luego ejemplos/utilidades).
- Usar Wayfinder (`@/actions/...`) para generar las URLs. Nunca usar rutas hardcodeadas.

---

## Referencia rápida de props de PageSection

| Prop              | Tipo              | Obligatorio | Descripción                                                      |
| ----------------- | ----------------- | ----------- | ---------------------------------------------------------------- |
| `children`        | `React.ReactNode` | ✅          | Contenido principal de la página                                 |
| `pageTitle`       | `string`          | —           | Título visible en el encabezado                                  |
| `pageDescription` | `string`          | —           | Subtítulo/descripción en el encabezado                           |
| `browserTitle`    | `string`          | —           | Título de la pestaña del navegador (si omitido, usa `pageTitle`) |
| `zoneActions`     | `React.ReactNode` | —           | Botones de acción en la esquina superior derecha                 |

---

## Archivo de referencia

- Componente base: `resources/js/components/blocks/page-section.tsx`
- Ejemplo completo de página: `resources/js/pages/ejemplo/un-dominio/index.tsx`
- Sidebar: `resources/js/components/app-sidebar.tsx`
