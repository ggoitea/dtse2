# Plan: Corregir frontend mascotas.tsx

Reemplazar `Table` raw por `AdaptiveTable` en `resources/js/pages/comercial/clientes/mascotas.tsx`.

## Archivos a crear

### 1. `resources/js/pages/comercial/clientes/components/mascotas-columns.tsx`

```tsx
import type { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';

import type { Paciente } from '../../veterinaria/pacientes/types';
import { CASTRADO_LABELS, ESPECIE_LABELS } from '../../veterinaria/pacientes/types';

export const columns: ColumnDef<Paciente>[] = [
    {
        accessorKey: 'nombre',
        header: 'Nombre',
        cell: ({ row }) =>
            row.original.nombre ?? (
                <span className="text-muted-foreground italic">Sin nombre</span>
            ),
    },
    {
        accessorKey: 'especie_tipo',
        header: 'Especie',
        cell: ({ row }) =>
            row.original.especie_tipo
                ? ESPECIE_LABELS[row.original.especie_tipo]
                : '—',
    },
    {
        accessorKey: 'raza',
        header: 'Raza',
        cell: ({ row }) => row.original.raza ?? '—',
    },
    {
        accessorKey: 'esta_castrado',
        header: 'Castrado/a',
        cell: ({ row }) => CASTRADO_LABELS[row.original.esta_castrado],
    },
    {
        id: 'estado',
        header: 'Estado',
        cell: ({ row }) =>
            row.original.esta_internado ? (
                <Badge className="bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
                    Internado
                </Badge>
            ) : (
                <Badge variant="secondary">Alta</Badge>
            ),
    },
];
```

### 2. `resources/js/pages/comercial/clientes/components/mascotas-row-actions.tsx`

```tsx
import type { Paciente } from '../../veterinaria/pacientes/types';

interface Props {
    paciente: Paciente;
}

export default function MascotasRowActions({ paciente: _paciente }: Props) {
    return null;
}
```

### 3. `resources/js/pages/comercial/clientes/components/mascotas-mobile-card.tsx`

```tsx
import type { Row } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';

import type { Paciente } from '../../veterinaria/pacientes/types';
import { CASTRADO_LABELS, ESPECIE_LABELS } from '../../veterinaria/pacientes/types';

export default function MascotasMobileCard({ row }: { row: Row<Paciente> }) {
    const p = row.original;

    return (
        <div className="group cursor-pointer rounded-2xl border border-border bg-muted p-5 transition-transform active:scale-[0.98]">
            <div className="mb-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <p className="truncate text-base font-semibold">
                        {p.nombre ?? (
                            <span className="text-muted-foreground italic">Sin nombre</span>
                        )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {p.especie_tipo ? ESPECIE_LABELS[p.especie_tipo] : '—'}
                        {p.raza ? ` · ${p.raza}` : ''}
                    </p>
                </div>
                {p.esta_internado ? (
                    <Badge className="shrink-0 bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
                        Internado
                    </Badge>
                ) : (
                    <Badge variant="secondary" className="shrink-0">
                        Alta
                    </Badge>
                )}
            </div>
            <div className="flex flex-col gap-1 border-t border-border pt-3 text-sm">
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Castrado/a</span>
                    <span>{CASTRADO_LABELS[p.esta_castrado]}</span>
                </div>
            </div>
        </div>
    );
}
```

## Archivo a modificar

### 4. `resources/js/pages/comercial/clientes/mascotas.tsx`

**Eliminar** estos imports:
```ts
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
```

**Agregar** estos imports:
```ts
import { AdaptiveTable } from '@/components/blocks/adaptive-table';
import type { CollectionData } from '@/components/blocks/data-table';

import { columns } from './components/mascotas-columns';
import MascotasMobileCard from './components/mascotas-mobile-card';
```

**Dentro del componente**, antes del return, convertir el array plano a CollectionData:
```ts
const pacientesData: CollectionData<Paciente> = {
    data: cliente.pacientes,
    meta: {
        total: cliente.pacientes.length,
        per_page: cliente.pacientes.length,
        current_page: 1,
        last_page: 1,
        path: '',
        from: 1,
        to: cliente.pacientes.length,
    },
};
```

**Reemplazar** el bloque `<Table>...</Table>` (líneas 83-136) por:
```tsx
<AdaptiveTable
    columns={columns}
    data={pacientesData}
    MobileTemplate={MascotasMobileCard}
/>
```

Mantener el empty state (líneas 62-81) intacto.
