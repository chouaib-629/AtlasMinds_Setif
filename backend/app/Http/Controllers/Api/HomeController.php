<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Education;
use App\Models\Club;
use App\Models\DirectActivity;
use Illuminate\Http\Request;
use Carbon\Carbon;

class HomeController extends Controller
{
    /**
     * Get home page data for mobile app
     * Returns live & upcoming events, learning programs, and community projects
     */
    public function index(Request $request)
    {
        try {
            // Get educations - don't require status to be set
            $educations = Education::where('is_active', true)
                ->orderBy('date', 'asc')
                ->limit(10)
                ->get();
            
            // Get clubs - don't require status to be set
            $clubs = Club::where('is_active', true)
                ->orderBy('date', 'asc')
                ->limit(10)
                ->get();
            
            // Get direct activities - don't require status to be set
            $directActivities = DirectActivity::where('is_active', true)
                ->orderBy('date', 'asc')
                ->limit(10)
                ->get();
            
            // Format events data (live & upcoming)
            $eventsData = collect()
                ->merge($educations->map(function ($item) {
                    return $this->formatEvent($item, 'education');
                }))
                ->merge($clubs->map(function ($item) {
                    return $this->formatEvent($item, 'club');
                }))
                ->merge($directActivities->map(function ($item) {
                    return $this->formatEvent($item, 'direct_activity');
                }))
                ->filter(function ($item) {
                    return $item !== null;
                })
                ->sortBy('date')
                ->take(4)
                ->values();
            
            // Format learning programs data (educations and clubs)
            $learningData = collect()
                ->merge($educations->map(function ($education) {
                    return $this->formatLearningProgram($education);
                }))
                ->merge($clubs->map(function ($club) {
                    return $this->formatLearningProgram($club);
                }))
                ->filter(function ($item) {
                    return $item !== null;
                })
                ->take(4)
                ->values();
            
            // Format community projects data (direct activities)
            $communityData = DirectActivity::where('is_active', true)
                ->orderBy('votes', 'desc')
                ->limit(4)
                ->get()
                ->map(function ($activity) {
                    return $this->formatCommunityProject($activity);
                })
                ->filter(function ($item) {
                    return $item !== null;
                })
                ->values();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'events' => $eventsData,
                    'learning' => $learningData,
                    'community' => $communityData,
                ],
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in HomeController@index: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch home data',
                'data' => [
                    'events' => [],
                    'learning' => [],
                    'community' => [],
                ],
            ], 500);
        }
    }
    
    /**
     * Format activity as event
     */
    private function formatEvent($activity, $type)
    {
        try {
            // Get date as Carbon instance
            $activityDate = $activity->date instanceof Carbon 
                ? $activity->date 
                : Carbon::parse($activity->date);
            
            // Determine status
            $status = $activity->status ?? 'upcoming';
            
            // If status is not set, determine it based on date/time
            if (!$activity->status || $activity->status === '') {
                $eventDateTime = $activityDate->copy();
                
                if ($activity->time) {
                    try {
                        $time = Carbon::parse($activity->time);
                        $eventDateTime->setTime($time->hour, $time->minute);
                    } catch (\Exception $e) {
                        // Time parsing failed, use date only
                    }
                }
                
                $now = Carbon::now();
                $endTime = $eventDateTime->copy()->addHours(2); // Assume events last 2 hours
                
                if ($now >= $eventDateTime && $now <= $endTime) {
                    $status = 'live';
                } else {
                    $status = 'upcoming';
                }
            }
            
            // Calculate participants from approved inscriptions if relationship exists
            $participantsCount = $activity->participants ?? 0;
            if (method_exists($activity, 'inscriptions')) {
                $participantsCount = $activity->inscriptions()->where('status', 'approved')->count();
            }
            
            return [
                'id' => "{$type}_{$activity->id}",
                'title' => $activity->title ?? '',
                'description' => $activity->description ?? '',
                'category' => $activity->category ?? 'general',
                'centerName' => $activity->center_name ?? $activity->location ?? 'دار الشباب',
                'centerId' => (string)($activity->center_id ?? $activity->id),
                'organizerContact' => $activity->organizer_contact ?? $activity->organizer ?? '+213 555 000 000',
                'date' => $activityDate->format('Y-m-d'),
                'time' => $activity->time ?? $activityDate->format('H:i'),
                'status' => $status,
                'image' => $activity->image_url ?? 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&h=400&fit=crop',
            ];
        } catch (\Exception $e) {
            // Log error and return safe defaults
            \Log::error('Error formatting event: ' . $e->getMessage(), [
                'activity_id' => $activity->id ?? null,
                'type' => $type,
            ]);
            
            $activityId = $activity->id ?? 'unknown';
            return [
                'id' => "{$type}_{$activityId}",
                'title' => $activity->title ?? '',
                'description' => $activity->description ?? '',
                'category' => 'general',
                'centerName' => 'دار الشباب',
                'centerId' => '1',
                'organizerContact' => '+213 555 000 000',
                'date' => date('Y-m-d'),
                'time' => '00:00',
                'status' => 'upcoming',
                'image' => 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&h=400&fit=crop',
            ];
        }
    }
    
    /**
     * Format activity as learning program
     */
    private function formatLearningProgram($activity)
    {
        try {
            return [
                'id' => "learning_{$activity->id}",
                'title' => $activity->title ?? '',
                'description' => $activity->description ?? '',
                'duration' => $activity->duration ?? 'غير محدد',
                'level' => $activity->level ?? 'مبتدئ',
                'centerName' => $activity->center_name ?? $activity->location ?? 'دار الشباب',
                'centerId' => (string)($activity->center_id ?? $activity->id),
                'organizerContact' => $activity->organizer_contact ?? $activity->organizer ?? '+213 555 000 000',
                'image' => $activity->image_url ?? 'https://images.unsplash.com/photo-1759523146335-0069847ceb16?w=600&h=400&fit=crop',
            ];
        } catch (\Exception $e) {
            \Log::error('Error formatting learning program: ' . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Format activity as community project
     */
    private function formatCommunityProject($activity)
    {
        try {
            return [
                'id' => "community_{$activity->id}",
                'title' => $activity->title ?? '',
                'description' => $activity->description ?? '',
                'votes' => $activity->votes ?? 0,
                'targetAudience' => $activity->target_audience ?? 'جميع الأعمار',
                'centerName' => $activity->center_name ?? $activity->location ?? 'دار الشباب',
                'centerId' => (string)($activity->center_id ?? $activity->id),
                'organizerContact' => $activity->organizer_contact ?? $activity->organizer ?? '+213 555 000 000',
                'image' => $activity->image_url ?? 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop',
            ];
        } catch (\Exception $e) {
            \Log::error('Error formatting community project: ' . $e->getMessage());
            return null;
        }
    }
}
