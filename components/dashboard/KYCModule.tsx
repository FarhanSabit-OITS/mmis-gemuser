
import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, Camera, CheckCircle2, AlertTriangle, 
  MapPin, Building, Info, UserCircle, Briefcase, 
  ChevronDown, Send, FileText, UserPlus, ArrowRight
} from 'lucide-react';
import { z } from 'zod';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { CITIES_AND_MARKETS } from '../../constants';
import { Role } from '../../types';

const kycSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  idNumber: z.string().min(5, "Valid ID number is required"),
  city: z.string().min(1, "Location (City) selection is mandatory"),
  market: z.string().min(1, "Market hub selection is mandatory"),
  businessName: z.string().min(3, "Business name is required"),
  requestedRole: z.string().min(1, "Target role is required"),
  email: z.string().email()
}).refine((data) => {
  if (data.requestedRole === 'MARKET_ADMIN') {
    return data.email.toLowerCase().endsWith('@mmis.tevas.ug');
  }
  return true;
}, {
  message: "Market Admin applications require an official @mmis.tevas.ug email domain.",
  path: ["email"]
});

interface KYCProps {
  type: 'VENDOR' | 'SUPPLIER' | 'ADMIN';
  userEmail: string;
  onComplete: () => void;
}

export const KYCModule = ({ type, userEmail, onComplete }: KYCProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    idNumber: '',
    city: '',
    market: '',
    businessName: '',
    businessType: 'Retail',
    requestedRole: (type === 'ADMIN' ? 'MARKET_ADMIN' : type) as Role
  });

  const marketsForCity = useMemo(() => {
    return CITIES_AND_MARKETS.find(c => c.city === form.city)?.markets || [];
  }, [form.city]);

  const handleSubmit = async () => {
    setErrors({});
    const validationResult = kycSchema.safeParse({ ...form, email: userEmail });

    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      
      // Handle domain error specifically for UI feedback
      if (fieldErrors.email) {
        alert(fieldErrors.email);
      }
      return;
    }

    setSubmitting(true);
    await new Promise(r => setTimeout(r, 2500));
    setSubmitting(false);
    setIsSuccess(true);
    
    setTimeout(() => {
      onComplete();
    }, 4000);
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center animate-fade-in">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-100 border-4 border-white">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">KYC Dossier Transmitted</h2>
        <p className="text-slate-500 text-lg mb-8 leading-relaxed max-w-md mx-auto">
          Your credentials for <span className="text-indigo-600 font-bold">{form.requestedRole}</span> access are now in the verification pipeline.
        </p>
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-2xl inline-block text-left w-full max-w-sm">
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-800 pb-2">Tracking Registry</p>
           <div className="space-y-3">
             <div className="flex justify-between text-xs">
                <span className="opacity-60">Status:</span>
                <span className="text-amber-400 font-bold uppercase">Manual Review</span>
             </div>
             <div className="flex justify-between text-xs">
                <span className="opacity-60">Hub Node:</span>
                <span className="font-bold">{form.market}</span>
             </div>
           </div>
        </div>
        <p className="text-xs text-slate-400 mt-8 italic">Returning to workspace...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-indigo-600 text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-100 ring-4 ring-indigo-50">
            {type === 'ADMIN' ? <ShieldCheck size={40}/> : <UserPlus size={40}/>}
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              KYC & Credentialing
            </h2>
            <p className="text-slate-500 font-medium text-lg">Official Partner Onboarding & Domain Verification</p>
          </div>
        </div>
        <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-xs font-black uppercase border border-indigo-100 shadow-sm flex items-center gap-2">
           <Send size={14}/> Routing to Super Admin
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <Card title="1. Role & Identity Context">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                 <label className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2 px-1">
                   <UserCircle size={14} className="text-indigo-600"/> Target Privilege <span className="text-red-500 font-black">*</span>
                 </label>
                 <div className="relative">
                   <select 
                    value={form.requestedRole}
                    onChange={(e) => setForm({...form, requestedRole: e.target.value as Role})}
                    className="bg-black text-white border-2 border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-600 outline-none w-full font-bold transition-all appearance-none shadow-xl"
                  >
                    <option value="VENDOR">Market Vendor</option>
                    <option value="SUPPLIER">Bulk Supplier</option>
                    <option value="MARKET_ADMIN">Market Admin (Restricted)</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>

              <Input 
                label="Entity Legal Name *" 
                placeholder="e.g. Skyline Retailers" 
                value={form.businessName} 
                onChange={(e:any) => setForm({...form, businessName: e.target.value})} 
                className={errors.businessName ? 'border-red-500' : ''}
              />
              
              <div className="flex flex-col gap-1.5">
                 <label className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2 px-1">
                   <Briefcase size={14} className="text-indigo-600"/> Industry Type
                 </label>
                 <div className="relative">
                   <select 
                    value={form.businessType}
                    onChange={(e) => setForm({...form, businessType: e.target.value})}
                    className="bg-black text-white border-2 border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-600 outline-none w-full font-bold transition-all appearance-none shadow-xl"
                  >
                    <option value="Retail">Retail Trade</option>
                    <option value="Wholesale">Wholesale Supply</option>
                    <option value="Logistics">Supply Chain Node</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>

              <Input label="NIN / TIN Number *" placeholder="Enter credential ID" value={form.idNumber} onChange={(e:any) => setForm({...form, idNumber: e.target.value})} className={errors.idNumber ? 'border-red-500' : ''} />
            </div>
          </Card>

          <Card title="2. Regional Allocation">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2 px-1">
                  <MapPin size={14} className="text-indigo-600"/> Operational City *
                </label>
                <div className="relative">
                  <select 
                    value={form.city}
                    onChange={(e) => setForm({...form, city: e.target.value, market: ''})}
                    className="bg-black text-white border-2 border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-600 outline-none w-full font-bold transition-all appearance-none shadow-xl"
                  >
                    <option value="">Select Region</option>
                    {CITIES_AND_MARKETS.map(c => <option key={c.city} value={c.city}>{c.city}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={`text-xs font-black uppercase tracking-widest flex items-center gap-2 px-1 ${form.city ? 'text-slate-700' : 'text-slate-300'}`}>
                  <Building size={14}/> Targeted Market Node *
                </label>
                <div className="relative">
                  <select 
                    value={form.market}
                    onChange={(e) => setForm({...form, market: e.target.value})}
                    disabled={!form.city}
                    className={`bg-black text-white border-2 border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-600 outline-none w-full font-bold transition-all appearance-none shadow-xl ${!form.city ? 'opacity-30 grayscale cursor-not-allowed' : 'opacity-100'}`}
                  >
                    <option value="">{form.city ? `Choose Center in ${form.city}` : 'Select City First'}</option>
                    {marketsForCity.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>
            </div>
          </Card>

          <Card title="3. Identity Documents">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Input label="Legal First Name *" placeholder="John" value={form.firstName} onChange={(e:any) => setForm({...form, firstName: e.target.value})} className={errors.firstName ? 'border-red-500' : ''} />
              <Input label="Legal Last Name *" placeholder="Doe" value={form.lastName} onChange={(e:any) => setForm({...form, lastName: e.target.value})} className={errors.lastName ? 'border-red-500' : ''} />
            </div>
            
            <div className="border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center hover:border-indigo-500 transition-all cursor-pointer bg-slate-50 group">
              <div className="w-16 h-16 bg-white text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Camera size={28} />
              </div>
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Capture ID / Documentation</h4>
              <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto mt-2 italic">Official NIN Card or Trade License scans required.</p>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-slate-900 text-white shadow-2xl sticky top-24 border-none p-8 rounded-[32px]">
            <h3 className="text-lg font-black mb-8 flex items-center gap-3 tracking-tight border-b border-white/10 pb-4">
              <FileText size={20} className="text-indigo-400" />
              Submission Payload
            </h3>
            
            <div className="space-y-6 mb-10">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Intended Entity</span>
                <span className="text-sm font-bold">{form.businessName || '---'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Network Access</span>
                <span className="text-sm font-bold text-indigo-400">{form.requestedRole}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Hub Location</span>
                <span className="text-sm font-bold text-emerald-400">{form.market || 'Pending Selection'}</span>
              </div>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={handleSubmit} 
                loading={submitting} 
                className="w-full h-14 text-xs font-black uppercase tracking-widest bg-indigo-600 hover:bg-indigo-500 shadow-2xl shadow-indigo-900/40"
              >
                Submit Dossier <ArrowRight size={16} className="ml-2"/>
              </Button>
              <Button variant="ghost" className="w-full !text-slate-500 !text-xs !font-black !uppercase" onClick={() => window.history.back()}>
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};