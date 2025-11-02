<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\EventInscription;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ParticipantController extends Controller
{
    /**
     * Display a listing of participants (users registered for events - inscriptions)
     */
    public function index(Request $request)
    {
        $admin = Auth::guard('admin')->user();
        
        $query = EventInscription::with(['user', 'event.admin']);

        // Filter by event_id
        if ($request->has('event_id') && $request->event_id) {
            $query->where('event_id', $request->event_id);
            
            // Role-based check
            if (!$admin->is_super_admin) {
                $event = Event::find($request->event_id);
                if (!$event || $event->admin_id !== $admin->id) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Accès non autorisé à cet événement',
                    ], 403);
                }
            }
        }

        // Filter by wilaya (from user)
        if ($request->has('wilaya') && $request->wilaya) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('wilaya', $request->wilaya);
            });
        }

        // Role-based filtering - regular admin only sees inscriptions for their events
        if (!$admin->is_super_admin) {
            $query->whereHas('event', function ($q) use ($admin) {
                $q->where('admin_id', $admin->id);
            });
        }

        $inscriptions = $query->orderBy('created_at', 'desc')->get();

        // Transform to show participants with their registration info
        $participants = $inscriptions->map(function ($inscription) {
            $user = $inscription->user;
            return [
                'id' => $user->id,
                'nom' => $user->nom,
                'prenom' => $user->prenom,
                'email' => $user->email,
                'wilaya' => $user->wilaya,
                'commune' => $user->commune,
                'score' => $user->score,
                'attended_events_count' => $user->attended_events_count,
                'inscription_id' => $inscription->id,
                'event_id' => $inscription->event_id,
                'event_title' => $inscription->event->title,
                'event_type' => $inscription->event->type,
                'inscription_status' => $inscription->status,
                'created_at' => $inscription->created_at,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'participants' => $participants,
            ],
        ]);
    }

    /**
     * Display the specified participant (from inscription)
     */
    public function show($id)
    {
        // This is the inscription_id, get the inscription with relationships
        $inscription = EventInscription::with(['user', 'event.admin'])->findOrFail($id);
        $user = $inscription->user;

        return response()->json([
            'success' => true,
            'data' => [
                'participant' => [
                    'id' => $user->id,
                    'nom' => $user->nom,
                    'prenom' => $user->prenom,
                    'email' => $user->email,
                    'wilaya' => $user->wilaya,
                    'commune' => $user->commune,
                    'score' => $user->score,
                    'attended_events_count' => $user->attended_events_count,
                    'inscription_id' => $inscription->id,
                    'event_id' => $inscription->event_id,
                    'event_title' => $inscription->event->title,
                    'inscription_status' => $inscription->status,
                ],
            ],
        ]);
    }

    /**
     * Get participant attendance (events they attended)
     */
    public function attendance($id)
    {
        $participant = User::findOrFail($id);

        // Get events where user has inscription with status 'attended'
        $events = EventInscription::where('user_id', $id)
            ->where('status', 'attended')
            ->with('event.admin')
            ->get()
            ->map(function ($inscription) {
                return $inscription->event;
            })
            ->filter();

        return response()->json([
            'success' => true,
            'data' => [
                'events' => $events,
            ],
        ]);
    }
}
