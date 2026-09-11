<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\WelcomeGoogleUserMail;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Throwable;

class GoogleAuthController extends Controller
{
    /**
     * Chuyển hướng người dùng sang trang đăng nhập của Google
     */
    public function redirectToGoogle(Request $request): JsonResponse|RedirectResponse
    {
        $mode = $request->query('mode', 'login'); // 'login' hoặc 'register'

        try {
            $redirectUrl = Socialite::driver('google')
                ->stateless()
                ->with([
                    'prompt' => 'select_account',
                    'state' => base64_encode(json_encode(['mode' => $mode])),
                ])
                ->redirect()
                ->getTargetUrl();

            if ($request->wantsJson()) {
                return response()->json([
                    'status' => 'success',
                    'url' => $redirectUrl,
                ]);
            }

            return redirect()->away($redirectUrl);
        } catch (Throwable $e) {
            Log::error('Google Redirect Error', ['error' => $e->getMessage()]);

            if ($request->wantsJson()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không thể tạo liên kết đăng nhập Google: ' . $e->getMessage(),
                ], 500);
            }

            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173') . '/login?error=' . urlencode('Lỗi kết nối Google');
            return redirect($frontendUrl);
        }
    }

    /**
     * Xử lý callback sau khi người dùng xác thực với Google
     */
    public function handleGoogleCallback(Request $request): RedirectResponse
    {
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');

        // Lấy mode từ state (login hay register)
        $mode = 'login';
        $stateRaw = $request->input('state');
        if ($stateRaw) {
            $decoded = json_decode(base64_decode($stateRaw), true);
            if (is_array($decoded) && !empty($decoded['mode'])) {
                $mode = $decoded['mode'];
            }
        }

        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            $googleId = $googleUser->getId();
            $email = $googleUser->getEmail();
            $name = $googleUser->getName() ?: 'Khách hàng SkyLink';
            $avatar = $googleUser->getAvatar();

            if (!$email) {
                return redirect($frontendUrl . '/login?error=' . urlencode('Google không cung cấp địa chỉ email.'));
            }

            // 1. Tìm user theo google_id hoặc theo email
            $user = User::where('google_id', $googleId)
                ->orWhere('email', $email)
                ->first();

            // Nếu người dùng đang bấm "Đăng nhập" nhưng email chưa từng đăng ký
            if ($mode === 'login' && !$user) {
                return redirect($frontendUrl . '/login?error=' . urlencode('Tài khoản ' . $email . ' chưa được đăng ký trên SkyLink. Vui lòng bấm Đăng ký trước!'));
            }

            if ($user) {
                // Cập nhật google_id và avatar nếu chưa có
                $user->update([
                    'google_id' => $user->google_id ?: $googleId,
                    'avatar' => $avatar ?: $user->avatar,
                    'email_verified_at' => $user->email_verified_at ?: now(),
                ]);
            } else {
                // Đăng ký tài khoản mới khi ở mode register
                $user = User::create([
                    'name' => $name,
                    'email' => $email,
                    'google_id' => $googleId,
                    'avatar' => $avatar,
                    'password' => null,
                    'membership_tier' => 'standard',
                    'email_verified_at' => now(),
                ]);

                // Gán quyền thành viên (member)
                $memberRole = Role::where('name', 'member')->first();
                if ($memberRole) {
                    $user->roles()->attach($memberRole);
                }
            }

            // Gửi email chào mừng đến hộp thư Gmail
            try {
                Mail::to($user->email)->send(new WelcomeGoogleUserMail($user));
                Log::info('Welcome email sent to Google user: ' . $user->email);
            } catch (Throwable $mailEx) {
                Log::warning('Could not send welcome email to ' . $user->email . ': ' . $mailEx->getMessage());
            }

            $user->load('roles');

            // Tạo Sanctum access token
            $token = $user->createToken('auth_token')->plainTextToken;

            // Chuyển hướng về React Frontend kèm token và thông tin user
            $targetUrl = $frontendUrl . '/auth/callback?' . http_build_query([
                'status' => 'success',
                'token' => $token,
                'user' => json_encode($user),
            ]);

            return redirect($targetUrl);

        } catch (Throwable $e) {
            Log::error('Google Auth Callback Error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect($frontendUrl . '/login?error=' . urlencode('Đăng nhập Google không thành công. Vui lòng thử lại.'));
        }
    }

    /**
     * Xử lý xác thực Google One Tap từ Frontend
     */
    public function oneTap(Request $request): JsonResponse
    {
        $credential = $request->input('credential');
        if (!$credential) {
            return response()->json([
                'status' => 'error',
                'message' => 'Mã xác thực Google (credential) là bắt buộc.',
            ], 422);
        }

        try {
            $response = \Illuminate\Support\Facades\Http::get('https://oauth2.googleapis.com/tokeninfo', [
                'id_token' => $credential,
            ]);

            if (!$response->successful()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Mã xác thực Google không hợp lệ hoặc đã hết hạn.',
                ], 401);
            }

            $payload = $response->json();
            $googleId = $payload['sub'] ?? null;
            $email = $payload['email'] ?? null;
            $name = $payload['name'] ?? 'Khách hàng SkyLink';
            $avatar = $payload['picture'] ?? null;

            if (!$email || !$googleId) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không thể đọc thông tin người dùng từ Google.',
                ], 400);
            }

            $user = User::where('google_id', $googleId)
                ->orWhere('email', $email)
                ->first();

            if ($user) {
                $user->update([
                    'google_id' => $user->google_id ?: $googleId,
                    'avatar' => $avatar ?: $user->avatar,
                    'email_verified_at' => $user->email_verified_at ?: now(),
                ]);
            } else {
                $user = User::create([
                    'name' => $name,
                    'email' => $email,
                    'google_id' => $googleId,
                    'avatar' => $avatar,
                    'password' => null,
                    'membership_tier' => 'standard',
                    'email_verified_at' => now(),
                ]);

                $memberRole = Role::where('name', 'member')->first();
                if ($memberRole) {
                    $user->roles()->attach($memberRole);
                }
            }

            // Gửi email chào mừng đến hộp thư Gmail
            try {
                Mail::to($user->email)->send(new WelcomeGoogleUserMail($user));
                Log::info('Welcome email sent to Google One Tap user: ' . $user->email);
            } catch (Throwable $mailEx) {
                Log::warning('Could not send welcome email to ' . $user->email . ': ' . $mailEx->getMessage());
            }

            $user->load('roles');
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'status' => 'success',
                'user' => $user,
                'access_token' => $token,
                'token_type' => 'Bearer',
            ]);
        } catch (Throwable $e) {
            Log::error('Google One Tap Error', ['error' => $e->getMessage()]);

            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi xử lý xác thực Google One Tap: ' . $e->getMessage(),
            ], 500);
        }
    }
}
