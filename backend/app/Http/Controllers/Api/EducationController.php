<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Education;
use Illuminate\Http\Request;

class EducationController extends Controller
{
    /**
     * Get all education activities (public endpoint for mobile app)
     */
    public function index(Request $request)
    {
        $query = Education::where('is_active', true);

        // Filter by featured
        if ($request->has('featured') && $request->featured == 'true') {
            $query->where('is_featured', true);
        }

        // Filter by category
        if ($request->has('category') && $request->category) {
            $query->where('category', $request->category);
        }

        // Order by date
        $educations = $query->orderBy('date', 'asc')->get();

        // Format response for mobile app
        $formatted = $educations->map(function ($education) {
            return [
                'id' => $education->id,
                'title' => $education->title,
                'description' => $education->description,
                'category' => $education->category,
                'date' => $education->date->format('Y-m-d'),
                'time' => $education->time ?? $education->date->format('H:i A'),
                'location' => $education->location,
                'type' => ucfirst($education->attendance_type),
                'organizer' => $education->organizer ?? 'Youth Center',
                'price' => $education->has_price ? ($education->price ? number_format($education->price, 2) . ' DZD' : 'Paid') : 'Free',
                'participants' => $education->participants,
                'capacity' => $education->capacity,
                'image_url' => $education->image_url,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $formatted,
        ]);
    }

    /**
     * Get featured education activities
     */
    public function featured()
    {
        $educations = Education::where('is_active', true)
            ->where('is_featured', true)
            ->orderBy('date', 'asc')
            ->limit(5)
            ->get();

        $formatted = $educations->map(function ($education) {
            return [
                'id' => $education->id,
                'title' => $education->title,
                'description' => $education->description,
                'category' => $education->category,
                'date' => $education->date->format('M d, Y'),
                'participants' => $education->participants,
                'image_url' => $education->image_url,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $formatted,
        ]);
    }

    /**
     * Get a single education activity by ID
     */
    public function show(Request $request, $id)
    {
        $education = Education::where('is_active', true)->find($id);

        if (!$education) {
            return response()->json([
                'success' => false,
                'message' => 'Education activity not found',
            ], 404);
        }

        // Get authenticated user if available
        $user = auth('api')->user();
        $userInscription = null;
        
        if ($user) {
            $userInscription = \App\Models\EducationInscription::where('user_id', $user->id)
                ->where('education_id', $id)
                ->first();
        }

        // Calculate participants from approved inscriptions
        $participantsCount = $education->inscriptions()->where('status', 'approved')->count();

        $formatted = [
            'id' => $education->id,
            'type' => 'education',
            'title' => $education->title,
            'description' => $education->description,
            'category' => $education->category,
            'date' => $education->date->format('Y-m-d'),
            'time' => $education->time ?? $education->date->format('H:i'),
            'location' => $education->location,
            'attendance_type' => $education->attendance_type,
            'organizer' => $education->organizer ?? 'Youth Center',
            'organizer_contact' => $education->organizer_contact ?? $education->organizer,
            'center_id' => (string)($education->center_id ?? $education->id),
            'center_name' => $education->center_name ?? $education->location ?? 'دار الشباب',
            'has_price' => $education->has_price,
            'price' => $education->has_price ? ($education->price ? (float)$education->price : null) : null,
            'participants' => $participantsCount,
            'capacity' => $education->capacity,
            'image_url' => $education->image_url,
            'status' => $education->status ?? 'upcoming',
            'duration' => $education->duration,
            'level' => $education->level,
            'is_registered' => $userInscription !== null,
            'registration_status' => $userInscription ? $userInscription->status : null,
        ];

        return response()->json([
            'success' => true,
            'data' => $formatted,
        ]);
    }

    /**
     * Join/Register for an education activity
     */
    public function join(Request $request, $id)
    {
        $education = Education::where('is_active', true)->find($id);

        if (!$education) {
            return response()->json([
                'success' => false,
                'message' => 'Education activity not found',
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
        $existingInscription = \App\Models\EducationInscription::where('user_id', $user->id)
            ->where('education_id', $id)
            ->first();

        if ($existingInscription) {
            return response()->json([
                'success' => false,
                'message' => 'You are already registered for this activity',
                'data' => [
                    'status' => $existingInscription->status,
                    'participants' => $education->inscriptions()->where('status', 'approved')->count(),
                    'capacity' => $education->capacity,
                ],
            ], 400);
        }

        // Check capacity (count approved inscriptions)
        $approvedCount = $education->inscriptions()->where('status', 'approved')->count();
        if ($education->capacity && $approvedCount >= $education->capacity) {
            return response()->json([
                'success' => false,
                'message' => 'Activity is full',
            ], 400);
        }

        // Create inscription with pending status (can be approved by admin later)
        $inscription = \App\Models\EducationInscription::create([
            'user_id' => $user->id,
            'education_id' => $id,
            'status' => 'pending', // Default to pending, admin can approve later
        ]);

        // Update participants count (total approved)
        $education->participants = $education->inscriptions()->where('status', 'approved')->count();
        $education->save();

        return response()->json([
            'success' => true,
            'message' => 'Successfully registered for activity',
            'data' => [
                'inscription_id' => $inscription->id,
                'status' => $inscription->status,
                'participants' => $education->participants,
                'capacity' => $education->capacity,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name ?? ($user->nom . ' ' . $user->prenom),
                    'email' => $user->email,
                ],
            ],
        ]);
    }
}
