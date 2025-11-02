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
        Schema::create('educations', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('category')->default('Workshop'); // Workshop, Training, Course, etc.
            $table->dateTime('date');
            $table->string('time')->nullable();
            $table->string('location')->nullable();
            $table->enum('attendance_type', ['online', 'in-person', 'hybrid'])->default('in-person');
            $table->string('organizer')->nullable();
            $table->foreignId('admin_id')->nullable()->constrained('admins')->onDelete('set null');
            $table->decimal('price', 10, 2)->nullable();
            $table->boolean('has_price')->default(false);
            $table->integer('participants')->default(0);
            $table->integer('capacity')->nullable();
            $table->string('image_url')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('educations');
    }
};
