<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

use App\Mail\WelcomeGoogleUserMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Throwable;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::create([
            'name'            => $validated['name'],
            'email'           => $validated['email'],
            'password'        => Hash::make($validated['password']),
            'membership_tier' => 'standard',
        ]);

        $memberRole = Role::where('name', 'member')->first();
        if ($memberRole) {
            $user->roles()->attach($memberRole);
        }

        // Gửi email thông báo về Gmail đăng ký
        try {
            Mail::to($user->email)->send(new WelcomeGoogleUserMail($user));
            Log::info('Welcome email sent to user: ' . $user->email);
        } catch (Throwable $mailEx) {
            Log::warning('Could not send welcome email to ' . $user->email . ': ' . $mailEx->getMessage());
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status'       => 'success',
            'user'         => $user,
            'access_token' => $token,
            'token_type'   => 'Bearer',
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $validated = $request->validated();

        if (!Auth::attempt($validated)) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Sai email hoặc mật khẩu',
            ], 401);
        }

        $user = User::with('roles')
            ->where('email', $validated['email'])
            ->firstOrFail();

        // Gửi email thông báo khi đăng nhập
        try {
            Mail::to($user->email)->send(new WelcomeGoogleUserMail($user));
            Log::info('Login notification email sent to: ' . $user->email);
        } catch (Throwable $mailEx) {
            Log::warning('Could not send login notification email to ' . $user->email . ': ' . $mailEx->getMessage());
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status'       => 'success',
            'user'         => $user,
            'access_token' => $token,
            'token_type'   => 'Bearer',
        ]);
    }
        

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data'   => $request->user()->load('roles'),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Logged out',
        ]);
    }
}