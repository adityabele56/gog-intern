import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import {
  Printer,
  Download,
  Edit,
  PlusCircle,
  RotateCw,
  Layers,
  Sparkles,
  Check
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { IDCardPreview } from '../components/id-card/IDCardPreview';
import { useCards } from '../context/CardContext';
import { useToast } from '../context/ToastContext';
import { TEMPLATES } from '../utils/theme';

export const CardPreviewPage = () => {
  const navigate = useNavigate();
  const { activeCard, cards, incrementDownload, incrementPrint } = useCards();
  const { addToast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const card = activeCard || cards[0];
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [isLandscape, setIsLandscape] = useState(true);
  const [showBack, setShowBack] = useState(false);

  const handlePrint = () => {
    if (card) incrementPrint(card.id);
    addToast('Opening print dialog...', 'info');
    window.print();
  };

  const handleDownload = async () => {
    if (!card) return;
    const cardElement = document.querySelector('.print-area');
    if (!cardElement) {
      addToast('ID Card element not ready for download', 'warning');
      return;
    }

    setIsExporting(true);
    try {
      addToast('Generating high-resolution badge download...', 'info');
      const canvas = await html2canvas(cardElement, {
        scale: 3, // 300 DPI high-res output
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FFFFFF'
      });

      const link = document.createElement('a');
      const nameSanitized = (card.fullName || 'ID_Card').replace(/[^a-zA-Z0-9]/g, '_');
      link.download = `${nameSanitized}_ID_Badge.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      if (card) incrementDownload(card.id);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      addToast(`Downloaded high-res badge for ${card.fullName}!`, 'success');
    } catch (err) {
      console.error('Download error:', err);
      addToast('Failed to generate image download', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  if (!card) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-600 font-medium">No card selected for preview.</p>
        <Button onClick={() => navigate('/dashboard/create')} className="mt-4">
          Create New Card
        </Button>
      </div>
    );
  }

  const isStudent = card.cardType === 'Student' || !!card.college || !!card.rollNumber;

  return (
    <div className="flex flex-col gap-6">
      <div className="no-print">
        <Breadcrumb items={[{ label: 'My Cards', link: '/dashboard/cards' }, { label: 'Card Preview' }]} />
      </div>

      {/* Header Bar */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              ID Card Printable Studio
            </h1>
            <Badge variant={isStudent ? 'success' : 'primary'}>
              {isStudent ? 'Student Badge' : 'Employee Badge'}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Preview, toggle templates, print, or download vector PDF for <span className="font-bold text-slate-800">{card.fullName}</span>.
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Button variant="outline" icon={Edit} onClick={() => navigate('/dashboard/create')}>
            Edit Card
          </Button>
          <Button variant="outline" icon={PlusCircle} onClick={() => navigate('/dashboard/create')}>
            Create New
          </Button>
          <Button variant="secondary" icon={Download} isLoading={isExporting} onClick={handleDownload}>
            Download Badge
          </Button>
          <Button variant="primary" icon={Printer} onClick={handlePrint}>
            Print Card
          </Button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left ID Card Stage Container */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center p-8 bg-slate-100/70 rounded-3xl border border-slate-200 min-h-[420px]">
          {/* Controls Bar above stage */}
          <div className="no-print flex items-center justify-between w-full max-w-lg mb-6 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLandscape(!isLandscape)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1.5"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>{isLandscape ? 'Landscape' : 'Portrait'}</span>
              </button>
              <button
                onClick={() => setShowBack(!showBack)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              >
                {showBack ? 'View Front Side' : 'View Back Side'}
              </button>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Standard CR-80 Size</span>
          </div>

          {/* Render Actual Card Component */}
          <IDCardPreview
            card={card}
            templateId={selectedTemplate}
            isLandscape={isLandscape}
            showBack={showBack}
          />

          <p className="no-print text-xs text-slate-400 mt-4 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            CR80 3.375" x 2.125" standard badge format with 300 DPI high-resolution export.
          </p>
        </div>

        {/* Right Configuration & Template Sidebar */}
        <div className="no-print lg:col-span-4 flex flex-col gap-6">
          {/* Template Selector */}
          <Card className="p-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" /> Choose Design Template
            </h3>
            <div className="space-y-3">
              {TEMPLATES.map((tmpl) => {
                const isSelected = selectedTemplate === tmpl.id;
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => setSelectedTemplate(tmpl.id)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${tmpl.accent}`} />
                      <span className="text-sm font-bold text-slate-800">{tmpl.name}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Quick Specifications */}
          <Card className="p-6 text-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Badge Metadata
            </h3>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">{isStudent ? 'Roll Number:' : 'Employee ID:'}</span>
              <span className="font-mono font-bold text-slate-900">{card.rollNumber || card.employeeId}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">{isStudent ? 'Course:' : 'Department:'}</span>
              <span className="font-semibold text-slate-800">{card.course || card.department}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Total Printed:</span>
              <span className="font-bold text-emerald-600">{card.printed || 0} times</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Total Downloaded:</span>
              <span className="font-bold text-sky-600">{card.downloads || 0} times</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
