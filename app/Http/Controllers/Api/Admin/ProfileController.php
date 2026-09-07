<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user()->load('roles');

        return response()->json([
            'status' => 'success',
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'membership_tier' => ucfirst($user->membership_tier ?? 'standard'),
                'role' => $user->roles->first()?->name ?? 'admin',
                'roles' => $user->roles,
                'created_at' => $user->created_at ? $user->created_at->format('Y-m-d H:i:s') : null,
            ]
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|min:6',
        ]);

        $user->name = $request->name;
        $user->email = $request->email;

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();
        $user->load('roles');

        return response()->json([
            'status' => 'success',
            'message' => 'Profile updated successfully',
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'membership_tier' => ucfirst($user->membership_tier ?? 'standard'),
                'role' => $user->roles->first()?->name ?? 'admin',
                'roles' => $user->roles,
                'created_at' => $user->created_at ? $user->created_at->format('Y-m-d H:i:s') : null,
            ]
        ]);
    }
}