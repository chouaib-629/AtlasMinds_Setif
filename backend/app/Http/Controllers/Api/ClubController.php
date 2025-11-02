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
}
