<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Event;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superAdmin = Admin::where('is_super_admin', true)->first();
        $regularAdmin = Admin::where('is_super_admin', false)->first();

        if (!$superAdmin || !$regularAdmin) {
            $this->command->error('Admins not found. Please run AdminSeeder first.');
            return;
        }

        // Super Admin Events (National, Online, Hybrid)
        $superAdminEvents = [
            [
                'title' => 'National Youth Conference 2025',
                'description' => 'A national conference for youth across Algeria with online and hybrid attendance options.',
                'type' => 'national',
                'attendance_type' => 'hybrid',
                'date' => Carbon::now()->addDays(30)->setTime(9, 0),
                'location' => 'Alger, Palais des Congrès',
                'admin_id' => $superAdmin->id,
                'price' => 2000.00,
                'has_price' => true,
            ],
            [
                'title' => 'Virtual Coding Workshop',
                'description' => 'Online coding workshop for beginners. Accessible from anywhere in Algeria.',
                'type' => 'online',
                'attendance_type' => 'online',
                'date' => Carbon::now()->addDays(15)->setTime(14, 0),
                'location' => null,
                'admin_id' => $superAdmin->id,
                'price' => 500.00,
                'has_price' => true,
            ],
            [
                'title' => 'National Entrepreneurship Summit',
                'description' => 'Hybrid event combining online presentations with in-person networking sessions.',
                'type' => 'national',
                'attendance_type' => 'hybrid',
                'date' => Carbon::now()->addDays(45)->setTime(10, 0),
                'location' => 'Alger',
                'admin_id' => $superAdmin->id,
                'price' => 1500.00,
                'has_price' => true,
            ],
            [
                'title' => 'Online Mental Health Workshop',
                'description' => 'Free online workshop about youth mental health and well-being.',
                'type' => 'online',
                'attendance_type' => 'online',
                'date' => Carbon::now()->addDays(20)->setTime(16, 0),
                'location' => null,
                'admin_id' => $superAdmin->id,
                'price' => null,
                'has_price' => false,
            ],
        ];

        // Regular Admin Events (Local, In-Person only)
        $regularAdminEvents = [
            [
                'title' => 'Local Football Tournament',
                'description' => 'Weekly football tournament for local youth at the youth house.',
                'type' => 'local',
                'attendance_type' => 'in-person',
                'date' => Carbon::now()->addDays(7)->setTime(17, 0),
                'location' => 'Youth House - Sétif',
                'admin_id' => $regularAdmin->id,
                'price' => null,
                'has_price' => false,
            ],
            [
                'title' => 'Art & Crafts Workshop',
                'description' => 'Hands-on art and crafts workshop for local participants.',
                'type' => 'local',
                'attendance_type' => 'in-person',
                'date' => Carbon::now()->addDays(12)->setTime(10, 0),
                'location' => 'Youth House - Sétif',
                'admin_id' => $regularAdmin->id,
                'price' => 300.00,
                'has_price' => true,
            ],
            [
                'title' => 'Community Service Day',
                'description' => 'Local community service activity organized by the youth house.',
                'type' => 'local',
                'attendance_type' => 'in-person',
                'date' => Carbon::now()->addDays(25)->setTime(8, 0),
                'location' => 'Various locations in Sétif',
                'admin_id' => $regularAdmin->id,
                'price' => null,
                'has_price' => false,
            ],
            [
                'title' => 'Cooking Class - Traditional Recipes',
                'description' => 'Learn traditional Algerian cooking recipes.',
                'type' => 'local',
                'attendance_type' => 'in-person',
                'date' => Carbon::now()->addDays(18)->setTime(15, 0),
                'location' => 'Youth House Kitchen - Sétif',
                'admin_id' => $regularAdmin->id,
                'price' => 500.00,
                'has_price' => true,
            ],
        ];

        foreach ($superAdminEvents as $event) {
            Event::create($event);
        }

        foreach ($regularAdminEvents as $event) {
            Event::create($event);
        }

        $this->command->info('Events seeded successfully!');
        $this->command->info('- ' . count($superAdminEvents) . ' Super Admin events (national/online/hybrid)');
        $this->command->info('- ' . count($regularAdminEvents) . ' Regular Admin events (local/in-person)');
    }
}
