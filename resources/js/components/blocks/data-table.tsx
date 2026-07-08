import { useImperativeHandle, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { Button } from '../ui/button';

interface TableSectionProps {
    children: React.ReactNode;
    header?: React.ReactNode;
}

export function TableSection({ children, header }: TableSectionProps) {
    return (
        <div className="flex flex-col gap-4">
            {header && (
                <div className="flex items-center justify-between md:flex-row">
                    {header}
                </div>
            )}

            <div className="">{children}</div>
        </div>
    );
}

export function PaginationController({
    pageIndex,
    pageCount,
    onPreviousPage,
    onNextPage,
    onGoToPage,
}: {
    pageIndex: number;
    pageCount: number;
    onPreviousPage: () => void;
    onNextPage: () => void;
    onGoToPage: (page: number) => void;
}) {
    const visible = 4;

    if (pageCount <= 1) {
        return null;
    }

    const half = Math.floor(visible / 2);
    let start = Math.max(0, pageIndex - half);
    const end = Math.min(pageCount, start + visible);

    if (end - start < visible) {
        start = Math.max(0, end - visible);
    }

    const pages: (number | 'ellipsis')[] = [];

    if (start > 0) {
        pages.push(0);

        if (start > 1) {
            pages.push('ellipsis');
        }
    }

    for (let i = start; i < end; i++) {
        pages.push(i);
    }

    if (end < pageCount) {
        if (end < pageCount - 1) {
            pages.push('ellipsis');
        }

        pages.push(pageCount - 1);
    }

    return (
        <div className="flex items-center justify-end space-x-2 py-4">
            <Button
                variant="outline"
                size="sm"
                onClick={onPreviousPage}
                disabled={pageIndex === 0}
            >
                <span className="hidden md:inline">Anterior</span>
                <span className="inline md:hidden">
                    <ArrowLeft />
                </span>
            </Button>

            <div className="flex items-center space-x-1">
                {pages.map((p, idx) => {
                    if (p === 'ellipsis') {
                        return (
                            <span
                                key={`e-${idx}`}
                                className="px-2 text-sm text-muted-foreground"
                            >
                                …
                            </span>
                        );
                    }

                    const pageNumber = p as number;
                    const isCurrent = pageNumber === pageIndex;

                    return (
                        <Button
                            key={pageNumber}
                            size="sm"
                            variant={isCurrent ? undefined : 'outline'}
                            onClick={() => onGoToPage(pageNumber)}
                            disabled={isCurrent}
                        >
                            {pageNumber + 1}
                        </Button>
                    );
                })}
            </div>

            <Button
                variant="outline"
                size="sm"
                onClick={onNextPage}
                disabled={pageIndex >= pageCount - 1}
            >
                <span className="hidden md:inline">Siguiente</span>
                <span className="inline md:hidden">
                    <ArrowRight />
                </span>
            </Button>
        </div>
    );
}

export type CollectionData<T> = {
    data: T[];
    meta: {
        total: number;
        per_page: number;
        current_page: number;
        last_page: number;
        path: string;
        from: number;
        to: number;
    };
};

export type DataTableRef = {
    resetPagination: () => void;
};

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: CollectionData<TData>;
    onPageChange?: (page: number) => void;
    ref?: React.Ref<DataTableRef>;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    onPageChange,
    ref,
}: DataTableProps<TData, TValue>) {
    const [pagination, setPagination] = useState({
        pageIndex: data.meta.current_page - 1,
        pageSize: data.meta.per_page,
    });

    useImperativeHandle(ref, () => ({
        resetPagination: () => {
            table.resetPagination();
        },
    }));
    // eslint-disable-next-line
    const table = useReactTable<TData>({
        data: data.data,
        columns,
        state: {
            pagination,
        },
        getCoreRowModel: getCoreRowModel(),
        onPaginationChange: (updater) => {
            const newPagination =
                typeof updater === 'function' ? updater(pagination) : updater;
            setPagination(newPagination);

            if (onPageChange) {
                onPageChange(newPagination.pageIndex + 1);
            }
        },
        manualFiltering: true,
        manualPagination: true,
        rowCount: data.meta.total,
    });

    return (
        <>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
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
                                    key={
                                        row.id +
                                        '_' +
                                        ((row.original as any)?.id ?? '')
                                    }
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No hay resultados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <PaginationController
                pageIndex={pagination.pageIndex}
                pageCount={data.meta.last_page}
                onPreviousPage={() => table.previousPage()}
                onNextPage={() => table.nextPage()}
                onGoToPage={(page) => table.setPageIndex(page)}
            />
        </>
    );
}
