<?php

use App\Enums\EventoEstado;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('eventos');
        Schema::create('eventos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('localidad_id')->constrained('localidades')->cascadeOnDelete();
            $table->foreignId('sitio_id')->nullable()->nullOnDelete();
            $table->string('nombre');
            $table->longText('descripcion')->nullable();
            $table->date('fecha');
            $table->time('inicio')->nullable();
            $table->time('fin')->nullable();
            $table->string('domicilio_calle');
            $table->string('domicilio_numero')->nullable();
            $table->enum('estado', array_column(EventoEstado::cases(), 'value'))->default(EventoEstado::Pendiente->value);
            $table->timestamps();

            $table->index('fecha');
            $table->index('estado');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('eventos');
    }
};
