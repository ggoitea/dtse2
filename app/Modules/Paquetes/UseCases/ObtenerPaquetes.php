<?php

namespace App\Modules\Paquetes\UseCases;

use App\Modules\Paquetes\Queries\PaqueteQueries;
use App\Modules\Shared\Domain\PaginadoValueObject;
use \Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ObtenerPaquetes
{
    public static function make(int $page = 1, int $perPage = 25, array $filtros = []): LengthAwarePaginator
    {
        return (new self(
            new PaginadoValueObject(
                pagina: $page,
                porPagina: $perPage
            ),
            filtros: $filtros
        ))->__invoke();
    }

    public function __construct(
        public PaginadoValueObject $paginado,
        public array $filtros = []
    ) {}

    public function __invoke(): LengthAwarePaginator
    {
        $paquetes = PaqueteQueries::obtenerPaquetes($this->filtros)->paginate(
            $this->paginado->porPagina,
            ['*'],
            'page',
            $this->paginado->pagina
        )->withQueryString();

        return $paquetes;
    }
}
