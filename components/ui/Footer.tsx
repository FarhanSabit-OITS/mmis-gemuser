
import React from 'react';
import { ShieldCheck, MessageSquare, Globe, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-100 py-12 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <ShieldCheck className="text-white" size={18} />
              </div>
              <span className="text-lg font-bold text-slate-800">MMIS Secure</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Enterprise Multi-Vendor Management Information System. Secure, scalable, and optimized for regional commerce.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-800 mb-4 uppercase text-xs tracking-widest">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Marketplace</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Vendor Portal</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Supplier Network</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Admin Dashboard</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-4 uppercase text-xs tracking-widest">Support</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Contact Support</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-4 uppercase text-xs tracking-widest">Connect</h4>
            <div className="flex gap-4">
              <button className="p-2 bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-all"><Globe size={20}/></button>
              <button className="p-2 bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-all"><MessageSquare size={20}/></button>
            </div>
            <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                SYSTEM STATUS: OPERATIONAL
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-medium">
          <p>© {new Date().getFullYear()} MMIS (Multi-Vendor Management Information System). All rights reserved.</p>
          <p className="flex items-center gap-1">Built with <Heart size={12} className="text-red-500 fill-red-500"/> for Tevas UG</p>
        </div>
      </div>
    </footer>
  );
};
