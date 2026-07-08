import type React from 'react';
import { useState } from 'react';
import type {
    ColumnDef,
    ColumnFiltersState,
    ColumnPinningState,
    Row,
    SortingState,
    VisibilityState,
} from '@tanstack/react-table';
import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Inbox } from 'lucide-react';

import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '../ui/empty';
import type { CollectionData } from './data-table';

export const renderCell = <TData,>(row: Row<TData>, columnId: string) => {
    const cell = row.getVisibleCells().find((c) => c.column.id === columnId);

    return cell
        ? flexRender(cell.column.columnDef.cell, cell.getContext())
        : null;
};

function EmptyMobileGrid() {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <Inbox />
                </EmptyMedia>
                <EmptyTitle>Sin elementos</EmptyTitle>
                <EmptyDescription>
                    No hay elementos para mostrar.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="flex-row justify-center gap-2"></EmptyContent>
        </Empty>
    );
}

export type MobileTemplateRenderer<TData> = React.ComponentType<{
    row: Row<TData>;
}>;

interface Props<TData> {
    data: CollectionData<TData>;
    columns: ColumnDef<TData, any>[];
    // onSearch?: (query: string) => void;
    header?: React.ReactNode;
    // searchValue?: string;
    filters?: {
        search: string;
        [key: string]: string | number | boolean | null;
    };
    MobileTemplate: MobileTemplateRenderer<TData>;
}

export function MobileGrid<TData>({
    data,
    columns,
    header,
    MobileTemplate,
}: Props<TData>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {},
    );
    const [rowSelection, setRowSelection] = useState({});
    // const [search, setSearch] = useState(searchValue ?? '');
    const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
        left: ['actions'],
        right: [],
    });

    // eslint-disable-next-line
    const table = useReactTable({
        data: data.data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualFiltering: true,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onColumnPinningChange: setColumnPinning,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            columnPinning,
        },
        initialState: {
            columnPinning: {
                left: [],
                right: ['actions'],
            },
        },
    });

    // const handleSearch = () => {
    //     if (onSearch) {
    //         onSearch(search);
    //     }
    // };

    return (
        <div className="flex flex-col gap-4">
            {header}
            {/* {onSearch && (
                <div className={cn('flex items-center gap-2')}>
                    <Input
                        placeholder="Buscar..."
                        value={search}
                        onKeyUp={handleSearch}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleSearch}
                    >
                        <Search className="h-4 w-4" />
                    </Button>
                </div>
            )} */}
            {table.getRowModel().rows?.length > 0 ? (
                table
                    .getRowModel()
                    .rows.map((row) => (
                        <MobileTemplate
                            key={
                                row.id + '_' + ((row.original as any)?.id ?? '')
                            }
                            row={row}
                        />
                    ))
            ) : (
                <EmptyMobileGrid />
            )}
        </div>
    );
}
