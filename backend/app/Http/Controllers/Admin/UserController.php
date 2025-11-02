<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Display a listing of all users
     */
    public function index(Request $request)
    {
        $admin = Auth::guard('admin')->user();
        
        $query = User::query();

        // Filter by wilaya
        if ($request->has('wilaya') && $request->wilaya) {
            $query->where('wilaya', $request->wilaya);
        }

        // Filter by commune
        if ($request->has('commune') && $request->commune) {
            $query->where('commune', $request->commune);
        }

        $users = $query->select([
            'id',
            'name',
            'nom',
            'prenom',
            'email',
            'wilaya',
            'commune',
            'numero_telephone',
            'date_de_naissance',
            'adresse',
            'score',
            'attended_events_count',
            'created_at'
        ])->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => [
                'users' => $users,
            ],
        ]);
    }

    /**
     * Display the specified user
     */
    public function show($id)
    {
        $user = User::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user,
            ],
        ]);
    }
}
