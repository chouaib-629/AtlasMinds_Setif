<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $wilayas = ['Alger', 'Sétif', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Batna', 'Djelfa', 'Tizi Ouzou', 'Béjaïa'];
        $communes = ['Centre-ville', 'Aéroport', 'Les Sources', 'Résidence', 'Cité'];

        // Create users across different wilayas to showcase filtering
        $users = [
            // Alger users
            ['nom' => 'Benaissa', 'prenom' => 'Ahmed', 'email' => 'ahmed.benaissa@youth.com', 'wilaya' => 'Alger', 'commune' => 'Centre-ville', 'score' => 1500, 'attended_events_count' => 8],
            ['nom' => 'Kadri', 'prenom' => 'Fatima', 'email' => 'fatima.kadri@youth.com', 'wilaya' => 'Alger', 'commune' => 'Aéroport', 'score' => 1200, 'attended_events_count' => 6],
            ['nom' => 'Moussa', 'prenom' => 'Karim', 'email' => 'karim.moussa@youth.com', 'wilaya' => 'Alger', 'commune' => 'Les Sources', 'score' => 980, 'attended_events_count' => 5],
            
            // Sétif users (for regular admin's youth house)
            ['nom' => 'Amrani', 'prenom' => 'Samira', 'email' => 'samira.amrani@youth.com', 'wilaya' => 'Sétif', 'commune' => 'Centre-ville', 'score' => 1350, 'attended_events_count' => 7],
            ['nom' => 'Boukhari', 'prenom' => 'Youssef', 'email' => 'youssef.boukhari@youth.com', 'wilaya' => 'Sétif', 'commune' => 'Résidence', 'score' => 1100, 'attended_events_count' => 6],
            ['nom' => 'Lakhdar', 'prenom' => 'Nadia', 'email' => 'nadia.lakhdar@youth.com', 'wilaya' => 'Sétif', 'commune' => 'Cité', 'score' => 900, 'attended_events_count' => 4],
            ['nom' => 'Hamadi', 'prenom' => 'Omar', 'email' => 'omar.hamadi@youth.com', 'wilaya' => 'Sétif', 'commune' => 'Les Sources', 'score' => 800, 'attended_events_count' => 4],
            
            // Oran users
            ['nom' => 'Ziani', 'prenom' => 'Leila', 'email' => 'leila.ziani@youth.com', 'wilaya' => 'Oran', 'commune' => 'Centre-ville', 'score' => 1400, 'attended_events_count' => 7],
            ['nom' => 'Bensalem', 'prenom' => 'Mehdi', 'email' => 'mehdi.bensalem@youth.com', 'wilaya' => 'Oran', 'commune' => 'Aéroport', 'score' => 1050, 'attended_events_count' => 5],
            
            // Constantine users
            ['nom' => 'Dahmani', 'prenom' => 'Sara', 'email' => 'sara.dahmani@youth.com', 'wilaya' => 'Constantine', 'commune' => 'Centre-ville', 'score' => 1300, 'attended_events_count' => 6],
            ['nom' => 'Ghazali', 'prenom' => 'Tarek', 'email' => 'tarek.ghazali@youth.com', 'wilaya' => 'Constantine', 'commune' => 'Résidence', 'score' => 950, 'attended_events_count' => 5],
            
            // Other wilayas
            ['nom' => 'Slimani', 'prenom' => 'Imane', 'email' => 'imane.slimani@youth.com', 'wilaya' => 'Annaba', 'commune' => 'Centre-ville', 'score' => 1250, 'attended_events_count' => 6],
            ['nom' => 'Toumi', 'prenom' => 'Bilal', 'email' => 'bilal.toumi@youth.com', 'wilaya' => 'Blida', 'commune' => 'Aéroport', 'score' => 1150, 'attended_events_count' => 5],
            ['nom' => 'Mansouri', 'prenom' => 'Salma', 'email' => 'salma.mansouri@youth.com', 'wilaya' => 'Tizi Ouzou', 'commune' => 'Centre-ville', 'score' => 1000, 'attended_events_count' => 5],
        ];

        foreach ($users as $userData) {
            User::updateOrCreate(
                ['email' => $userData['email']],
                array_merge($userData, [
                    'name' => $userData['prenom'] . ' ' . $userData['nom'],
                    'date_de_naissance' => '2000-01-15',
                    'adresse' => '123 Rue de Test',
                    'numero_telephone' => '0550' . rand(100000, 999999),
                    'password' => Hash::make('password123'),
                    'score' => $userData['score'],
                    'attended_events_count' => $userData['attended_events_count'],
                ])
            );
        }

        $this->command->info('Users seeded successfully!');
        $this->command->info('- Total users: ' . count($users));
        $this->command->info('- Users in Sétif (Regular Admin): ' . collect($users)->where('wilaya', 'Sétif')->count());
    }
}
