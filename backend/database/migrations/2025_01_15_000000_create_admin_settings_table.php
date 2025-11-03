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
        Schema::create('admin_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('admin_id')->constrained('admins')->onDelete('cascade');
            $table->string('site_name')->nullable();
            $table->text('site_description')->nullable();
            $table->string('timezone')->default('Africa/Algiers');
            $table->string('language')->default('fr');
            $table->string('date_format')->default('DD/MM/YYYY');
            
            // Notification settings (JSON)
            $table->json('notification_settings')->nullable();
            
            // System settings (JSON)
            $table->json('system_settings')->nullable();
            
            // Security settings (JSON, for super admin)
            $table->json('security_settings')->nullable();
            
            $table->timestamps();
            
            // Ensure one settings record per admin
            $table->unique('admin_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin_settings');
    }
};

