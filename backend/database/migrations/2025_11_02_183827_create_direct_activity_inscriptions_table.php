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
        Schema::create('direct_activity_inscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('direct_activity_id')->constrained('direct_activities')->onDelete('cascade');
            $table->enum('status', ['pending', 'approved', 'rejected', 'attended'])->default('pending');
            $table->timestamps();
            
            $table->unique(['user_id', 'direct_activity_id']);
            $table->index('status');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('direct_activity_inscriptions');
    }
};
