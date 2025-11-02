<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Event;
use App\Models\EventInscription;
use Illuminate\Database\Seeder;

class EventInscriptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $events = Event::with('admin')->get();
        $users = User::all();

        if ($events->isEmpty() || $users->isEmpty()) {
            $this->command->error('Events or Users not found. Please run EventSeeder and UserSeeder first.');
            return;
        }

        $superAdminEvents = $events->filter(function ($event) {
            return $event->admin && $event->admin->is_super_admin;
        });

        $regularAdminEvents = $events->filter(function ($event) {
            return $event->admin && !$event->admin->is_super_admin;
        });

        $statuses = ['pending', 'approved', 'rejected', 'attended'];

        // Create inscriptions for Super Admin events (national/online/hybrid)
        foreach ($superAdminEvents as $event) {
            // Get users from different wilayas for national events
            $participants = $users->random(rand(5, 10));
            
            foreach ($participants as $user) {
                // Random status, but favor approved and attended for variety
                $statusIndexes = [0, 1, 1, 1, 3]; // More approved/attended
                $status = $statuses[$statusIndexes[array_rand($statusIndexes)]];
                
                EventInscription::updateOrCreate(
                    [
                        'user_id' => $user->id,
                        'event_id' => $event->id,
                    ],
                    ['status' => $status]
                );
            }
        }

        // Create inscriptions for Regular Admin events (local)
        // Use mainly Sétif users (regular admin's area)
        $setifUsers = $users->where('wilaya', 'Sétif');
        
        foreach ($regularAdminEvents as $event) {
            // Regular admin events mainly have local participants
            $participants = $setifUsers->random(min(rand(3, 8), $setifUsers->count()));
            
            foreach ($participants as $user) {
                $statusIndexes = [0, 1, 1, 3];
                $status = $statuses[$statusIndexes[array_rand($statusIndexes)]];
                
                EventInscription::updateOrCreate(
                    [
                        'user_id' => $user->id,
                        'event_id' => $event->id,
                    ],
                    ['status' => $status]
                );
            }
        }

        $totalInscriptions = EventInscription::count();
        $superAdminInscriptions = EventInscription::whereHas('event.admin', function ($q) {
            $q->where('is_super_admin', true);
        })->count();
        $regularAdminInscriptions = EventInscription::whereHas('event.admin', function ($q) {
            $q->where('is_super_admin', false);
        })->count();

        $this->command->info('Event Inscriptions seeded successfully!');
        $this->command->info('- Total inscriptions: ' . $totalInscriptions);
        $this->command->info('- Super Admin event inscriptions: ' . $superAdminInscriptions);
        $this->command->info('- Regular Admin event inscriptions: ' . $regularAdminInscriptions);
    }
}
