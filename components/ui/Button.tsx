
import React from 'react';

interface ButtonProps {
  // Fixed: Made children optional to resolve TS errors in various components
  children?: React.ReactNode;
  // Fixed: Allow onClick to receive a MouseEvent to fix type mismatch in InventoryManagement and other components
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  loading = false, 
  disabled = false,
  type = 'button'
}: ButtonProps) => {
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50',
    outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50',
    ghost: 'text-slate-600 hover:bg-slate-100',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };
  return (
    <button 
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : children}
    </button>
  );
};
