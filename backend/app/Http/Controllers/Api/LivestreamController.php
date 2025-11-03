<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Livestream;
use Illuminate\Http\Request;

class LivestreamController extends Controller
{
    /**
     * Get all active livestreams (public endpoint for mobile app)
     */
    public function index(Request $request)
    {
        $query = Livestream::where('is_live', true)
            ->with(['event', 'admin'])
            ->orderBy('created_at', 'desc');

        // Filter by event_id if provided
        if ($request->has('event_id') && $request->event_id) {
            $query->where('event_id', $request->event_id);
        }

        $livestreams = $query->get();

        // Format response for mobile app
        $formatted = $livestreams->map(function ($livestream) {
            return [
                'id' => $livestream->id,
                'title' => $livestream->title,
                'description' => $livestream->description,
                'channel_name' => $livestream->channel_name,
                'stream_url' => $livestream->stream_url,
                'is_live' => $livestream->is_live,
                'event_id' => $livestream->event_id,
                'event_title' => $livestream->event ? $livestream->event->title : null,
                'has_agora' => !empty($livestream->channel_name),
                'created_at' => $livestream->created_at->toIso8601String(),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'livestreams' => $formatted,
            ],
        ]);
    }

    /**
     * Get a specific livestream by ID
     */
    public function show($id)
    {
        $livestream = Livestream::with(['event', 'admin'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => [
                'livestream' => [
                    'id' => $livestream->id,
                    'title' => $livestream->title,
                    'description' => $livestream->description,
                    'channel_name' => $livestream->channel_name,
                    'stream_url' => $livestream->stream_url,
                    'is_live' => $livestream->is_live,
                    'event_id' => $livestream->event_id,
                    'event_title' => $livestream->event ? $livestream->event->title : null,
                    'has_agora' => !empty($livestream->channel_name),
                    'created_at' => $livestream->created_at->toIso8601String(),
                ],
            ],
        ]);
    }
}

