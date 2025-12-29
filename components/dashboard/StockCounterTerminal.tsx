
import React, { useState, useMemo } from 'react';
import { 
  Package, Boxes, Search, Filter, Plus, Printer, 
  Camera, CheckCircle2, AlertTriangle, ArrowDownLeft, 
  ArrowUpRight, QrCode, FileCheck, ClipboardList, Info, 
  Truck, ShieldCheck, X, RefreshCw, Smartphone, Scan, FileText
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { StockLog } from '../../types';

export const StockCounterTerminal = () => {
  const [logs, setLogs] = useState<StockLog[]>([
    { id: 'STK-8821', itemName: 'Grade A Basmati Rice', quantity: 50, unit: 'Bags', vendor: 'Skyline Retailers', type: 'INBOUND', timestamp: '10:15 AM', inspector: 'Terminal #4', status: 'VERIFIED' },
    { id: 'STK-8822', itemName: 'Refined Sunflower Oil', quantity: 12, unit: 'Jerricans', vendor: 'GreenMart Logistics', type: 'INBOUND', timestamp: '10:45 AM', inspector: 'Terminal #4', status: 'VERIFIED' },
    { id: 'STK-8823', itemName: 'Solar Lantern X1', quantity: 200, unit: 'Units', vendor: 'Global Tech', type: 'OUTBOUND', timestamp: '11:15 AM', inspector: 'Terminal #2', status: 'FLAGGED' },
  ]);

  const [activeTab, setActiveTab] = useState<'TERMINAL' | 'SCANNER' | 'ANALYTICS'>('TERMINAL');
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [search, setSearch] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scannedManifest, setScannedManifest] = useState<StockLog | null>(null);

  const stats = useMemo(() => {
    return {
      total: logs.length,
      verified: logs.filter(l => l.status === 'VERIFIED').length,
      flagged: logs.filter(l => l.status === 'FLAGGED').length,
      load: logs.reduce((acc, l) => acc + l.quantity, 0)
    };
  }, [logs]);

  const startScan = () => {
    setScanning(true);
    setScannedManifest(null);
    setTimeout(() => {
      setScannedManifest(logs[Math.floor(Math.random() * logs.length)]);
      setScanning(false);
    }, 2500);
  };

  const handleVerify = (id: string) => {
    setLogs(logs.map(l => l.id === id ? { ...l, status: 'VERIFIED' } : l));
    setScannedManifest(null);
    setActiveTab('TERMINAL');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Terminal Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-2xl ring-4 ring-indigo-50">
             <Boxes size={32} />
           </div>
           <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Counter Terminal: Delta</h2>
              <p className="text-slate-500 font-medium text-lg">Inbound/Outbound Manifest Verification Node</p>
           </div>
        </div>
        <div className="flex gap-3">
           <Button variant="secondary" onClick={() => setActiveTab('SCANNER')} className="h-12 px-6 font-black uppercase text-[10px] tracking-widest">
             <Smartphone size={18}/> Optical Scan
           </Button>
           <Button onClick={() => setShowVerifyModal(true)} className="shadow-2xl shadow-indigo-200 h-12 px-8 font-black uppercase tracking-widest text-xs">
              <Camera size={18} /> New Manifest Verification
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-900 text-white p-6 rounded-[32px] border-none shadow-2xl group">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aggregate Traffic</p>
           <div className="flex items-center justify-between mt-2">
              <p className="text-4xl font-black tracking-tighter">{stats.total}</p>
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                 <RefreshCw size={24} />
              </div>
           </div>
        </Card>
        <Card className="bg-white p-6 rounded-[32px] border-l-4 border-l-emerald-500 shadow-xl group">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Integrity Pass</p>
           <div className="flex items-center justify-between mt-2">
              <p className="text-4xl font-black tracking-tighter text-slate-900">{stats.verified}</p>
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                 <ShieldCheck size={24} />
              </div>
           </div>
        </Card>
        <Card className="bg-white p-6 rounded-[32px] border-l-4 border-l-red-500 shadow-xl group">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Discrepancies</p>
           <div className="flex items-center justify-between mt-2">
              <p className="text-4xl font-black tracking-tighter text-slate-900">{stats.flagged}</p>
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all">
                 <AlertTriangle size={24} />
              </div>
           </div>
        </Card>
        <Card className="bg-indigo-600 text-white p-6 rounded-[32px] border-none shadow-2xl group">
           <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Daily Commodity Load</p>
           <div className="flex items-center justify-between mt-2">
              <p className="text-4xl font-black tracking-tighter">{stats.load}</p>
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                 <Package size={24} />
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
                 <h3 className="text-3xl font-black tracking-tight mb-4">Manifest Optical Sync</h3>
                 <p className="text-slate-400 text-sm mb-10 max-w-sm mx-auto">Focus scanner on the supplier's digital token to triangulate stock details with the global trade ledger.</p>
                 
                 <div className="aspect-video bg-black rounded-3xl mb-10 border-2 border-white/10 relative group overflow-hidden flex items-center justify-center">
                    {scanning ? (
                       <div className="text-center">
                          <RefreshCw className="animate-spin text-indigo-400 mb-2 mx-auto" size={32} />
                          <p className="text-[10px] font-black uppercase tracking-widest">Scanning Network Node...</p>
                       </div>
                    ) : scannedManifest ? (
                       <div className="bg-indigo-600/20 w-full h-full flex flex-col items-center justify-center p-8 animate-fade-in">
                          <FileText size={64} className="text-indigo-400 mb-4" />
                          <h4 className="text-xl font-black">{scannedManifest.itemName}</h4>
                          <p className="text-xs font-bold text-indigo-300 mt-2">MANIFEST ID: {scannedManifest.id}</p>
                       </div>
                    ) : (
                       <div className="w-48 h-48 border-2 border-indigo-500/50 rounded-3xl animate-pulse flex items-center justify-center">
                          <Scan size={64} className="text-indigo-400/50" />
                       </div>
                    )}
                 </div>

                 {scannedManifest ? (
                    <div className="space-y-4">
                       <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-left">
                             <p className="text-[9px] text-slate-500 font-black uppercase mb-1">DECLARED QTY</p>
                             <p className="text-sm font-bold">{scannedManifest.quantity} {scannedManifest.unit}</p>
                          </div>
                          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-left">
                             <p className="text-[9px] text-slate-500 font-black uppercase mb-1">PARTNER NODE</p>
                             <p className="text-sm font-bold truncate">{scannedManifest.vendor}</p>
                          </div>
                       </div>
                       <div className="flex gap-3">
                          <Button onClick={() => setScannedManifest(null)} variant="secondary" className="flex-1 !bg-white/10 !text-white border-none">Reject</Button>
                          <Button onClick={() => handleVerify(scannedManifest.id)} className="flex-1 !bg-emerald-600 border-none font-black uppercase text-xs h-12 shadow-xl shadow-emerald-900/50">Confirm Verification</Button>
                       </div>
                    </div>
                 ) : (
                    <Button onClick={startScan} disabled={scanning} className="w-full py-4 font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-900/50">Initialize Optical Scanner</Button>
                 )}
              </div>
           </Card>
           <Button variant="ghost" onClick={() => setActiveTab('TERMINAL')} className="w-full !text-slate-400 uppercase font-black text-xs">Return to Traffic Log</Button>
        </div>
      ) : (
        <Card className="rounded-[40px] shadow-2xl border-none p-0 overflow-hidden bg-white">
           <div className="p-8 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="w-full md:w-96">
                 <Input icon={Search} placeholder="Filter by manifest ID or commodity..." value={search} onChange={(e:any)=>setSearch(e.target.value)} />
              </div>
              <div className="flex items-center gap-4">
                 <select className="bg-black text-white border-2 border-slate-800 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-widest outline-none shadow-lg">
                    <option>View: All Traffic</option>
                    <option>Inbound Only</option>
                    <option>Outbound Only</option>
                 </select>
                 <Button variant="secondary" className="font-black text-[10px] uppercase h-10 px-6 tracking-widest shadow-sm"><Printer size={16}/> Daily Manifest</Button>
              </div>
           </div>

           <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50 border-b border-slate-100">
                       <th className="px-8 py-6">Manifest Node</th>
                       <th className="px-8 py-6">Commodity Stack</th>
                       <th className="px-8 py-6">Trade Operator</th>
                       <th className="px-8 py-6">Verification</th>
                       <th className="px-8 py-6 text-right">Action</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {logs.filter(l => l.itemName.toLowerCase().includes(search.toLowerCase()) || l.id.toLowerCase().includes(search.toLowerCase())).map(log => (
                       <tr key={log.id} className="group hover:bg-slate-50/80 transition-colors">
                          <td className="px-8 py-6">
                             <p className="text-sm font-black text-slate-900 font-mono tracking-tight">{log.id}</p>
                             <div className="flex items-center gap-2 mt-1">
                                {log.type === 'INBOUND' ? (
                                   <span className="flex items-center gap-1 text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-widest border border-emerald-100"><ArrowDownLeft size={10}/> Inbound Flow</span>
                                ) : (
                                   <span className="flex items-center gap-1 text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-widest border border-indigo-100"><ArrowUpRight size={10}/> Outbound Flow</span>
                                )}
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <p className="text-sm font-black text-slate-800 tracking-tight">{log.itemName}</p>
                             <div className="flex items-center gap-2 mt-1">
                                <Package size={12} className="text-slate-400" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{log.quantity} {log.unit}</span>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <p className="text-sm font-bold text-slate-700">{log.vendor}</p>
                             <p className="text-[9px] font-black uppercase text-indigo-500 mt-1">Certified Node</p>
                          </td>
                          <td className="px-8 py-6 text-xs font-black text-slate-600 uppercase tracking-widest">
                             {log.timestamp}
                             <p className="text-[9px] font-bold text-slate-400 mt-1 capitalize italic">{log.inspector}</p>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <span className={`inline-flex px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                                log.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                log.status === 'FLAGGED' ? 'bg-red-50 text-red-600 border-red-100' :
                                'bg-amber-50 text-amber-600 border-amber-100 animate-pulse'
                             }`}>
                                {log.status}
                             </span>
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
