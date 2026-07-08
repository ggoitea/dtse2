<?php

namespace App\Modules\Ejemplos\TablaConFiltros\UseCases;

use App\Models\User;
use App\Modules\Shared\Domain\PaginadoValueObject;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * Estructura basica de un UseCase, se puede usar para cualquier caso de uso, solo es necesario cambiar el namespace y el nombre de la clase
 */
final class ObtenerUsuarios
{
    /**
     * @return Collection<int, User>|LengthAwarePaginator
     */
    public static function make(int $page = 1, int $porPagina = 25, array $filtros = []): Collection|LengthAwarePaginator
    {
        $paginado = new PaginadoValueObject(pagina: $page, porPagina: $porPagina, nombreDePagina: 'usuariosPage');

        return (new self)->__invoke(filtros: $filtros, paginado: $paginado);
    }

    /**
     * @return Collection<int, User>|LengthAwarePaginator
     */
    public function __invoke(array $filtros = [], ?PaginadoValueObject $paginado = null): Collection|LengthAwarePaginator
    {
        $defaultFiltros = [
            'buscar' => null,
            'email' => null,
        ];

        $filtros = array_merge($defaultFiltros, $filtros);

        $query = User::query()
            ->when($filtros['buscar'], function (Builder $query, $buscar) {
                $query->whereAny([
                    'name',
                    'email',
                ], 'like', '%'.$buscar.'%');
            })
            ->when($filtros['email'], function (Builder $query, $email) {
                $query->where('email', 'like', '%'.$email.'%');
            });

        if ($paginado) {
            return $query->paginate(
                perPage: $paginado->porPagina,
                page: $paginado->pagina,
                columns: ['*'],
                pageName: $paginado->nombreDePagina,
            )->withQueryString();
        }

        return $query->get();
    }
}
