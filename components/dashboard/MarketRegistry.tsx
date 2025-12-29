
import React, { useState, useMemo } from 'react';
import { 
  Building2, MapPin, Plus, Search, Filter, Calendar, 
  Users, Briefcase, Globe, ExternalLink, ShieldAlert, 
  TrendingUp, BarChart as ChartIcon, PieChart as PieIcon, LineChart as LineIcon
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { UserProfile, Market } from '../../types';
import { MOCK_MARKETS } from '../../constants';

export const MarketRegistry = ({ user }: { user: UserProfile }) => {
  const [markets] = useState<Market[]>(MOCK_MARKETS);
  const [search, setSearch] = useState('');
  const [showAnalytics, setShowAnalytics] = useState(false);

  const filtered = useMemo(() => {
    return markets.filter(m => 
      m.name.toLowerCase().includes(search.toLowerCase()) || 
      m.city.toLowerCase().includes(search.toLowerCase())
    );
  }, [markets, search]);

  // Analytics Data
  const capacityData = useMemo(() => {
    return markets.map(m => ({
      name: m.name,
      capacity: m.capacity
    }));
  }, [markets]);

  const typeData = useMemo(() => {
    const counts: Record<string, number> = {};
    markets.forEach(m => {
      counts[m.type] = (counts[m.type] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [markets]);

  const timelineData = useMemo(() => {
    return [...markets]
      .sort((a, b) => new Date(a.establishedDate).getTime() - new Date(b.establishedDate).getTime())
      .map(m => ({
        year: new Date(m.establishedDate).getFullYear(),
        name: m.name,
        capacity: m.capacity
      }));
  }, [markets]);

  const COLORS = ['#4f46e5', '#8b5cf6', '#10b981', '#f59e0b'];

  const handleOpenMap = (marketName: string) => {
    const query = encodeURIComponent(`${marketName} Uganda`);
    window.open(`https://www.google.com/maps/search/${query}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Building2 className="text-indigo-600" size={28} />
            Market Hub & Infrastructure
          </h2>
          <p className="text-slate-500">Categorization of regional commerce centers by infrastructure, age, and ownership.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="font-bold text-xs flex items-center gap-2"
          >
            {showAnalytics ? <Building2 size={16}/> : <ChartIcon size={16}/>}
            {showAnalytics ? 'Show Registry' : 'Visual Analytics'}
          </Button>
          {(user.role === 'SUPER_ADMIN' || user.role === 'MARKET_ADMIN') && (
            <Button className="font-bold uppercase tracking-widest text-xs">
              <Plus size={18}/> Register New Center
            </Button>
          )}
        </div>
      </div>

      {showAnalytics ? (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Market Capacity Distribution">
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={capacityData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" fontSize={10} tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                    <YAxis fontSize={10} tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      cursor={{fill: '#f8fafc'}}
                    />
                    <Bar dataKey="capacity" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title="Infrastructure Type Ratio">
              <div className="h-80 w-full flex flex-col">
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={typeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {typeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-2">
                  {typeData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card title="Establishment Timeline & Growth" className="lg:col-span-2">
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineData}>
                    <defs>
                      <linearGradient id="colorCap" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="year" fontSize={10} tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                    <YAxis fontSize={10} tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="capacity" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorCap)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-center text-xs text-slate-400 mt-4 font-medium italic">Visualization of market capacity increases relative to establishment dates.</p>
            </Card>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input icon={Search} placeholder="Filter markets by name, city, or trade..." value={search} onChange={(e:any) => setSearch(e.target.value)} />
            </div>
            <select className="bg-black text-white border border-slate-800 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-bold">
              <option>All Center Types</option>
              <option>Wholesale Hub</option>
              <option>Retail Market</option>
              <option>Mixed Use Center</option>
            </select>
            <select className="bg-black text-white border border-slate-800 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-bold">
              <option>Ownership Model</option>
              <option>Publicly Managed</option>
              <option>Privately Managed</option>
              <option>PPP Model</option>
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filtered.map(market => (
              <Card key={market.id} className="relative group overflow-hidden border-2 border-transparent hover:border-indigo-100 transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4 items-center">
                    <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:bg-indigo-600 transition-colors">
                      <Building2 size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">{market.name}</h3>
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold mt-1">
                        <MapPin size={12} className="text-indigo-500" /> {market.city}, Regional Hub
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest shadow-sm ${
                    market.ownership === 'PUBLIC' ? 'bg-blue-100 text-blue-700' :
                    market.ownership === 'PRIVATE' ? 'bg-purple-100 text-purple-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {market.ownership} CONTROL
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-y-6 gap-x-6 mb-8 border-y border-slate-50 py-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Briefcase size={12}/> Utility Type
                    </p>
                    <p className="text-sm font-black text-slate-800 tracking-tight">{market.type}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Calendar size={12}/> Legacy
                    </p>
                    <p className="text-sm font-black text-slate-800 tracking-tight">
                      Est. {new Date(market.establishedDate).getFullYear()} ({new Date().getFullYear() - new Date(market.establishedDate).getFullYear()}y old)
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Users size={12}/> Capacity
                    </p>
                    <p className="text-sm font-black text-slate-800 tracking-tight">{market.capacity.toLocaleString()} Vendors</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Globe size={12}/> Key Trades
                    </p>
                    <p className="text-sm font-black text-slate-800 truncate tracking-tight">{market.primaryProducts.join(', ')}</p>
                  </div>
                </div>

                <div className="flex gap-2 relative z-10">
                   <Button 
                     variant="secondary" 
                     className="flex-1 text-[10px] font-black uppercase tracking-widest py-2"
                     onClick={() => handleOpenMap(market.name)}
                   >
                     <ExternalLink size={14}/> Geo-Mapping
                   </Button>
                   <Button variant="outline" className="flex-1 text-[10px] font-black uppercase tracking-widest py-2">
                     Market Registry
                   </Button>
                </div>
                
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
              </Card>
            ))}
          </div>
        </>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <Card className="flex items-center gap-4 bg-indigo-50 border-indigo-100">
           <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-md">
             <TrendingUp size={24} />
           </div>
           <div>
             <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Active Markets</p>
             <p className="text-xl font-black text-slate-800">42 Centers</p>
           </div>
        </Card>
        <Card className="flex items-center gap-4 bg-emerald-50 border-emerald-100">
           <div className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-md">
             <ShieldAlert size={24} />
           </div>
           <div>
             <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Compliance</p>
             <p className="text-xl font-black text-slate-800">98.4% Verified</p>
           </div>
        </Card>
        <Card className="flex items-center gap-4 bg-amber-50 border-amber-100">
           <div className="w-12 h-12 bg-amber-600 text-white rounded-xl flex items-center justify-center shadow-md">
             <Users size={24} />
           </div>
           <div>
             <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Total Traders</p>
             <p className="text-xl font-black text-slate-800">85,200+</p>
           </div>
        </Card>
      </div>
    </div>
  );
};
