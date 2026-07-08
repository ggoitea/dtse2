<?php

namespace App\Modules\Ejemplos\TablaConFiltros\UseCases;

use App\Models\User;

final class CrearUsuario
{
    public static function make(
        string $usuario,
        string $nombre,
        string $email,
        string $password
    ): User {
        return (new self)->__invoke(
            usuario: $usuario,
            nombre: $nombre,
            email: $email,
            password: $password
        );
    }

    public function __invoke(
        string $usuario,
        string $nombre,
        string $email,
        string $password
    ): User {
        return User::create([
            'name' => $nombre,
            'username' => $usuario,
            'email' => $email,
            'password' => $password,
        ]);
    }
}
