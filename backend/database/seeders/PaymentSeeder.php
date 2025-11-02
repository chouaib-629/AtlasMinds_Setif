<?php

namespace Database\Seeders;

use App\Models\Payment;
use App\Models\Event;
use App\Models\EventInscription;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class PaymentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get events that have pricing
        $eventsWithPrice = Event::where('has_price', true)->get();

        if ($eventsWithPrice->isEmpty()) {
            $this->command->warn('No events with pricing found. Please create events with pricing first.');
            return;
        }

        $statuses = ['pending', 'completed', 'failed', 'refunded'];
        $paymentMethods = ['bank_transfer', 'cash', 'mobile_payment', 'credit_card'];

        foreach ($eventsWithPrice as $event) {
            // Get approved inscriptions for this event
            $inscriptions = EventInscription::where('event_id', $event->id)
                ->whereIn('status', ['approved', 'attended'])
                ->get();

            foreach ($inscriptions as $inscription) {
                // Create payment for each approved inscription
                $status = $statuses[array_rand([0, 1, 1, 1])]; // Favor completed
                
                Payment::updateOrCreate(
                    [
                        'user_id' => $inscription->user_id,
                        'event_id' => $event->id,
                    ],
                    [
                        'amount' => $event->price,
                        'status' => $status,
                        'payment_method' => $status === 'completed' ? $paymentMethods[array_rand($paymentMethods)] : null,
                        'transaction_id' => $status === 'completed' ? 'TXN' . rand(100000, 999999) : null,
                        'paid_at' => $status === 'completed' ? Carbon::now()->subDays(rand(1, 30)) : null,
                    ]
                );
            }
        }

        $totalPayments = Payment::count();
        $superAdminPayments = Payment::whereHas('event.admin', function ($q) {
            $q->where('is_super_admin', true);
        })->count();
        $regularAdminPayments = Payment::whereHas('event.admin', function ($q) {
            $q->where('is_super_admin', false);
        })->count();

        $this->command->info('Payments seeded successfully!');
        $this->command->info('- Total payments: ' . $totalPayments);
        $this->command->info('- Super Admin event payments: ' . $superAdminPayments);
        $this->command->info('- Regular Admin event payments: ' . $regularAdminPayments);
    }
}
