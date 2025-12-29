
import React, { useEffect, useState, useMemo } from 'react';
import { Package, Store, Users, TrendingUp, ArrowRight, Plus, ShieldCheck, DollarSign, Clock, AlertCircle, CheckCircle, BarChart3, LineChart, PieChart } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, Cell, PieChart as RePieChart, Pie
} from 'recharts';
import { UserProfile } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { PaymentGateway } from '../payments/PaymentGateway';

export const Home = ({ user }: { user: UserProfile }) => {
  const [insights, setInsights] = useState<string>('');
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoadingInsights(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Provide a professional 2-sentence market trend analysis for a user with the role ${user.role} in a multi-vendor ecommerce system. Focus on BI and performance.`,
        });
        setInsights(response.text || 'Welcome back! Performance metrics show a steady upward trend in regional hubs.');
      } catch (e) {
        setInsights('Welcome back! Market analytics indicate stability in core commercial sectors.');
      }
      setLoadingInsights(false);
    };
    fetchInsights();
  }, [user.role]);

  // BI Data Mock
  const performanceData = [
    { name: 'Jan', revenue: 4000, vendors: 24 },
    { name: 'Feb', revenue: 3000, vendors: 28 },
    { name: 'Mar', revenue: 2000, vendors: 30 },
    { name: 'Apr', revenue: 2780, vendors: 35 },
    { name: 'May', revenue: 1890, vendors: 42 },
    { name: 'Jun', revenue: 2390, vendors: 45 },
  ];

  const distributionData = [
    { name: 'Kampala', value: 400 },
    { name: 'Mbarara', value: 300 },
    { name: 'Jinja', value: 300 },
    { name: 'Gulu', value: 200 },
  ];
  const COLORS = ['#4f46e5', '#8b5cf6', '#10b981', '#f59e0b'];

  return (
    <div className="space-y-6 animate-fade-in">
      {showPayment && (
        <PaymentGateway 
          amount={450000} 
          itemDescription="Monthly Market Dues & License" 
          onSuccess={() => setShowPayment(false)}
          onCancel={() => setShowPayment(false)}
        />
      )}

      {/* Hero Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 rounded-3xl p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl relative overflow-hidden border border-white/10">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
             <span className="bg-white/20 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full border border-white/10">BI Console</span>
             <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full border border-emerald-500/20">Active</span>
          </div>
          <h2 className="text-3xl font-black mb-2 tracking-tight">Hello, {user.name}!</h2>
          <p className="text-indigo-100 text-lg opacity-90 max-w-lg font-medium leading-snug">
            {loadingInsights ? 'Parsing system-wide BI metrics...' : insights}
          </p>
          <div className="flex gap-4 mt-8">
            <Button variant="secondary" className="!bg-white/10 !text-white !border-white/20 hover:!bg-white/20" onClick={() => setShowPayment(true)}>
              <DollarSign size={18}/> Pay Dues
            </Button>
            <Button variant="secondary" className="!bg-white !text-indigo-800 font-black tracking-tight">System Report</Button>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 relative z-10 w-full md:w-auto min-w-[240px]">
          <div className="text-[10px] font-black opacity-60 mb-2 uppercase tracking-widest">Aggregate Health Score</div>
          <div className="text-5xl font-black tracking-tighter">98.4<span className="text-2xl opacity-40">%</span></div>
          <div className="mt-4 flex items-center gap-2 text-xs text-green-400 font-bold bg-green-400/10 px-3 py-1.5 rounded-full w-fit">
            <TrendingUp size={14} /> +2.4% Momentum
          </div>
        </div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Application Tracking Section */}
      {user.kycStatus !== 'NONE' && (
        <Card title="Operational Onboarding Status" className="border-l-4 border-indigo-600 shadow-lg">
          <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${
                user.kycStatus === 'SUBMITTED' ? 'bg-amber-100 text-amber-600' :
                user.kycStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-600' :
                'bg-red-100 text-red-600'
              }`}>
                {user.kycStatus === 'SUBMITTED' ? <Clock size={28} /> : 
                 user.kycStatus === 'APPROVED' ? <CheckCircle size={28} /> : <AlertCircle size={28} />}
              </div>
              <div>
                <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest">{user.appliedRole || 'Partner'} Credential Verification</h4>
                <p className="text-sm text-slate-500 font-medium">Status: <span className={`font-black uppercase ${user.kycStatus === 'APPROVED' ? 'text-emerald-600' : 'text-amber-600'}`}>{user.kycStatus}</span></p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">SLA Timeframe</p>
              <p className="text-xs font-black text-slate-800 bg-white border border-slate-100 px-3 py-1 rounded-lg">48-72 Hours</p>
            </div>
          </div>
        </Card>
      )}

      {/* BI Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
              <TrendingUp size={20} className="text-indigo-600" /> Revenue & Growth Index
            </h3>
            <select className="text-[10px] font-black uppercase tracking-widest bg-slate-50 border-none rounded-lg px-2 py-1 outline-none">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={10} tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis fontSize={10} tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2 mb-6">
            <PieChart size={20} className="text-indigo-600" /> Market Concentration
          </h3>
          <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <RePieChart>
                 <Pie
                   data={distributionData}
                   cx="50%"
                   cy="50%"
                   innerRadius={60}
                   outerRadius={80}
                   paddingAngle={5}
                   dataKey="value"
                 >
                   {distributionData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <Tooltip />
               </RePieChart>
             </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {distributionData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{entry.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Platform Orders', value: '1,284', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active Vendors', value: '45', icon: Store, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Verified Users', value: '12.5k', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Total Volume', value: 'UGX 48.2M', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((stat, i) => (
          <Card key={i} className="flex items-center gap-4 hover:shadow-md transition-all cursor-pointer border-slate-100 group">
            <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{stat.label}</p>
              <h4 className="text-xl font-black text-slate-900 tracking-tight">{stat.value}</h4>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="System Activity Pulse" className="lg:col-span-2">
          <div className="space-y-4">
            {[
              { title: 'Market Clearance: Kampala Center', time: '5 mins ago', badge: 'Critical' },
              { title: 'New Vendor Verified: "GreenMart Logistics"', time: '1 hour ago', badge: 'Success' },
              { title: 'API Sync: Regional Revenue Node', time: '4 hours ago', badge: 'Info' },
              { title: 'Audit Alert: Multiple Login Attempts', time: 'Yesterday', badge: 'Security' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-4">
                  <div className={`w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-indigo-600 animate-pulse' : 'bg-slate-200'}`} />
                  <div>
                    <h5 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{item.title}</h5>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[10px] text-slate-400 font-bold">{item.time}</p>
                      <span className="text-[8px] font-black uppercase tracking-widest bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{item.badge}</span>
                    </div>
                  </div>
                </div>
                <ArrowRight size={18} className="text-slate-200 group-hover:text-indigo-600 transition-all group-hover:translate-x-1" />
              </div>
            ))}
          </div>
          <Button variant="ghost" className="w-full mt-6 text-[10px] font-black text-indigo-600 uppercase tracking-widest py-3 hover:bg-indigo-50 rounded-2xl">Access Full Audit Stack</Button>
        </Card>

        <Card title="Strategic Actions">
          <div className="grid grid-cols-1 gap-3">
            <Button variant="secondary" className="justify-start gap-4 w-full py-4 !border-slate-100 hover:!border-indigo-600 group">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Plus size={18} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-slate-700">Add Listing</span>
            </Button>
            <Button variant="secondary" className="justify-start gap-4 w-full py-4 !border-slate-100 hover:!border-indigo-600 group">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Users size={18} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-slate-700">Manage Team</span>
            </Button>
            <Button variant="secondary" className="justify-start gap-4 w-full py-4 !border-slate-100 hover:!border-indigo-600 group">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Store size={18} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-slate-700">Hub Settings</span>
            </Button>
            <Button variant="secondary" className="justify-start gap-4 w-full py-4 !border-slate-100 hover:!border-indigo-600 group">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <ShieldCheck size={18} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-slate-700">Security Audit</span>
            </Button>
          </div>
          <div className="mt-8 p-6 bg-indigo-600 rounded-3xl text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="font-black text-sm mb-1 tracking-tight">Enterprise Scale</h4>
              <p className="text-[11px] opacity-80 mb-5 leading-relaxed font-medium">Unlock advanced BI visualizations and lower settlement fees.</p>
              <Button className="!bg-white !text-indigo-600 w-full text-xs !py-2 shadow-none font-black uppercase tracking-widest group-hover:scale-105 transition-transform">Upgrade Engine</Button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
          </div>
        </Card>
      </div>
    </div>
  );
};
