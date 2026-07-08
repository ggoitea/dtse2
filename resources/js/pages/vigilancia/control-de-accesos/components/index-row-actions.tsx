import { useState } from 'react';
import { router } from '@inertiajs/react';
import { LogIn } from 'lucide-react';

import { ConfirmActionDialog } from '@/components/confirm-action-dialog';
import { Button } from '@/components/ui/button';
import { ingresar } from '@/routes/vigilancia/control-de-accesos';

import type { CredencialAcceso } from '../types/control-acceso';

interface Props {
    credencial: CredencialAcceso;
}

export default function IndexRowActions({ credencial }: Props) {
    const [open, setOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleIngresar = () => {
        setProcessing(true);
        router.post(
            ingresar(credencial.id).url,
            {},
            {
                onSuccess: () => setOpen(false),
                onFinish: () => setProcessing(false),
            },
        );
    };

    const can_ingreso_fisico = credencial.can.ingreso_fisico;

    return (
        <div className="flex items-center justify-end gap-4">
            <Button
                onClick={() => setOpen(true)}
                disabled={!can_ingreso_fisico}
            >
                <LogIn />
                Ingresar
            </Button>

            <ConfirmActionDialog
                open={open}
                onOpenChange={setOpen}
                title="Registrar ingreso"
                description={
                    <>
                        ¿Confirmar el ingreso de{' '}
                        <span className="font-medium text-foreground">
                            {credencial.nombre ?? credencial.tipo.label}
                        </span>
                        {credencial.dni ? ` (DNI ${credencial.dni})` : ''}?
                    </>
                }
                processing={processing}
                onConfirm={handleIngresar}
                confirmLabel="Confirmar ingreso"
                confirmVariant="default"
            />
        </div>
    );
}
