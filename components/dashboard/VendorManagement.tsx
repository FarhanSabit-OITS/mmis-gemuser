
import React, { useState, useMemo, useRef } from 'react';
import { 
  Search, Filter, Plus, Edit, Trash2, Download, CheckCircle, XCircle, 
  Eye, ChevronUp, ChevronDown, User, MapPin, DollarSign, Calendar, 
  CreditCard, History, ArrowRight, LayoutGrid, Layers, ShieldCheck, 
  Zap, Clock, Mail, Package, QrCode, X, Printer, Share2, Camera, Save, Lock, Info, CheckCircle2, Shield,
  Store, AlertCircle, ShoppingBag, Copy, AlertTriangle, FileCheck, HelpCircle, TrendingUp, RotateCcw
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Vendor, UserProfile, Product } from '../../types';
import { CITIES_AND_MARKETS, STORE_LEVELS, STORE_SECTIONS } from '../../constants';
import { PaymentGateway } from '../payments/PaymentGateway';

type ManagementTab = 'DIRECTORY' | 'FINANCIALS' | 'STORE_PROFILE' | 'MY_PRODUCTS';

interface VendorManagementProps {
  user?: UserProfile;
}

export const VendorManagement = ({ user }: VendorManagementProps) => {
  const isVendor = user?.role === 'VENDOR';
  const [activeTab, setActiveTab] = useState<ManagementTab>(isVendor ? 'MY_PRODUCTS' : 'DIRECTORY');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    status: 'ALL',
    gender: 'ALL',
    city: 'ALL',
    market: 'ALL',
    rentDue: 'ALL',
    level: 'ALL'
  });
  
  const [sortConfig, setSortConfig] = useState<{ key: keyof Vendor, direction: 'asc' | 'desc' } | null>({ key: 'name', direction: 'asc' });
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [payingVendor, setPayingVendor] = useState<Vendor | null>(null);
  const [qrVendor, setQrVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to determine status based on user thresholds
  const determineProductStatus = (stock: number): Product['status'] => {
    const low = user?.settings?.lowStockThreshold ?? 10;
    const critical = user?.settings?.criticalStockThreshold ?? 5;
    if (stock <= critical) return 'CRITICAL';
    if (stock <= low) return 'LOW';
    return 'HEALTHY';
  };

  // --- Product Management State ---
  const [products, setProducts] = useState<Product[]>([
    { id: 'P-001', name: 'Fresh Organic Tomatoes', description: 'Sun-ripened, organic tomatoes from local farms.', vendor: user?.name || 'My Store', stock: 120, price: 5000, status: 'HEALTHY', category: 'Produce' },
    { id: 'P-002', name: 'Premium Basmati Rice', description: 'Long-grain aromatic rice, 5kg pack.', vendor: user?.name || 'My Store', stock: 8, price: 35000, status: 'LOW', category: 'Groceries' },
    { id: 'P-003', name: 'Solar Lantern X1', description: 'Portable solar LED lantern with USB charging.', vendor: user?.name || 'My Store', stock: 0, price: 45000, status: 'CRITICAL', category: 'Electronics' },
  ]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [modalStep, setModalStep] = useState<'FORM' | 'REVIEW'>('FORM');
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'General'
  });

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({ name: '', description: '', price: '', stock: '', category: 'General' });
    setModalStep('FORM');
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      description: p.description || '',
      price: p.price.toString(),
      stock: p.stock.toString(),
      category: p.category
    });
    setModalStep('FORM');
    setShowProductModal(true);
  };

  const handleSaveProduct = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    
    const stockNum = Number(productForm.stock);
    const newProductData = {
      name: productForm.name,
      description: productForm.description,
      price: Number(productForm.price),
      stock: stockNum,
      category: productForm.category,
      status: determineProductStatus(stockNum)
    };

    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...newProductData } : p));
    } else {
      const newP: Product = {
        id: 'P-' + Math.random().toString(36).substr(2, 5).toUpperCase(),
        vendor: user?.name || 'My Store',
        ...newProductData
      };
      setProducts([newP, ...products]);
    }

    setLoading(false);
    setShowProductModal(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    setShowDeleteConfirm(null);
  };

  const handleDuplicate = (p: Product) => {
    const newP: Product = {
      ...p,
      id: 'P-' + Math.random().toString(36).substr(2, 5).toUpperCase(),
      name: `${p.name} (Copy)`
    };
    setProducts([newP, ...products]);
  };

  const [vendors, setVendors] = useState<Vendor[]>([
    { id: 'V-001', name: 'Global Tech', email: 'contact@globaltech.com', category: 'Electronics', status: 'ACTIVE', products: 124, joinedDate: '2023-10-12', gender: 'MALE', age: 34, city: 'Mbarara', market: 'Mbarara Central', rentDue: 0, level: 'Ground Floor', section: 'Electronics Hub', storeType: 'SHOP', ownershipType: 'LEASED' },
    { id: 'V-002', name: 'Fresh Foods Co.', email: 'sales@freshfoods.io', category: 'Groceries', status: 'PENDING', products: 45, joinedDate: '2024-01-05', gender: 'FEMALE', age: 28, city: 'Kabale', market: 'Bugongi', rentDue: 150000, level: 'Level 1', section: 'Fresh Produce Area', storeType: 'STALL', ownershipType: 'OWNED' },
    { id: 'V-003', name: 'Fashion Hub', email: 'support@fashionhub.com', category: 'Apparel', status: 'ACTIVE', products: 890, joinedDate: '2023-05-20', gender: 'FEMALE', age: 41, city: 'Jinja', market: 'Amber Court', rentDue: 0, level: 'Level 2', section: 'Clothing Wing', storeType: 'KIOSK', ownershipType: 'SUB-LEASED' },
    { id: 'V-004', name: 'Home Decor Ltd', email: 'info@homedecor.net', category: 'Furniture', status: 'INACTIVE', products: 12, joinedDate: '2022-11-30', gender: 'MALE', age: 55, city: 'Kampala', market: 'Owino', rentDue: 450000, level: 'Basement', section: 'Aisle B', storeType: 'WAREHOUSE', ownershipType: 'LEASED' },
  ]);

  const requestSort = (key: keyof Vendor) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredVendors = useMemo(() => {
    let result = vendors.filter(v => {
      const matchesSearch = 
        v.name.toLowerCase().includes(search.toLowerCase()) || 
        v.id.toLowerCase().includes(search.toLowerCase()) ||
        v.email.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = filters.status === 'ALL' || v.status === filters.status;
      const matchesCity = filters.city === 'ALL' || v.city === filters.city;
      const matchesMarket = filters.market === 'ALL' || v.market === filters.market;
      const matchesRent = filters.rentDue === 'ALL' || (filters.rentDue === 'DUE' ? v.rentDue > 0 : v.rentDue === 0);
      const matchesLevel = filters.level === 'ALL' || v.level === filters.level;
      
      return matchesSearch && matchesStatus && matchesCity && matchesMarket && matchesRent && matchesLevel;
    });

    if (sortConfig) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key] ?? '';
        const valB = b[sortConfig.key] ?? '';
        
        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortConfig.direction === 'asc' 
            ? valA.localeCompare(valB) 
            : valB.localeCompare(valA);
        }
        
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [vendors, search, filters, sortConfig]);

  const handleResetFilters = () => {
    setFilters({
      status: 'ALL',
      gender: 'ALL',
      city: 'ALL',
      market: 'ALL',
      rentDue: 'ALL',
      level: 'ALL'
    });
    setSearch('');
  };

  const handlePaymentSuccess = () => {
    if (payingVendor) {
      setVendors(prev => prev.map(v => v.id === payingVendor.id ? { ...v, rentDue: 0 } : v));
      setPayingVendor(null);
    }
  };

  const toggleStatus = (id: string) => {
    setVendors(vendors.map(v => {
      if (v.id === id) {
        const nextStatus = v.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        return { ...v, status: nextStatus as any };
      }
      return v;
    }));
  };

  const availableMarkets = useMemo(() => {
    const city = CITIES_AND_MARKETS.find(c => c.city === filters.city);
    return city ? city.markets : [];
  }, [filters.city]);

  const selectClassName = "bg-black text-white border-2 border-slate-800 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all appearance-none cursor-pointer shadow-lg w-full";

  // --- Summary Metrics for Products ---
  const productStats = useMemo(() => {
    return {
      total: products.length,
      // Recalculate counts based on current dynamic thresholds for the dashboard stats
      low: products.filter(p => determineProductStatus(p.stock) === 'LOW').length,
      out: products.filter(p => determineProductStatus(p.stock) === 'CRITICAL').length,
      value: products.reduce((acc, p) => acc + (p.price * p.stock), 0)
    };
  }, [products, user?.settings]); // Also watch user.settings for threshold changes

  const SortIcon = ({ column }: { column: keyof Vendor }) => {
    if (sortConfig?.key !== column) return <ChevronDown size={14} className="opacity-20" />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} className="text-indigo-600" /> : <ChevronDown size={14} className="text-indigo-600" />;
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      {payingVendor && (
        <PaymentGateway 
          amount={payingVendor.rentDue}
          itemDescription={`Rent Dues for ${payingVendor.name}`}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setPayingVendor(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-2xl ring-4 ring-indigo-50">
             <Store size={32} />
           </div>
           <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                {isVendor ? 'Store Management Terminal' : 'Regional Vendor Registry'}
              </h2>
              <p className="text-slate-500 font-medium text-lg">
                {isVendor ? 'Operator Dashboard & Commercial Index' : 'Administrative Oversight Hub'}
              </p>
           </div>
        </div>
        {!isVendor && (
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowFilters(!showFilters)} className={`h-12 px-6 ${showFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : ''}`}>
              <Filter size={18} /> {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
            <Button className="shadow-2xl shadow-indigo-100 h-12 px-8 font-black uppercase tracking-widest text-xs"><Plus size={18} /> Onboard Partner</Button>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 bg-slate-100/50 p-2 rounded-2xl w-fit border border-slate-200/50 shadow-inner">
        {isVendor ? (
          <>
            <button onClick={() => setActiveTab('MY_PRODUCTS')} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'MY_PRODUCTS' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'text-slate-500 hover:text-slate-800 hover:bg-white'}`}><Package size={16} /> Product Catalog</button>
            <button onClick={() => setActiveTab('STORE_PROFILE')} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'STORE_PROFILE' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'text-slate-500 hover:text-slate-800 hover:bg-white'}`}><User size={16} /> Operator Profile</button>
          </>
        ) : (
          <>
            <button onClick={() => setActiveTab('DIRECTORY')} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'DIRECTORY' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'text-slate-500 hover:text-slate-800 hover:bg-white'}`}><Layers size={16} /> Hub Registry</button>
            <button onClick={() => setActiveTab('FINANCIALS')} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'FINANCIALS' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'text-slate-500 hover:text-slate-800 hover:bg-white'}`}><DollarSign size={16} /> Revenue & Dues</button>
          </>
        )}
      </div>

      {/* --- Tab Content: Admin: Directory View --- */}
      {activeTab === 'DIRECTORY' && !isVendor && (
        <div className="space-y-6 animate-fade-in">
          <Card className="shadow-2xl border-slate-100 p-0 rounded-3xl overflow-hidden">
            <div className="p-8 bg-slate-50 border-b border-slate-100">
              <div className="flex flex-col gap-6">
                {/* Search and Primary Filters */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-2">
                    <Input 
                      icon={Search} 
                      placeholder="Query store entity, UID, or contact email..." 
                      value={search} 
                      onChange={(e:any) => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="relative group">
                    <select 
                      value={filters.status}
                      onChange={(e) => setFilters({...filters, status: e.target.value})}
                      className={selectClassName}
                    >
                      <option value="ALL">All Partner Status</option>
                      <option value="ACTIVE">Verified Operators</option>
                      <option value="INACTIVE">Deactivated Accounts</option>
                      <option value="PENDING">KYC Queue</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                  </div>
                  <div className="relative group">
                    <select 
                      value={filters.rentDue}
                      onChange={(e) => setFilters({...filters, rentDue: e.target.value})}
                      className={selectClassName}
                    >
                      <option value="ALL">Rent: All Status</option>
                      <option value="CLEARED">Settlement Cleared</option>
                      <option value="DUE">Arrears Outstanding</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                  </div>
                </div>

                {/* Secondary Filters (Collapsible) */}
                {showFilters && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-slate-200 animate-slide-down">
                    <div className="relative group">
                      <select 
                        value={filters.city}
                        onChange={(e) => setFilters({...filters, city: e.target.value, market: 'ALL'})}
                        className={selectClassName}
                      >
                        <option value="ALL">Regional: All Cities</option>
                        {CITIES_AND_MARKETS.map(c => <option key={c.city} value={c.city}>{c.city}</option>)}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                    </div>
                    <div className="relative group">
                      <select 
                        value={filters.market}
                        onChange={(e) => setFilters({...filters, market: e.target.value})}
                        disabled={filters.city === 'ALL'}
                        className={`${selectClassName} ${filters.city === 'ALL' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <option value="ALL">All Hub Nodes</option>
                        {availableMarkets.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                    </div>
                    <div className="relative group">
                      <select 
                        value={filters.level}
                        onChange={(e) => setFilters({...filters, level: e.target.value})}
                        className={selectClassName}
                      >
                        <option value="ALL">Floor: All Levels</option>
                        {STORE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                    </div>
                    <Button variant="outline" onClick={handleResetFilters} className="w-full h-full py-3 text-xs font-black uppercase tracking-widest border-2 border-slate-200">
                      <RotateCcw size={16} /> Reset Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest bg-slate-50/50">
                    <th className="px-8 py-6 cursor-pointer group/header hover:bg-indigo-50/50 transition-colors" onClick={() => requestSort('name')}>
                      <div className="flex items-center gap-2">Trade Entity <SortIcon column="name" /></div>
                    </th>
                    <th className="px-8 py-6 cursor-pointer group/header hover:bg-indigo-50/50 transition-colors" onClick={() => requestSort('level')}>
                      <div className="flex items-center gap-2">Architecture <SortIcon column="level" /></div>
                    </th>
                    <th className="px-8 py-6 cursor-pointer group/header hover:bg-indigo-50/50 transition-colors" onClick={() => requestSort('status')}>
                      <div className="flex items-center gap-2">Compliance <SortIcon column="status" /></div>
                    </th>
                    <th className="px-8 py-6 cursor-pointer group/header hover:bg-indigo-50/50 transition-colors" onClick={() => requestSort('rentDue')}>
                      <div className="flex items-center gap-2">Arrears <SortIcon column="rentDue" /></div>
                    </th>
                    <th className="px-8 py-6 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredVendors.map(vendor => (
                    <tr 
                      key={vendor.id} 
                      onClick={() => setSelectedVendor(vendor)}
                      className="group hover:bg-slate-50/80 transition-all cursor-pointer border-l-[6px] border-l-transparent hover:border-l-indigo-600"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black shadow-xl group-hover:bg-indigo-600 group-hover:scale-110 transition-all">
                            {vendor.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-base font-black text-slate-900 tracking-tight">{vendor.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                               <span className="text-[9px] font-black bg-slate-200/50 text-slate-500 px-2 py-0.5 rounded-lg uppercase tracking-widest">{vendor.id}</span>
                               <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">{vendor.storeType} Hub</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2 text-[10px] font-black text-slate-800 uppercase tracking-widest">
                             <Layers size={14} className="text-indigo-500" /> {vendor.level}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                             <LayoutGrid size={14} className="text-slate-300" /> {vendor.section}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                          <span className={`w-fit px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                            vendor.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            vendor.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                            'bg-red-50 text-red-600 border-red-100'
                          }`}>
                            {vendor.status}
                          </span>
                          <button
                            onClick={() => toggleStatus(vendor.id)}
                            className={`w-10 h-6 rounded-full relative transition-all duration-300 shadow-inner ${
                              vendor.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-300'
                            }`}
                          >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${
                              vendor.status === 'ACTIVE' ? 'right-1' : 'left-1'
                            }`} />
                          </button>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                           <p className={`text-base font-black tracking-tight ${vendor.rentDue > 0 ? 'text-red-500 underline decoration-red-200 underline-offset-4' : 'text-emerald-600'}`}>
                             {vendor.rentDue === 0 ? 'CLEARED' : `UGX ${vendor.rentDue.toLocaleString()}`}
                           </p>
                           <div className="flex items-center gap-1.5 opacity-50">
                             <Clock size={12} className="text-slate-400" />
                             <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{vendor.market} Hub</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => setQrVendor(vendor)} className="p-3 hover:bg-indigo-50 rounded-2xl text-indigo-600 transition-all hover:scale-110 shadow-sm" title="Generate Node QR"><QrCode size={20} /></button>
                          {vendor.rentDue > 0 && (
                            <button onClick={() => setPayingVendor(vendor)} className="p-3 hover:bg-emerald-50 rounded-2xl text-emerald-600 transition-all hover:scale-110 shadow-sm" title={`Settle UGX ${vendor.rentDue.toLocaleString()}`}><DollarSign size={20} /></button>
                          )}
                          <button onClick={() => setSelectedVendor(vendor)} className="p-3 hover:bg-slate-100 rounded-2xl text-slate-500 transition-all hover:scale-110" title="Inspect Registry Dossier"><Eye size={20} /></button>
                          <button className="p-3 hover:bg-red-50 rounded-2xl text-red-500 transition-all hover:scale-110" title="Revoke Authorized Access"><Trash2 size={20} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredVendors.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-8 py-32 text-center text-slate-400 italic">
                        <ShoppingBag className="mx-auto mb-6 opacity-10" size={80} />
                        <p className="font-black uppercase tracking-widest text-sm">No vendors match your active filter stack.</p>
                        <Button variant="ghost" onClick={handleResetFilters} className="mt-4 text-indigo-600 uppercase font-black text-xs">Clear Filter State</Button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* --- Tab Content: My Products View --- */}
      {activeTab === 'MY_PRODUCTS' && isVendor && (
        <div className="space-y-8 animate-fade-in pb-20">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-slate-900 text-white border-none shadow-2xl p-6 group">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Listings</p>
                 <div className="flex items-center justify-between mt-2">
                    <p className="text-4xl font-black tracking-tighter">{productStats.total}</p>
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform"><ShoppingBag size={24} /></div>
                 </div>
              </Card>
              <Card className="bg-white shadow-xl border-slate-100 p-6 border-l-4 border-l-amber-500">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Supply Warnings</p>
                 <div className="flex items-center justify-between mt-2">
                    <p className="text-4xl font-black tracking-tighter text-slate-800">{productStats.low}</p>
                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600"><Zap size={24} /></div>
                 </div>
              </Card>
              <Card className="bg-white shadow-xl border-slate-100 p-6 border-l-4 border-l-red-500">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock Outage</p>
                 <div className="flex items-center justify-between mt-2">
                    <p className="text-4xl font-black tracking-tighter text-slate-800">{productStats.out}</p>
                    <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600"><AlertCircle size={24} /></div>
                 </div>
              </Card>
              <Card className="bg-indigo-600 text-white border-none shadow-2xl p-6 group">
                 <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Inventory Valuation</p>
                 <div className="flex items-center justify-between mt-2">
                    <p className="text-2xl font-black tracking-tighter">UGX {productStats.value.toLocaleString()}</p>
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><TrendingUp size={24} /></div>
                 </div>
              </Card>
           </div>

           <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="w-full lg:w-96">
                <Input icon={Search} placeholder="Search catalog ID or item name..." value={search} onChange={(e:any) => setSearch(e.target.value)} />
              </div>
              <div className="flex flex-wrap gap-2 items-center w-full lg:w-auto">
                 <select className={selectClassName}>
                   <option>Status: All Channels</option>
                   <option>Healthy Channels</option>
                   <option>Supply Deficit</option>
                   <option>Audit Required</option>
                 </select>
                 <Button onClick={handleOpenAddProduct} className="shadow-2xl shadow-indigo-200 h-12 px-8 font-black uppercase tracking-widest text-xs"><Plus size={18} /> Initialize New Listing</Button>
              </div>
           </div>

           <Card className="overflow-hidden border-slate-100 shadow-2xl p-0 rounded-3xl">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                      <th className="px-8 py-6">Product Definition</th>
                      <th className="px-8 py-6">Reserve Level</th>
                      <th className="px-8 py-6">Unit Valuation</th>
                      <th className="px-8 py-6">System Health</th>
                      <th className="px-8 py-6 text-right">Operations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map((p) => {
                      const currentStatus = determineProductStatus(p.stock);
                      return (
                        <tr key={p.id} className="group hover:bg-slate-50/80 transition-all">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-5">
                               <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg group-hover:bg-indigo-600 transition-all"><Package size={24} /></div>
                               <div className="min-w-0">
                                  <span className="text-sm font-black text-slate-900 block truncate tracking-tight">{p.name}</span>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[9px] font-black bg-slate-200/50 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-widest">{p.id}</span>
                                    <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">{p.category}</span>
                                  </div>
                               </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex flex-col gap-2">
                               <span className={`text-sm font-black ${p.stock === 0 ? 'text-red-500' : 'text-slate-800'}`}>{p.stock.toLocaleString()} Units</span>
                               <div className="w-28 h-2 rounded-full bg-slate-100 overflow-hidden shadow-inner">
                                  <div className={`h-full transition-all duration-700 ${currentStatus === 'HEALTHY' ? 'bg-emerald-500' : currentStatus === 'LOW' ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${Math.min((p.stock / 200) * 100, 100)}%` }} />
                               </div>
                            </div>
                          </td>
                          <td className="px-8 py-6"><p className="text-sm font-black text-slate-900 tracking-tighter">UGX {p.price.toLocaleString()}</p></td>
                          <td className="px-8 py-6">
                             <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${currentStatus === 'HEALTHY' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : currentStatus === 'LOW' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                               <div className={`w-1.5 h-1.5 rounded-full ${currentStatus === 'HEALTHY' ? 'bg-emerald-500' : currentStatus === 'LOW' ? 'bg-amber-500' : 'bg-red-500 animate-pulse'}`} /> {currentStatus}
                             </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <div className="flex justify-end gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleDuplicate(p)} className="p-3 hover:bg-slate-200 rounded-xl text-slate-500 transition-all hover:scale-110" title="Duplicate Listing"><Copy size={18} /></button>
                                <button onClick={() => handleOpenEditProduct(p)} className="p-3 hover:bg-indigo-50 rounded-xl text-indigo-600 transition-all hover:scale-110 shadow-sm" title="Edit Identity"><Edit size={18} /></button>
                                <button onClick={() => setShowDeleteConfirm(p.id)} className="p-3 hover:bg-red-50 rounded-xl text-red-500 transition-all hover:scale-110 shadow-sm" title="Purge Item"><Trash2 size={18} /></button>
                             </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
           </Card>
        </div>
      )}

      {/* Detail Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[130] flex items-center justify-center p-4 animate-fade-in">
          <Card className="w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar border-none rounded-[40px] p-12 relative bg-white">
            <div className="absolute top-0 left-0 w-full h-2.5 bg-indigo-600"></div>
            <div className="flex justify-between items-start mb-10">
              <div className="flex gap-8 items-center">
                <div className="w-24 h-24 bg-slate-900 text-white rounded-[32px] flex items-center justify-center text-5xl font-black shadow-2xl ring-8 ring-slate-100">{selectedVendor.name.charAt(0)}</div>
                <div>
                  <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{selectedVendor.name}</h3>
                  <div className="flex items-center gap-4 mt-2">
                     <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Registry ID: {selectedVendor.id}</p>
                     <span className="text-[10px] font-black bg-indigo-600 text-white px-4 py-1 rounded-full uppercase tracking-widest shadow-xl shadow-indigo-100">{selectedVendor.storeType} Hub</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedVendor(null)} className="p-4 hover:bg-slate-100 rounded-3xl text-slate-400 transition-all hover:scale-110"><X size={32} /></button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-10 mb-12 border-y border-slate-100 py-12">
              <div className="space-y-2">
                <span className="text-[10px] uppercase text-slate-400 font-black tracking-widest flex items-center gap-2"><User size={14} className="text-indigo-400"/> Operator Identity</span>
                <p className="text-lg font-black text-slate-800 tracking-tight">{selectedVendor.age}y • {selectedVendor.gender}</p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] uppercase text-slate-400 font-black tracking-widest flex items-center gap-2"><Mail size={14} className="text-indigo-400"/> Primary Contact</span>
                <p className="text-sm font-black text-slate-800 truncate">{selectedVendor.email}</p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] uppercase text-slate-400 font-black tracking-widest flex items-center gap-2"><MapPin size={14} className="text-indigo-400"/> Trade Hub</span>
                <p className="text-lg font-black text-slate-800 tracking-tight">{selectedVendor.market}</p>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest opacity-60">{selectedVendor.city}</p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] uppercase text-slate-400 font-black tracking-widest flex items-center gap-2"><DollarSign size={14} className="text-indigo-400"/> Settlement Index</span>
                <p className={`text-lg font-black tracking-tight ${selectedVendor.rentDue > 0 ? 'text-red-500' : 'text-emerald-600'}`}>{selectedVendor.rentDue === 0 ? 'CLEARED' : `UGX ${selectedVendor.rentDue.toLocaleString()}`}</p>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest opacity-60">{selectedVendor.rentDue > 0 ? 'Arrears Found' : 'Healthy Standing'}</p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] uppercase text-slate-400 font-black tracking-widest flex items-center gap-2"><Package size={14} className="text-indigo-400"/> Active Channel</span>
                <p className="text-lg font-black text-slate-800 tracking-tight">{selectedVendor.products.toLocaleString()} SKUs</p>
                <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest opacity-60">Search-Index Ready</p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] uppercase text-slate-400 font-black tracking-widest flex items-center gap-2"><Layers size={14} className="text-indigo-400"/> Level Architecture</span>
                <p className="text-base font-black text-slate-800 tracking-tight">{selectedVendor?.level || 'Ground Floor'}</p>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest opacity-60">{selectedVendor?.section || 'Default Zone'}</p>
              </div>
            </div>

            <div className="flex gap-4 justify-end">
              <Button variant="secondary" onClick={() => setSelectedVendor(null)} className="px-10 h-14 font-black uppercase text-[10px]">Close Dossier</Button>
              <Button variant="outline" className="font-black uppercase tracking-widest text-[10px] px-8 h-14 border-2 shadow-sm"><Edit size={18}/> Registry Edit</Button>
              {selectedVendor.rentDue > 0 && (
                <Button onClick={() => { setPayingVendor(selectedVendor); setSelectedVendor(null); }} className="font-black uppercase tracking-widest text-[10px] px-12 h-14 shadow-2xl shadow-emerald-200 bg-emerald-600 hover:bg-emerald-500 border-none"><DollarSign size={20}/> Settle Registry</Button>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* QR Code and Product Modal placeholders - keeping them short for the update block if unchanged or abbreviated */}
      {qrVendor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <Card className="w-full max-sm text-center py-10 relative overflow-hidden rounded-3xl border-none">
             <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600"></div>
             <button onClick={() => setQrVendor(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"><X size={24} /></button>
             <div className="mb-8 px-6">
                <div className="w-24 h-24 bg-indigo-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl ring-4 ring-indigo-50"><QrCode size={48} /></div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{qrVendor.name}</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Market Verification Node</p>
             </div>
             <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl mx-auto w-56 h-56 flex items-center justify-center relative group transition-all hover:bg-white hover:border-indigo-200">
                <div className="grid grid-cols-4 gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                   {Array.from({ length: 16 }).map((_, i) => (<div key={i} className={`w-10 h-10 ${Math.random() > 0.4 ? 'bg-slate-800' : 'bg-transparent'} rounded-md`}></div>))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/60 backdrop-blur-sm rounded-3xl"><Printer size={48} className="text-indigo-600" /></div>
             </div>
             <div className="mt-8 px-8 space-y-3">
                <Button className="w-full py-4 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-xl shadow-indigo-100"><Download size={18} /> High-Res Vector</Button>
                <div className="flex gap-2">
                   <Button variant="secondary" className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest"><Share2 size={16} /> Share Link</Button>
                   <Button variant="secondary" className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest"><Printer size={16} /> Batch Print</Button>
                </div>
             </div>
             <p className="mt-8 text-[9px] text-slate-400 font-medium leading-relaxed italic px-10">Secured via 256-bit MMIS Encryption. This QR provides immediate credential access to authorized staff.</p>
          </Card>
        </div>
      )}
    </div>
  );
};
