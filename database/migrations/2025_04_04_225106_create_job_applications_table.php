<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('job_applications', function (Blueprint $table) {
            $table->id();
            $table->text('message')->nullable();
            $table->string('status', 20)->default('pending');
            $table->string('cv_path')->nullable();
            $table->foreignId('unemployed_id')->nullable()->constrained('unemployeds')->cascadeOnDelete();
            $table->foreignId('job_offer_id')->nullable()->constrained('job_offers')->cascadeOnDelete();
            $table->timestamps();
        });

        // Normalización de estados históricos en español a valores canónicos
        if (Schema::hasTable('job_applications')) {
            DB::table('job_applications')->where('status', 'pendiente')->update(['status' => 'pending']);
            DB::table('job_applications')->whereIn('status', ['aceptada', 'aceptado'])->update(['status' => 'accepted']);
            DB::table('job_applications')->whereIn('status', ['rechazada', 'rechazado'])->update(['status' => 'rejected']);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_applications');
    }
};
