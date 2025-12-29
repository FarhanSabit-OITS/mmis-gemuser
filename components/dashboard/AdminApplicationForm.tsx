
import React, { useState, useMemo } from 'react';
import { ShieldCheck, User, Building, MapPin, AlertCircle, CheckCircle2, Send, ArrowRight, Info, LayoutGrid, ChevronDown } from 'lucide-react';
import { z } from 'zod';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { CITIES_AND_MARKETS } from '../../constants';

const adminSchema = z.object({
  businessName: z.string().min(3, "Business name must be at least 3 characters"),
  contactPerson: z.string().min(2, "Contact person name is required"),
  targetCity: z.string().min(1, "Location (City) selection is mandatory"),
  targetMarket: z.string().min(1, "Market selection is mandatory"),
  email: z.string().email().refine((val) => val.toLowerCase().endsWith('@mmis.tevas.ug'), {
    message: "Restricted Access: Only @mmis.tevas.ug domains are eligible for Market Admin roles."
  }),
  notes: z.string().optional()
});

interface AdminApplicationFormProps {
  userEmail: string;
  onComplete: () => void;
}

export const AdminApplicationForm = ({ userEmail, onComplete }: AdminApplicationFormProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [form, setForm] = useState({
    businessName: '',
    contactPerson: '',
    targetCity: '',
    targetMarket: '',
    notes: '',
    requestedRole: 'MARKET_ADMIN'
  });

  const availableMarkets = useMemo(() => {
    return CITIES_AND_MARKETS.find(c => c.city === form.targetCity)?.markets || [];
  }, [form.targetCity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = adminSchema.safeParse({ ...form, email: userEmail });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    await new Promise(r => setTimeout(r, 2000));
    setSubmitting(false);
    setSuccess(true);
    
    setTimeout(() => {
      onComplete();
    }, 2500);
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center animate-fade-in">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-100">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Request Transmitted</h2>
        <p className="text-slate-500 mb-8">
          Your application for <strong>Market Admin</strong> at <strong>{form.targetMarket} ({form.targetCity})</strong> has been routed to the Super Admin for review.
        </p>
        <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs text-slate-400 font-medium">
          Official verification typically takes 24-48 hours.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-xl">
          <ShieldCheck size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Market Admin Registry</h2>
          <p className="text-slate-500 text-sm">Official credential request for city-level oversight.</p>
        </div>
      </div>

      {errors.email && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex gap-3 items-start animate-shake">
          <AlertCircle className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-900">Domain Verification Failed</p>
            <p className="text-xs text-red-700 leading-relaxed">{errors.email}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card title="Administrative Credentials">
          <div className="space-y-4">
             <div className="flex flex-col gap-1">
              <label className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-1.5 mb-1 px-1">
                <LayoutGrid size={14} className="text-indigo-600"/> Role Selection <span className="text-red-500">*</span>
              </label>
              <select 
                disabled
                className="bg-black text-white border-2 border-slate-800 rounded-xl px-4 py-3 text-sm outline-none w-full font-bold shadow-xl"
              >
                <option value="MARKET_ADMIN">Market Administrator</option>
              </select>
            </div>

            <Input 
              label="Contact Person Name *" 
              placeholder="Your full legal name" 
              icon={User} 
              value={form.contactPerson} 
              onChange={(e: any) => setForm({ ...form, contactPerson: e.target.value })} 
              className={errors.contactPerson ? 'border-red-500' : ''}
            />
            {errors.contactPerson && <p className="text-[10px] text-red-500 font-bold -mt-3 mb-2 px-1">{errors.contactPerson}</p>}
            
            <Input 
              label="Management Entity Name *" 
              placeholder="e.g. Western Regional Markets Ltd" 
              icon={Building} 
              value={form.businessName} 
              onChange={(e: any) => setForm({ ...form, businessName: e.target.value })} 
            />
            {errors.businessName && <p className="text-[10px] text-red-500 font-bold -mt-3 mb-2 px-1">{errors.businessName}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-1.5 mb-1 px-1">
                  <MapPin size={14} className="text-indigo-600"/> Location (City) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select 
                    value={form.targetCity}
                    onChange={(e) => setForm({ ...form, targetCity: e.target.value, targetMarket: '' })}
                    className="bg-black text-white border-2 border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full font-bold transition-all appearance-none shadow-xl"
                  >
                    <option value="">Select City</option>
                    {CITIES_AND_MARKETS.map(c => <option key={c.city} value={c.city}>{c.city}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-1.5 mb-1 px-1">
                  <Building size={14} className="text-indigo-600"/> Target Market <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select 
                    value={form.targetMarket}
                    onChange={(e) => setForm({ ...form, targetMarket: e.target.value })}
                    disabled={!form.targetCity}
                    className={`bg-black text-white border-2 border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full font-bold transition-all appearance-none shadow-xl ${!form.targetCity && 'opacity-50 grayscale cursor-not-allowed'}`}
                  >
                    <option value="">{form.targetCity ? `Select in ${form.targetCity}` : 'Lock: Select City First'}</option>
                    {availableMarkets.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>
            </div>
            {(errors.targetCity || errors.targetMarket) && <p className="text-[10px] text-red-500 font-bold px-1">Location and Market selection is mandatory.</p>}

            <Input 
              label="Additional Notes (Optional)" 
              placeholder="Regional experience..." 
              multiline 
              value={form.notes} 
              onChange={(e: any) => setForm({ ...form, notes: e.target.value })} 
            />
          </div>
        </Card>

        <div className="bg-indigo-50 p-5 rounded-2xl flex gap-4 border border-indigo-100">
          <Info className="text-indigo-600 shrink-0 mt-0.5" size={20} />
          <p className="text-[11px] text-indigo-700 leading-relaxed font-medium">
            Authorized @mmis.tevas.ug accounts bypass basic screening. Final approval is granted by the Super Admin after manual verification of professional credentials.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={() => window.history.back()}>Discard</Button>
          <Button 
            type="submit" 
            loading={submitting} 
            className="px-10 h-12 shadow-2xl shadow-indigo-100 font-black uppercase tracking-widest text-xs"
          >
            Route to Super Admin <ArrowRight size={16} className="ml-1" />
          </Button>
        </div>
      </form>
    </div>
  );
};