<?php

use App\Enums\ContactoEstadoEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contactos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('telefono');
            $table->text('consulta');
            $table->enum('estado', array_column(ContactoEstadoEnum::cases(), 'value'))->default(ContactoEstadoEnum::Nuevo->value);
            $table->timestamps();

            $table->index('estado');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contactos');
    }
};
