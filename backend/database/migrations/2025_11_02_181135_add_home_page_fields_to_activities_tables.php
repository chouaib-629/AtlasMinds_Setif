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
        // Add fields to educations table
        Schema::table('educations', function (Blueprint $table) {
            $table->enum('status', ['live', 'upcoming'])->nullable()->after('is_active');
            $table->integer('center_id')->nullable()->after('admin_id');
            $table->string('center_name')->nullable()->after('center_id');
            $table->string('organizer_contact')->nullable()->after('organizer');
            $table->string('duration')->nullable()->after('capacity'); // e.g., "6 أسابيع"
            $table->enum('level', ['مبتدئ', 'متوسط', 'متقدم'])->nullable()->after('duration');
        });

        // Add fields to clubs table
        Schema::table('clubs', function (Blueprint $table) {
            $table->enum('status', ['live', 'upcoming'])->nullable()->after('is_active');
            $table->integer('center_id')->nullable()->after('admin_id');
            $table->string('center_name')->nullable()->after('center_id');
            $table->string('organizer_contact')->nullable()->after('organizer');
            $table->string('duration')->nullable()->after('capacity');
            $table->enum('level', ['مبتدئ', 'متوسط', 'متقدم'])->nullable()->after('duration');
        });

        // Add fields to direct_activities table
        Schema::table('direct_activities', function (Blueprint $table) {
            $table->enum('status', ['live', 'upcoming'])->nullable()->after('is_active');
            $table->integer('center_id')->nullable()->after('admin_id');
            $table->string('center_name')->nullable()->after('center_id');
            $table->string('organizer_contact')->nullable()->after('organizer');
            $table->integer('votes')->default(0)->after('capacity');
            $table->string('target_audience')->nullable()->after('votes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('educations', function (Blueprint $table) {
            $table->dropColumn(['status', 'center_id', 'center_name', 'organizer_contact', 'duration', 'level']);
        });

        Schema::table('clubs', function (Blueprint $table) {
            $table->dropColumn(['status', 'center_id', 'center_name', 'organizer_contact', 'duration', 'level']);
        });

        Schema::table('direct_activities', function (Blueprint $table) {
            $table->dropColumn(['status', 'center_id', 'center_name', 'organizer_contact', 'votes', 'target_audience']);
        });
    }
};
