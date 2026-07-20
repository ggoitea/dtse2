import { useState } from 'react';
import { Form, Head } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';

import GoogleButton from '@/components/google-button';
import InputError from '@/components/input-error';
import SocialDivider from '@/components/social-divider';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({ status, canResetPassword, canRegister }: Props) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <AuthLayout title="Acceso al sistema">
            <Head title="Iniciar sesión" />

            <GoogleButton href="/auth/google" />

            <SocialDivider />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="username">
                                    Nombre de usuario
                                </Label>
                                <Input
                                    id="username"
                                    type="text"
                                    name="username"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="username"
                                    placeholder="Ingresa tu nombre"
                                />
                                <InputError message={errors.username} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="Ingresa tu contraseña"
                                    />
                                    <button
                                        type="button"
                                        className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <Label htmlFor="remember">Recordarme</Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-6 w-full shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Ingresar
                            </Button>

                            {canResetPassword && (
                                <div className="text-center text-sm">
                                    <TextLink
                                        href={request()}
                                        tabIndex={5}
                                        className="no-underline hover:text-primary hover:decoration-transparent"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </TextLink>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </Form>

            {canRegister && (
                <div className="text-center text-sm text-muted-foreground">
                    ¿No tienes una cuenta?{' '}
                    <TextLink href={register()} tabIndex={6}>
                        Regístrate
                    </TextLink>
                </div>
            )}

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
