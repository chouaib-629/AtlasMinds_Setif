<?php

namespace Database\Seeders;

use App\Models\Livestream;
use App\Models\Event;
use App\Models\Admin;
use Illuminate\Database\Seeder;

class LivestreamSeeder extends Seeder
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

        // Super Admin Livestreams
        $superAdminLivestreams = [
            [
                'title' => 'National Conference Live Stream',
                'description' => 'Live streaming of the national youth conference',
                'stream_url' => 'https://youtube.com/live/national-conference-2025',
                'is_live' => false,
            ],
            [
                'title' => 'Virtual Workshop Stream',
                'description' => 'Live coding workshop stream',
                'stream_url' => 'https://youtube.com/live/coding-workshop',
                'is_live' => true,
            ],
        ];

        foreach ($superAdminLivestreams as $livestreamData) {
            $event = $superAdminEvents->random();
            Livestream::create(array_merge($livestreamData, [
                'event_id' => $event->id,
                'admin_id' => $superAdmin->id,
            ]));
        }

        // Regular Admin Livestreams
        $regularAdminLivestreams = [
            [
                'title' => 'Local Tournament Broadcast',
                'description' => 'Live stream of local football tournament',
                'stream_url' => 'https://youtube.com/live/local-tournament',
                'is_live' => false,
            ],
            [
                'title' => 'Cooking Class Live',
                'description' => 'Live cooking demonstration',
                'stream_url' => 'https://youtube.com/live/cooking-class',
                'is_live' => true,
            ],
        ];

        foreach ($regularAdminLivestreams as $livestreamData) {
            $event = $regularAdminEvents->random();
            Livestream::create(array_merge($livestreamData, [
                'event_id' => $event->id,
                'admin_id' => $regularAdmin->id,
            ]));
        }

        $totalLivestreams = Livestream::count();
        $liveLivestreams = Livestream::where('is_live', true)->count();
        $superAdminLivestreamsCount = Livestream::where('admin_id', $superAdmin->id)->count();
        $regularAdminLivestreamsCount = Livestream::where('admin_id', $regularAdmin->id)->count();

        $this->command->info('Livestreams seeded successfully!');
        $this->command->info('- Total livestreams: ' . $totalLivestreams);
        $this->command->info('- Live streams: ' . $liveLivestreams);
        $this->command->info('- Super Admin livestreams: ' . $superAdminLivestreamsCount);
        $this->command->info('- Regular Admin livestreams: ' . $regularAdminLivestreamsCount);
    }
}
