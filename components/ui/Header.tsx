
import React from 'react';
import { Store, Bell, Search, User as UserIcon, LogOut } from 'lucide-react';
import { UserProfile } from '../../types';

interface HeaderProps {
  user?: UserProfile | null;
  onLogout?: () => void;
  onLogoClick?: () => void;
  showSearch?: boolean;
  isSimplified?: boolean;
  onNotificationClick?: () => void;
}

export const Header = ({ 
  user, 
  onLogout, 
  onLogoClick,
  showSearch = true, 
  isSimplified = false,
  onNotificationClick 
}: HeaderProps) => {
  return (
    <header className={`h-20 bg-white/70 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-8 border-b border-slate-100 ${isSimplified ? 'shadow-sm' : ''}`}>
      <div className="flex items-center gap-4 flex-1">
        <div 
          onClick={onLogoClick}
          className="flex items-center gap-2 group cursor-pointer"
          title="Go to Home"
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <Store className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight hidden sm:block">MMIS</h1>
        </div>
      </div>

      {!isSimplified && (
        <div className="flex items-center gap-4 relative">
          {showSearch && (
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                placeholder="Global search..." 
                className="bg-slate-100/50 border border-slate-200 rounded-full pl-10 pr-4 py-2 text-sm w-64 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none" 
              />
            </div>
          )}

          {user && (
            <>
              <div className="relative">
                <button 
                  onClick={onNotificationClick}
                  className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative"
                >
                  <Bell size={20} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
              </div>
              
              <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
              
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-900 leading-none">{user.name}</p>
                  <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-tighter mt-1">{user.role}</p>
                </div>
                <div className="group relative">
                  <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-black ring-2 ring-slate-100 cursor-pointer">
                    {user.name.charAt(0)}
                  </div>
                  {onLogout && (
                     <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-2">
                       <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                         <LogOut size={16} /> Sign Out
                       </button>
                     </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
      
      {isSimplified && !user && (
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Platform</a>
            <a href="#" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Solutions</a>
            <a href="#" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Pricing</a>
          </nav>
          <div className="h-8 w-[1px] bg-slate-200"></div>
          <button className="text-sm font-black text-indigo-600 uppercase tracking-widest hover:underline">Support Hub</button>
        </div>
      )}
    </header>
  );
};
