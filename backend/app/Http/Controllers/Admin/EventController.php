<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class EventController extends Controller
{
    /**
     * Display a listing of events
     */
    public function index(Request $request)
    {
        $admin = Auth::guard('admin')->user();
        
        $query = Event::query();

        // Role-based filtering
        if (!$admin->is_super_admin) {
            // Regular admin can only see their own events (local events)
            $query->where(function ($q) use ($admin) {
                $q->where('admin_id', $admin->id)
                  ->orWhere('type', 'local');
            });
        }

        // Filter by type
        if ($request->has('type') && $request->type) {
            $query->where('type', $request->type);
        }

        // Filter by attendance_type
        if ($request->has('attendance_type') && $request->attendance_type) {
            $query->where('attendance_type', $request->attendance_type);
        }

        $events = $query->with('admin')->orderBy('date', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => [
                'events' => $events,
            ],
        ]);
    }

    /**
     * Store a newly created event
     */
    public function store(Request $request)
    {
        $admin = Auth::guard('admin')->user();

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => 'required|in:national,local,online,hybrid',
            'attendance_type' => 'required|in:online,in-person,hybrid',
            'date' => 'required|date',
            'location' => 'nullable|string|max:255',
            'price' => 'nullable|numeric|min:0',
            'has_price' => 'boolean',
        ], [
            'title.required' => 'Le titre est requis',
            'description.required' => 'La description est requise',
            'type.required' => 'Le type est requis',
            'type.in' => 'Le type doit être: national, local, online ou hybrid',
            'attendance_type.required' => 'Le type de participation est requis',
            'attendance_type.in' => 'Le type de participation doit être: online, in-person ou hybrid',
            'date.required' => 'La date est requise',
            'date.date' => 'La date doit être valide',
            'price.numeric' => 'Le prix doit être un nombre',
            'price.min' => 'Le prix ne peut pas être négatif',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Role-based restrictions
        if (!$admin->is_super_admin) {
            // Regular admin can only create local, in-person events
            if ($request->type !== 'local' || $request->attendance_type !== 'in-person') {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous ne pouvez créer que des événements locaux en présentiel',
                ], 403);
            }
        }

        $event = Event::create([
            'title' => $request->title,
            'description' => $request->description,
            'type' => $request->type,
            'attendance_type' => $request->attendance_type,
            'date' => $request->date,
            'location' => $request->location,
            'admin_id' => $admin->id,
            'price' => $request->has_price && $request->price ? $request->price : null,
            'has_price' => $request->has_price ?? false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Événement créé avec succès',
            'data' => [
                'event' => $event->load('admin'),
            ],
        ], 201);
    }

    /**
     * Display the specified event
     */
    public function show($id)
    {
        $admin = Auth::guard('admin')->user();
        
        $event = Event::with('admin')->findOrFail($id);

        // Role-based access check
        if (!$admin->is_super_admin && $event->type !== 'local') {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'event' => $event,
            ],
        ]);
    }

    /**
     * Update the specified event
     */
    public function update(Request $request, $id)
    {
        $admin = Auth::guard('admin')->user();
        
        $event = Event::findOrFail($id);

        // Role-based access check
        if (!$admin->is_super_admin && $event->admin_id !== $admin->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez modifier que vos propres événements',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'type' => 'sometimes|required|in:national,local,online,hybrid',
            'attendance_type' => 'sometimes|required|in:online,in-person,hybrid',
            'date' => 'sometimes|required|date',
            'location' => 'nullable|string|max:255',
            'price' => 'nullable|numeric|min:0',
            'has_price' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Role-based restrictions for updates
        if (!$admin->is_super_admin) {
            // Regular admin can only update to local, in-person
            if ($request->has('type') && $request->type !== 'local') {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous ne pouvez créer que des événements locaux',
                ], 403);
            }
            if ($request->has('attendance_type') && $request->attendance_type !== 'in-person') {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous ne pouvez créer que des événements en présentiel',
                ], 403);
            }
        }

        $event->update($request->only([
            'title',
            'description',
            'type',
            'attendance_type',
            'date',
            'location',
            'price',
            'has_price',
        ]));

        // Ensure price is null if has_price is false
        if (!$event->has_price) {
            $event->price = null;
            $event->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Événement mis à jour avec succès',
            'data' => [
                'event' => $event->load('admin'),
            ],
        ]);
    }

    /**
     * Remove the specified event
     */
    public function destroy($id)
    {
        $admin = Auth::guard('admin')->user();
        
        $event = Event::findOrFail($id);

        // Role-based access check
        if (!$admin->is_super_admin && $event->admin_id !== $admin->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez supprimer que vos propres événements',
            ], 403);
        }

        $event->delete();

        return response()->json([
            'success' => true,
            'message' => 'Événement supprimé avec succès',
        ]);
    }
}
