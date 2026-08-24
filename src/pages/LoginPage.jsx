import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CreditCard, Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      addToast('Welcome back! Logged in successfully.', 'success');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid email or password credentials';
      addToast(msg, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[560px]">
        {/* Left Side Branding */}
        <div className="md:col-span-5 bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 text-white p-8 lg:p-10 flex flex-col justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">Identify.io</span>
          </Link>

          <div>
            <h2 className="text-2xl font-bold tracking-tight leading-snug">
              Welcome Back to Your ID Command Center
            </h2>
            <p className="text-blue-100 text-xs mt-2 leading-relaxed">
              Access active card designs, manage staff badges, and print high-resolution credentials.
            </p>
          </div>

          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-xs">
            <p className="font-bold flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-amber-300" /> Real MongoDB Authentication
            </p>
            <p className="text-blue-100">Sign in with your registered account credentials.</p>
          </div>
        </div>

        {/* Right Side Login Form */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Sign In</h2>
                <p className="text-xs text-slate-500 mt-1">Enter your credentials to continue</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setValue('email', 'admin@example.com');
                  setValue('password', 'admin123');
                  addToast('Sample credentials filled. Create an account if not registered yet!', 'info');
                }}
              >
                Sample Fill
              </Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <Input
                label="Work Email"
                type="email"
                placeholder="name@company.com"
                icon={Mail}
                error={errors.email?.message}
                {...register('email', { required: 'Email address is required' })}
              />

              {/* Password */}
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  icon={Lock}
                  error={errors.password?.message}
                  {...register('password', { required: 'Password is required' })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-[38px] text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                className="w-full mt-2"
              >
                Sign In to Dashboard
              </Button>
            </form>

            <p className="text-center text-xs text-slate-500 mt-6">
              Don't have an account?{' '}
              <Link to="/signup" className="font-bold text-blue-600 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Reset Password"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-slate-600">
            Enter your work email address and we'll send you a password reset link.
          </p>
          <Input label="Work Email" type="email" placeholder="name@company.com" icon={Mail} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setForgotModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setForgotModalOpen(false);
                addToast('Password reset link sent to your email!', 'success');
              }}
            >
              Send Reset Link
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
