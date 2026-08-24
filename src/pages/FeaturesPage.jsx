import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Zap,
  Shield,
  Layers,
  Printer,
  QrCode,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Database,
  Lock,
  Cpu,
  FileCheck
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';

export const FeaturesPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const featureList = [
    {
      icon: Sparkles,
      title: '300 DPI High-Res Export',
      description: 'Export identity badges directly to print-ready 300 DPI high-resolution PNG images or vectors adhering strictly to standard CR-80 physical dimensions (3.375" x 2.125").',
      badge: 'High Precision',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: QrCode,
      title: 'Smart Encrypted QR Code',
      description: 'Automatically encodes verified credentials, employee identity, department role, and emergency contact details into scan-ready smart QR codes.',
      badge: 'Security',
      color: 'bg-indigo-50 text-indigo-600'
    },
    {
      icon: Layers,
      title: 'CR-80 Dynamic Templates',
      description: 'Choose from multiple professional layout presets including Modern Tech Blue, Corporate Cyan, Executive Dark, and Clean Minimal styles with custom colors.',
      badge: 'Multi-Style',
      color: 'bg-sky-50 text-sky-600'
    },
    {
      icon: Printer,
      title: 'Batch Printing & Duplex View',
      description: 'Easily toggle between front and back sides of the badge, switch between portrait and landscape formats, and trigger browser batch print dialogs.',
      badge: 'Print Ready',
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      icon: Database,
      title: 'MongoDB Cloud Persistence',
      description: 'Real-time database storage ensures all employee records, issue histories, download counts, and custom profile assets are securely stored and synced.',
      badge: 'Cloud Sync',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      icon: Lock,
      title: 'Multi-Role Asset Management',
      description: 'Upload employee portrait photos, official company signatures, and corporate logos with automated CORS pre-processing for zero-taint image downloads.',
      badge: 'Enterprise Access',
      color: 'bg-amber-50 text-amber-600'
    }
  ];

  const highlights = [
    'No expensive specialized ID card software needed',
    'Instant live front and back card preview wizard',
    'Full search and filter directory by department/course',
    'Single-click high-res PNG download with custom filenames',
    'GDPR compliant encrypted credential storage'
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-900 via-slate-900 to-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <Badge variant="primary" className="bg-blue-500/20 text-blue-300 border-blue-400/30 mb-4 inline-flex">
              Platform Features Overview
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Enterprise ID Badge Generation Built for Speed & Precision
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Explore the complete suite of features engineered to design, generate, print, and manage security identity credentials effortlessly.
            </p>

            <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate(isLoggedIn ? '/dashboard' : '/signup')}
                icon={ArrowRight}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold"
              >
                {isLoggedIn ? 'Go to Dashboard' : 'Start Creating Badges'}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/about')}
                className="border-slate-700 text-slate-200 hover:bg-slate-800"
              >
                Learn About Us
              </Button>
            </div>
          </div>
        </section>

        {/* Feature Grid Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Everything You Need for Digital Identity Management
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-xl mx-auto">
              Built from the ground up to eliminate costly specialized software and complex hardware setups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureList.map((feat, idx) => (
              <Card key={idx} className="p-6 flex flex-col justify-between hover:border-blue-400 transition-all duration-200 group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${feat.color}`}>
                      <feat.icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2.5 py-1 rounded-md bg-slate-100">
                      {feat.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Highlighting Section */}
        <section className="bg-white border-y border-slate-200 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Why Organizations Choose Us
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Designed for Corporate, Educational & Healthcare Institutions
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Whether you need student identity badges, corporate employee credentials, or temporary guest passes, our system simplifies verification and generation.
              </p>

              <div className="space-y-3 pt-2">
                {highlights.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-700">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-gradient-to-br from-blue-50 to-sky-50 p-8 rounded-3xl border border-blue-100 flex flex-col justify-between text-center">
              <Cpu className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Ready to Upgrade Credentialing?</h3>
              <p className="text-xs text-slate-600 mb-6">
                Start issuing high-resolution identity credentials in minutes. No credit card required.
              </p>
              <Button
                variant="primary"
                onClick={() => navigate(isLoggedIn ? '/dashboard/create' : '/signup')}
                className="w-full justify-center"
              >
                {isLoggedIn ? 'Create Card Now' : 'Create Free Account'}
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
