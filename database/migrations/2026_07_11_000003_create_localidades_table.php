<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('localidades', function (Blueprint $table) {
            $table->id();
            $table->string('asentamiento_id');
            $table->foreignId('departamento_id')->constrained()->cascadeOnDelete();
            $table->boolean('es_paraje')->default(false);
            $table->string('nombre');
            $table->string('latitud');
            $table->string('longitud');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('localidades');
    }
};
