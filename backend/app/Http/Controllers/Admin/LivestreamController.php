<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Livestream;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class LivestreamController extends Controller
{
    /**
     * Display a listing of livestreams
     */
    public function index(Request $request)
    {
        $admin = Auth::guard('admin')->user();
        
        $query = Livestream::with(['event.admin', 'admin']);

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

        // Role-based filtering
        if (!$admin->is_super_admin) {
            // Regular admin can only see livestreams for their events
            $query->whereHas('event', function ($q) use ($admin) {
                $q->where('admin_id', $admin->id);
            });
        }

        $livestreams = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => [
                'livestreams' => $livestreams,
            ],
        ]);
    }

    /**
     * Store a newly created livestream
     */
    public function store(Request $request)
    {
        $admin = Auth::guard('admin')->user();

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'stream_url' => 'required|url',
            'is_live' => 'boolean',
            'event_id' => 'nullable|exists:events,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Role-based check for event
        if ($request->event_id) {
            $event = Event::find($request->event_id);
            if (!$admin->is_super_admin && $event->admin_id !== $admin->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous ne pouvez créer des livestreams que pour vos événements',
                ], 403);
            }
        }

        $livestream = Livestream::create([
            'title' => $request->title,
            'description' => $request->description,
            'stream_url' => $request->stream_url,
            'is_live' => $request->is_live ?? false,
            'event_id' => $request->event_id,
            'admin_id' => $admin->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Livestream créé avec succès',
            'data' => [
                'livestream' => $livestream->load(['event.admin', 'admin']),
            ],
        ], 201);
    }

    /**
     * Update the specified livestream
     */
    public function update(Request $request, $id)
    {
        $admin = Auth::guard('admin')->user();
        
        $livestream = Livestream::with('event')->findOrFail($id);

        // Role-based access check
        if (!$admin->is_super_admin && $livestream->admin_id !== $admin->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez modifier que vos propres livestreams',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'stream_url' => 'sometimes|required|url',
            'is_live' => 'boolean',
            'event_id' => 'nullable|exists:events,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Check event access if event_id is being updated
        if ($request->has('event_id') && $request->event_id) {
            $event = Event::find($request->event_id);
            if (!$admin->is_super_admin && $event->admin_id !== $admin->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous ne pouvez associer des livestreams qu\'à vos événements',
                ], 403);
            }
        }

        $livestream->update($request->only(['title', 'description', 'stream_url', 'is_live', 'event_id']));

        return response()->json([
            'success' => true,
            'message' => 'Livestream mis à jour avec succès',
            'data' => [
                'livestream' => $livestream->load(['event.admin', 'admin']),
            ],
        ]);
    }

    /**
     * Remove the specified livestream
     */
    public function destroy($id)
    {
        $admin = Auth::guard('admin')->user();
        
        $livestream = Livestream::findOrFail($id);

        // Role-based access check
        if (!$admin->is_super_admin && $livestream->admin_id !== $admin->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez supprimer que vos propres livestreams',
            ], 403);
        }

        $livestream->delete();

        return response()->json([
            'success' => true,
            'message' => 'Livestream supprimé avec succès',
        ]);
    }
}
