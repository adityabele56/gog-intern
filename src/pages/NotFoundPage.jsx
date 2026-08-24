import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 flex flex-col items-center">
        {/* Creative Graphic */}
        <div className="w-24 h-24 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 shadow-inner relative">
          <CreditCard className="w-12 h-12 rotate-12" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white font-extrabold text-xs px-2 py-0.5 rounded-full">
            404
          </span>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Page Not Found</h1>
        <p className="text-sm text-slate-500 mt-2 mb-8 leading-relaxed">
          The page or ID credential resource you are looking for has been moved or does not exist.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <Button
            variant="outline"
            icon={ArrowLeft}
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto flex-1"
          >
            Go Back
          </Button>
          <Button
            variant="primary"
            icon={Home}
            onClick={() => navigate('/')}
            className="w-full sm:w-auto flex-1"
          >
            Go Back Home
          </Button>
        </div>
      </div>
    </div>
  );
};
