<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DirectActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class DirectActivityController extends Controller
{
    /**
     * Display a listing of direct activities
     */
    public function index(Request $request)
    {
        $admin = Auth::guard('admin')->user();
        
        $query = DirectActivity::query();

        // Role-based filtering
        if (!$admin->is_super_admin) {
            // Regular admin can only see their own activities
            $query->where('admin_id', $admin->id);
        }

        // Filter by category
        if ($request->has('category') && $request->category) {
            $query->where('category', $request->category);
        }

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Filter by is_active
        if ($request->has('is_active')) {
            $query->where('is_active', $request->is_active);
        }

        $activities = $query->with('admin')->orderBy('date', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => [
                'direct_activities' => $activities,
            ],
        ]);
    }

    /**
     * Store a newly created direct activity
     */
    public function store(Request $request)
    {
        $admin = Auth::guard('admin')->user();

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'nullable|string|max:255',
            'date' => 'required|date',
            'time' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'attendance_type' => 'required|in:online,in-person,hybrid',
            'organizer' => 'nullable|string|max:255',
            'organizer_contact' => 'nullable|string|max:255',
            'center_id' => 'nullable|integer',
            'center_name' => 'nullable|string|max:255',
            'price' => 'nullable|numeric|min:0',
            'has_price' => 'boolean',
            'capacity' => 'nullable|integer|min:1',
            'image_url' => 'nullable|string|url',
            'is_featured' => 'boolean',
            'status' => 'nullable|in:live,upcoming',
            'votes' => 'nullable|integer|min:0',
            'target_audience' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors(),
            ], 422);
        }

        $activity = DirectActivity::create([
            'title' => $request->title,
            'description' => $request->description,
            'category' => $request->category ?? 'Community',
            'date' => $request->date,
            'time' => $request->time,
            'location' => $request->location,
            'attendance_type' => $request->attendance_type,
            'organizer' => $request->organizer,
            'organizer_contact' => $request->organizer_contact,
            'admin_id' => $admin->id,
            'center_id' => $request->center_id,
            'center_name' => $request->center_name,
            'price' => $request->has_price && $request->price ? $request->price : null,
            'has_price' => $request->has_price ?? false,
            'capacity' => $request->capacity,
            'participants' => 0,
            'image_url' => $request->image_url,
            'is_featured' => $request->is_featured ?? false,
            'is_active' => $request->is_active ?? true,
            'status' => $request->status ?? 'upcoming',
            'votes' => $request->votes ?? 0,
            'target_audience' => $request->target_audience,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Activité directe créée avec succès',
            'data' => [
                'direct_activity' => $activity->load('admin'),
            ],
        ], 201);
    }

    /**
     * Display the specified direct activity
     */
    public function show($id)
    {
        $admin = Auth::guard('admin')->user();
        
        $activity = DirectActivity::with(['admin', 'inscriptions.user'])->findOrFail($id);

        // Role-based access check
        if (!$admin->is_super_admin && $activity->admin_id !== $admin->id) {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'direct_activity' => $activity,
            ],
        ]);
    }

    /**
     * Update the specified direct activity
     */
    public function update(Request $request, $id)
    {
        $admin = Auth::guard('admin')->user();
        
        $activity = DirectActivity::findOrFail($id);

        // Role-based access check
        if (!$admin->is_super_admin && $activity->admin_id !== $admin->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez modifier que vos propres activités',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'category' => 'nullable|string|max:255',
            'date' => 'sometimes|required|date',
            'time' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'attendance_type' => 'sometimes|required|in:online,in-person,hybrid',
            'organizer' => 'nullable|string|max:255',
            'organizer_contact' => 'nullable|string|max:255',
            'center_id' => 'nullable|integer',
            'center_name' => 'nullable|string|max:255',
            'price' => 'nullable|numeric|min:0',
            'has_price' => 'boolean',
            'capacity' => 'nullable|integer|min:1',
            'image_url' => 'nullable|string|url',
            'is_featured' => 'boolean',
            'status' => 'nullable|in:live,upcoming',
            'votes' => 'nullable|integer|min:0',
            'target_audience' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors(),
            ], 422);
        }

        $activity->update($request->only([
            'title',
            'description',
            'category',
            'date',
            'time',
            'location',
            'attendance_type',
            'organizer',
            'organizer_contact',
            'center_id',
            'center_name',
            'price',
            'has_price',
            'capacity',
            'image_url',
            'is_featured',
            'status',
            'votes',
            'target_audience',
            'is_active',
        ]));

        // Ensure price is null if has_price is false
        if (!$activity->has_price) {
            $activity->price = null;
            $activity->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Activité directe mise à jour avec succès',
            'data' => [
                'direct_activity' => $activity->load('admin'),
            ],
        ]);
    }

    /**
     * Remove the specified direct activity
     */
    public function destroy($id)
    {
        $admin = Auth::guard('admin')->user();
        
        $activity = DirectActivity::findOrFail($id);

        // Role-based access check
        if (!$admin->is_super_admin && $activity->admin_id !== $admin->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez supprimer que vos propres activités',
            ], 403);
        }

        $activity->delete();

        return response()->json([
            'success' => true,
            'message' => 'Activité directe supprimée avec succès',
        ]);
    }
}
