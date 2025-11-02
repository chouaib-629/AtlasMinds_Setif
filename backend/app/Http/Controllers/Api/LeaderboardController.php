<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LeaderboardController extends Controller
{
    /**
     * Display leaderboard for mobile app users
     */
    public function index(Request $request)
    {
        $scope = $request->get('scope', 'algeria');
        $wilaya = $request->get('wilaya');
        $commune = $request->get('commune');

        $query = User::select([
            'id as user_id',
            'nom',
            'prenom',
            'wilaya',
            'commune',
            'score',
            'attended_events_count'
        ]);

        // Apply scope filters
        if ($scope === 'wilaya' && $wilaya) {
            $query->where('wilaya', $wilaya);
        } elseif ($scope === 'commune' && $commune && $wilaya) {
            // Filter by commune (requires wilaya to be specified)
            $query->where('wilaya', $wilaya)
                  ->where('commune', $commune);
        }
        // 'algeria' means all Algeria - no additional filter needed

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

