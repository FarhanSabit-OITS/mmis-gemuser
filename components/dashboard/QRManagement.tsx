
import React, { useState } from 'react';
import { 
  QrCode, Ticket, FileText, Download, Printer, Plus, 
  Search, X, Camera, CheckCircle2, History, AlertTriangle,
  Clock, ShieldCheck, User, Zap, Mail, Smartphone
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface Token {
  id: string;
  type: 'ENTRY' | 'RECEIPT' | 'PRODUCT' | 'VENDOR_ID';
  owner: string;
  issued: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  code: string;
}

export const QRManagement = () => {
  const [activeTab, setActiveTab] = useState<'TOKENS' | 'SCANNER'>('TOKENS');
  const [search, setSearch] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  
  const [tokens] = useState<Token[]>([
    { id: 'T-1001', type: 'ENTRY', owner: 'John Doe (Supplier)', issued: '2024-05-18 08:30', status: 'ACTIVE', code: 'MMIS-ENT-8821' },
    { id: 'T-1002', type: 'VENDOR_ID', owner: 'Mukasa James', issued: '2023-12-10 14:22', status: 'ACTIVE', code: 'MMIS-VND-4452' },
    { id: 'T-1003', type: 'RECEIPT', owner: 'Cash Payment', issued: '2024-05-18 10:05', status: 'EXPIRED', code: 'MMIS-REC-9912' },
    { id: 'T-1004', type: 'PRODUCT', owner: 'Skyline Retailers', issued: '2024-05-15 09:00', status: 'ACTIVE', code: 'MMIS-PRD-1111' },
  ]);

  const filteredTokens = tokens.filter(t => 
    t.owner.toLowerCase().includes(search.toLowerCase()) || 
    t.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-2xl ring-4 ring-slate-100">
             <QrCode size={32} />
           </div>
           <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Security & Token Console</h2>
              <p className="text-slate-500 font-medium text-lg">QR Ecosystem & Verification Terminal</p>
           </div>
        </div>
        <div className="flex gap-3">
           <Button variant="secondary" onClick={() => setActiveTab('SCANNER')} className="h-12 px-6 font-black uppercase text-[10px] tracking-widest">
              <Camera size={18}/> Optical Scan
           </Button>
           <Button className="shadow-2xl shadow-indigo-200 h-12 px-8 font-black uppercase tracking-widest text-xs">
              <Plus size={18} /> Issue New Token
           </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 bg-slate-100/50 p-2 rounded-2xl w-fit border border-slate-200/50 shadow-inner">
        <button 
          onClick={() => setActiveTab('TOKENS')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'TOKENS' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'text-slate-500 hover:text-slate-800 hover:bg-white'}`}
        >
          <Ticket size={16} /> Token Inventory
        </button>
        <button 
          onClick={() => setActiveTab('SCANNER')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'SCANNER' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'text-slate-500 hover:text-slate-800 hover:bg-white'}`}
        >
          <Smartphone size={16} /> Active Scanner
        </button>
      </div>

      {activeTab === 'TOKENS' ? (
        <div className="space-y-6 animate-fade-in">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                 <Input icon={Search} placeholder="Filter by owner, ID or encrypted code..." value={search} onChange={(e:any)=>setSearch(e.target.value)} />
              </div>
              <select className="bg-black text-white border-2 border-slate-800 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-widest outline-none shadow-lg">
                 <option>Type: All Issued</option>
                 <option>Entry Passes</option>
                 <option>Digital Receipts</option>
                 <option>Identity Tokens</option>
              </select>
              <Button variant="secondary" className="font-black text-[10px] uppercase tracking-widest"><Printer size={16}/> Thermal Export</Button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTokens.map(token => (
                <Card key={token.id} className="group relative overflow-hidden rounded-3xl border-none shadow-xl hover:shadow-2xl transition-all">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                     <QrCode size={100} className="text-slate-800" />
                  </div>
                  
                  <div className="flex items-center gap-4 mb-6">
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all ${
                       token.status === 'ACTIVE' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'
                     }`}>
                       <Ticket size={24} />
                     </div>
                     <div>
                       <h4 className="font-black text-slate-900 tracking-tight">{token.type} Token</h4>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{token.id}</p>
                     </div>
                  </div>

                  <div className="space-y-3 mb-8 border-y border-slate-50 py-5">
                     <div className="flex justify-between items-center">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Assignee:</span>
                       <span className="text-xs font-bold text-slate-800">{token.owner}</span>
                     </div>
                     <div className="flex justify-between items-center">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status:</span>
                       <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                         token.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                       }`}>{token.status}</span>
                     </div>
                     <div className="flex justify-between items-center">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Issued:</span>
                       <span className="text-xs font-bold text-slate-500">{token.issued}</span>
                     </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl mb-6 flex items-center justify-between group-hover:bg-indigo-50 transition-colors">
                     <span className="font-mono text-[10px] font-black text-indigo-600">{token.code}</span>
                     <Zap size={14} className="text-indigo-400" />
                  </div>

                  <div className="flex gap-2">
                    <Button variant="secondary" className="flex-1 text-[10px] font-black uppercase py-2"><Download size={14} /> PDF</Button>
                    <Button variant="outline" className="flex-1 text-[10px] font-black uppercase py-2 border-2"><Printer size={14} /> Print</Button>
                  </div>
                </Card>
              ))}
           </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-8 py-10 animate-slide-up">
           <Card className="rounded-[40px] shadow-2xl border-none p-12 text-center relative overflow-hidden bg-slate-900 text-white">
              <div className="relative z-10">
                 <div className="w-24 h-24 bg-white/10 rounded-[32px] flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-2xl">
                    <Camera size={48} className="text-indigo-400" />
                 </div>
                 <h3 className="text-3xl font-black tracking-tight mb-4">Auth Scanner Active</h3>
                 <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10 max-w-sm mx-auto">
                    Align the token QR within the optical guide. System will automatically triangulate and verify credentials against the global ledger.
                 </p>
                 
                 <div className="aspect-video bg-black rounded-3xl mb-10 border-2 border-white/10 relative group overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-48 h-48 border-2 border-indigo-500/50 rounded-3xl animate-pulse flex items-center justify-center">
                          <div className="w-32 h-32 border border-indigo-500/20 rounded-2xl" />
                       </div>
                    </div>
                    <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500/40 animate-scan"></div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                       <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Last Scan</p>
                       <p className="text-xs font-bold text-emerald-400">SUCCESS: MMIS-ENT-001</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                       <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Terminal ID</p>
                       <p className="text-xs font-bold text-indigo-400">STAFF-NODE-KLA-12</p>
                    </div>
                 </div>
              </div>
              <div className="absolute -left-20 -top-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl"></div>
           </Card>
           
           <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-3xl flex gap-5">
              <ShieldCheck className="text-indigo-600 shrink-0 mt-0.5" size={28} />
              <div>
                 <p className="text-sm font-black text-indigo-900 uppercase tracking-tight">Encryption Integrity Protocol</p>
                 <p className="text-xs text-indigo-700 leading-relaxed font-medium">
                    All scanned data is verified via 256-bit asymmetric encryption. Revoked tokens are flagged instantly at the network edge.
                 </p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
