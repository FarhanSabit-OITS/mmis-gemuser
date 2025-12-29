
import React, { useState, useMemo } from 'react';
import { 
  Truck, LogIn, LogOut, DollarSign, Clock, ShieldCheck, 
  Printer, Camera, QrCode, Search, X, CheckCircle2, 
  AlertTriangle, CreditCard, ArrowRight, UserCheck, Ticket,
  LayoutGrid, History, Smartphone, Scan, User, RefreshCw
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface GateRecord {
  id: string;
  plate: string;
  type: 'SUPPLIER' | 'VENDOR' | 'STAFF' | 'VISITOR';
  timeIn: string;
  timeOut?: string;
  status: 'INSIDE' | 'EXITED';
  charge: number;
  paymentStatus: 'PAID' | 'PENDING' | 'EXEMPT';
  token: string;
}

export const GateManagement = () => {
  const [activeTab, setActiveTab] = useState<'TERMINAL' | 'HISTORY' | 'SCANNER'>('TERMINAL');
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<GateRecord | null>(null);
  const [search, setSearch] = useState('');
  const [scannedResult, setScannedResult] = useState<GateRecord | null>(null);
  const [scanning, setScanning] = useState(false);
  
  const [records, setRecords] = useState<GateRecord[]>([
    { id: 'GT-001', plate: 'UAX 123Z', type: 'SUPPLIER', timeIn: '08:45 AM', status: 'INSIDE', charge: 5000, paymentStatus: 'PAID', token: 'QR-882-991' },
    { id: 'GT-002', plate: 'UBB 990X', type: 'VENDOR', timeIn: '09:12 AM', timeOut: '11:05 AM', status: 'EXITED', charge: 2000, paymentStatus: 'PAID', token: 'QR-112-445' },
    { id: 'GT-003', plate: 'UCA 445L', type: 'VISITOR', timeIn: '10:05 AM', status: 'INSIDE', charge: 3500, paymentStatus: 'PENDING', token: 'QR-556-221' },
  ]);

  const [entryForm, setEntryForm] = useState({
    plate: '',
    type: 'VISITOR' as GateRecord['type'],
  });

  const handleEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: GateRecord = {
      id: 'GT-' + Math.random().toString(36).substr(2, 4).toUpperCase(),
      plate: entryForm.plate.toUpperCase(),
      type: entryForm.type,
      timeIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'INSIDE',
      charge: entryForm.type === 'STAFF' ? 0 : 2500,
      paymentStatus: entryForm.type === 'STAFF' ? 'EXEMPT' : 'PENDING',
      token: 'QR-' + Math.floor(100 + Math.random() * 900) + '-' + Math.floor(100 + Math.random() * 900),
    };
    setRecords([newRecord, ...records]);
    setGeneratedToken(newRecord);
    setShowEntryModal(false);
    setEntryForm({ plate: '', type: 'VISITOR' });
  };

  const handleExit = (id: string) => {
    setRecords(records.map(r => 
      r.id === id ? { ...r, status: 'EXITED', timeOut: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), paymentStatus: 'PAID' } : r
    ));
    setScannedResult(null);
  };

  const handleScanSimulation = () => {
    setScanning(true);
    setTimeout(() => {
      // Find a record that is still 'INSIDE' for simulation
      const target = records.find(r => r.status === 'INSIDE') || null;
      setScannedResult(target);
      setScanning(false);
    }, 2000);
  };

  const totals = useMemo(() => {
    const inside = records.filter(r => r.status === 'INSIDE').length;
    const collections = records.reduce((acc, r) => acc + (r.paymentStatus === 'PAID' ? r.charge : 0), 0);
    const pending = records.filter(r => r.paymentStatus === 'PENDING').length;
    return { inside, collections, pending };
  }, [records]);

  const filteredRecords = records.filter(r => 
    r.plate.toLowerCase().includes(search.toLowerCase()) || 
    r.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Entry Modal */}
      {showEntryModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-2xl relative overflow-hidden rounded-[32px] border-none" title="Staff Check-In Terminal">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600"></div>
            <button onClick={() => setShowEntryModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"><X size={24} /></button>
            <form onSubmit={handleEntry} className="space-y-5 py-2">
              <Input label="Vehicle Plate Number *" placeholder="e.g. UAX 990P" icon={Truck} value={entryForm.plate} onChange={(e:any)=>setEntryForm({...entryForm, plate: e.target.value})} required />
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">User Category</label>
                <select 
                  value={entryForm.type}
                  onChange={(e) => setEntryForm({...entryForm, type: e.target.value as any})}
                  className="w-full bg-black text-white border-2 border-slate-800 rounded-2xl px-4 py-3.5 text-sm font-bold focus:border-indigo-600 outline-none appearance-none cursor-pointer shadow-xl"
                >
                  <option value="VISITOR">Visitor / Customer</option>
                  <option value="VENDOR">Market Vendor</option>
                  <option value="SUPPLIER">Bulk Supplier</option>
                  <option value="STAFF">Official Staff</option>
                </select>
              </div>
              <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex gap-3">
                 <DollarSign className="text-indigo-600 shrink-0 mt-0.5" size={18} />
                 <div>
                    <p className="text-xs font-bold text-indigo-900">Settlement Authorization</p>
                    <p className="text-[10px] text-indigo-700 font-medium">Auto-bill UGX 2,500 for non-exempt vehicles.</p>
                 </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="secondary" onClick={() => setShowEntryModal(false)}>Abort</Button>
                <Button type="submit" className="px-8 font-black uppercase tracking-widest text-xs h-12 shadow-xl shadow-indigo-100">
                  Generate Token
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Generated Token Display */}
      {generatedToken && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
           <Card className="w-full max-sm text-center py-10 relative overflow-hidden rounded-[32px] border-none bg-white">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600"></div>
              <button onClick={() => setGeneratedToken(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"><X size={24} /></button>
              
              <div className="mb-8 px-6">
                 <div className="w-24 h-24 bg-indigo-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl ring-4 ring-indigo-50">
                    <QrCode size={48} />
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight">{generatedToken.plate}</h3>
                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Authorized Access Token</p>
              </div>

              <div className="bg-slate-50 p-6 mx-8 rounded-[24px] space-y-3 mb-8 text-left border border-slate-100">
                 <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-400 uppercase tracking-widest text-[9px]">Manifest ID:</span>
                    <span className="text-slate-900">{generatedToken.id}</span>
                 </div>
                 <div className="flex justify-between text-xs font-bold border-t border-slate-200 pt-3">
                    <span className="text-slate-400 uppercase tracking-widest text-[9px]">Check-In:</span>
                    <span className="text-slate-900">{generatedToken.timeIn}</span>
                 </div>
              </div>

              <div className="px-8 space-y-3">
                 <Button className="w-full py-4 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-xl shadow-indigo-100">
                    <Printer size={18} /> Print Thermal Slip
                 </Button>
              </div>
           </Card>
        </div>
      )}

      {/* Main Terminal Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-2xl ring-4 ring-slate-100">
             <LayoutGrid size={32} />
           </div>
           <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Stuff Terminal: Gate Alpha</h2>
              <p className="text-slate-500 font-medium text-lg">Entry-Exit Verification & Compliance Hub</p>
           </div>
        </div>
        <div className="flex gap-3">
           <Button variant="secondary" onClick={() => setActiveTab('SCANNER')} className="h-12 px-6 font-black uppercase text-[10px] tracking-widest">
             <Smartphone size={18}/> OPTICAL SCANNER
           </Button>
           <Button onClick={() => setShowEntryModal(true)} className="shadow-2xl shadow-indigo-200 h-12 px-8 font-black uppercase tracking-widest text-xs">
              <LogIn size={18} /> New Check-In
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-indigo-600 text-white border-none shadow-2xl relative overflow-hidden group p-8 rounded-[32px]">
           <p className="text-[10px] font-black text-white/60 uppercase tracking-widest relative z-10 mb-4 border-b border-white/10 pb-4">Real-time Revenue</p>
           <p className="text-4xl font-black relative z-10 tracking-tighter">UGX {totals.collections.toLocaleString()}</p>
           <DollarSign className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700" size={180} />
        </Card>
        
        <Card className="bg-white shadow-xl border-slate-100 p-8 rounded-[32px] border-l-4 border-l-emerald-500 group">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Traffic In-Bound</p>
           <div className="flex items-center justify-between">
              <p className="text-5xl font-black text-slate-900 tracking-tighter">{totals.inside}</p>
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <Truck size={32} />
              </div>
           </div>
        </Card>

        <Card className="bg-white shadow-xl border-slate-100 p-8 rounded-[32px] border-l-4 border-l-amber-500 group">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Verification Queued</p>
           <div className="flex items-center justify-between">
              <p className="text-5xl font-black text-slate-900 tracking-tighter">{totals.pending}</p>
              <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all">
                <CreditCard size={32} />
              </div>
           </div>
        </Card>
      </div>

      {activeTab === 'SCANNER' ? (
        <div className="max-w-2xl mx-auto space-y-8 animate-slide-up py-10">
           <Card className="rounded-[40px] shadow-2xl border-none p-12 text-center bg-slate-900 text-white relative overflow-hidden">
              <div className="relative z-10">
                 <div className="w-24 h-24 bg-white/10 rounded-[32px] flex items-center justify-center mx-auto mb-8 border border-white/20">
                    <Camera size={48} className="text-indigo-400" />
                 </div>
                 <h3 className="text-3xl font-black tracking-tight mb-4">Terminal Auth Active</h3>
                 
                 <div className="aspect-video bg-black rounded-3xl mb-10 border-2 border-white/10 relative group overflow-hidden flex items-center justify-center">
                    {scanning ? (
                       <div className="text-center">
                          <RefreshCw className="animate-spin text-indigo-400 mb-2 mx-auto" size={32} />
                          <p className="text-[10px] font-black uppercase tracking-widest">Triangulating Token...</p>
                       </div>
                    ) : (
                       <div className="w-48 h-48 border-2 border-indigo-500/50 rounded-3xl animate-pulse flex items-center justify-center">
                          <Scan size={64} className="text-indigo-400/50" />
                       </div>
                    )}
                 </div>

                 {scannedResult ? (
                    <div className="bg-emerald-500/20 border border-emerald-500/30 p-6 rounded-[24px] animate-fade-in text-left">
                       <div className="flex justify-between items-start mb-4">
                          <div>
                             <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">VALIDATED ENTITY</p>
                             <h4 className="text-xl font-black">{scannedResult.plate}</h4>
                          </div>
                          <CheckCircle2 className="text-emerald-400" size={32} />
                       </div>
                       <Button onClick={() => handleExit(scannedResult.id)} className="w-full !bg-emerald-600 border-none font-black uppercase text-xs h-12 shadow-xl shadow-emerald-900/50">
                          Authorize Final Exit
                       </Button>
                    </div>
                 ) : (
                    <Button onClick={handleScanSimulation} disabled={scanning} className="w-full py-4 font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-900/50">
                       Start Verification Cycle
                    </Button>
                 )}
              </div>
           </Card>
           <Button variant="ghost" onClick={() => setActiveTab('TERMINAL')} className="w-full !text-slate-400 uppercase font-black text-xs">Return to Terminal</Button>
        </div>
      ) : (
        <Card className="overflow-hidden border-slate-100 shadow-2xl p-0 rounded-[32px]">
           <div className="p-8 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="w-full md:w-96">
                 <Input icon={Search} placeholder="Search plate or token code..." value={search} onChange={(e:any)=>setSearch(e.target.value)} />
              </div>
              <div className="flex gap-4">
                <Button variant="secondary" className="font-black text-[10px] uppercase tracking-widest"><Printer size={16}/> Daily Manifest</Button>
              </div>
           </div>

           <div className="overflow-x-auto custom-scrollbar">
             <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                    <th className="px-8 py-6">Vehicle Entity</th>
                    <th className="px-8 py-6">Manifest Auth</th>
                    <th className="px-8 py-6">Cycle Node</th>
                    <th className="px-8 py-6">Arrears</th>
                    <th className="px-8 py-6 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredRecords.map((r) => (
                    <tr key={r.id} className={`group hover:bg-slate-50/80 transition-all ${r.status === 'EXITED' && 'opacity-60 grayscale'}`}>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-5">
                           <div className={`w-14 h-14 rounded-2xl ${r.status === 'INSIDE' ? 'bg-slate-900' : 'bg-slate-200'} text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-all`}>
                              <Truck size={24} className={r.status === 'EXITED' ? 'text-slate-400' : 'text-white'} />
                           </div>
                           <div>
                              <span className="text-base font-black text-slate-900 block tracking-tight">{r.plate}</span>
                              <span className="text-[9px] font-black uppercase text-indigo-500 tracking-widest">{r.type} Node</span>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                         <p className="text-sm font-black text-slate-700 font-mono tracking-tight">{r.token}</p>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex flex-col gap-1">
                            <p className="text-sm font-black text-slate-800 tracking-tight">{r.timeIn}</p>
                            <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${r.status === 'INSIDE' ? 'text-emerald-600' : 'text-slate-400'}`}>
                               {r.status === 'INSIDE' ? <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> : <LogOut size={12}/>}
                               {r.status === 'INSIDE' ? 'STATIONARY' : `EXITED: ${r.timeOut}`}
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <p className="text-sm font-black text-slate-900 tracking-tighter">UGX {r.charge.toLocaleString()}</p>
                         <span className={`inline-flex px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                           r.paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                           r.paymentStatus === 'PENDING' ? 'bg-red-50 text-red-600 border-red-100 animate-pulse' :
                           'bg-slate-50 text-slate-500 border-slate-100'
                         }`}>
                           {r.paymentStatus}
                         </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <div className="flex justify-end gap-2">
                            {r.status === 'INSIDE' ? (
                              <Button 
                                onClick={() => handleExit(r.id)}
                                className="text-[10px] font-black uppercase tracking-widest bg-slate-900 hover:bg-red-600 transition-all h-10 px-6"
                              >
                                Finalize Exit
                              </Button>
                            ) : (
                              <button className="p-3 hover:bg-slate-100 rounded-xl text-slate-500 transition-all">
                                 <Printer size={18} />
                              </button>
                            )}
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
           </div>
        </Card>
      )}
    </div>
  );
};
