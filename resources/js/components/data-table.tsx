import { useState } from 'react';
import type { ColumnPinningState } from '@tanstack/react-table';
import {
    type ColumnDef,
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type SortingState,
    useReactTable,
    type VisibilityState,
} from '@tanstack/react-table';
import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface Props<TData> {
    data: TData[];
    columns: ColumnDef<TData>[];
    onSearch?: (query: string) => void;
    searchValue?: string;
    filters?: {
        search: string;
    };
}

export function DataTable<TData>({
    data,
    columns,
    onSearch,
    searchValue,
    // filters,
}: Props<TData>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {},
    );
    const [rowSelection, setRowSelection] = useState({});
    const [search, setSearch] = useState(searchValue ?? '');
    const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
        left: ['actions'],
        right: [],
    });

    // eslint-disable-next-line
    const table = useReactTable({
        data,
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

    const handleSearch = () => {
        if (onSearch) {
            onSearch(search);
        }
    };

    const getPinnedProps = (
        column: ReturnType<typeof table.getAllColumns>[number],
        // isHeader = false,
    ) => {
        const pinned = column.getIsPinned();

        if (!pinned) {
            return {} as const;
        }

        const isLeft = pinned === 'left';

        return {
            className: cn(
                'sticky z-2 bg-background',
                // isHeader ? 'z-30' : 'z-20',
                isLeft && 'shadow-[1px_0_0_0_hsl(var(--border))]',
            ),
            style: {
                left: isLeft ? column.getStart('left') : undefined,
                right: !isLeft ? column.getAfter('right') : undefined,
            },
        } as const;
    };

    return (
        <div className="flex w-full flex-col gap-2">
            {onSearch && (
                <div className="flex items-center">
                    <div className={cn(`flex items-center gap-2`)}>
                        <Input
                            placeholder={'Buscar...'}
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
                </div>
            )}
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    const pinnedProps = getPinnedProps(
                                        header.column,
                                    );

                                    return (
                                        <TableHead
                                            key={header.id}
                                            className={pinnedProps.className}
                                            style={pinnedProps.style}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => {
                                        const pinnedProps = getPinnedProps(
                                            cell.column,
                                        );

                                        return (
                                            <TableCell
                                                key={cell.id}
                                                className={
                                                    pinnedProps.className
                                                }
                                                style={pinnedProps.style}
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    Sin resultados
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground"></div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Anterior
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Siguiente
                    </Button>
                </div>
            </div>
        </div>
    );
}
