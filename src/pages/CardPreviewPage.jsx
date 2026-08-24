import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { toPng } from 'html-to-image';
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

// Helper: Wait for document fonts and all image elements within container to be fully loaded
const waitForAssetsToLoad = async (container) => {
  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch (e) {
      console.warn('[DOWNLOAD] Font loading wait warning:', e);
    }
  }

  const images = Array.from(container.querySelectorAll('img'));
  await Promise.all(
    images.map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete && img.naturalWidth !== 0) {
            resolve();
            return;
          }
          const onDone = () => {
            img.removeEventListener('load', onDone);
            img.removeEventListener('error', onDone);
            resolve();
          };
          img.addEventListener('load', onDone);
          img.addEventListener('error', onDone);
        })
    )
  );
};

// Helper: Safely inline cross-origin images to Data URLs to prevent canvas/SVG tainting
const inlineCrossDomainImages = async (container) => {
  const images = Array.from(container.querySelectorAll('img'));
  const backups = [];

  await Promise.all(
    images.map(async (img) => {
      const src = img.src;
      if (!src || src.startsWith('data:')) return;

      try {
        // Method 1: Fetch as CORS blob & convert to Data URL via FileReader
        const response = await fetch(src, { mode: 'cors' });
        if (response.ok) {
          const blob = await response.blob();
          const dataUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(blob);
          });
          if (dataUrl) {
            backups.push({ img, originalSrc: src });
            img.src = dataUrl;
            return;
          }
        }
      } catch (fetchErr) {
        console.warn('[DOWNLOAD] Fetch image as blob failed, trying Image canvas fallback:', src, fetchErr);
      }

      // Method 2: Offscreen Image canvas drawing fallback
      try {
        const dataUrl = await new Promise((resolve) => {
          const tempImg = new Image();
          tempImg.crossOrigin = 'anonymous';
          tempImg.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              canvas.width = tempImg.naturalWidth || 400;
              canvas.height = tempImg.naturalHeight || 400;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(tempImg, 0, 0);
              resolve(canvas.toDataURL('image/png'));
            } catch (canvasErr) {
              resolve(null);
            }
          };
          tempImg.onerror = () => resolve(null);
          tempImg.src = src;
        });

        if (dataUrl) {
          backups.push({ img, originalSrc: src });
          img.src = dataUrl;
        }
      } catch (err) {
        console.warn('[DOWNLOAD] Image data URL conversion skipped:', src, err);
      }
    })
  );

  return () => {
    backups.forEach(({ img, originalSrc }) => {
      img.src = originalSrc;
    });
  };
};

export const CardPreviewPage = () => {
  const navigate = useNavigate();
  const { activeCard, cards, incrementDownload, incrementPrint } = useCards();
  const { addToast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const cardRef = useRef(null);

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
    console.log('[DOWNLOAD] Button clicked');
    if (!card) {
      console.warn('[DOWNLOAD] No card active');
      return;
    }

    const cardElement = cardRef.current?.querySelector('.print-area') || document.querySelector('.print-area');
    if (!cardElement) {
      console.error('[DOWNLOAD] Card element not found in DOM');
      addToast('ID Card element not ready for download', 'warning');
      return;
    }

    console.log('[DOWNLOAD] Card element found', cardElement);
    const rect = cardElement.getBoundingClientRect();
    console.log('[DOWNLOAD] Card dimensions', { width: rect.width, height: rect.height });

    setIsExporting(true);
    let restoreImages = null;
    let createdObjectUrl = null;

    try {
      addToast('Generating high-resolution badge download...', 'info');

      console.log('[DOWNLOAD] Waiting for images');
      await waitForAssetsToLoad(cardElement);

      restoreImages = await inlineCrossDomainImages(cardElement);
      console.log('[DOWNLOAD] Images loaded');

      console.log('[DOWNLOAD] Starting capture');
      let dataUrl = '';

      try {
        // Primary capture method: html-to-image
        dataUrl = await toPng(cardElement, {
          quality: 1.0,
          pixelRatio: 3,
          backgroundColor: '#FFFFFF',
          fontEmbedCSS: ''
        });
      } catch (primaryErr) {
        console.warn('[DOWNLOAD] Primary capture (html-to-image) failed, falling back to html2canvas:', primaryErr);
        // Fallback capture method: html2canvas
        const canvas = await html2canvas(cardElement, {
          scale: 3,
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#FFFFFF',
          logging: false
        });
        dataUrl = canvas.toDataURL('image/png');
      }

      console.log('[DOWNLOAD] Capture completed');

      // Convert Data URL to Blob
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      console.log('[DOWNLOAD] Blob created', { size: blob.size, type: blob.type });

      createdObjectUrl = URL.createObjectURL(blob);

      const empId = card.employeeId || card.rollNumber || card.id || 'BADGE';
      const sanitizedEmpId = String(empId).trim().replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `ID-Card-${sanitizedEmpId}.png`;

      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = createdObjectUrl;
      link.download = filename;

      document.body.appendChild(link);
      console.log('[DOWNLOAD] Download triggered', { filename });
      link.click();
      document.body.removeChild(link);

      if (card) incrementDownload(card.id);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      addToast(`Downloaded high-res badge for ${card.fullName || 'Employee'}!`, 'success');
    } catch (err) {
      console.error('[DOWNLOAD ERROR] Failed to generate ID card download:', err);
      addToast(err?.message ? `Download error: ${err.message}` : 'Failed to generate image download', 'error');
    } finally {
      if (restoreImages) {
        restoreImages();
      }
      if (createdObjectUrl) {
        setTimeout(() => {
          URL.revokeObjectURL(createdObjectUrl);
        }, 1000);
      }
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
          <div ref={cardRef}>
            <IDCardPreview
              card={card}
              templateId={selectedTemplate}
              isLandscape={isLandscape}
              showBack={showBack}
            />
          </div>

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
