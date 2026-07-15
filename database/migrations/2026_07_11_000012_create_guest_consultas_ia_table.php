<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('guest_consultas_ia', function (Blueprint $table) {
            $table->id();
            $table->string('fingerprint');
            $table->integer('consultas_realizadas')->default(0);
            $table->timestamps();

            $table->index('fingerprint');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('guest_consultas_ia');
    }
};
