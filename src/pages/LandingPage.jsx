import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap,
  ShieldCheck,
  QrCode,
  Printer,
  Smartphone,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Users,
  Award,
  Clock,
  Star
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { FeatureCard } from '../components/shared/FeatureCard';
import { IDCardPreview } from '../components/id-card/IDCardPreview';

export const LandingPage = () => {
  const navigate = useNavigate();

  const sampleCardData = {
    fullName: 'Sarah Jenkins',
    employeeId: 'APX-9482',
    designation: 'Senior Lead Architect',
    department: 'Engineering',
    companyName: 'APEX INNOVATIONS INC.',
    phone: '+1 (555) 345-6789',
    email: 'sarah.j@apexinnovations.com',
    bloodGroup: 'O+',
    dob: '1995-04-12',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400'
  };

  const features = [
    {
      icon: Zap,
      title: 'Fast Generation',
      description: 'Generate high-resolution printable ID cards in under 30 seconds with automated templates.'
    },
    {
      icon: ShieldCheck,
      title: 'Secure System',
      description: 'Encrypted metadata verification, secure RFID tracking codes, and privacy compliance.'
    },
    {
      icon: Smartphone,
      title: 'Fully Responsive',
      description: 'Design and manage employee cards seamlessly from desktop, tablet, or smartphone.'
    },
    {
      icon: Printer,
      title: 'Print Ready',
      description: 'Export press-ready 300 DPI vector PDF files designed for thermal card printers.'
    },
    {
      icon: QrCode,
      title: 'Dynamic QR Code',
      description: 'Automatically embeds encrypted employee verification QR codes on every badge.'
    },
    {
      icon: Sparkles,
      title: 'Custom Branding',
      description: 'Upload custom company logos, signatures, color palettes, and department watermarks.'
    }
  ];

  const stats = [
    { label: 'Cards Generated', value: '150,000+', icon: Users },
    { label: 'System Uptime', value: '99.99%', icon: Clock },
    { label: 'Active Enterprise Clients', value: '1,200+', icon: Award },
    { label: 'Average User Rating', value: '4.95 / 5', icon: Star }
  ];

  const testimonials = [
    {
      quote: "Identify.io has streamlined our onboarding process completely. Printing employee badges used to take days, now it takes 2 minutes.",
      name: "Marcus Vance",
      title: "Head of Operations, TechCorp",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"
    },
    {
      quote: "The live preview and instant vector PDF downloads saved our security team hundreds of hours. High quality and elegant design!",
      name: "Elena Rostova",
      title: "Security Manager, Apex Bio",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-white via-slate-50 to-blue-50/40 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 flex flex-col gap-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold w-fit mx-auto lg:mx-0">
                <Sparkles className="w-4 h-4 text-sky-500" />
                <span>Next-Gen Enterprise ID Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Professional <span className="text-blue-600">ID Card</span> Generator
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl font-normal leading-relaxed mx-auto lg:mx-0">
                Generate professional ID Cards in seconds with an elegant and secure system. Built for modern enterprises, schools, and organizations.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  icon={ArrowRight}
                  onClick={() => navigate('/signup')}
                  className="w-full sm:w-auto"
                >
                  Get Started Free
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    const el = document.getElementById('features');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto"
                >
                  Learn More
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-200/80 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-semibold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> Instant PDF Export
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> No Credit Card Required
                </span>
              </div>
            </motion.div>

            {/* Hero Right Card Preview Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 flex flex-col items-center justify-center"
            >
              <div className="relative group p-4 bg-white/60 rounded-3xl border border-slate-200 shadow-2xl backdrop-blur-sm hover:shadow-blue-500/10 transition duration-300">
                <IDCardPreview card={sampleCardData} templateId="modern" isLandscape={true} />
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500 font-medium px-2">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Dynamic Preview
                  </span>
                  <span>100% Vector Quality</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Powerful Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
              Everything You Need to Create Enterprise Badges
            </h2>
            <p className="text-slate-600 mt-3 text-base">
              Designed to make staff ID generation effortless, secure, and lightning fast.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => (
              <FeatureCard
                key={idx}
                icon={feat.icon}
                title={feat.title}
                description={feat.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <stat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{stat.value}</h3>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Trusted Worldwide
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, idx) => (
              <Card key={idx} className="flex flex-col justify-between">
                <p className="text-slate-700 italic text-base leading-relaxed mb-6">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{t.name}</h4>
                    <p className="text-xs text-slate-500">{t.title}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-sky-600 text-white">
        <div className="max-w-5xl mx-auto px-4 text-center flex flex-col items-center gap-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Generate Professional ID Cards?
          </h2>
          <p className="text-blue-100 text-base max-w-xl">
            Join thousands of organizations using Identify.io for fast, secure, and beautiful ID card issuance.
          </p>
          <Button
            variant="secondary"
            size="lg"
            className="bg-white text-blue-700 hover:bg-blue-50 shadow-xl border-none font-bold"
            onClick={() => navigate('/signup')}
          >
            Create Your First Card Now
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};
