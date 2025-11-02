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
}
