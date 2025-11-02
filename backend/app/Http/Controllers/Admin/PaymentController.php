<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class PaymentController extends Controller
{
    /**
     * Display a listing of payments
     */
    public function index(Request $request)
    {
        $admin = Auth::guard('admin')->user();
        
        $query = Payment::with(['user', 'event.admin']);

        // Role-based filtering
        if (!$admin->is_super_admin) {
            // Regular admin can only see payments for their events
            $query->whereHas('event', function ($q) use ($admin) {
                $q->where('admin_id', $admin->id);
            });
        }

        // Filter by event_id
        if ($request->has('event_id') && $request->event_id) {
            $query->where('event_id', $request->event_id);
            
            // Additional check for regular admin
            if (!$admin->is_super_admin) {
                $event = Event::find($request->event_id);
                if (!$event || $event->admin_id !== $admin->id) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Accès non autorisé à cet événement',
                    ], 403);
                }
            }
        }

        // Filter by user_id
        if ($request->has('user_id') && $request->user_id) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Filter by date range
        if ($request->has('start_date') && $request->start_date) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }
        if ($request->has('end_date') && $request->end_date) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        $payments = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => [
                'payments' => $payments,
            ],
        ]);
    }

    /**
     * Display the specified payment
     */
    public function show($id)
    {
        $admin = Auth::guard('admin')->user();
        
        $payment = Payment::with(['user', 'event.admin'])->findOrFail($id);

        // Role-based access check
        if (!$admin->is_super_admin && $payment->event->admin_id !== $admin->id) {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'payment' => $payment,
            ],
        ]);
    }

    /**
     * Update payment status
     */
    public function updateStatus(Request $request, $id)
    {
        $admin = Auth::guard('admin')->user();
        
        $payment = Payment::with('event')->findOrFail($id);

        // Role-based access check
        if (!$admin->is_super_admin && $payment->event->admin_id !== $admin->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez modifier que les paiements de vos événements',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:completed,failed,refunded',
        ], [
            'status.required' => 'Le statut est requis',
            'status.in' => 'Le statut doit être: completed, failed ou refunded',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors(),
            ], 422);
        }

        $oldStatus = $payment->status;
        $payment->status = $request->status;

        // Set paid_at when status changes to completed
        if ($request->status === 'completed' && $oldStatus !== 'completed') {
            $payment->paid_at = now();
        }

        // Clear paid_at if status changes from completed
        if ($oldStatus === 'completed' && $request->status !== 'completed') {
            $payment->paid_at = null;
        }

        $payment->save();

        return response()->json([
            'success' => true,
            'message' => 'Statut du paiement mis à jour avec succès',
            'data' => [
                'payment' => $payment->load(['user', 'event.admin']),
            ],
        ]);
    }
}
