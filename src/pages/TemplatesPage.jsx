import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Sparkles, Check, ArrowRight, RotateCw, PlusCircle, CreditCard } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { IDCardPreview } from '../components/id-card/IDCardPreview';
import { TEMPLATES } from '../utils/theme';
import { useCards } from '../context/CardContext';

export const TemplatesPage = () => {
  const navigate = useNavigate();
  const { activeCard, cards, setActiveCard } = useCards();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLandscape, setIsLandscape] = useState(true);
  const [showBack, setShowBack] = useState(false);

  // Sample placeholder card data for template preview if user has no cards yet
  const defaultSampleCard = {
    id: 'sample-001',
    fullName: 'Alexander Wright',
    designation: 'Senior Product Designer',
    department: 'Engineering & Design',
    companyName: 'Identify SaaS Tech Inc.',
    employeeId: 'EMP-9402',
    phone: '+1 (555) 382-9102',
    email: 'alex.wright@identify.io',
    bloodGroup: 'O+',
    dob: '1995-08-14',
    address: '742 Evergreen Terrace',
    city: 'San Francisco',
    state: 'CA',
    pincode: '94107',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'
  };

  const sampleCard = activeCard || (cards && cards.length > 0 ? cards[0] : defaultSampleCard);

  const categories = [
    { id: 'all', label: 'All Templates' },
    { id: 'corporate', label: 'Corporate & Business' },
    { id: 'student', label: 'University & Academic' },
    { id: 'executive', label: 'Executive Leadership' }
  ];

  const handleUseTemplate = (templateId) => {
    navigate('/dashboard/create', { state: { selectedTemplate: templateId } });
  };

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={[{ label: 'Dashboard', link: '/dashboard' }, { label: 'Templates Gallery' }]} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                ID Card Design Templates
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Browse CR-80 standard professional identity templates. Select any layout to generate dynamic badges.
              </p>
            </div>
          </div>
        </div>

        {/* Global Stage Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsLandscape(!isLandscape)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition flex items-center gap-1.5 shadow-xs"
          >
            <RotateCw className="w-3.5 h-3.5 text-blue-600" />
            <span>{isLandscape ? 'Landscape Mode' : 'Portrait Mode'}</span>
          </button>

          <button
            onClick={() => setShowBack(!showBack)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition shadow-xs"
          >
            {showBack ? 'View Front Side' : 'View Back Side'}
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-stretch">
        {TEMPLATES.map((template) => {
          return (
            <Card
              key={template.id}
              className="p-6 flex flex-col justify-between hover:border-blue-300 transition-all duration-200 group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-3.5 h-3.5 rounded-full ${template.accent}`} />
                    <h3 className="text-base font-bold text-slate-900">{template.name}</h3>
                  </div>
                  <Badge variant="primary">CR-80 Standard</Badge>
                </div>

                {/* Live Card Preview Box */}
                <div className="bg-slate-100/80 p-6 rounded-2xl border border-slate-200 flex items-center justify-center min-h-[320px] overflow-hidden">
                  <div className="transform scale-95 transition-transform duration-200 group-hover:scale-100">
                    <IDCardPreview
                      card={sampleCard}
                      templateId={template.id}
                      isLandscape={isLandscape}
                      showBack={showBack}
                    />
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>300 DPI Export Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setActiveCard(sampleCard);
                      navigate('/dashboard/preview');
                    }}
                  >
                    Full Preview
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={PlusCircle}
                    onClick={() => handleUseTemplate(template.id)}
                  >
                    Use Template
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
