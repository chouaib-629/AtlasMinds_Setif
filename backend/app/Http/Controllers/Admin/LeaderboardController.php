<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LeaderboardController extends Controller
{
    /**
     * Display leaderboard
     */
    public function index(Request $request)
    {
        $admin = Auth::guard('admin')->user();
        
        $scope = $request->get('scope', 'global');
        $wilaya = $request->get('wilaya');

        $query = User::select([
            'id as user_id',
            'nom',
            'prenom',
            'wilaya',
            'score',
            'attended_events_count'
        ]);

        // Apply scope filters
        if ($scope === 'wilaya' && $wilaya) {
            $query->where('wilaya', $wilaya);
        } elseif ($scope === 'algeria') {
            // All Algeria - no additional filter needed
            // (all users are in Algeria)
        }
        // 'global' means all users - no filter

        // If regular admin, you might want to filter by their youth house
        // For now, we'll show all users based on scope
        // This can be customized based on your business logic

        $leaderboard = $query->orderBy('score', 'desc')
            ->orderBy('attended_events_count', 'desc')
            ->limit(100) // Top 100
            ->get();

        // Manually assign ranks
        $rank = 1;
        $leaderboard = $leaderboard->map(function ($entry) use (&$rank) {
            $entry->rank = $rank++;
            return $entry;
        });

        return response()->json([
            'success' => true,
            'data' => [
                'leaderboard' => $leaderboard,
            ],
        ]);
    }
}
