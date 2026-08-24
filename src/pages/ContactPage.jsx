import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../context/ToastContext';

export const ContactPage = () => {
  const { addToast } = useToast();
  const [openFaq, setOpenFaq] = useState(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    // Simulate contact form submission
    await new Promise((resolve) => setTimeout(resolve, 800));
    addToast('Thank you for reaching out! Our team will respond within 24 hours.', 'success');
    reset();
  };

  const contactDetails = [
    {
      icon: Mail,
      title: 'Email Support',
      value: 'support@identify.io',
      desc: '24/7 dedicated support team'
    },
    {
      icon: Phone,
      title: 'Toll-Free Phone',
      value: '+1 (800) 555-CARD',
      desc: 'Mon-Fri 9am - 6pm EST'
    },
    {
      icon: MapPin,
      title: 'Global Headquarters',
      value: 'San Francisco, CA',
      desc: '100 Innovation Way, Suite 500'
    },
    {
      icon: Clock,
      title: 'Live Support Hours',
      value: 'Mon - Fri',
      desc: '9:00 AM - 6:00 PM EST'
    }
  ];

  const faqs = [
    {
      q: 'What image format and resolution are exported badges?',
      a: 'Downloaded ID cards are generated in crisp 300 DPI high-resolution PNG format adhering strictly to standard physical CR-80 dimensions (3.375" x 2.125").'
    },
    {
      q: 'Can I upload custom profile photos, company logos, and signatures?',
      a: 'Yes! You can upload custom employee photos, corporate logos, and official authorized signature images during the step-by-step card wizard.'
    },
    {
      q: 'Is our organizational data stored securely?',
      a: 'All data is stored in encrypted MongoDB databases protected by industry-standard JWT authentication and HTTPS SSL data transmission.'
    },
    {
      q: 'Can I edit or update an existing ID card after creation?',
      a: 'Absolutely. You can edit any existing card directly from the "My Cards" directory or Dashboard table at any time.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-900 via-slate-900 to-blue-950 text-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <Badge variant="primary" className="bg-blue-500/20 text-blue-300 border-blue-400/30 mb-4 inline-flex">
              Get in Touch
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Contact Our Credential Specialists
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Have questions about ID badge templates, custom enterprise setups, or bulk printing? We are here to assist you.
            </p>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactDetails.map((det, idx) => (
              <Card key={idx} className="p-5 flex flex-col items-center text-center shadow-md">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <det.icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">{det.title}</h3>
                <p className="text-xs font-semibold text-blue-600 mt-1">{det.value}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{det.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Form & Information */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form */}
            <Card className="lg:col-span-7 p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-slate-900">Send Us a Message</h2>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name *"
                    placeholder="Jane Doe"
                    {...register('name', { required: 'Name is required' })}
                    error={errors.name?.message}
                  />
                  <Input
                    label="Email Address *"
                    type="email"
                    placeholder="jane@company.com"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' }
                    })}
                    error={errors.email?.message}
                  />
                </div>

                <Input
                  label="Subject *"
                  placeholder="Inquiry about ID Card Generator"
                  {...register('subject', { required: 'Subject is required' })}
                  error={errors.subject?.message}
                />

                <Textarea
                  label="Message *"
                  rows={4}
                  placeholder="How can our team help your organization?"
                  {...register('message', { required: 'Message is required' })}
                  error={errors.message?.message}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  icon={Send}
                  isLoading={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  Send Message
                </Button>
              </form>
            </Card>

            {/* FAQ */}
            <div className="lg:col-span-5 space-y-4">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base font-bold text-slate-900">Frequently Asked Questions</h3>
                </div>

                <div className="divide-y divide-slate-100 space-y-3">
                  {faqs.map((faq, index) => {
                    const isOpen = openFaq === index;
                    return (
                      <div key={index} className="pt-3">
                        <button
                          onClick={() => setOpenFaq(isOpen ? null : index)}
                          className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-bold text-slate-900 hover:text-blue-600 transition"
                        >
                          <span>{faq.q}</span>
                          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isOpen && (
                          <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                            {faq.a}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
