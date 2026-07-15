<?php

use App\Enums\SitioSocialTipo;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sitio_sociales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sitio_id')->constrained()->cascadeOnDelete();
            $table->enum('tipo', array_column(SitioSocialTipo::cases(), 'value'));
            $table->string('url');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sitio_sociales');
    }
};
