import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, X, CheckCircle2 } from 'lucide-react';

export const UploadBox = ({ label, value, onChange, accept = 'image/*', helperText }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result, file);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-semibold text-slate-800 tracking-wide">
          {label}
        </label>
      )}

      {value ? (
        <div className="relative group rounded-2xl border border-slate-200 bg-slate-50 p-3 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <img
              src={value}
              alt="Uploaded preview"
              className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-xs bg-white"
            />
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-900 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Image Selected
              </p>
              <p className="text-[11px] text-slate-500 truncate">Ready for ID card placement</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange('', null)}
            className="p-1.5 bg-white border border-slate-200 text-slate-500 rounded-xl hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed transition cursor-pointer text-center ${
            isDragging
              ? 'border-blue-500 bg-blue-50/50'
              : 'border-slate-300 bg-slate-50/50 hover:bg-slate-100/80 hover:border-blue-400'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
            <UploadCloud className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-800">
            Click to upload <span className="font-normal text-slate-500">or drag and drop</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">SVG, PNG, JPG or WEBP (Max 5MB)</p>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}
      {helperText && <p className="text-xs text-slate-400">{helperText}</p>}
    </div>
  );
};
