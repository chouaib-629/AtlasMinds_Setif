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
}
