import type { ComponentType } from 'react';
import { useState } from 'react';
import { Check, Filter, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

type Filters = Record<string, string | number | null>;

const defaultFilters = (
    filterItems: FilterItemProps[],
    allNull: boolean = false,
): Filters => {
    const filter = Object.fromEntries(
        filterItems.map(({ key, value }) => [
            key,
            allNull ? null : (value ?? null),
        ]),
    );

    return filter;
};

export interface FilterComponentProps {
    value: string;
    onValueChange: (value: string) => void;
}

export interface FilterItemProps {
    key: string;
    value: string | null;
    component: ComponentType<FilterComponentProps>;
}

interface Props {
    items: FilterItemProps[];
    onApply: (filters: Filters) => void;
    processing?: boolean;
}

export default function FilterPopover({
    items,
    onApply,
    // processing = false,
}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState<Filters>(defaultFilters(items));

    const clearFilters = () => {
        setFilters(defaultFilters(items, true));
    };

    const updateFilter = (
        key: keyof Filters,
        value: string | number | null,
    ) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleApply = () => {
        setIsOpen(false);
        onApply(filters);
    };

    const appliedFilters = items.filter(
        (item) => item.value !== null && item.value !== '',
    );

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filtros
                    {appliedFilters.length > 0 && (
                        <Badge
                            variant="secondary"
                            className="ml-1 flex h-5 min-w-5 items-center justify-center px-1.5 py-0"
                        >
                            {appliedFilters.length}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="h-auto w-screen rounded-none border-none p-0 sm:h-auto sm:w-150 sm:rounded-xl sm:border sm:p-6 md:w-212.5"
                align="end"
            >
                <div className="flex h-full flex-col p-6 sm:h-auto sm:p-0">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="space-y-1">
                            <h4 className="text-lg leading-none font-semibold">
                                Filtros Avanzados
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                Personaliza tu búsqueda con múltiples criterios.
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full sm:hidden"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <Separator className="mb-6" />

                    <div className="-mr-2 overflow-y-auto pr-2 sm:overflow-visible">
                        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 md:grid-cols-3">
                            {items.map(({ key, component: Component }) => (
                                <Component
                                    key={key}
                                    value={(filters[key] as string) ?? ''}
                                    onValueChange={(val) =>
                                        updateFilter(key, val)
                                    }
                                />
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between gap-4 border-t pt-6">
                        <Button
                            variant="ghost"
                            onClick={clearFilters}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Limpiar filtros
                        </Button>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="hidden sm:inline-flex"
                                onClick={() => setIsOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleApply}
                                className="gap-2 px-8"
                            >
                                <Check className="h-4 w-4" />
                                Aplicar Filtros
                            </Button>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
