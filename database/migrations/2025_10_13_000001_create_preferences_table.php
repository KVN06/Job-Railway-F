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

        if (!Schema::hasColumn('users', 'notify_email')) {
            Schema::table('users', function (Blueprint $table) {
                $table->boolean('notify_email')->default(true);
            });
        }

        if (!Schema::hasColumn('users', 'notify_platform')) {
            Schema::table('users', function (Blueprint $table) {
                $table->boolean('notify_platform')->default(true);
            });
        }

        if (!Schema::hasColumn('users', 'dark_mode')) {
            Schema::table('users', function (Blueprint $table) {
                $table->boolean('dark_mode')->default(false);
            });
        }

        if (!Schema::hasColumn('users', 'language')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('language', 5)->default('es');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {

        $columns = [];
        foreach (['notify_email', 'notify_platform', 'dark_mode', 'language'] as $col) {
            if (Schema::hasColumn('users', $col)) {
                $columns[] = $col;
            }
        }

        if (!empty($columns)) {
            Schema::table('users', function (Blueprint $table) use ($columns) {
                $table->dropColumn($columns);
            });
        }
    }
};
