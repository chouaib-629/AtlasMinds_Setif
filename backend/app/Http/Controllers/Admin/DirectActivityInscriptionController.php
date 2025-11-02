<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DirectActivityInscription;
use App\Models\DirectActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class DirectActivityInscriptionController extends Controller
{
    /**
     * Display a listing of direct activity inscriptions
     */
    public function index(Request $request)
    {
        $admin = Auth::guard('admin')->user();
        
        $query = DirectActivityInscription::with(['user', 'directActivity.admin']);

        // Filter by direct_activity_id
        if ($request->has('direct_activity_id') && $request->direct_activity_id) {
            $query->where('direct_activity_id', $request->direct_activity_id);
            
            // Role-based check
            if (!$admin->is_super_admin) {
                $activity = DirectActivity::find($request->direct_activity_id);
                if (!$activity || $activity->admin_id !== $admin->id) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Accès non autorisé à cette activité',
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
            // Regular admin can only see inscriptions for their activities
            $query->whereHas('directActivity', function ($q) use ($admin) {
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
        
        $inscription = DirectActivityInscription::with('directActivity')->findOrFail($id);

        // Role-based access check
        if (!$admin->is_super_admin && $inscription->directActivity->admin_id !== $admin->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez modifier que les inscriptions de vos activités',
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
        $activity = $inscription->directActivity;
        if ($oldStatus !== 'approved' && $request->status === 'approved') {
            // Increment
            $activity->participants = $activity->inscriptions()->where('status', 'approved')->count();
            $activity->save();
        } elseif ($oldStatus === 'approved' && $request->status !== 'approved') {
            // Decrement
            $activity->participants = $activity->inscriptions()->where('status', 'approved')->count();
            $activity->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Statut de l\'inscription mis à jour avec succès',
            'data' => [
                'inscription' => $inscription->load(['user', 'directActivity.admin']),
            ],
        ]);
    }
}
