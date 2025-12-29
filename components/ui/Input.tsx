
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  icon?: LucideIcon;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  disabled?: boolean;
  multiline?: boolean;
  required?: boolean;
  // Added className to props interface
  className?: string;
}

// Added className to component parameters and applied it to the container div
export const Input = ({ label, type = 'text', placeholder, icon: Icon, value, onChange, disabled, multiline, required, className = '' }: InputProps) => (
  <div className={`mb-4 ${className}`}>
    {label && (
      <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2 px-1">
        {label}
      </label>
    )}
    <div className="relative group">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 z-10 transition-colors group-focus-within:text-indigo-400" />}
      {multiline ? (
        <textarea
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          rows={4}
          className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3.5 bg-black text-white border-2 border-slate-800 rounded-2xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all outline-none placeholder:text-slate-600 text-sm font-bold disabled:opacity-50 resize-none shadow-xl`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3.5 bg-black text-white border-2 border-slate-800 rounded-2xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all outline-none placeholder:text-slate-600 text-sm font-bold disabled:opacity-50 shadow-xl`}
        />
      )}
    </div>
  </div>
);
