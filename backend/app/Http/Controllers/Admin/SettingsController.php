<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class SettingsController extends Controller
{
    /**
     * Get admin settings
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $admin = Auth::guard('admin')->user();
            
            if (!$admin) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized',
                ], 401);
            }

            $settings = AdminSetting::where('admin_id', $admin->id)->first();

            // Return default settings if none exist
            if (!$settings) {
                $settings = $this->getDefaultSettings($admin);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'settings' => $this->formatSettings($settings),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch settings: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update admin settings
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request)
    {
        try {
            $admin = Auth::guard('admin')->user();
            
            if (!$admin) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized',
                ], 401);
            }

            $validator = Validator::make($request->all(), [
                'site_name' => 'nullable|string|max:255',
                'site_description' => 'nullable|string',
                'timezone' => 'nullable|string',
                'language' => 'nullable|string|in:fr,ar,en',
                'date_format' => 'nullable|string|in:DD/MM/YYYY,MM/DD/YYYY,YYYY-MM-DD',
                'notification_settings' => 'nullable|array',
                'system_settings' => 'nullable|array',
                'security_settings' => 'nullable|array',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $settings = AdminSetting::updateOrCreate(
                ['admin_id' => $admin->id],
                [
                    'site_name' => $request->input('site_name'),
                    'site_description' => $request->input('site_description'),
                    'timezone' => $request->input('timezone', 'Africa/Algiers'),
                    'language' => $request->input('language', 'fr'),
                    'date_format' => $request->input('date_format', 'DD/MM/YYYY'),
                    'notification_settings' => $request->input('notification_settings'),
                    'system_settings' => $request->input('system_settings'),
                    'security_settings' => $request->input('security_settings'),
                ]
            );

            return response()->json([
                'success' => true,
                'message' => 'Settings updated successfully',
                'data' => [
                    'settings' => $this->formatSettings($settings),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update settings: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get default settings
     *
     * @param  \App\Models\Admin  $admin
     * @return array
     */
    private function getDefaultSettings($admin)
    {
        return [
            'site_name' => 'Algeria Youth Network',
            'site_description' => 'Admin dashboard for youth centers management',
            'timezone' => 'Africa/Algiers',
            'language' => 'fr',
            'date_format' => 'DD/MM/YYYY',
            'notification_settings' => [
                'emailNotifications' => true,
                'pushNotifications' => false,
                'eventReminders' => true,
                'newInscriptionAlerts' => true,
                'paymentAlerts' => true,
            ],
            'system_settings' => [
                'itemsPerPage' => 25,
                'autoRefresh' => true,
                'refreshInterval' => 30,
                'enableAnalytics' => true,
                'enableLogs' => true,
            ],
            'security_settings' => $admin->is_super_admin ? [
                'sessionTimeout' => 60,
                'requireStrongPassword' => true,
                'twoFactorAuth' => false,
                'ipWhitelist' => false,
            ] : null,
        ];
    }

    /**
     * Format settings for response
     *
     * @param  \App\Models\AdminSetting|array  $settings
     * @return array
     */
    private function formatSettings($settings)
    {
        if (is_array($settings)) {
            return $settings;
        }

        return [
            'site_name' => $settings->site_name,
            'site_description' => $settings->site_description,
            'timezone' => $settings->timezone,
            'language' => $settings->language,
            'date_format' => $settings->date_format,
            'notification_settings' => $settings->notification_settings ?? [],
            'system_settings' => $settings->system_settings ?? [],
            'security_settings' => $settings->security_settings ?? [],
        ];
    }
}

