<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EducationInscription;
use App\Models\Education;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class EducationInscriptionController extends Controller
{
    /**
     * Display a listing of education inscriptions
     */
    public function index(Request $request)
    {
        $admin = Auth::guard('admin')->user();
        
        $query = EducationInscription::with(['user', 'education.admin']);

        // Filter by education_id
        if ($request->has('education_id') && $request->education_id) {
            $query->where('education_id', $request->education_id);
            
            // Role-based check
            if (!$admin->is_super_admin) {
                $education = Education::find($request->education_id);
                if (!$education || $education->admin_id !== $admin->id) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Accès non autorisé à cette activité éducative',
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
            $query->whereHas('education', function ($q) use ($admin) {
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
        
        $inscription = EducationInscription::with('education')->findOrFail($id);

        // Role-based access check
        if (!$admin->is_super_admin && $inscription->education->admin_id !== $admin->id) {
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
        $education = $inscription->education;
        if ($oldStatus !== 'approved' && $request->status === 'approved') {
            // Increment
            $education->participants = $education->inscriptions()->where('status', 'approved')->count();
            $education->save();
        } elseif ($oldStatus === 'approved' && $request->status !== 'approved') {
            // Decrement
            $education->participants = $education->inscriptions()->where('status', 'approved')->count();
            $education->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Statut de l\'inscription mis à jour avec succès',
            'data' => [
                'inscription' => $inscription->load(['user', 'education.admin']),
            ],
        ]);
    }
}
