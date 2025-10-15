<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('unemployed_id')->constrained('unemployeds')->cascadeOnDelete();
            $table->morphs('favoritable');
            $table->timestamp('added_at')->useCurrent();
            $table->timestamps();

            $table->unique(['unemployed_id', 'favoritable_id', 'favoritable_type'], 'favorites_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('favorites');
    }
};
