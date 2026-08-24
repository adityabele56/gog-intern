import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Award,
  Users,
  Building,
  CheckCircle,
  ArrowRight,
  Globe,
  Lock,
  Sparkles,
  Layers,
  HeartHandshake
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';

export const AboutPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const stats = [
    { label: 'ID Badges Generated', value: '50,000+' },
    { label: 'Active Organizations', value: '500+' },
    { label: 'Export Resolution', value: '300 DPI' },
    { label: 'System Availability', value: '99.99%' }
  ];

  const pillars = [
    {
      icon: ShieldCheck,
      title: 'Security & Compliance',
      description: 'We adhere to global data encryption standards, ensuring user credentials, photos, and signatures remain strictly protected.'
    },
    {
      icon: Sparkles,
      title: 'Vector Precision',
      description: 'Every generated card adheres to exact physical CR-80 card specifications (3.375" x 2.125") with high-resolution PNG rendering.'
    },
    {
      icon: Globe,
      title: 'Cloud Accessibility',
      description: 'Access identity credential workflows from anywhere without needing costly desktop software or local hardware dongles.'
    },
    {
      icon: HeartHandshake,
      title: 'Customer-First Innovation',
      description: 'Engineered based on direct feedback from security administrators, HR leaders, and academic registrars worldwide.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <Badge variant="primary" className="bg-blue-500/20 text-blue-300 border-blue-400/30 mb-4 inline-flex">
              About Identify.io
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Pioneering Modern Digital & Printable Credentialing
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Identify.io is a modern SaaS platform designed to streamline employee, student, and organizational identity card creation with instant 300 DPI high-resolution printing.
            </p>
          </div>
        </section>

        {/* Stats Counter */}
        <section className="py-12 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((st, idx) => (
              <div key={idx} className="p-4">
                <p className="text-3xl sm:text-4xl font-extrabold text-blue-600 tracking-tight">{st.value}</p>
                <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">{st.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Our Core Mission</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Replacing Legacy Software with Web-Native Simplicity
            </h2>
            <p className="text-sm text-slate-600 mt-3 max-w-3xl mx-auto leading-relaxed">
              Traditional ID card creation often requires proprietary desktop software, complicated driver installations, and outdated user interfaces. Identify.io brings identity management into the modern web era—enabling instant customization, high-res canvas exports, and seamless cloud data management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pillars.map((pil, idx) => (
              <Card key={idx} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <pil.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">{pil.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{pil.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Tech Stack & Architecture */}
        <section className="bg-slate-100/70 border-y border-slate-200 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <Badge variant="primary">Modern Tech Stack</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Engineered with High-Performance Technologies
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
              Built on React 19, Vite, Express, and MongoDB with `html-to-image` rendering for uncompromised canvas performance and instant PNG badge downloads.
            </p>

            <div className="pt-6 flex items-center justify-center gap-4 flex-wrap">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate(isLoggedIn ? '/dashboard' : '/signup')}
                icon={ArrowRight}
              >
                {isLoggedIn ? 'Go to Dashboard' : 'Get Started Now'}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/contact')}
              >
                Contact Sales & Support
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
