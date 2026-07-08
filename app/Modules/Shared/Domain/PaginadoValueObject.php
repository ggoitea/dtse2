<?php

namespace App\Modules\Shared\Domain;

class PaginadoValueObject
{
    public function __construct(
        public int $pagina,
        public int $porPagina,
        public string $nombreDePagina = 'page',
    ) {}
}
