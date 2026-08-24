import React from 'react';
import { Card } from '../ui/Card';

export const FeatureCard = ({ icon: Icon, title, description, badge }) => {
  return (
    <Card hoverEffect className="flex flex-col gap-3 group relative">
      {badge && (
        <span className="absolute top-4 right-4 bg-sky-100 text-sky-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
          {badge}
        </span>
      )}
      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-xs">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">
        {title}
      </h3>
      <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
    </Card>
  );
};
