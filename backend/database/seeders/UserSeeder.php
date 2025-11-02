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
        // Create test user
        User::updateOrCreate(
            ['email' => 'user@youth.com'],
            [
                'name' => 'Test User',
                'nom' => 'User',
                'prenom' => 'Test',
                'date_de_naissance' => '2000-01-15',
                'adresse' => '123 Rue de Test',
                'commune' => 'Sétif',
                'wilaya' => 'Sétif',
                'numero_telephone' => '0550123456',
                'email' => 'user@youth.com',
                'password' => Hash::make('azerty123'),
            ]
        );
    }
}
