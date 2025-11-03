<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\YouthCentre;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class YouthCentreController extends Controller
{
    /**
     * Display a listing of youth centres
     */
    public function index()
    {
        try {
            $admin = Auth::guard('admin')->user();
            
            if ($admin->is_super_admin) {
                // Super admins can see all youth centres
                $youthCentres = YouthCentre::withCount('admins')->orderBy('created_at', 'desc')->get();
            } else {
                // Regular admins can only see their own youth centre
                if ($admin->youth_centre_id) {
                    $youthCentres = YouthCentre::where('id', $admin->youth_centre_id)
                        ->withCount('admins')
                        ->get();
                } else {
                    $youthCentres = collect([]);
                }
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'youth_centres' => $youthCentres,
                ],
            ]);
        } catch (\Exception $e) {
            \Log::error('Error loading youth centres: ' . $e->getMessage());
            
            // Check if it's a database error (table doesn't exist)
            if (str_contains($e->getMessage(), 'Base table or view not found') || 
                str_contains($e->getMessage(), 'Unknown table') ||
                str_contains($e->getMessage(), 'youth_centres')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Database tables not found. Please run the migrations: php artisan migrate',
                ], 500);
            }
            
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while loading youth centres: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created youth centre
     */
    public function store(Request $request)
    {
        $admin = Auth::guard('admin')->user();

        // Regular admins can create youth centres, but only if they don't already have one
        if (!$admin->is_super_admin) {
            if ($admin->youth_centre_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are already assigned to a youth centre. You cannot create a new one.',
                ], 422);
            }
        }

        // Process FormData - decode JSON strings for arrays
        $requestData = $request->all();
        
        // Handle JSON strings for arrays
        if ($request->has('available_formations') && is_string($request->input('available_formations'))) {
            $decoded = json_decode($request->input('available_formations'), true);
            $requestData['available_formations'] = is_array($decoded) ? $decoded : [];
        }
        
        if ($request->has('available_activities') && is_string($request->input('available_activities'))) {
            $decoded = json_decode($request->input('available_activities'), true);
            $requestData['available_activities'] = is_array($decoded) ? $decoded : [];
        }
        
        // Handle boolean conversion for is_active
        if ($request->has('is_active')) {
            $isActive = $request->input('is_active');
            if (is_string($isActive)) {
                $requestData['is_active'] = $isActive === '1' || $isActive === 'true' || $isActive === 'on';
            } else {
                $requestData['is_active'] = (bool) $isActive;
            }
        }
        
        // Handle numeric fields
        if ($request->has('number_of_places')) {
            $requestData['number_of_places'] = (int) ($request->input('number_of_places') ?: 0);
        }
        
        if ($request->has('latitude') && $request->input('latitude') !== '') {
            $requestData['latitude'] = (float) $request->input('latitude');
        } else {
            $requestData['latitude'] = null;
        }
        
        if ($request->has('longitude') && $request->input('longitude') !== '') {
            $requestData['longitude'] = (float) $request->input('longitude');
        } else {
            $requestData['longitude'] = null;
        }

        $validator = Validator::make($requestData, [
            'name' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'location' => 'required|string|max:255',
            'number_of_places' => 'nullable|integer|min:0',
            'available_formations' => 'nullable|array',
            'available_activities' => 'nullable|array',
            'description' => 'nullable|string',
            'phone_number' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:255',
            'address' => 'nullable|string|max:255',
            'wilaya' => 'nullable|string|max:255',
            'commune' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('youth_centres', 'public');
            $data['image'] = $imagePath;
        }

        $youthCentre = YouthCentre::create($data);

        // If the creator is a regular admin (not super admin), automatically assign them to the new youth centre
        if (!$admin->is_super_admin) {
            $admin->youth_centre_id = $youthCentre->id;
            $admin->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Youth centre created successfully',
            'data' => [
                'youth_centre' => $youthCentre,
            ],
        ], 201);
    }

    /**
     * Display the specified youth centre
     */
    public function show($id)
    {
        $admin = Auth::guard('admin')->user();

        $youthCentre = YouthCentre::withCount('admins')->find($id);

        if (!$youthCentre) {
            return response()->json([
                'success' => false,
                'message' => 'Youth centre not found',
            ], 404);
        }

        // Regular admins can only view their own youth centre
        if (!$admin->is_super_admin && $admin->youth_centre_id !== $youthCentre->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'youth_centre' => $youthCentre,
            ],
        ]);
    }

    /**
     * Update the specified youth centre
     */
    public function update(Request $request, $id)
    {
        $admin = Auth::guard('admin')->user();

        $youthCentre = YouthCentre::find($id);

        if (!$youthCentre) {
            return response()->json([
                'success' => false,
                'message' => 'Youth centre not found',
            ], 404);
        }

        // Regular admins can only update their own youth centre
        // Super admins can update any youth centre
        if (!$admin->is_super_admin && $admin->youth_centre_id !== $youthCentre->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. You can only update your own youth centre.',
            ], 403);
        }

        // Process FormData - decode JSON strings for arrays
        $requestData = $request->all();
        
        // Handle JSON strings for arrays
        if ($request->has('available_formations') && is_string($request->input('available_formations'))) {
            $decoded = json_decode($request->input('available_formations'), true);
            $requestData['available_formations'] = is_array($decoded) ? $decoded : [];
        }
        
        if ($request->has('available_activities') && is_string($request->input('available_activities'))) {
            $decoded = json_decode($request->input('available_activities'), true);
            $requestData['available_activities'] = is_array($decoded) ? $decoded : [];
        }
        
        // Handle boolean conversion for is_active
        if ($request->has('is_active')) {
            $isActive = $request->input('is_active');
            if (is_string($isActive)) {
                $requestData['is_active'] = $isActive === '1' || $isActive === 'true' || $isActive === 'on';
            } else {
                $requestData['is_active'] = (bool) $isActive;
            }
        }
        
        // Handle numeric fields
        if ($request->has('number_of_places')) {
            $requestData['number_of_places'] = (int) ($request->input('number_of_places') ?: 0);
        }
        
        if ($request->has('latitude') && $request->input('latitude') !== '') {
            $requestData['latitude'] = (float) $request->input('latitude');
        } else {
            $requestData['latitude'] = null;
        }
        
        if ($request->has('longitude') && $request->input('longitude') !== '') {
            $requestData['longitude'] = (float) $request->input('longitude');
        } else {
            $requestData['longitude'] = null;
        }

        $validator = Validator::make($requestData, [
            'name' => 'sometimes|required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'location' => 'sometimes|required|string|max:255',
            'number_of_places' => 'nullable|integer|min:0',
            'available_formations' => 'nullable|array',
            'available_activities' => 'nullable|array',
            'description' => 'nullable|string',
            'phone_number' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:255',
            'address' => 'nullable|string|max:255',
            'wilaya' => 'nullable|string|max:255',
            'commune' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($youthCentre->image) {
                Storage::disk('public')->delete($youthCentre->image);
            }
            $imagePath = $request->file('image')->store('youth_centres', 'public');
            $data['image'] = $imagePath;
        }

        $youthCentre->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Youth centre updated successfully',
            'data' => [
                'youth_centre' => $youthCentre->fresh(),
            ],
        ]);
    }

    /**
     * Remove the specified youth centre
     */
    public function destroy($id)
    {
        $admin = Auth::guard('admin')->user();

        // Only super admins can delete youth centres
        if (!$admin->is_super_admin) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only super admins can delete youth centres.',
            ], 403);
        }

        $youthCentre = YouthCentre::find($id);

        if (!$youthCentre) {
            return response()->json([
                'success' => false,
                'message' => 'Youth centre not found',
            ], 404);
        }

        // Delete image if exists
        if ($youthCentre->image) {
            Storage::disk('public')->delete($youthCentre->image);
        }

        $youthCentre->delete();

        return response()->json([
            'success' => true,
            'message' => 'Youth centre deleted successfully',
        ]);
    }

    /**
     * Get all admins for a youth centre
     */
    public function getAdmins($id)
    {
        $admin = Auth::guard('admin')->user();
        
        $youthCentre = YouthCentre::find($id);
        
        if (!$youthCentre) {
            return response()->json([
                'success' => false,
                'message' => 'Youth centre not found',
            ], 404);
        }

        // Regular admins can only view their own youth centre's admins
        if (!$admin->is_super_admin && $admin->youth_centre_id !== $youthCentre->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $admins = \App\Models\Admin::where('youth_centre_id', $id)
            ->where('is_super_admin', false) // Don't include super admins
            ->select('id', 'name', 'email', 'created_at')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'admins' => $admins,
            ],
        ]);
    }

    /**
     * Assign an admin to a youth centre
     */
    public function assignAdmin(Request $request, $id)
    {
        $admin = Auth::guard('admin')->user();

        $youthCentre = YouthCentre::find($id);
        
        if (!$youthCentre) {
            return response()->json([
                'success' => false,
                'message' => 'Youth centre not found',
            ], 404);
        }

        // Regular admins can only assign admins to their own youth centre
        // Super admins can assign admins to any youth centre
        if (!$admin->is_super_admin && $admin->youth_centre_id !== $youthCentre->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. You can only assign admins to your own youth centre.',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'admin_id' => 'required|integer|exists:admins,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $targetAdmin = \App\Models\Admin::find($request->admin_id);

        if (!$targetAdmin) {
            return response()->json([
                'success' => false,
                'message' => 'Admin not found',
            ], 404);
        }

        // Don't assign super admins to youth centres
        if ($targetAdmin->is_super_admin) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot assign super admin to a youth centre',
            ], 422);
        }

        // If admin already has a youth centre, prevent assignment
        if ($targetAdmin->youth_centre_id && $targetAdmin->youth_centre_id !== $id) {
            return response()->json([
                'success' => false,
                'message' => 'This admin is already assigned to another youth centre. Please remove them from that centre first.',
            ], 422);
        }

        // Assign the admin
        $targetAdmin->youth_centre_id = $id;
        $targetAdmin->save();

        return response()->json([
            'success' => true,
            'message' => 'Admin assigned successfully',
            'data' => [
                'admin' => $targetAdmin,
            ],
        ]);
    }

    /**
     * Remove an admin from a youth centre
     */
    public function removeAdmin(Request $request, $id)
    {
        $admin = Auth::guard('admin')->user();

        $youthCentre = YouthCentre::find($id);
        
        if (!$youthCentre) {
            return response()->json([
                'success' => false,
                'message' => 'Youth centre not found',
            ], 404);
        }

        // Regular admins can only remove admins from their own youth centre
        // Super admins can remove admins from any youth centre
        if (!$admin->is_super_admin && $admin->youth_centre_id !== $youthCentre->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. You can only remove admins from your own youth centre.',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'admin_id' => 'required|integer|exists:admins,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $targetAdmin = \App\Models\Admin::find($request->admin_id);

        if (!$targetAdmin) {
            return response()->json([
                'success' => false,
                'message' => 'Admin not found',
            ], 404);
        }

        // Only remove if admin is assigned to this youth centre
        if ($targetAdmin->youth_centre_id !== $id) {
            return response()->json([
                'success' => false,
                'message' => 'Admin is not assigned to this youth centre',
            ], 422);
        }

        // Prevent admins from removing themselves
        if ($targetAdmin->id === $admin->id) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot remove yourself from the youth centre',
            ], 422);
        }

        // Remove the admin
        $targetAdmin->youth_centre_id = null;
        $targetAdmin->save();

        return response()->json([
            'success' => true,
            'message' => 'Admin removed successfully',
        ]);
    }

    /**
     * Get all unassigned admins (for dropdown selection)
     */
    public function getUnassignedAdmins()
    {
        $admin = Auth::guard('admin')->user();

        // Both super admins and regular admins with a youth centre can see unassigned admins
        // Regular admins can add admins to their own youth centre
        $admins = \App\Models\Admin::whereNull('youth_centre_id')
            ->where('is_super_admin', false) // Don't include super admins
            ->select('id', 'name', 'email')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'admins' => $admins,
            ],
        ]);
    }
}
