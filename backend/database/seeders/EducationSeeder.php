<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Education;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class EducationSeeder extends Seeder
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

        // Education activities - mix of live and upcoming
        $educations = [
            // Live events
            [
                'title' => 'ندوة القيادة الشبابية',
                'description' => 'لقاء تفاعلي مع قادة محليين ومتحدثين ملهمين لمناقشة مهارات القيادة والتطوير الشخصي',
                'category' => 'Workshop',
                'date' => Carbon::now()->subHours(1)->setTime(18, 0),
                'time' => '18:00',
                'location' => 'دار الشباب المركزي - سطيف',
                'attendance_type' => 'in-person',
                'organizer' => 'إدارة الشباب والرياضة',
                'organizer_contact' => '+213 555 123 456',
                'admin_id' => $regularAdmin->id,
                'center_id' => 1,
                'center_name' => 'دار الشباب المركزي',
                'price' => null,
                'has_price' => false,
                'participants' => 45,
                'capacity' => 60,
                'image_url' => 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&h=400&fit=crop',
                'is_featured' => true,
                'is_active' => true,
                'status' => 'live',
                'duration' => '3 ساعات',
                'level' => 'متقدم',
            ],
            [
                'title' => 'ورشة التصميم الجرافيكي',
                'description' => 'تعلم أساسيات التصميم باستخدام Adobe Photoshop و Illustrator للمبتدئين',
                'category' => 'Training',
                'date' => Carbon::now()->addDays(3)->setTime(15, 0),
                'time' => '15:00',
                'location' => 'دار الشباب وهران',
                'attendance_type' => 'hybrid',
                'organizer' => 'نادي التصميم الرقمي',
                'organizer_contact' => '+213 555 234 567',
                'admin_id' => $regularAdmin->id,
                'center_id' => 2,
                'center_name' => 'دار الشباب وهران',
                'price' => 500.00,
                'has_price' => true,
                'participants' => 12,
                'capacity' => 20,
                'image_url' => 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&h=400&fit=crop',
                'is_featured' => true,
                'is_active' => true,
                'status' => 'upcoming',
                'duration' => '4 أسابيع',
                'level' => 'مبتدئ',
            ],
            [
                'title' => 'جلسة تطوير الذات',
                'description' => 'استراتيجيات النجاح والتطوير الشخصي مع مدرب معتمد',
                'category' => 'Workshop',
                'date' => Carbon::now()->addDays(5)->setTime(19, 0),
                'time' => '19:00',
                'location' => 'دار الشباب قسنطينة',
                'attendance_type' => 'in-person',
                'organizer' => 'مركز التطوير الشبابي',
                'organizer_contact' => '+213 555 345 678',
                'admin_id' => $regularAdmin->id,
                'center_id' => 3,
                'center_name' => 'دار الشباب قسنطينة',
                'price' => null,
                'has_price' => false,
                'participants' => 30,
                'capacity' => 50,
                'image_url' => 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&h=400&fit=crop',
                'is_featured' => true,
                'is_active' => true,
                'status' => 'upcoming',
                'duration' => '2 ساعات',
                'level' => 'متوسط',
            ],
            [
                'title' => 'البرمجة بلغة Python',
                'description' => 'دورة متقدمة في البرمجة للمبتدئين - تعلم أساسيات البرمجة والتطبيقات العملية',
                'category' => 'Course',
                'date' => Carbon::now()->addDays(7)->setTime(16, 0),
                'time' => '16:00',
                'location' => 'دار الشباب المركزي - سطيف',
                'attendance_type' => 'hybrid',
                'organizer' => 'نادي البرمجة',
                'organizer_contact' => '+213 555 456 789',
                'admin_id' => $regularAdmin->id,
                'center_id' => 1,
                'center_name' => 'دار الشباب المركزي',
                'price' => 800.00,
                'has_price' => true,
                'participants' => 18,
                'capacity' => 25,
                'image_url' => 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&h=400&fit=crop',
                'is_featured' => true,
                'is_active' => true,
                'status' => 'upcoming',
                'duration' => '6 أسابيع',
                'level' => 'مبتدئ',
            ],
            // Learning Programs
            [
                'title' => 'برنامج القيادة الشبابية',
                'description' => 'برنامج متقدم لتطوير مهارات القيادة والإدارة والمسؤولية المجتمعية',
                'category' => 'Program',
                'date' => Carbon::now()->addDays(10)->setTime(14, 0),
                'time' => '14:00',
                'location' => 'دار الشباب المركزي - سطيف',
                'attendance_type' => 'in-person',
                'organizer' => 'معهد القيادة الشبابية',
                'organizer_contact' => '+213 555 111 222',
                'admin_id' => $regularAdmin->id,
                'center_id' => 1,
                'center_name' => 'دار الشباب المركزي',
                'price' => null,
                'has_price' => false,
                'participants' => 25,
                'capacity' => 30,
                'image_url' => 'https://images.unsplash.com/photo-1759523146335-0069847ceb16?w=600&h=400&fit=crop',
                'is_featured' => true,
                'is_active' => true,
                'status' => 'upcoming',
                'duration' => '6 أسابيع',
                'level' => 'متقدم',
            ],
            [
                'title' => 'مهارات التواصل الفعال',
                'description' => 'تعلم فن التواصل والتأثير في الآخرين - دورة تطبيقية مع تمارين عملية',
                'category' => 'Course',
                'date' => Carbon::now()->addDays(14)->setTime(10, 0),
                'time' => '10:00',
                'location' => 'دار الشباب وهران',
                'attendance_type' => 'in-person',
                'organizer' => 'مركز المهارات الشخصية',
                'organizer_contact' => '+213 555 222 333',
                'admin_id' => $regularAdmin->id,
                'center_id' => 2,
                'center_name' => 'دار الشباب وهران',
                'price' => 600.00,
                'has_price' => true,
                'participants' => 15,
                'capacity' => 20,
                'image_url' => 'https://images.unsplash.com/photo-1545886082-e66c6b9e011a?w=600&h=400&fit=crop',
                'is_featured' => true,
                'is_active' => true,
                'status' => 'upcoming',
                'duration' => '4 أسابيع',
                'level' => 'مبتدئ',
            ],
        ];

        foreach ($educations as $education) {
            Education::create($education);
        }

        $this->command->info('Education activities seeded successfully!');
        $this->command->info('- ' . count($educations) . ' education activities created');
    }
}
