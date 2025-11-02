<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Education;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class EducationController extends Controller
{
    /**
     * Display a listing of education activities
     */
    public function index(Request $request)
    {
        $admin = Auth::guard('admin')->user();
        
        $query = Education::query();

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

        $educations = $query->with('admin')->orderBy('date', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => [
                'educations' => $educations,
            ],
        ]);
    }

    /**
     * Store a newly created education activity
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
            'duration' => 'nullable|string|max:255',
            'level' => 'nullable|in:مبتدئ,متوسط,متقدم',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors(),
            ], 422);
        }

        $education = Education::create([
            'title' => $request->title,
            'description' => $request->description,
            'category' => $request->category ?? 'Workshop',
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
            'duration' => $request->duration,
            'level' => $request->level,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Activité éducative créée avec succès',
            'data' => [
                'education' => $education->load('admin'),
            ],
        ], 201);
    }

    /**
     * Display the specified education activity
     */
    public function show($id)
    {
        $admin = Auth::guard('admin')->user();
        
        $education = Education::with(['admin', 'inscriptions.user'])->findOrFail($id);

        // Role-based access check
        if (!$admin->is_super_admin && $education->admin_id !== $admin->id) {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'education' => $education,
            ],
        ]);
    }

    /**
     * Update the specified education activity
     */
    public function update(Request $request, $id)
    {
        $admin = Auth::guard('admin')->user();
        
        $education = Education::findOrFail($id);

        // Role-based access check
        if (!$admin->is_super_admin && $education->admin_id !== $admin->id) {
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
            'duration' => 'nullable|string|max:255',
            'level' => 'nullable|in:مبتدئ,متوسط,متقدم',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors(),
            ], 422);
        }

        $education->update($request->only([
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
            'duration',
            'level',
            'is_active',
        ]));

        // Ensure price is null if has_price is false
        if (!$education->has_price) {
            $education->price = null;
            $education->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Activité éducative mise à jour avec succès',
            'data' => [
                'education' => $education->load('admin'),
            ],
        ]);
    }

    /**
     * Remove the specified education activity
     */
    public function destroy($id)
    {
        $admin = Auth::guard('admin')->user();
        
        $education = Education::findOrFail($id);

        // Role-based access check
        if (!$admin->is_super_admin && $education->admin_id !== $admin->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez supprimer que vos propres activités',
            ], 403);
        }

        $education->delete();

        return response()->json([
            'success' => true,
            'message' => 'Activité éducative supprimée avec succès',
        ]);
    }
}
