import { useState } from 'react';
import { Form } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';

import Heading from '@/components/heading';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import { AdaptiveLayout } from '@/layouts/adaptive-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';
import { disable, enable, show } from '@/routes/two-factor';

type Props = {
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
};

export default function TwoFactor({
    requiresConfirmation = false,
    twoFactorEnabled = false,
}: Props) {
    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors,
    } = useTwoFactorAuth();
    const [showSetupModal, setShowSetupModal] = useState<boolean>(false);

    return (
        <SettingsLayout>
            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Autenticación de dos factores"
                    description="Administra la configuración de autenticación de dos factores"
                />
                {twoFactorEnabled ? (
                    <div className="flex flex-col items-start justify-start space-y-4">
                        <Badge variant="default">Activada</Badge>
                        <p className="text-muted-foreground">
                            Con la autenticación de dos factores activada, se te
                            pedirá un PIN seguro y aleatorio al iniciar sesión,
                            que podrás obtener desde una aplicación compatible
                            con TOTP en tu teléfono.
                        </p>

                        <TwoFactorRecoveryCodes
                            recoveryCodesList={recoveryCodesList}
                            fetchRecoveryCodes={fetchRecoveryCodes}
                            errors={errors}
                        />

                        <div className="relative inline">
                            <Form {...disable.form()}>
                                {({ processing }) => (
                                    <Button
                                        variant="destructive"
                                        type="submit"
                                        disabled={processing}
                                    >
                                        <ShieldCheck /> Desactivar 2FA
                                    </Button>
                                )}
                            </Form>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-start justify-start space-y-4">
                        <Badge variant="destructive">Desactivada</Badge>
                        <p className="text-muted-foreground">
                            Cuando actives la autenticación de dos factores, se
                            te pedirá un PIN seguro durante el inicio de sesión.
                            Este PIN puede obtenerse desde una aplicación
                            compatible con TOTP en tu teléfono.
                        </p>

                        <div>
                            {hasSetupData ? (
                                <Button onClick={() => setShowSetupModal(true)}>
                                    <ShieldCheck />
                                    Continuar configuración
                                </Button>
                            ) : (
                                <Form
                                    {...enable.form()}
                                    onSuccess={() => setShowSetupModal(true)}
                                >
                                    {({ processing }) => (
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                        >
                                            <ShieldCheck />
                                            Activar 2FA
                                        </Button>
                                    )}
                                </Form>
                            )}
                        </div>
                    </div>
                )}

                <TwoFactorSetupModal
                    isOpen={showSetupModal}
                    onClose={() => setShowSetupModal(false)}
                    requiresConfirmation={requiresConfirmation}
                    twoFactorEnabled={twoFactorEnabled}
                    qrCodeSvg={qrCodeSvg}
                    manualSetupKey={manualSetupKey}
                    clearSetupData={clearSetupData}
                    fetchSetupData={fetchSetupData}
                    errors={errors}
                />
            </div>
        </SettingsLayout>
    );
}

TwoFactor.layout = (page: React.ReactNode) => (
    <AdaptiveLayout
        browserTitle="Autenticación 2FA"
        icon={ShieldCheck}
        breadcrumbs={[
            { title: 'Configuración', href: edit().url },
            { title: 'Autenticación 2FA', href: show().url },
        ]}
    >
        {page}
    </AdaptiveLayout>
);
