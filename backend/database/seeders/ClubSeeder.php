<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Club;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class ClubSeeder extends Seeder
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

        // Club activities
        $clubs = [
            [
                'title' => 'إدارة المشاريع الحديثة',
                'description' => 'أسس إدارة المشاريع وأفضل الممارسات العالمية - نادي ريادة الأعمال',
                'category' => 'Club',
                'date' => Carbon::now()->addDays(6)->setTime(14, 0),
                'time' => '14:00',
                'location' => 'دار الشباب قسنطينة',
                'attendance_type' => 'in-person',
                'organizer' => 'نادي ريادة الأعمال',
                'organizer_contact' => '+213 555 333 444',
                'admin_id' => $regularAdmin->id,
                'center_id' => 3,
                'center_name' => 'دار الشباب قسنطينة',
                'price' => null,
                'has_price' => false,
                'participants' => 20,
                'capacity' => 25,
                'image_url' => 'https://images.unsplash.com/photo-1758599669406-d5179ccefcb9?w=600&h=400&fit=crop',
                'is_featured' => true,
                'is_active' => true,
                'status' => 'upcoming',
                'duration' => '8 أسابيع',
                'level' => 'متوسط',
            ],
            [
                'title' => 'التسويق الرقمي للمبتدئين',
                'description' => 'استراتيجيات التسويق الرقمي ووسائل التواصل الاجتماعي - نادي التسويق',
                'category' => 'Club',
                'date' => Carbon::now()->addDays(9)->setTime(15, 0),
                'time' => '15:00',
                'location' => 'دار الشباب المركزي - سطيف',
                'attendance_type' => 'hybrid',
                'organizer' => 'نادي التسويق الرقمي',
                'organizer_contact' => '+213 555 444 555',
                'admin_id' => $regularAdmin->id,
                'center_id' => 1,
                'center_name' => 'دار الشباب المركزي',
                'price' => 400.00,
                'has_price' => true,
                'participants' => 22,
                'capacity' => 30,
                'image_url' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
                'is_featured' => true,
                'is_active' => true,
                'status' => 'upcoming',
                'duration' => '5 أسابيع',
                'level' => 'مبتدئ',
            ],
            [
                'title' => 'نادي القراءة والكتابة',
                'description' => 'لقاءات أسبوعية لمناقشة الكتب وتطوير مهارات الكتابة الإبداعية',
                'category' => 'Club',
                'date' => Carbon::now()->addDays(4)->setTime(17, 0),
                'time' => '17:00',
                'location' => 'دار الشباب وهران',
                'attendance_type' => 'in-person',
                'organizer' => 'نادي الأدب والثقافة',
                'organizer_contact' => '+213 555 555 666',
                'admin_id' => $regularAdmin->id,
                'center_id' => 2,
                'center_name' => 'دار الشباب وهران',
                'price' => null,
                'has_price' => false,
                'participants' => 18,
                'capacity' => 25,
                'image_url' => 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop',
                'is_featured' => false,
                'is_active' => true,
                'status' => 'upcoming',
                'duration' => 'مستمر',
                'level' => 'مبتدئ',
            ],
        ];

        foreach ($clubs as $club) {
            Club::create($club);
        }

        $this->command->info('Club activities seeded successfully!');
        $this->command->info('- ' . count($clubs) . ' club activities created');
    }
}
