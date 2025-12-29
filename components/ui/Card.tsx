
import React from 'react';

interface CardProps {
  // Fixed: Made children optional and added key to resolve TS errors in various components
  children?: React.ReactNode;
  title?: string;
  className?: string;
  key?: React.Key;
}

export const Card = ({ children, title, className = '' }: CardProps) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-100 p-6 ${className}`}>
    {title && <h3 className="text-lg font-semibold mb-4 text-slate-800">{title}</h3>}
    {children}
  </div>
);
