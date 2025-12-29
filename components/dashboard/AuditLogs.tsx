
import React, { useState, useMemo } from 'react';
import { Search, History, Download, User, Activity, Clock, SlidersHorizontal, ChevronLeft, ChevronRight, AlertCircle, Info, ShieldAlert } from 'lucide-react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface Log {
  id: string;
  user: string;
  role: string;
  action: string;
  target: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

export const AuditLogs = () => {
  const [search, setSearch] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [filterRole, setFilterRole] = useState('ALL');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const [logs] = useState<Log[]>([
    { id: 'LOG-001', user: 'super.admin@mmis.com', role: 'SUPER_ADMIN', action: 'ROLE_CHANGE', target: 'user: u-8271', timestamp: '2024-05-15 14:22', severity: 'high' },
    { id: 'LOG-002', user: 'market.manager@mmis.com', role: 'MARKET_ADMIN', action: 'VENDOR_VERIFY', target: 'vendor: v-001', timestamp: '2024-05-15 13:45', severity: 'medium' },
    { id: 'LOG-003', user: 'staff.one@mmis.com', role: 'COUNTER_STAFF', action: 'INVENTORY_UPDATE', target: 'product: p-99', timestamp: '2024-05-15 12:10', severity: 'low' },
    { id: 'LOG-004', user: 'super.admin@mmis.com', role: 'SUPER_ADMIN', action: 'SYSTEM_CONFIG', target: 'settings: mfa', timestamp: '2024-05-15 10:30', severity: 'high' },
    { id: 'LOG-005', user: 'vendor.01@market.com', role: 'VENDOR', action: 'PRODUCT_ADD', target: 'product: p-105', timestamp: '2024-05-14 16:20', severity: 'low' },
  ]);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = 
        log.user.toLowerCase().includes(search.toLowerCase()) || 
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.target.toLowerCase().includes(search.toLowerCase());
      
      const matchesSeverity = filterSeverity === 'ALL' || log.severity === filterSeverity.toLowerCase();
      const matchesRole = filterRole === 'ALL' || log.role === filterRole;
      
      const matchesStart = dateRange.start === '' || log.timestamp >= dateRange.start;
      const matchesEnd = dateRange.end === '' || log.timestamp <= dateRange.end + ' 23:59';

      return matchesSearch && matchesSeverity && matchesRole && matchesStart && matchesEnd;
    });
  }, [logs, search, filterSeverity, filterRole, dateRange]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">System Audit Engine</h2>
          <p className="text-slate-500">Traceable security events and administrative history.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary"><Download size={18} /> Export as PDF</Button>
          <Button variant="secondary"><Download size={18} /> CSV</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="md:col-span-2">
          <Input icon={Search} placeholder="Search user, action, or target ID..." value={search} onChange={(e:any) => setSearch(e.target.value)} />
        </div>
        <select 
          value={filterSeverity} 
          onChange={(e) => setFilterSeverity(e.target.value)}
          className="bg-black text-white border border-slate-800 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="ALL">All Severities</option>
          <option value="LOW">Low (Info)</option>
          <option value="MEDIUM">Medium (Warnings)</option>
          <option value="HIGH">High (Critical)</option>
        </select>
        <select 
          value={filterRole} 
          onChange={(e) => setFilterRole(e.target.value)}
          className="bg-black text-white border border-slate-800 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="ALL">All Roles</option>
          <option value="SUPER_ADMIN">Super Admin</option>
          <option value="MARKET_ADMIN">Market Admin</option>
          <option value="VENDOR">Vendor</option>
          <option value="COUNTER_STAFF">Staff</option>
        </select>
        <div className="lg:col-span-2 flex gap-2">
           <input type="date" value={dateRange.start} onChange={(e) => setDateRange({...dateRange, start: e.target.value})} className="bg-slate-100 border-none rounded-lg px-3 py-1 text-xs w-full outline-none focus:ring-1 focus:ring-indigo-500" />
           <input type="date" value={dateRange.end} onChange={(e) => setDateRange({...dateRange, end: e.target.value})} className="bg-slate-100 border-none rounded-lg px-3 py-1 text-xs w-full outline-none focus:ring-1 focus:ring-indigo-500" />
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Action Event</th>
                <th className="px-4 py-4">Authorized User</th>
                <th className="px-4 py-4">Target Entity</th>
                <th className="px-4 py-4">Timestamp</th>
                <th className="px-4 py-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLogs.map(log => (
                <tr key={log.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      log.severity === 'high' ? 'bg-red-50 text-red-600' :
                      log.severity === 'medium' ? 'bg-amber-50 text-amber-600' :
                      'bg-indigo-50 text-indigo-600'
                    }`}>
                      {log.severity === 'high' ? <ShieldAlert size={16} /> : log.severity === 'medium' ? <AlertCircle size={16} /> : <Info size={16} />}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-bold text-slate-800">{log.action}</p>
                    <p className="text-[10px] font-mono text-slate-400">{log.id}</p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-600">
                        {log.user.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-700">{log.user}</p>
                        <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">{log.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">{log.target}</span>
                  </td>
                  <td className="px-4 py-4 text-xs text-slate-500 font-medium">
                    {log.timestamp}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button className="text-[10px] font-black uppercase text-indigo-600 hover:underline">View Stack</button>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-20 text-center text-slate-400">
                    <Activity size={40} className="mx-auto mb-2 opacity-20" />
                    <p className="italic">No audit events match the current criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
          <p className="text-xs text-slate-500 font-medium">Showing {filteredLogs.length} logs of {logs.length} total events</p>
          <div className="flex gap-2">
            <button className="p-1.5 hover:bg-slate-100 rounded border border-slate-200"><ChevronLeft size={16}/></button>
            <button className="px-3 py-1 bg-indigo-600 text-white rounded font-bold text-xs">1</button>
            <button className="p-1.5 hover:bg-slate-100 rounded border border-slate-200"><ChevronRight size={16}/></button>
          </div>
        </div>
      </Card>
    </div>
  );
};
