---
name: drawer-form-components
description: 'Reglas hard para componentes de formulario: selección con Combobox vs Select, Combobox dentro de Drawer con portal container, dismissible del Drawer, y layout de DrawerFooter. Activar SIEMPRE que se cree o modifique un formulario dentro de un Drawer, o cuando se use Combobox, Select, o DrawerFooter en cualquier componente.'
license: MIT
compatibility: opencode
metadata:
    audience: maintainers
    workflow: github
---

# Drawer Form Components

Este skill define las **reglas hard** de componentes de formulario para toda la aplicación. Sin excepciones.

---

## Regla 1 — Combobox vs Select

**Usa `Combobox` cuando el listado sea largo (más de ~8 opciones).**  
**Usa `Select` cuando el listado sea corto (≤ ~8 opciones que entran en pantalla sin scroll).**

Esta es una regla dura. No uses `Select` para listas de clientes, artículos, proveedores, ni cualquier entidad que crezca con el tiempo. No uses `Combobox` para opciones fijas y pequeñas como estado, tipo de precio (si son pocas), o condición de pago.

```tsx
// ✅ Correcto — lista larga (clientes, artículos, proveedores, etc.)
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from '@/components/ui/combobox';

<Combobox
    items={clientes}
    itemToStringLabel={(item) => (item ? item.nombre : '')}
    onValueChange={(v) => setData('cliente_id', v.id)}
>
    <ComboboxInput placeholder="Seleccionar un cliente" />
    <ComboboxContent>
        <ComboboxEmpty>No se encontraron clientes.</ComboboxEmpty>
        <ComboboxList>
            {(item) => (
                <ComboboxItem key={item.id} value={item}>
                    {item.nombre}
                </ComboboxItem>
            )}
        </ComboboxList>
    </ComboboxContent>
</Combobox>;

// ✅ Correcto — lista corta (tipos de precio, estados, condiciones fijas)
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

<Select
    value={item.precio_lista_id}
    onValueChange={(v) => actualizarItem(index, 'precio_lista_id', v)}
>
    <SelectTrigger>
        <SelectValue placeholder="Seleccionar tipo de precio" />
    </SelectTrigger>
    <SelectContent>
        {preciosLista.map((pl) => (
            <SelectItem key={pl.id} value={String(pl.id)}>
                {pl.nombre}
            </SelectItem>
        ))}
    </SelectContent>
</Select>;
```

---

## Regla 2 — Combobox dentro de un Drawer

Cuando uses `Combobox` dentro de un `Drawer`, **siempre** debes pasar `container={containerRef}` a `ComboboxContent`.  
Sin esto, el dropdown se renderiza debajo del overlay del Drawer y no es interactuable.

**Patrón obligatorio:**

```tsx
import { useRef } from 'react';
import { DrawerContent } from '@/components/ui/drawer';
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from '@/components/ui/combobox';

// 1. Crear el ref en el componente
const containerRef = useRef<HTMLDivElement>(null);

// 2. Atacharlo al DrawerContent
<DrawerContent ref={containerRef}>
    ...
    {/* 3. Pasar el container a ComboboxContent */}
    <Combobox
        items={clientes}
        itemToStringLabel={(item) => (item ? item.nombre : '')}
        onValueChange={(v) => setData('cliente_id', v.id)}
    >
        <ComboboxInput placeholder="Seleccionar un cliente" />
        <ComboboxContent container={containerRef}>
            <ComboboxEmpty>No se encontraron clientes.</ComboboxEmpty>
            <ComboboxList>
                {(item) => (
                    <ComboboxItem key={item.id} value={item}>
                        {item.nombre}
                    </ComboboxItem>
                )}
            </ComboboxList>
        </ComboboxContent>
    </Combobox>
    ...
</DrawerContent>;
```

> **Referencia canónica**: ver `resources/js/pages/comercial/ventas/components/nueva-venta-drawer.tsx` para el patrón completo.

---

## Regla 3 — Drawer dismissible

**Por defecto, `dismissible` SIEMPRE debe ser `false`.**

La razón: con `dismissible={true}`, el `<Input type="date" />` no funciona correctamente porque el Drawer intercepta los eventos de puntero y el calendario nativo no se abre.

```tsx
// ✅ Correcto — dismissible en false por defecto
<Drawer open={open} onOpenChange={onOpenChange} direction="right" dismissible={false}>
```

**Excepción — si necesitás habilitar `dismissible={true}`:**

Debés agregar `onPointerDown={(e) => e.stopPropagation()}` a **cada** `<Input type="date" />` del formulario, para propagar el evento y restaurar la funcionalidad del calendario.

```tsx
// ✅ Correcto — dismissible habilitado con propagación en input date
<Drawer
    open={open}
    onOpenChange={onOpenChange}
    direction="right"
    dismissible={true}
>
    <DrawerContent>
        ...
        <Input
            type="date"
            value={data.fecha}
            onChange={(e) => setData('fecha', e.target.value)}
            onPointerDown={(e) => e.stopPropagation()} // ← obligatorio cuando dismissible={true}
        />
        ...
    </DrawerContent>
</Drawer>
```

---

## Regla 4 — DrawerFooter en columna

**En drawers con `direction="right"`, los botones del `DrawerFooter` SIEMPRE deben estar en columna.**  
Nunca uses `flex-row` en el footer de un drawer lateral.

```tsx
// ✅ Correcto — botones en columna (comportamiento default de DrawerFooter)
<DrawerFooter className="px-0">
    <Button type="submit" disabled={processing}>
        {processing && <Spinner />}
        Registrar venta
    </Button>
    <DrawerClose asChild>
        <Button type="button" variant="outline">
            Cancelar
        </Button>
    </DrawerClose>
</DrawerFooter>

// ❌ Incorrecto — nunca usar flex-row en drawer lateral
<DrawerFooter className="flex-row px-0">
    ...
</DrawerFooter>
```

---

## Resumen de reglas

| Situación                         | Regla                                                                               |
| --------------------------------- | ----------------------------------------------------------------------------------- |
| Lista larga (>~8 opciones)        | Usar `Combobox`                                                                     |
| Lista corta (≤~8 opciones)        | Usar `Select`                                                                       |
| `Combobox` dentro de `Drawer`     | Pasar `container={containerRef}` a `ComboboxContent`; `ref` en `DrawerContent`      |
| Drawer por defecto                | `dismissible={false}`                                                               |
| Drawer con `dismissible={true}`   | Agregar `onPointerDown={(e) => e.stopPropagation()}` a cada `<Input type="date" />` |
| Botones en `DrawerFooter` lateral | Siempre en columna, nunca `flex-row`                                                |
