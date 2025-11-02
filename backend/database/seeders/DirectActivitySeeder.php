<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\DirectActivity;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class DirectActivitySeeder extends Seeder
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

        // Direct activities - Community Projects
        $directActivities = [
            [
                'title' => 'مختبر الروبوتات للشباب',
                'description' => 'تعلم البرمجة وبناء روبوتات بسيطة في مختبر مجهز بأحدث التقنيات',
                'category' => 'Volunteer',
                'date' => Carbon::now()->addDays(8)->setTime(13, 0),
                'time' => '13:00',
                'location' => 'دار الشباب المركزي - سطيف',
                'attendance_type' => 'in-person',
                'organizer' => 'نادي التقنية والابتكار',
                'organizer_contact' => '+213 555 666 777',
                'admin_id' => $regularAdmin->id,
                'center_id' => 1,
                'center_name' => 'دار الشباب المركزي',
                'price' => null,
                'has_price' => false,
                'participants' => 35,
                'capacity' => 40,
                'image_url' => 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop',
                'is_featured' => true,
                'is_active' => true,
                'status' => 'upcoming',
                'votes' => 142,
                'target_audience' => 'الشباب 15-25 سنة',
            ],
            [
                'title' => 'مركز الفنون والحرف اليدوية',
                'description' => 'تعليم الفنون التقليدية الجزائرية والحرف اليدوية - الحفاظ على التراث',
                'category' => 'Community Service',
                'date' => Carbon::now()->addDays(11)->setTime(10, 0),
                'time' => '10:00',
                'location' => 'دار الشباب وهران',
                'attendance_type' => 'in-person',
                'organizer' => 'جمعية التراث الثقافي',
                'organizer_contact' => '+213 555 777 888',
                'admin_id' => $regularAdmin->id,
                'center_id' => 2,
                'center_name' => 'دار الشباب وهران',
                'price' => 300.00,
                'has_price' => true,
                'participants' => 28,
                'capacity' => 35,
                'image_url' => 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=400&fit=crop',
                'is_featured' => true,
                'is_active' => true,
                'status' => 'upcoming',
                'votes' => 98,
                'target_audience' => 'جميع الأعمار',
            ],
            [
                'title' => 'حديقة حضرية مجتمعية',
                'description' => 'مساحة خضراء لزراعة الخضروات وتعزيز الوعي البيئي - مشروع مجتمعي',
                'category' => 'Community Service',
                'date' => Carbon::now()->addDays(13)->setTime(8, 0),
                'time' => '08:00',
                'location' => 'دار الشباب قسنطينة',
                'attendance_type' => 'in-person',
                'organizer' => 'نادي البيئة والتنمية المستدامة',
                'organizer_contact' => '+213 555 888 999',
                'admin_id' => $regularAdmin->id,
                'center_id' => 3,
                'center_name' => 'دار الشباب قسنطينة',
                'price' => null,
                'has_price' => false,
                'participants' => 40,
                'capacity' => 50,
                'image_url' => 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&h=400&fit=crop',
                'is_featured' => true,
                'is_active' => true,
                'status' => 'upcoming',
                'votes' => 87,
                'target_audience' => 'الشباب والعائلات',
            ],
            [
                'title' => 'أكاديمية الرياضات الإلكترونية',
                'description' => 'تدريب احترافي للرياضات الإلكترونية مع معدات حديثة ومنافسات دورية',
                'category' => 'Volunteer',
                'date' => Carbon::now()->addDays(15)->setTime(16, 0),
                'time' => '16:00',
                'location' => 'دار الشباب المركزي - سطيف',
                'attendance_type' => 'in-person',
                'organizer' => 'نادي الرياضات الإلكترونية',
                'organizer_contact' => '+213 555 999 000',
                'admin_id' => $regularAdmin->id,
                'center_id' => 1,
                'center_name' => 'دار الشباب المركزي',
                'price' => 1000.00,
                'has_price' => true,
                'participants' => 50,
                'capacity' => 60,
                'image_url' => 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop',
                'is_featured' => true,
                'is_active' => true,
                'status' => 'upcoming',
                'votes' => 156,
                'target_audience' => 'الشباب 14-30 سنة',
            ],
            [
                'title' => 'مركز الدعم الدراسي المجاني',
                'description' => 'دروس تقوية مجانية لطلاب الثانوية في المواد العلمية والأدبية',
                'category' => 'Community Service',
                'date' => Carbon::now()->addDays(2)->setTime(14, 0),
                'time' => '14:00',
                'location' => 'دار الشباب وهران',
                'attendance_type' => 'in-person',
                'organizer' => 'نادي التضامن الطلابي',
                'organizer_contact' => '+213 555 123 789',
                'admin_id' => $regularAdmin->id,
                'center_id' => 2,
                'center_name' => 'دار الشباب وهران',
                'price' => null,
                'has_price' => false,
                'participants' => 60,
                'capacity' => 80,
                'image_url' => 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop',
                'is_featured' => false,
                'is_active' => true,
                'status' => 'upcoming',
                'votes' => 203,
                'target_audience' => 'طلاب الثانوية',
            ],
        ];

        foreach ($directActivities as $activity) {
            DirectActivity::create($activity);
        }

        $this->command->info('Direct activities seeded successfully!');
        $this->command->info('- ' . count($directActivities) . ' direct activities created');
    }
}
