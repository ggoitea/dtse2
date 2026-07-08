import { NumericFormat } from 'react-number-format';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Role } from '@/types';

interface UserFormData {
    name: string;
    username: string;
    email: string;
    dni: string;
    telefono: string;
    direccion: string;
    password: string;
    role_id: number | '';
}

interface Props {
    data: UserFormData;
    setData: <K extends keyof UserFormData>(
        key: K,
        value: UserFormData[K],
    ) => void;
    errors: Partial<Record<keyof UserFormData, string>>;
    processing: boolean;
    onSubmit: (e: React.FormEvent) => void;
    submitLabel: string;
    roles: Pick<Role, 'id' | 'name'>[];
    isEdit?: boolean;
}

export function UserForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    submitLabel,
    roles,
    isEdit = false,
}: Props) {
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Nombre completo"
                        required
                        autoFocus
                    />
                    <InputError message={errors.name} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="username">Usuario</Label>
                    <Input
                        id="username"
                        value={data.username}
                        onChange={(e) => setData('username', e.target.value)}
                        placeholder="Nombre de usuario"
                        required
                        autoComplete="off"
                    />
                    <InputError message={errors.username} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="usuario@ejemplo.com"
                        autoComplete="off"
                        required
                    />
                    <InputError message={errors.email} />
                </div>

                <div className="grid gap-2 md:grid-cols-2 md:gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="dni">DNI</Label>
                        <NumericFormat
                            id="dni"
                            customInput={Input}
                            value={data.dni}
                            onValueChange={(values) =>
                                setData('dni', values.value)
                            }
                            placeholder="Documento"
                            autoComplete="off"
                            decimalScale={0}
                            allowNegative={false}
                            fixedDecimalScale={false}
                            decimalSeparator=","
                            thousandSeparator="."
                        />
                        <InputError message={errors.dni} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="telefono">Teléfono</Label>
                        <Input
                            id="telefono"
                            value={data.telefono}
                            onChange={(e) =>
                                setData('telefono', e.target.value)
                            }
                            placeholder="+54..."
                            autoComplete="off"
                        />
                        <InputError message={errors.telefono} />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="direccion">Dirección</Label>
                    <Input
                        id="direccion"
                        value={data.direccion}
                        onChange={(e) => setData('direccion', e.target.value)}
                        placeholder="Dirección completa"
                        autoComplete="off"
                    />
                    <InputError message={errors.direccion} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password">
                        Contraseña
                        {isEdit && (
                            <span className="font-normal text-muted-foreground">
                                {' '}
                                (dejar en blanco para mantener la actual)
                            </span>
                        )}
                    </Label>
                    <Input
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        autoComplete="new-password"
                        required={!isEdit}
                    />
                    <InputError message={errors.password} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="role_id">Rol</Label>
                    <Select
                        value={data.role_id ? String(data.role_id) : ''}
                        onValueChange={(value) =>
                            setData('role_id', value ? Number(value) : '')
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar rol" />
                        </SelectTrigger>
                        <SelectContent>
                            {roles.map((role) => (
                                <SelectItem
                                    key={role.id}
                                    value={String(role.id)}
                                    className="capitalize"
                                >
                                    {role.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.role_id} />
                </div>
            </div>

            <div className="flex items-center justify-end">
                <Button type="submit" disabled={processing}>
                    {processing ? 'Guardando...' : submitLabel}
                </Button>
            </div>
        </form>
    );
}
