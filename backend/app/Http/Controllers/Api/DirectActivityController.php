<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DirectActivity;
use Illuminate\Http\Request;

class DirectActivityController extends Controller
{
    /**
     * Get all direct activities (public endpoint for mobile app)
     */
    public function index(Request $request)
    {
        $query = DirectActivity::where('is_active', true);

        // Filter by featured
        if ($request->has('featured') && $request->featured == 'true') {
            $query->where('is_featured', true);
        }

        // Filter by category
        if ($request->has('category') && $request->category) {
            $query->where('category', $request->category);
        }

        // Order by date
        $activities = $query->orderBy('date', 'asc')->get();

        // Format response for mobile app
        $formatted = $activities->map(function ($activity) {
            return [
                'id' => $activity->id,
                'title' => $activity->title,
                'description' => $activity->description,
                'category' => $activity->category,
                'date' => $activity->date->format('Y-m-d'),
                'time' => $activity->time ?? $activity->date->format('H:i A'),
                'location' => $activity->location,
                'type' => ucfirst($activity->attendance_type),
                'organizer' => $activity->organizer ?? 'Youth Center',
                'price' => $activity->has_price ? ($activity->price ? number_format($activity->price, 2) . ' DZD' : 'Paid') : 'Free',
                'participants' => $activity->participants,
                'capacity' => $activity->capacity,
                'image_url' => $activity->image_url,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $formatted,
        ]);
    }

    /**
     * Get featured direct activities
     */
    public function featured()
    {
        $activities = DirectActivity::where('is_active', true)
            ->where('is_featured', true)
            ->orderBy('date', 'asc')
            ->limit(5)
            ->get();

        $formatted = $activities->map(function ($activity) {
            return [
                'id' => $activity->id,
                'title' => $activity->title,
                'description' => $activity->description,
                'category' => $activity->category,
                'date' => $activity->date->format('M d, Y'),
                'participants' => $activity->participants,
                'image_url' => $activity->image_url,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $formatted,
        ]);
    }

    /**
     * Get a single direct activity by ID
     */
    public function show(Request $request, $id)
    {
        $activity = DirectActivity::where('is_active', true)->find($id);

        if (!$activity) {
            return response()->json([
                'success' => false,
                'message' => 'Direct activity not found',
            ], 404);
        }

        // Get authenticated user if available
        $user = auth('api')->user();
        $userInscription = null;
        
        if ($user) {
            $userInscription = \App\Models\DirectActivityInscription::where('user_id', $user->id)
                ->where('direct_activity_id', $id)
                ->first();
        }

        // Calculate participants from approved inscriptions
        $participantsCount = $activity->inscriptions()->where('status', 'approved')->count();

        $formatted = [
            'id' => $activity->id,
            'type' => 'direct_activity',
            'title' => $activity->title,
            'description' => $activity->description,
            'category' => $activity->category,
            'date' => $activity->date->format('Y-m-d'),
            'time' => $activity->time ?? $activity->date->format('H:i'),
            'location' => $activity->location,
            'attendance_type' => $activity->attendance_type,
            'organizer' => $activity->organizer ?? 'Youth Center',
            'organizer_contact' => $activity->organizer_contact ?? $activity->organizer,
            'center_id' => (string)($activity->center_id ?? $activity->id),
            'center_name' => $activity->center_name ?? $activity->location ?? 'دار الشباب',
            'has_price' => $activity->has_price,
            'price' => $activity->has_price ? ($activity->price ? (float)$activity->price : null) : null,
            'participants' => $participantsCount,
            'capacity' => $activity->capacity,
            'image_url' => $activity->image_url,
            'status' => $activity->status ?? 'upcoming',
            'votes' => $activity->votes ?? 0,
            'target_audience' => $activity->target_audience,
            'is_registered' => $userInscription !== null,
            'registration_status' => $userInscription ? $userInscription->status : null,
        ];

        return response()->json([
            'success' => true,
            'data' => $formatted,
        ]);
    }

    /**
     * Join/Register for a direct activity
     */
    public function join(Request $request, $id)
    {
        $activity = DirectActivity::where('is_active', true)->find($id);

        if (!$activity) {
            return response()->json([
                'success' => false,
                'message' => 'Direct activity not found',
            ], 404);
        }

        // Check if user is authenticated
        $user = auth('api')->user();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication required',
            ], 401);
        }

        // Check if user is already registered
        $existingInscription = \App\Models\DirectActivityInscription::where('user_id', $user->id)
            ->where('direct_activity_id', $id)
            ->first();

        if ($existingInscription) {
            return response()->json([
                'success' => false,
                'message' => 'You are already registered for this activity',
                'data' => [
                    'status' => $existingInscription->status,
                    'participants' => $activity->inscriptions()->where('status', 'approved')->count(),
                    'capacity' => $activity->capacity,
                ],
            ], 400);
        }

        // Check capacity (count approved inscriptions)
        $approvedCount = $activity->inscriptions()->where('status', 'approved')->count();
        if ($activity->capacity && $approvedCount >= $activity->capacity) {
            return response()->json([
                'success' => false,
                'message' => 'Activity is full',
            ], 400);
        }

        // Create inscription with pending status
        $inscription = \App\Models\DirectActivityInscription::create([
            'user_id' => $user->id,
            'direct_activity_id' => $id,
            'status' => 'pending',
        ]);

        // Update participants count (total approved)
        $activity->participants = $activity->inscriptions()->where('status', 'approved')->count();
        $activity->save();

        return response()->json([
            'success' => true,
            'message' => 'Successfully registered for activity',
            'data' => [
                'inscription_id' => $inscription->id,
                'status' => $inscription->status,
                'participants' => $activity->participants,
                'capacity' => $activity->capacity,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name ?? ($user->nom . ' ' . $user->prenom),
                    'email' => $user->email,
                ],
            ],
        ]);
    }
}
