import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Shield, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                <CreditCard className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                Identify<span className="text-blue-600">.io</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed">
              Enterprise-grade online ID card generation platform. Create, customize, and print high-resolution security badge cards in seconds.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>ISO 27001 Certified & GDPR Compliant</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Product
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm font-medium text-slate-600">
              <li><Link to="/features" className="hover:text-blue-600 transition">ID Card Features</Link></li>
              <li><Link to="/features" className="hover:text-blue-600 transition">Batch Printing</Link></li>
              <li><Link to="/features" className="hover:text-blue-600 transition">Dynamic QR Security</Link></li>
              <li><Link to="/features" className="hover:text-blue-600 transition">Enterprise Security</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm font-medium text-slate-600">
              <li><Link to="/about" className="hover:text-blue-600 transition">About Us</Link></li>
              <li><Link to="/features" className="hover:text-blue-600 transition">Platform Overview</Link></li>
              <li><Link to="/contact" className="hover:text-blue-600 transition">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Get in Touch
            </h4>
            <ul className="flex flex-col gap-3 text-sm text-slate-600">
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                <span>support@identify.io</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                <span>+1 (800) 555-CARD</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>100 Innovation Way, Suite 500, San Francisco, CA</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Identify.io Systems. All rights reserved.</p>
          <div className="flex items-center gap-6 font-medium">
            <a href="#privacy" className="hover:text-slate-900">Privacy</a>
            <a href="#terms" className="hover:text-slate-900">Terms</a>
            <a href="#cookies" className="hover:text-slate-900">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
