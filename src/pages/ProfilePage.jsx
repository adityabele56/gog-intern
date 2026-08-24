import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, Building, ShieldCheck, Lock, Save, Camera } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('details');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [avatarFile, setAvatarFile] = useState(null);

  const { register: regProfile, handleSubmit: handleProfileSubmit, formState: { isSubmitting: isProfileSubmitting } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      company: user?.company || 'Apex Innovations Inc.',
      role: user?.role || 'user'
    }
  });

  const { register: regPass, handleSubmit: handlePassSubmit, reset: resetPass, formState: { isSubmitting: isPassSubmitting } } = useForm();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onUpdateProfile = async (data) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.phone) formData.append('phone', data.phone);
      if (avatarFile) formData.append('profileImage', avatarFile);

      await updateUserProfile(formData);
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update profile';
      addToast(msg, 'error');
    }
  };

  const onChangePassword = async (data) => {
    try {
      const formData = new FormData();
      formData.append('password', data.newPassword);
      await updateUserProfile(formData);
      addToast('Security password updated successfully!', 'success');
      resetPass();
    } catch (err) {
      addToast('Failed to update password', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={[{ label: 'User Profile' }]} />

      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
        Administrator Profile & Credentials
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Profile Overview Card */}
        <Card className="lg:col-span-4 p-6 flex flex-col items-center text-center">
          <div className="relative group mb-4">
            <img
              src={avatarPreview || user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
              alt={user?.name}
              className="w-28 h-28 rounded-3xl object-cover border-4 border-slate-100 shadow-md bg-slate-100"
            />
            <label className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition cursor-pointer">
              <Camera className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>

          <h2 className="text-xl font-extrabold text-slate-900">{user?.name}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
          <div className="mt-3">
            <Badge variant="primary">{user?.role || 'User'}</Badge>
          </div>

          <div className="w-full border-t border-slate-100 mt-6 pt-4 space-y-3 text-xs text-slate-600 text-left">
            <div className="flex items-center gap-2.5">
              <Building className="w-4 h-4 text-blue-600" />
              <span>{user?.company || 'Apex Innovations Inc.'}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-blue-600" />
              <span>{user?.phone || 'Not Provided'}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Verified MongoDB Account</span>
            </div>
          </div>
        </Card>

        {/* Right Tabbed Form */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <Card className="p-6">
            {/* Tabs Header */}
            <div className="flex border-b border-slate-200 mb-6 gap-6">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-3 font-bold text-sm transition border-b-2 ${
                  activeTab === 'details'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Personal Details
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`pb-3 font-bold text-sm transition border-b-2 ${
                  activeTab === 'security'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Security & Password
              </button>
            </div>

            {/* Tab 1: Details */}
            {activeTab === 'details' && (
              <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Full Name" icon={User} {...regProfile('name')} />
                  <Input label="Email Address" icon={Mail} disabled {...regProfile('email')} />
                  <Input label="Phone Number" icon={Phone} {...regProfile('phone')} />
                  <Input label="Company / Organization" icon={Building} {...regProfile('company')} />
                </div>
                <div className="flex justify-end pt-4">
                  <Button type="submit" variant="primary" icon={Save} isLoading={isProfileSubmitting}>
                    Save Changes
                  </Button>
                </div>
              </form>
            )}

            {/* Tab 2: Security */}
            {activeTab === 'security' && (
              <form onSubmit={handlePassSubmit(onChangePassword)} className="space-y-4">
                <Input
                  label="New Password"
                  type="password"
                  icon={Lock}
                  {...regPass('newPassword', { required: true })}
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  icon={Lock}
                  {...regPass('confirmNewPassword', { required: true })}
                />
                <div className="flex justify-end pt-4">
                  <Button type="submit" variant="primary" icon={Save} isLoading={isPassSubmitting}>
                    Update Password
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
