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
        Schema::table('livestreams', function (Blueprint $table) {
            $table->string('stream_url')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('livestreams', function (Blueprint $table) {
            // Note: We can't easily revert to NOT NULL if there are null values
            // In a production environment, you'd need to handle this carefully
            $table->string('stream_url')->nullable(false)->change();
        });
    }
};


