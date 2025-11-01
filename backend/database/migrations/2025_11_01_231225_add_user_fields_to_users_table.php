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
        Schema::table('users', function (Blueprint $table) {
            $table->string('nom')->nullable()->after('name');
            $table->string('prenom')->nullable()->after('nom');
            $table->date('date_de_naissance')->nullable()->after('prenom');
            $table->text('adresse')->nullable()->after('date_de_naissance');
            $table->string('commune')->nullable()->after('adresse');
            $table->string('wilaya')->nullable()->after('commune');
            $table->string('numero_telephone', 20)->nullable()->after('wilaya');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'nom',
                'prenom',
                'date_de_naissance',
                'adresse',
                'commune',
                'wilaya',
                'numero_telephone',
            ]);
        });
    }
};
