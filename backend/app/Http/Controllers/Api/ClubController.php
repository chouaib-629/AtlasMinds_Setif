<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Club;
use Illuminate\Http\Request;

class ClubController extends Controller
{
    /**
     * Get all club activities (public endpoint for mobile app)
     */
    public function index(Request $request)
    {
        $query = Club::where('is_active', true);

        // Filter by featured
        if ($request->has('featured') && $request->featured == 'true') {
            $query->where('is_featured', true);
        }

        // Filter by category
        if ($request->has('category') && $request->category) {
            $query->where('category', $request->category);
        }

        // Order by date
        $clubs = $query->orderBy('date', 'asc')->get();

        // Format response for mobile app
        $formatted = $clubs->map(function ($club) {
            return [
                'id' => $club->id,
                'title' => $club->title,
                'description' => $club->description,
                'category' => $club->category,
                'date' => $club->date->format('Y-m-d'),
                'time' => $club->time ?? $club->date->format('H:i A'),
                'location' => $club->location,
                'type' => ucfirst($club->attendance_type),
                'organizer' => $club->organizer ?? 'Youth Center',
                'price' => $club->has_price ? ($club->price ? number_format($club->price, 2) . ' DZD' : 'Paid') : 'Free',
                'participants' => $club->participants,
                'capacity' => $club->capacity,
                'image_url' => $club->image_url,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $formatted,
        ]);
    }

    /**
     * Get featured club activities
     */
    public function featured()
    {
        $clubs = Club::where('is_active', true)
            ->where('is_featured', true)
            ->orderBy('date', 'asc')
            ->limit(5)
            ->get();

        $formatted = $clubs->map(function ($club) {
            return [
                'id' => $club->id,
                'title' => $club->title,
                'description' => $club->description,
                'category' => $club->category,
                'date' => $club->date->format('M d, Y'),
                'participants' => $club->participants,
                'image_url' => $club->image_url,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $formatted,
        ]);
    }

    /**
     * Get a single club activity by ID
     */
    public function show(Request $request, $id)
    {
        $club = Club::where('is_active', true)->find($id);

        if (!$club) {
            return response()->json([
                'success' => false,
                'message' => 'Club activity not found',
            ], 404);
        }

        // Get authenticated user if available
        $user = auth('api')->user();
        $userInscription = null;
        
        if ($user) {
            $userInscription = \App\Models\ClubInscription::where('user_id', $user->id)
                ->where('club_id', $id)
                ->first();
        }

        // Calculate participants from approved inscriptions
        $participantsCount = $club->inscriptions()->where('status', 'approved')->count();

        $formatted = [
            'id' => $club->id,
            'type' => 'club',
            'title' => $club->title,
            'description' => $club->description,
            'category' => $club->category,
            'date' => $club->date->format('Y-m-d'),
            'time' => $club->time ?? $club->date->format('H:i'),
            'location' => $club->location,
            'attendance_type' => $club->attendance_type,
            'organizer' => $club->organizer ?? 'Youth Center',
            'organizer_contact' => $club->organizer_contact ?? $club->organizer,
            'center_id' => (string)($club->center_id ?? $club->id),
            'center_name' => $club->center_name ?? $club->location ?? 'دار الشباب',
            'has_price' => $club->has_price,
            'price' => $club->has_price ? ($club->price ? (float)$club->price : null) : null,
            'participants' => $participantsCount,
            'capacity' => $club->capacity,
            'image_url' => $club->image_url,
            'status' => $club->status ?? 'upcoming',
            'duration' => $club->duration,
            'level' => $club->level,
            'is_registered' => $userInscription !== null,
            'registration_status' => $userInscription ? $userInscription->status : null,
        ];

        return response()->json([
            'success' => true,
            'data' => $formatted,
        ]);
    }

    /**
     * Join/Register for a club activity
     */
    public function join(Request $request, $id)
    {
        $club = Club::where('is_active', true)->find($id);

        if (!$club) {
            return response()->json([
                'success' => false,
                'message' => 'Club activity not found',
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
        $existingInscription = \App\Models\ClubInscription::where('user_id', $user->id)
            ->where('club_id', $id)
            ->first();

        if ($existingInscription) {
            return response()->json([
                'success' => false,
                'message' => 'You are already registered for this activity',
                'data' => [
                    'status' => $existingInscription->status,
                    'participants' => $club->inscriptions()->where('status', 'approved')->count(),
                    'capacity' => $club->capacity,
                ],
            ], 400);
        }

        // Check capacity (count approved inscriptions)
        $approvedCount = $club->inscriptions()->where('status', 'approved')->count();
        if ($club->capacity && $approvedCount >= $club->capacity) {
            return response()->json([
                'success' => false,
                'message' => 'Activity is full',
            ], 400);
        }

        // Create inscription with pending status
        $inscription = \App\Models\ClubInscription::create([
            'user_id' => $user->id,
            'club_id' => $id,
            'status' => 'pending',
        ]);

        // Update participants count (total approved)
        $club->participants = $club->inscriptions()->where('status', 'approved')->count();
        $club->save();

        return response()->json([
            'success' => true,
            'message' => 'Successfully registered for activity',
            'data' => [
                'inscription_id' => $inscription->id,
                'status' => $inscription->status,
                'participants' => $club->participants,
                'capacity' => $club->capacity,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name ?? ($user->nom . ' ' . $user->prenom),
                    'email' => $user->email,
                ],
            ],
        ]);
    }
}
