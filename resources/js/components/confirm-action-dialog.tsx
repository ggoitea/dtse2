import type { ComponentProps, ReactNode } from 'react';

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

interface ConfirmActionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: ReactNode;
    processing?: boolean;
    onConfirm: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
    showConfirmAction?: boolean;
    confirmVariant?: ComponentProps<typeof Button>['variant'];
}

export function ConfirmActionDialog({
    open,
    onOpenChange,
    title,
    description,
    processing = false,
    onConfirm,
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    showConfirmAction = true,
    confirmVariant = 'destructive',
}: ConfirmActionDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={processing}>
                        {cancelLabel}
                    </AlertDialogCancel>
                    {showConfirmAction && (
                        <Button
                            type="button"
                            variant={confirmVariant}
                            onClick={onConfirm}
                            disabled={processing}
                        >
                            {processing && <Spinner />}
                            {confirmLabel}
                        </Button>
                    )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
