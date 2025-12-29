import React, { useState } from 'react';
import { Mail, Lock, User, Fingerprint, MessageSquare, Info, AlertCircle, X, CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { UserProfile, Role } from '../../types';
import { Header } from '../ui/Header';
import { Footer } from '../ui/Footer';

interface AuthPageProps {
  onSuccess: (user: UserProfile) => void;
}

export const AuthPage = ({ onSuccess }: AuthPageProps) => {
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP' | 'MFA' | 'FORGOT' | 'CONTACT'>('LOGIN');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerificationTooltip, setShowVerificationTooltip] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    
    if (mode === 'LOGIN') {
      setMode('MFA');
    } else if (mode === 'SIGNUP') {
      setShowVerificationTooltip(true);
    } else if (mode === 'MFA') {
      onSuccess({
        id: 'u-' + Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0] || 'Operator',
        email: email || 'demo@mmis.ug',
        role: 'USER' as Role,
        isVerified: true,
        kycStatus: 'NONE',
        mfaEnabled: true,
        settings: {
          lowStockThreshold: 10,
          criticalStockThreshold: 5,
          notifications: {
            email: true,
            browser: true,
            sms: false
          }
        }
      });
    }
    setLoading(false);
  };

  const closeTooltipAndReset = () => {
    setShowVerificationTooltip(false);
    setMode('LOGIN');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative">
      <Header 
        user={null} 
        isSimplified={true}
        onLogoClick={() => setMode('LOGIN')}
      />
      
      {showVerificationTooltip && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <Card className="max-w-md w-full relative overflow-hidden rounded-[32px] p-8 border-none shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
            <button onClick={closeTooltipAndReset} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors">
              <X size={24} />
            </button>
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Mail size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Check Verification Node</h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed font-medium">
                A secure entry link has been dispatched to <span className="font-black text-indigo-600">{email || 'your registry email'}</span>.
              </p>
              
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-4 text-left mb-8">
                <Info size={20} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-700 leading-relaxed font-bold uppercase tracking-tight">
                  Registry Latency: Check <span className="underline">Spam or Junk</span> if not visible within 60s. The link is valid for 24 cycles.
                </p>
              </div>

              <Button className="w-full h-14 font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100" onClick={closeTooltipAndReset}>
                Credential Dispatched
              </Button>
            </div>
          </Card>
        </div>
      )}

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in py-12">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center justify-center gap-3">
              MMIS <span className="text-indigo-600 bg-indigo-50 px-3 py-1 rounded-2xl">HUB</span>
            </h1>
            <p className="text-slate-500 mt-3 font-bold uppercase text-[10px] tracking-[0.2em] opacity-60">Regional Logistics Intelligence</p>
          </div>

          <Card className="shadow-2xl border-none rounded-[40px] p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600"></div>
            
            {mode === 'LOGIN' && (
              <>
                <h2 className="text-xl font-black mb-8 text-center text-slate-800 tracking-tight">Operator Authentication</h2>
                <Input label="Registry ID / Email" icon={Mail} placeholder="operator@mmis.ug" value={email} onChange={(e:any)=>setEmail(e.target.value)} />
                <Input label="Master Key" type="password" icon={Lock} placeholder="••••••••" />
                
                <div className="flex items-center justify-between mb-8 px-1">
                  <label className="flex items-center text-xs text-slate-500 cursor-pointer font-black uppercase tracking-widest hover:text-indigo-600 transition-colors">
                    <input type="checkbox" className="mr-2 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" /> Persistent Session
                  </label>
                  <button onClick={() => setMode('FORGOT')} className="text-xs text-indigo-600 font-black uppercase tracking-widest hover:underline">Lost Access?</button>
                </div>

                <Button className="w-full h-14 font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100 mb-8" onClick={handleAuth} loading={loading}>Authorize Terminal</Button>
                
                <div className="text-center space-y-4 pt-6 border-t border-slate-50">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    New entity? <button onClick={() => setMode('SIGNUP')} className="text-indigo-600 hover:underline">Initialize Registration</button>
                  </p>
                  <button onClick={() => setMode('CONTACT')} className="text-[9px] text-slate-300 hover:text-indigo-400 font-black uppercase tracking-[0.1em] flex items-center justify-center gap-2 mx-auto transition-colors">
                    <MessageSquare size={12} /> Contact Administrative Support
                  </button>
                </div>
              </>
            )}

            {mode === 'SIGNUP' && (
              <>
                <h2 className="text-xl font-black mb-8 text-center text-slate-800 tracking-tight">Create Entity Ledger</h2>
                <Input label="Legal Entity Name" icon={User} placeholder="e.g. Mukasa James" />
                <Input label="Registry Email" icon={Mail} placeholder="name@domain.com" value={email} onChange={(e:any)=>setEmail(e.target.value)} />
                <Input label="Master Key Generation" type="password" icon={Lock} placeholder="Secure passphrase" />
                
                <Button className="w-full h-14 font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100 mb-8" onClick={handleAuth} loading={loading}>Dispatch Credentials</Button>
                
                <div className="text-center pt-6 border-t border-slate-50">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Existing Node? <button onClick={() => setMode('LOGIN')} className="text-indigo-600 hover:underline">Return to Terminal</button>
                  </p>
                </div>
              </>
            )}

            {mode === 'MFA' && (
              <div className="text-center py-4">
                <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[28px] flex items-center justify-center mx-auto mb-8 shadow-inner ring-4 ring-indigo-50/50">
                  <Fingerprint size={40} />
                </div>
                <h2 className="text-2xl font-black mb-2 text-slate-900 tracking-tight">Identity Sync</h2>
                <p className="text-xs text-slate-500 mb-10 font-medium">Transmit the 6-digit MMIS Secure Key generated via your authenticator node.</p>
                <div className="flex gap-3 justify-center mb-10">
                  {[1,2,3,4,5,6].map(i => (
                    <input 
                      key={i} 
                      maxLength={1} 
                      autoFocus={i === 1}
                      className="w-12 h-14 bg-black text-white border-2 border-slate-800 rounded-2xl text-center font-black text-xl focus:border-indigo-600 outline-none transition-all shadow-xl" 
                    />
                  ))}
                </div>
                <Button className="w-full h-14 font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100" onClick={handleAuth} loading={loading}>Validate Registry</Button>
                <p className="mt-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Auth failure? <button className="text-indigo-600 hover:underline">Use Recovery Ledger</button></p>
              </div>
            )}

            {mode === 'FORGOT' && (
              <>
                <h2 className="text-xl font-black mb-4 text-center text-slate-800 tracking-tight">Ledger Recovery</h2>
                <p className="text-xs text-slate-500 mb-10 text-center font-medium leading-relaxed">System will dispatch a key rotation packet to your verified registry email address.</p>
                <Input label="Verified Email" icon={Mail} placeholder="operator@domain.ug" />
                <Button className="w-full h-14 font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100" onClick={() => { alert('Recovery packet dispatched!'); setMode('LOGIN'); }}>Send Rotation Link</Button>
                <div className="mt-10 text-center pt-6 border-t border-slate-50">
                  <button onClick={() => setMode('LOGIN')} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Abort & Return</button>
                </div>
              </>
            )}
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};