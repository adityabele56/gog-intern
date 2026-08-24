import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CreditCard, Mail, Lock, User, CheckCircle2, Eye, EyeOff, Phone } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { addToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      await signup({
        name: data.fullName,
        email: data.email,
        password: data.password,
        phone: data.phone || ''
      });
      addToast('Account created successfully! Welcome to Identify.io', 'success');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to create account';
      addToast(msg, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* Left Side Illustration */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-600 via-blue-700 to-sky-600 text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2.5 mb-8">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight">Identify.io</span>
            </Link>

            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight leading-tight">
              Create Enterprise ID Badges in Seconds
            </h2>
            <p className="text-blue-100 text-sm mt-3 leading-relaxed">
              Join thousands of businesses managing staff credentials with maximum security, dynamic QR codes, and instant vector PDF printing.
            </p>
          </div>

          <div className="relative z-10 space-y-3 pt-6 border-t border-white/20 text-xs font-semibold text-blue-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-300" />
              <span>Full Access to All Template Designs</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-300" />
              <span>MongoDB Powered Backend Storage</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-300" />
              <span>Instant High-DPI Vector Exports</span>
            </div>
          </div>
        </div>

        {/* Right Side Signup Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create your account</h2>
            <p className="text-sm text-slate-500 mt-1 mb-6">
              Start building your professional ID cards today.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Full Name */}
              <Input
                label="Full Name"
                placeholder="e.g. Sarah Jenkins"
                icon={User}
                error={errors.fullName?.message}
                {...register('fullName', { required: 'Full name is required' })}
              />

              {/* Email */}
              <Input
                label="Email Address"
                type="email"
                placeholder="name@company.com"
                icon={Mail}
                error={errors.email?.message}
                {...register('email', {
                  required: 'Email address is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />

              {/* Phone */}
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+1 (555) 000-0000"
                icon={Phone}
                {...register('phone')}
              />

              {/* Password */}
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 6 characters"
                  icon={Lock}
                  error={errors.password?.message}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-[38px] text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Confirm Password */}
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Re-enter password"
                icon={Lock}
                error={errors.confirmPassword?.message}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (val) => val === password || 'Passwords do not match'
                })}
              />

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  {...register('terms', { required: 'You must agree to the Terms of Service' })}
                />
                <label htmlFor="terms" className="text-xs text-slate-600 leading-snug cursor-pointer">
                  I agree to the{' '}
                  <a href="#terms" className="text-blue-600 font-semibold hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#privacy" className="text-blue-600 font-semibold hover:underline">
                    Privacy Policy
                  </a>.
                </label>
              </div>
              {errors.terms && <p className="text-xs text-red-500 font-medium">{errors.terms.message}</p>}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                className="w-full mt-2"
              >
                Create Account
              </Button>
            </form>

            <p className="text-center text-xs text-slate-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-blue-600 hover:underline">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
