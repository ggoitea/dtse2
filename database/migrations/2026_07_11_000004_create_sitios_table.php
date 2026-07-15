<?php

use App\Enums\SitioCategoria;
use App\Enums\SitioEstado;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('sitios');

        Schema::create('sitios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('localidad_id')->constrained('localidades')->cascadeOnDelete();
            $table->string('nombre');
            $table->string('domicilio_calle');
            $table->string('domicilio_numero')->nullable();
            $table->string('contacto_telefono')->nullable();
            $table->string('contacto_email')->nullable();
            $table->string('latitud');
            $table->string('longitud');
            $table->longText('descripcion')->nullable();
            $table->enum('estado', array_column(SitioEstado::cases(), 'value'))->default(SitioEstado::Pendiente->value);
            $table->foreignId('creado_por_user_id')->nullable()->nullOnDelete();
            $table->enum('categoria', array_column(SitioCategoria::cases(), 'value'))->default(SitioCategoria::Otro->value);
            $table->timestamps();

            $table->index('estado');
            $table->index('categoria');
            $table->index(['latitud', 'longitud']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sitios');
    }
};
