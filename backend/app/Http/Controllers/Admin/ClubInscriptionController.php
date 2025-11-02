<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ClubInscription;
use App\Models\Club;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ClubInscriptionController extends Controller
{
    /**
     * Display a listing of club inscriptions
     */
    public function index(Request $request)
    {
        $admin = Auth::guard('admin')->user();
        
        $query = ClubInscription::with(['user', 'club.admin']);

        // Filter by club_id
        if ($request->has('club_id') && $request->club_id) {
            $query->where('club_id', $request->club_id);
            
            // Role-based check
            if (!$admin->is_super_admin) {
                $club = Club::find($request->club_id);
                if (!$club || $club->admin_id !== $admin->id) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Accès non autorisé à ce club',
                    ], 403);
                }
            }
        }

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Role-based filtering
        if (!$admin->is_super_admin) {
            // Regular admin can only see inscriptions for their clubs
            $query->whereHas('club', function ($q) use ($admin) {
                $q->where('admin_id', $admin->id);
            });
        }

        $inscriptions = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => [
                'inscriptions' => $inscriptions,
            ],
        ]);
    }

    /**
     * Update inscription status
     */
    public function updateStatus(Request $request, $id)
    {
        $admin = Auth::guard('admin')->user();
        
        $inscription = ClubInscription::with('club')->findOrFail($id);

        // Role-based access check
        if (!$admin->is_super_admin && $inscription->club->admin_id !== $admin->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez modifier que les inscriptions de vos clubs',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:approved,rejected,attended',
        ], [
            'status.required' => 'Le statut est requis',
            'status.in' => 'Le statut doit être: approved, rejected ou attended',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors(),
            ], 422);
        }

        $oldStatus = $inscription->status;
        $inscription->status = $request->status;
        $inscription->save();

        // Update participants count if status changed to/from approved
        $club = $inscription->club;
        if ($oldStatus !== 'approved' && $request->status === 'approved') {
            // Increment
            $club->participants = $club->inscriptions()->where('status', 'approved')->count();
            $club->save();
        } elseif ($oldStatus === 'approved' && $request->status !== 'approved') {
            // Decrement
            $club->participants = $club->inscriptions()->where('status', 'approved')->count();
            $club->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Statut de l\'inscription mis à jour avec succès',
            'data' => [
                'inscription' => $inscription->load(['user', 'club.admin']),
            ],
        ]);
    }
}
