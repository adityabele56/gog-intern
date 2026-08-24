import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  CreditCard,
  Layers,
  User,
  Settings,
  LogOut,
  X,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Create ID', icon: PlusCircle, path: '/dashboard/create' },
    { label: 'My Cards', icon: CreditCard, path: '/dashboard/cards' },
    { label: 'Templates', icon: Layers, path: '/dashboard/templates' },
    { label: 'Profile', icon: User, path: '/dashboard/profile' },
    { label: 'Settings', icon: Settings, path: '/dashboard/settings' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 w-64 p-5 select-none">
      {/* Top Header Logo */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100">
        <NavLink to="/dashboard" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">
              Identify<span className="text-blue-600">.io</span>
            </span>
            <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">
              SaaS Portal
            </span>
          </div>
        </NavLink>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 py-6 flex flex-col gap-1.5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1">
          Menu Navigation
        </p>
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            end={item.path === '/dashboard'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
              }`
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Banner / Upgrade Widget */}
      <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl p-4 border border-blue-100/80 mb-4">
        <div className="flex items-center gap-2 text-blue-700 font-bold text-xs mb-1">
          <Sparkles className="w-4 h-4 text-sky-500" />
          <span>Pro Business Plan</span>
        </div>
        <p className="text-xs text-slate-600 leading-snug">
          Unlimited high-res vector PDF generation & bulk card printing.
        </p>
      </div>

      {/* Footer User Info & Logout */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
            alt="Avatar"
            className="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0"
          />
          <div className="truncate">
            <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Alex Morgan'}</p>
            <p className="text-[11px] text-slate-400 truncate">{user?.email || 'admin@identify.io'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          title="Logout"
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition shrink-0"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block fixed top-0 left-0 bottom-0 z-30">
        {navContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={onClose}
          />
          <div className="relative z-10">{navContent}</div>
        </div>
      )}
    </>
  );
};
