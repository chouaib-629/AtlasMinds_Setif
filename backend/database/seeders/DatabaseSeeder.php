<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed admins and users first
        $this->call([
            AdminSeeder::class,
            UserSeeder::class,
        ]);

        // Seed events, then related data
        $this->call([
            EventSeeder::class,
            EventInscriptionSeeder::class,
            PaymentSeeder::class,
            ChatSeeder::class,
            LivestreamSeeder::class,
        ]);

        // Seed home page activities
        $this->call([
            EducationSeeder::class,
            ClubSeeder::class,
            DirectActivitySeeder::class,
        ]);
    }
}
