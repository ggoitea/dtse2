<?php

use App\Enums\SitioAperturaDiaEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sitio_aperturas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sitio_id')->constrained()->cascadeOnDelete();
            $table->enum('dia', array_column(SitioAperturaDiaEnum::cases(), 'value'));
            $table->time('apertura')->nullable();
            $table->time('cierre')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sitio_aperturas');
    }
};
