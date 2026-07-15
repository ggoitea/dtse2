<?php

namespace App\Traits;

use App\Models\Archivo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

trait HasArchivos
{
    public function archivos(): MorphMany
    {
        return $this->morphMany(Archivo::class, 'modelable');
    }

    public function archivoDefault(): MorphOne
    {
        return $this->morphOne(Archivo::class, 'modelable')->where('default', true);
    }
}
