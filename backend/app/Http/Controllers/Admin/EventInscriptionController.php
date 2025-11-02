<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EventInscription;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class EventInscriptionController extends Controller
{
    /**
     * Display a listing of event inscriptions
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

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Role-based filtering
        if (!$admin->is_super_admin) {
            // Regular admin can only see inscriptions for their events
            $query->whereHas('event', function ($q) use ($admin) {
                $q->where('admin_id', $admin->id);
            });
        }

        $inscriptions = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => [
                'inscriptions' => $inscriptions,
            ],
        ]);
    }

    /**
     * Update inscription status
     */
    public function updateStatus(Request $request, $id)
    {
        $admin = Auth::guard('admin')->user();
        
        $inscription = EventInscription::with('event')->findOrFail($id);

        // Role-based access check
        if (!$admin->is_super_admin && $inscription->event->admin_id !== $admin->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez modifier que les inscriptions de vos événements',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:approved,rejected',
        ], [
            'status.required' => 'Le statut est requis',
            'status.in' => 'Le statut doit être: approved ou rejected',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors(),
            ], 422);
        }

        $inscription->status = $request->status;
        $inscription->save();

        return response()->json([
            'success' => true,
            'message' => 'Statut de l\'inscription mis à jour avec succès',
            'data' => [
                'inscription' => $inscription->load(['user', 'event.admin']),
            ],
        ]);
    }
}
