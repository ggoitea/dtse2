<?php

use App\Enums\PaqueteCategoriaEnum;
use App\Enums\PaqueteEstadoEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('paquete_turisticos', function (Blueprint $table) {
            $table->id();
            $table->nullableMorphs('modelable');
            $table->string('nombre');
            $table->longText('descripcion')->nullable();
            $table->enum('categoria', array_column(PaqueteCategoriaEnum::cases(), 'value'));
            $table->string('destino')->nullable();
            $table->string('duracion')->nullable();
            $table->enum('estado', array_column(PaqueteEstadoEnum::cases(), 'value'))->default(PaqueteEstadoEnum::Activo->value);
            $table->timestamps();

            $table->index('estado');
            $table->index('categoria');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('paquete_turisticos');
    }
};
