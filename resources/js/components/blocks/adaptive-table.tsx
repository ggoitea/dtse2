import React, { forwardRef } from 'react';
import type { ColumnDef } from '@tanstack/react-table';

import type {
    CollectionData,
    DataTableRef,
} from '@/components/blocks/data-table';
import { DataTable, TableSection } from '@/components/blocks/data-table';
import { useIsMobile } from '@/hooks/use-mobile';

import type { MobileTemplateRenderer } from './mobile-grid';
import { MobileGrid } from './mobile-grid';

interface Props<TData> {
    data: CollectionData<TData>;
    columns: ColumnDef<TData, any>[];
    header?: React.ReactNode;
    // filters?: Record<string, string | number | boolean | null>;
    MobileTemplate: MobileTemplateRenderer<TData>;
    tableRef?: React.Ref<DataTableRef>;
    onPageChange?: (page: number) => void;
}

type AdaptiveTableComponent = React.ForwardRefExoticComponent<
    React.PropsWithoutRef<Props<any>> & React.RefAttributes<DataTableRef>
>;

export const AdaptiveTable = forwardRef(function AdaptiveTable<TData = unknown>(
    {
        data,
        columns,
        header,
        MobileTemplate,
        tableRef,
        onPageChange,
    }: Props<TData>,
    ref: React.Ref<DataTableRef> | null,
) {
    const isMobile = useIsMobile();

    const forwardedRef = (ref ?? tableRef) as
        React.Ref<DataTableRef> | undefined;

    if (isMobile) {
        return (
            <MobileGrid
                header={header}
                columns={columns}
                data={data}
                MobileTemplate={MobileTemplate}
            />
        );
    }

    return (
        <TableSection header={header}>
            <DataTable
                ref={forwardedRef}
                columns={columns}
                data={data}
                onPageChange={onPageChange}
            />
        </TableSection>
    );
}) as AdaptiveTableComponent;
