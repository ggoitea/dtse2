import type { Row } from '@tanstack/react-table';

import { renderCell } from '@/components/blocks/mobile-grid';
import { Badge } from '@/components/ui/badge';

export default function PropiedadMobileGrid({ row }: { row: Row<any> }) {
    return (
        <div className="group cursor-pointer rounded-2xl border border-border bg-muted p-5 transition-transform active:scale-[0.98]">
            <div className="mb-2 flex items-start justify-between">
                <div>
                    <p className="mb-1 text-blue-500">
                        {renderCell(row, 'Titular')}
                    </p>
                    <h3 className="text-base uppercase">
                        {renderCell(row, 'descripcion')}
                    </h3>
                </div>
                <div>
                    <Badge>
                        Manzana {renderCell(row, 'manzana')}, Lote:{' '}
                        {renderCell(row, 'lote')}{' '}
                    </Badge>
                </div>
            </div>
            <div className="flex flex-col gap-1 border-t border-border pt-3 text-sm">
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Teléfono</span>
                    <span>{renderCell(row, 'Teléfono')}</span>
                </div>
                {row.getValue('secundario_telefono') !== '-' && (
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                            Teléfono alternativo
                        </span>
                        <span>{renderCell(row, 'secundario_telefono')}</span>
                    </div>
                )}
            </div>
            <div className="mt-1 flex items-center justify-end gap-1 border-t border-border pt-1 text-sm">
                {renderCell(row, 'actions')}
            </div>
        </div>
    );
}
