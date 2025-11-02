<?php

namespace Database\Seeders;

use App\Models\Chat;
use App\Models\Event;
use App\Models\Admin;
use Illuminate\Database\Seeder;

class ChatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superAdmin = Admin::where('is_super_admin', true)->first();
        $regularAdmin = Admin::where('is_super_admin', false)->first();
        $events = Event::with('admin')->get();

        if (!$superAdmin || !$regularAdmin || $events->isEmpty()) {
            $this->command->error('Admins or Events not found. Please run AdminSeeder and EventSeeder first.');
            return;
        }

        $superAdminEvents = $events->filter(function ($event) {
            return $event->admin && $event->admin->is_super_admin;
        });

        $regularAdminEvents = $events->filter(function ($event) {
            return $event->admin && !$event->admin->is_super_admin;
        });

        // Super Admin Chats
        $superAdminChats = [
            ['title' => 'National Conference Discussion', 'description' => 'General discussion channel for the national conference', 'is_active' => true],
            ['title' => 'Virtual Workshop Q&A', 'description' => 'Q&A channel for online workshops', 'is_active' => true],
            ['title' => 'National Events Hub', 'description' => 'Main chat for all national events', 'is_active' => false],
        ];

        foreach ($superAdminChats as $index => $chatData) {
            $event = $superAdminEvents->random();
            Chat::create(array_merge($chatData, [
                'event_id' => $event->id,
                'admin_id' => $superAdmin->id,
            ]));
        }

        // Regular Admin Chats
        $regularAdminChats = [
            ['title' => 'Local Events Chat', 'description' => 'Chat for local youth house events', 'is_active' => true],
            ['title' => 'Football Tournament Group', 'description' => 'Chat for tournament participants', 'is_active' => true],
            ['title' => 'Arts & Crafts Workshop', 'description' => 'Discussion about art projects', 'is_active' => true],
        ];

        foreach ($regularAdminChats as $index => $chatData) {
            $event = $regularAdminEvents->random();
            Chat::create(array_merge($chatData, [
                'event_id' => $event->id,
                'admin_id' => $regularAdmin->id,
            ]));
        }

        // Some chats without events
        Chat::create([
            'title' => 'General Community Chat',
            'description' => 'General community discussion',
            'is_active' => true,
            'event_id' => null,
            'admin_id' => $superAdmin->id,
        ]);

        Chat::create([
            'title' => 'Local House Chat',
            'description' => 'General chat for local youth house',
            'is_active' => true,
            'event_id' => null,
            'admin_id' => $regularAdmin->id,
        ]);

        $totalChats = Chat::count();
        $superAdminChatsCount = Chat::where('admin_id', $superAdmin->id)->count();
        $regularAdminChatsCount = Chat::where('admin_id', $regularAdmin->id)->count();

        $this->command->info('Chats seeded successfully!');
        $this->command->info('- Total chats: ' . $totalChats);
        $this->command->info('- Super Admin chats: ' . $superAdminChatsCount);
        $this->command->info('- Regular Admin chats: ' . $regularAdminChatsCount);
    }
}
