
import React, { useState, useMemo } from 'react';
// Added MapPin to imports to fix "Cannot find name 'MapPin'" error
import {
  Search, Plus, Filter, Package, Truck, History, Star,
  MoreVertical, CheckCircle, XCircle, Clock, LayoutDashboard,
  Boxes, CreditCard, ArrowUpRight, ArrowDownLeft, TrendingUp,
  Warehouse, ShieldCheck, ExternalLink, MoreHorizontal, MapPin
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { UserProfile, Supplier, Product, Transaction } from '../../types';

interface SupplierManagementProps {
  user: UserProfile;
}

export const SupplierManagement = ({ user }: SupplierManagementProps) => {
  const isSupplier = user.role === 'SUPPLIER';
  const isAdmin = user.role === 'SUPER_ADMIN' || user.role === 'MARKET_ADMIN';

  const [activeTab, setActiveTab] = useState<string>(isSupplier ? 'MY_DASHBOARD' : 'DIRECTORY');
  const [search, setSearch] = useState('');

  // Mock data for Supplier's view
  const myProducts: Product[] = [
    { id: 'P-101', name: 'Premium Jasmine Rice (100kg)', vendor: user.name, stock: 450, price: 320000, status: 'HEALTHY', category: 'Cereals' },
    { id: 'P-102', name: 'Refined Sugar Bulk (50kg)', vendor: user.name, stock: 20, price: 180000, status: 'LOW', category: 'Groceries' },
    { id: 'P-103', name: 'Refined Sunflower Oil (200L)', vendor: user.name, stock: 5, price: 1200000, status: 'CRITICAL', category: 'Groceries' },
  ];

  const myTransactions: Transaction[] = [
    { id: 'TX-S1', date: '2024-05-18 10:30', amount: 4500000, type: 'SUPPLY_PAYMENT', status: 'SUCCESS', method: 'Bank Transfer' },
    { id: 'TX-S2', date: '2024-05-15 14:20', amount: 1200000, type: 'WITHDRAWAL', status: 'SUCCESS', method: 'Mobile Money' },
    { id: 'TX-S3', date: '2024-05-10 09:15', amount: 890000, type: 'SERVICE_CHARGE', status: 'SUCCESS', method: 'Deducted from Balance' },
  ];

  const [suppliers] = useState<Supplier[]>([
    { id: 'S-001', name: 'Nile Agro Ltd', email: 'supply@nileagro.com', category: 'Cereals', status: 'ACTIVE', warehouseLocation: 'Jinja Industrial Area', suppliedItemsCount: 12, rating: 4.8, onboardingDate: '2023-01-10' },
    { id: 'S-002', name: 'Kampala Logistics', email: 'info@kpalalogistics.ug', category: 'Household', status: 'PENDING', warehouseLocation: 'Bweyogerere', suppliedItemsCount: 45, rating: 4.2, onboardingDate: '2024-05-12' },
    { id: 'S-003', name: 'Dairy King', email: 'orders@dairyking.co', category: 'Dairy', status: 'ACTIVE', warehouseLocation: 'Mbarara City', suppliedItemsCount: 8, rating: 4.9, onboardingDate: '2022-11-20' },
  ]);

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.warehouseLocation.toLowerCase().includes(search.toLowerCase())
  );

  const renderSupplierDashboard = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-indigo-600 text-white p-6 relative overflow-hidden">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Settled Earnings</p>
          <h3 className="text-3xl font-black mt-1">UGX 12.8M</h3>
          <div className="mt-4 flex items-center gap-1 text-[10px] bg-white/10 w-fit px-2 py-1 rounded">
            <TrendingUp size={12} /> +12% from last month
          </div>
          <CreditCard className="absolute -right-4 -bottom-4 opacity-10" size={100} />
        </Card>
        <Card className="border-l-4 border-l-emerald-500 p-6">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Orders</p>
          <h3 className="text-3xl font-black text-slate-900 mt-1">14</h3>
          <p className="text-xs text-slate-500 mt-2">4 ready for dispatch</p>
        </Card>
        <Card className="border-l-4 border-l-amber-500 p-6">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Supplier Rating</p>
          <div className="flex items-center gap-2 mt-1">
            <h3 className="text-3xl font-black text-slate-900">4.9</h3>
            <div className="flex text-amber-500"><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></div>
          </div>
          <p className="text-xs text-slate-500 mt-2">Top 5% Supplier</p>
        </Card>
        <Card className="border-l-4 border-l-blue-500 p-6">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventory Status</p>
          <h3 className="text-3xl font-black text-slate-900 mt-1">94%</h3>
          <p className="text-xs text-slate-500 mt-2">Stock health optimal</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Supply Payments */}
        <Card title="Payment Settlements" className="shadow-lg border-slate-100">
          <div className="space-y-4">
            {myTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'WITHDRAWAL' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {tx.type === 'WITHDRAWAL' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{tx.type.replace('_', ' ')}</p>
                    <p className="text-[10px] text-slate-400">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">UGX {tx.amount.toLocaleString()}</p>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">{tx.method}</span>
                </div>
              </div>
            ))}
          </div>
          <Button variant="ghost" className="w-full mt-4 text-[10px] font-black uppercase tracking-widest text-indigo-600">View Full Ledger</Button>
        </Card>

        {/* Warehouse Mapping */}
        <Card title="Logistics & Warehousing" className="shadow-lg border-slate-100">
          <div className="relative h-48 bg-slate-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-20 grayscale">
              <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" alt="Warehouse Map" />
            </div>
            <div className="relative z-10 text-center">
              <MapPin className="text-indigo-600 mx-auto mb-2" size={32} />
              <p className="text-xs font-bold text-slate-900">Primary Hub: Jinja Industrial Area</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Zone 4B, Sector 12</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Stock Area</p>
              <p className="text-sm font-bold text-slate-800">1,200 sq.ft</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Cold Storage</p>
              <p className="text-sm font-bold text-slate-800">Available</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderProductListing = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-black text-slate-800 tracking-tight">Bulk Catalog Management</h3>
        <Button className="text-xs font-black uppercase tracking-widest"><Plus size={16} /> New Supply Listing</Button>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-4 py-4">Item Catalog</th>
                <th className="px-4 py-4">Stock Reserve</th>
                <th className="px-4 py-4">Wholesale Price</th>
                <th className="px-4 py-4">Supply Status</th>
                <th className="px-4 py-4 text-right">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {myProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                        <Package size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{product.name}</p>
                        <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest">{product.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-black text-slate-700">{product.stock.toLocaleString()} Units</p>
                    <div className={`w-24 h-1.5 rounded-full bg-slate-100 mt-2 overflow-hidden`}>
                      <div className={`h-full ${product.status === 'HEALTHY' ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${Math.min((product.stock / 500) * 100, 100)}%` }} />
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-bold text-slate-900">UGX {product.price.toLocaleString()}</p>
                    <p className="text-[9px] text-slate-400 uppercase font-black">Per Bulk Unit</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${product.status === 'HEALTHY' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                      }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderDirectory = () => (
    <Card>
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input icon={Search} placeholder="Search by name or warehouse..." value={search} onChange={(e: any) => setSearch(e.target.value)} />
        <select className="bg-black text-white border border-slate-800 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
          <option>All Product Domains</option>
          <option>Agriculture</option>
          <option>FMCG</option>
          <option>Industrial Parts</option>
        </select>
        <select className="bg-black text-white border border-slate-800 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
          <option>Supply Capacity</option>
          <option>Bulk Only (&gt;1 Ton)</option>
          <option>High Volume Traders</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <th className="px-4 py-4">Entity Information</th>
              <th className="px-4 py-4">Warehousing</th>
              <th className="px-4 py-4">Active Capacity</th>
              <th className="px-4 py-4">Rating</th>
              <th className="px-4 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredSuppliers.map(s => (
              <tr key={s.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <Truck size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{s.name}</p>
                      <p className="text-[10px] text-slate-400">{s.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className="text-xs font-semibold text-slate-600 truncate max-w-[150px]">{s.warehouseLocation}</p>
                  <div className="flex items-center gap-1 text-[9px] text-indigo-500 font-black uppercase mt-1">
                    <MapPin size={10} /> Regional Hub
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col">
                    <p className="text-xs font-black text-slate-800">{s.suppliedItemsCount} Items</p>
                    <span className={`w-fit mt-1 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${s.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                      {s.status}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1 text-amber-500 font-black text-xs">
                    <Star size={12} fill="currentColor" /> {s.rating}
                  </div>
                  <p className="text-[9px] text-slate-400 uppercase mt-1">Trusted Partner</p>
                </td>
                <td className="px-4 py-4 text-right">
                  <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Warehouse className="text-indigo-600" size={28} />
            {isSupplier ? 'My Supplier Portal' : 'Supplier Ecosystem'}
          </h2>
          <p className="text-slate-500">
            {isSupplier ? 'Direct management of wholesale supplies and settlements.' : 'Global partner network and supply chain oversight.'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="text-[10px] font-black uppercase tracking-widest"><ShieldCheck size={16} /> Compliance Status</Button>
          <Button className="text-[10px] font-black uppercase tracking-widest"><Plus size={16} /> {isSupplier ? 'New Request' : 'Onboard Supplier'}</Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {isSupplier ? (
          <>
            <button
              onClick={() => setActiveTab('MY_DASHBOARD')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'MY_DASHBOARD' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <LayoutDashboard size={16} /> Dashboard
            </button>
            <button
              onClick={() => setActiveTab('MY_PRODUCTS')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'MY_PRODUCTS' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Boxes size={16} /> Bulk Catalog
            </button>
            <button
              onClick={() => setActiveTab('FINANCIALS')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'FINANCIALS' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <CreditCard size={16} /> Settlements
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveTab('DIRECTORY')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'DIRECTORY' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Supplier Directory
            </button>
            <button
              onClick={() => setActiveTab('REQUESTS')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'REQUESTS' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Supply Requests <span className="ml-1 bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full text-[10px]">1</span>
            </button>
          </>
        )}
      </div>

      {/* Tab Content Rendering */}
      {activeTab === 'MY_DASHBOARD' && renderSupplierDashboard()}
      {activeTab === 'MY_PRODUCTS' && renderProductListing()}
      {(activeTab === 'FINANCIALS' || activeTab === 'REQUESTS') && (
        <Card className="py-20 text-center text-slate-400 italic">
          <History className="mx-auto mb-4 opacity-20" size={48} />
          <p>This module section is currently syncing with the main financial ledger.</p>
          <Button variant="ghost" className="mt-4 text-xs font-bold text-indigo-600 uppercase tracking-widest">Reload Data</Button>
        </Card>
      )}
      {activeTab === 'DIRECTORY' && renderDirectory()}
    </div>
  );
};
