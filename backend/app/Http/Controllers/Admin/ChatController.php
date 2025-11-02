<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Chat;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ChatController extends Controller
{
    /**
     * Display a listing of chats
     */
    public function index(Request $request)
    {
        $admin = Auth::guard('admin')->user();
        
        $query = Chat::with(['event.admin', 'admin']);

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
            // Regular admin can only see chats for their events
            $query->whereHas('event', function ($q) use ($admin) {
                $q->where('admin_id', $admin->id);
            });
        }

        $chats = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => [
                'chats' => $chats,
            ],
        ]);
    }

    /**
     * Store a newly created chat
     */
    public function store(Request $request)
    {
        $admin = Auth::guard('admin')->user();

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
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
                    'message' => 'Vous ne pouvez créer des chats que pour vos événements',
                ], 403);
            }
        }

        $chat = Chat::create([
            'title' => $request->title,
            'description' => $request->description,
            'is_active' => $request->is_active ?? true,
            'event_id' => $request->event_id,
            'admin_id' => $admin->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Chat créé avec succès',
            'data' => [
                'chat' => $chat->load(['event.admin', 'admin']),
            ],
        ], 201);
    }

    /**
     * Update the specified chat
     */
    public function update(Request $request, $id)
    {
        $admin = Auth::guard('admin')->user();
        
        $chat = Chat::with('event')->findOrFail($id);

        // Role-based access check
        if (!$admin->is_super_admin && $chat->admin_id !== $admin->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez modifier que vos propres chats',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
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
                    'message' => 'Vous ne pouvez associer des chats qu\'à vos événements',
                ], 403);
            }
        }

        $chat->update($request->only(['title', 'description', 'is_active', 'event_id']));

        return response()->json([
            'success' => true,
            'message' => 'Chat mis à jour avec succès',
            'data' => [
                'chat' => $chat->load(['event.admin', 'admin']),
            ],
        ]);
    }

    /**
     * Remove the specified chat
     */
    public function destroy($id)
    {
        $admin = Auth::guard('admin')->user();
        
        $chat = Chat::findOrFail($id);

        // Role-based access check
        if (!$admin->is_super_admin && $chat->admin_id !== $admin->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez supprimer que vos propres chats',
            ], 403);
        }

        $chat->delete();

        return response()->json([
            'success' => true,
            'message' => 'Chat supprimé avec succès',
        ]);
    }
}
