
import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, DollarSign, Calendar, ArrowUpRight, ArrowDownLeft, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { UserProfile, Transaction } from '../../types';

export const TransactionHistory = ({ user }: { user: UserProfile }) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [amountRange, setAmountRange] = useState({ min: '', max: '' });
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const [transactions] = useState<Transaction[]>([
    { id: 'TX-101', date: '2024-05-15 14:30', amount: 250000, type: 'RENT', status: 'SUCCESS', method: 'Mobile Money' },
    { id: 'TX-102', date: '2024-05-14 09:15', amount: 5000, type: 'SERVICE_CHARGE', status: 'SUCCESS', method: 'Cash' },
    { id: 'TX-103', date: '2024-05-12 11:20', amount: 1200000, type: 'WITHDRAWAL', status: 'PENDING', method: 'Bank Transfer' },
    { id: 'TX-104', date: '2024-05-10 16:45', amount: 450000, type: 'LICENSE', status: 'FAILED', method: 'Card' },
    { id: 'TX-105', date: '2024-05-08 10:00', amount: 30000, type: 'SERVICE_CHARGE', status: 'SUCCESS', method: 'Mobile Money' },
  ]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch = tx.id.toLowerCase().includes(search.toLowerCase()) || tx.method.toLowerCase().includes(search.toLowerCase());
      const matchesType = filterType === 'ALL' || tx.type === filterType;
      const matchesMin = amountRange.min === '' || tx.amount >= Number(amountRange.min);
      const matchesMax = amountRange.max === '' || tx.amount <= Number(amountRange.max);
      
      // Basic date matching (strings for mock)
      const matchesStart = dateRange.start === '' || tx.date >= dateRange.start;
      const matchesEnd = dateRange.end === '' || tx.date <= dateRange.end + ' 23:59';

      return matchesSearch && matchesType && matchesMin && matchesMax && matchesStart && matchesEnd;
    });
  }, [transactions, search, filterType, amountRange, dateRange]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Financial History</h2>
          <p className="text-slate-500">Monitor all dues, payments, and withdrawals in real-time.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="text-sm"><Download size={16}/> Export CSV</Button>
          <Button className="text-sm"><ArrowUpRight size={16}/> New Withdrawal</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div className="md:col-span-1 lg:col-span-2">
          <Input icon={Search} placeholder="Search TX ID or method..." value={search} onChange={(e:any) => setSearch(e.target.value)} />
        </div>
        <select 
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-black text-white border border-slate-800 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="ALL">All Types</option>
          <option value="RENT">Rent Payments</option>
          <option value="SERVICE_CHARGE">Service Charges</option>
          <option value="WITHDRAWAL">Withdrawals</option>
          <option value="LICENSE">License Fees</option>
        </select>
        <Button variant="outline" className="flex items-center gap-2">
          <Calendar size={18} /> Date Range
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <SlidersHorizontal size={18} /> More Filters
        </Button>
      </div>

      {/* Extended Filters (Conditional rendering in a real app) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Min Amount</label>
          <input type="number" placeholder="0" value={amountRange.min} onChange={(e) => setAmountRange({...amountRange, min: e.target.value})} className="w-full bg-slate-50 border-none rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Max Amount</label>
          <input type="number" placeholder="1M+" value={amountRange.max} onChange={(e) => setAmountRange({...amountRange, max: e.target.value})} className="w-full bg-slate-50 border-none rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Start Date</label>
          <input type="date" value={dateRange.start} onChange={(e) => setDateRange({...dateRange, start: e.target.value})} className="w-full bg-slate-50 border-none rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">End Date</label>
          <input type="date" value={dateRange.end} onChange={(e) => setDateRange({...dateRange, end: e.target.value})} className="w-full bg-slate-50 border-none rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-indigo-500" />
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-4 py-4">Transaction ID</th>
                <th className="px-4 py-4">Date & Time</th>
                <th className="px-4 py-4">Type</th>
                <th className="px-4 py-4">Amount</th>
                <th className="px-4 py-4">Method</th>
                <th className="px-4 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-4 font-mono text-xs font-bold text-indigo-600">{tx.id}</td>
                  <td className="px-4 py-4 text-xs text-slate-500">{tx.date}</td>
                  <td className="px-4 py-4">
                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-tighter">{tx.type.replace('_', ' ')}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 font-bold">
                      {tx.type === 'WITHDRAWAL' ? <ArrowUpRight size={14} className="text-red-500" /> : <ArrowDownLeft size={14} className="text-emerald-500" />}
                      <span className={tx.type === 'WITHDRAWAL' ? 'text-slate-900' : 'text-slate-900'}>UGX {tx.amount.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-xs text-slate-600">{tx.method}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                      tx.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600' :
                      tx.status === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                      'bg-red-50 text-red-600'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400 italic">No transactions match your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50 text-xs text-slate-500">
          <p>Showing {filteredTransactions.length} of {transactions.length} entries</p>
          <div className="flex gap-2">
            <button className="p-1.5 hover:bg-slate-100 rounded border border-slate-200"><ChevronLeft size={16}/></button>
            <button className="px-3 py-1 bg-indigo-600 text-white rounded font-bold">1</button>
            <button className="p-1.5 hover:bg-slate-100 rounded border border-slate-200"><ChevronRight size={16}/></button>
          </div>
        </div>
      </Card>
    </div>
  );
};
