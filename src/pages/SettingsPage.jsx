import React, { useState } from 'react';
import { Bell, Globe, Lock, Shield, CreditCard, Save } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Select } from '../components/ui/Select';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { useToast } from '../context/ToastContext';

export const SettingsPage = () => {
  const { addToast } = useToast();
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    printLogs: true,
    securityAlerts: true,
    marketing: false
  });

  const [language, setLanguage] = useState('en');
  const [templateDefault, setTemplateDefault] = useState('modern');

  const handleSaveSettings = () => {
    addToast('System settings saved successfully!', 'success');
  };

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={[{ label: 'System Settings' }]} />

      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
        Platform Preferences & Settings
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Preferences */}
        <div className="lg:col-span-8 space-y-6">
          {/* Notifications */}
          <Card className="p-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-blue-600" /> Notification Controls
            </h3>

            <div className="divide-y divide-slate-100 text-xs space-y-3">
              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="font-bold text-slate-900">Email ID Print Notifications</p>
                  <p className="text-slate-500">Receive email notification whenever an ID badge is printed.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.printLogs}
                  onChange={(e) => setNotifications({ ...notifications, printLogs: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div>
                  <p className="font-bold text-slate-900">Security Login Alerts</p>
                  <p className="text-slate-500">Alerts when new IP addresses sign into your administrator account.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.securityAlerts}
                  onChange={(e) => setNotifications({ ...notifications, securityAlerts: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div>
                  <p className="font-bold text-slate-900">Weekly Analytics Report</p>
                  <p className="text-slate-500">Get a weekly summary of created and exported cards.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.emailAlerts}
                  onChange={(e) => setNotifications({ ...notifications, emailAlerts: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>
          </Card>

          {/* Language & Regional */}
          <Card className="p-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-blue-600" /> Language & Localization
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="System Display Language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                options={[
                  { value: 'en', label: 'English (United States)' },
                  { value: 'es', label: 'Spanish (Español)' },
                  { value: 'fr', label: 'French (Français)' },
                  { value: 'de', label: 'German (Deutsch)' }
                ]}
              />

              <Select
                label="Default ID Card Design Template"
                value={templateDefault}
                onChange={(e) => setTemplateDefault(e.target.value)}
                options={[
                  { value: 'modern', label: 'Modern Tech Blue' },
                  { value: 'corporate', label: 'Corporate Cyan' },
                  { value: 'executive', label: 'Executive Slate' },
                  { value: 'minimal', label: 'Clean Minimal' }
                ]}
              />
            </div>
          </Card>

          <div className="flex justify-end">
            <Button variant="primary" icon={Save} onClick={handleSaveSettings}>
              Save All Settings
            </Button>
          </div>
        </div>

        {/* Right Column: Account Status & Privacy */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-emerald-600" /> Privacy & Compliance
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              All employee metadata and uploaded photos are encrypted using AES-256 at rest.
            </p>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-semibold">
              ✓ GDPR & SOC2 Type II Certified
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
