import type { ColumnDef } from '@tanstack/react-table';
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    emptyMessage?: React.ReactNode;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    emptyMessage = 'No hay resultados.',
}: DataTableProps<TData, TValue>) {
    // eslint-disable-next-line react-hooks/incompatible-library
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        columnResizeMode: 'onChange',
    });

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                const size = header.column.columnDef.size;
                                const maxSize = header.column.columnDef.maxSize;

                                return (
                                    <TableHead
                                        key={header.id}
                                        style={
                                            size !== undefined
                                                ? {
                                                      width: size,
                                                      minWidth: size,
                                                      maxWidth: maxSize,
                                                  }
                                                : undefined
                                        }
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
                                data-state={row.getIsSelected() && 'selected'}
                            >
                                {row.getVisibleCells().map((cell) => {
                                    const size = cell.column.columnDef.size;
                                    const maxSize =
                                        cell.column.columnDef.maxSize;

                                    return (
                                        <TableCell
                                            key={cell.id}
                                            style={
                                                size !== undefined
                                                    ? {
                                                          width: size,
                                                          minWidth: size,
                                                          maxWidth: maxSize,
                                                      }
                                                    : undefined
                                            }
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
                                {emptyMessage}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
