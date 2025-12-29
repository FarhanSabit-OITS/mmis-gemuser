import React, { useState, useMemo } from 'react';
import { 
  Package, Search, Filter, Plus, Edit, Trash2, AlertCircle, ShoppingCart, 
  Send, CheckCircle, X, Save, Info, User, Tag, DollarSign, Boxes, 
  Warehouse, ShieldCheck, ChevronDown, ArrowRight, Eye, LayoutGrid, Zap,
  TrendingUp, BarChart3, ListFilter, ClipboardCheck
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { UserProfile, Product } from '../../types';

export const InventoryManagement = ({ user }: { user: UserProfile }) => {
  const [items, setItems] = useState<Product[]>([
    { id: 'PRD-8821', name: 'Basmati Rice (50kg)', description: 'Long-grain aromatic rice, Grade A quality. Sourced from the Nile delta region with moisture-sealed packaging.', vendor: 'Fresh Foods Ltd', stock: 12, price: 180000, status: 'LOW', category: 'Food' },
    { id: 'PRD-9902', name: 'Refined Sugar (20kg)', description: 'Fine white sugar for household use. Double-refined for maximum purity and long shelf life.', vendor: 'Fresh Foods Ltd', stock: 140, price: 85000, status: 'HEALTHY', category: 'Food' },
    { id: 'PRD-4453', name: 'Cooking Oil (20L)', description: 'Pure vegetable oil, cholesterol-free. Fortified with Vitamin A and D.', vendor: 'Global Mart', stock: 5, price: 120000, status: 'CRITICAL', category: 'Household' },
    { id: 'PRD-1022', name: 'Solar Lantern X-Pro', description: 'Dual-charging solar lantern with 5000mAh battery bank. Weatherproof casing.', vendor: 'Tech Hub Solutions', stock: 85, price: 65000, status: 'HEALTHY', category: 'Electronics' },
  ]);

  const [search, setSearch] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'General'
  });

  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.name.toLowerCase().includes(search.toLowerCase()) || 
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.vendor.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  const determineStatus = (stock: number): Product['status'] => {
    const low = user.settings?.lowStockThreshold ?? 10;
    const critical = user.settings?.criticalStockThreshold ?? 5;
    if (stock <= critical) return 'CRITICAL';
    if (stock <= low) return 'LOW';
    return 'HEALTHY';
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setForm({ name: '', description: '', price: '', stock: '', category: 'General' });
    setShowFormModal(true);
  };

  const handleOpenEdit = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category
    });
    setShowFormModal(true);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to purge this commodity from the registry?')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleSave = () => {
    if (!form.name || !form.price || !form.stock) {
      alert("Registration failed: Please define all required commodity parameters.");
      return;
    }

    if (editingProduct) {
      setItems(items.map(item => {
        if (item.id === editingProduct.id) {
          const newStock = Number(form.stock);
          return {
            ...item,
            name: form.name,
            description: form.description,
            price: Number(form.price),
            stock: newStock,
            category: form.category,
            status: determineStatus(newStock)
          };
        }
        return item;
      }));
    } else {
      const newStock = Number(form.stock);
      const p: Product = {
        id: 'PRD-' + Math.random().toString(36).substr(2, 4).toUpperCase(),
        name: form.name,
        description: form.description,
        vendor: user.name,
        price: Number(form.price),
        stock: newStock,
        status: user.role === 'SUPPLIER' ? 'PENDING_APPROVAL' : determineStatus(newStock),
        category: form.category
      };
      setItems([p, ...items]);
    }
    setShowFormModal(false);
  };

  const statusColors = {
    HEALTHY: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    LOW: 'bg-amber-50 text-amber-600 border-amber-100',
    CRITICAL: 'bg-red-50 text-red-600 border-red-100',
    PENDING_APPROVAL: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  };

  const selectClassName = "w-full bg-black text-white border-2 border-slate-800 rounded-2xl px-5 py-3.5 text-xs font-black uppercase tracking-widest outline-none focus:border-indigo-600 appearance-none cursor-pointer shadow-xl transition-all";

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 bg-indigo-600 text-white rounded-[24px] flex items-center justify-center shadow-2xl ring-4 ring-indigo-50">
             <Boxes size={32} />
           </div>
           <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Inventory Control</h2>
              <p className="text-slate-500 font-medium text-lg">
                Oversight: <span className="text-amber-600 font-black">Low &lt; {user.settings?.lowStockThreshold ?? 10}</span> | 
                <span className="text-red-600 font-black ml-1">Critical &lt; {user.settings?.criticalStockThreshold ?? 5}</span>
              </p>
           </div>
        </div>
        <Button onClick={handleOpenAdd} className="shadow-2xl shadow-indigo-200 h-14 px-8 font-black uppercase tracking-widest text-xs">
          {user.role === 'SUPPLIER' ? <ShoppingCart size={20}/> : <Plus size={20}/>}
          {user.role === 'SUPPLIER' ? 'Request Bulk Listing' : 'Register Commodity'}
        </Button>
      </div>

      {/* Control Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <Input 
            icon={Search} 
            placeholder="Search by ID, Name, or Node..." 
            value={search}
            onChange={(e:any) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative group">
          <select className={selectClassName}>
            <option>All Classifications</option>
            <option>Food & Cereals</option>
            <option>Household Gear</option>
            <option>Electronics</option>
          </select>
          <ListFilter className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
        </div>
        <div className="relative group">
          <select className={selectClassName}>
            <option>Status: All Channels</option>
            <option>Stable (Healthy)</option>
            <option>Low Supplies</option>
            <option>Critical Deficit</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
        </div>
      </div>

      {/* Main Registry Table */}
      <Card className="overflow-hidden border-slate-100 shadow-2xl p-0 rounded-[32px]">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                <th className="px-8 py-6">Commodity Entity</th>
                <th className="px-8 py-6">Source Node</th>
                <th className="px-8 py-6">Reserve Level</th>
                <th className="px-8 py-6">Valuation</th>
                <th className="px-8 py-6">Health</th>
                <th className="px-8 py-6 text-right">Ops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredItems.map((item) => (
                <tr 
                  key={item.id} 
                  onClick={() => setSelectedProduct(item)}
                  className="group hover:bg-slate-50/80 transition-all cursor-pointer border-l-4 border-l-transparent hover:border-l-indigo-600"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg group-hover:bg-indigo-600 group-hover:scale-105 transition-all">
                        <Package size={24} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-base font-black text-slate-900 block truncate tracking-tight">{item.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-black bg-slate-200/50 text-slate-500 px-2 py-0.5 rounded-lg uppercase tracking-widest">{item.id}</span>
                          <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">{item.category}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-800 tracking-tight">{item.vendor}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><Warehouse size={10}/> Trading Node</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-2">
                       <span className={`text-sm font-black ${item.stock === 0 ? 'text-red-500' : 'text-slate-800'}`}>{item.stock.toLocaleString()} Units</span>
                       <div className="w-24 h-1.5 rounded-full bg-slate-100 overflow-hidden shadow-inner">
                          <div className={`h-full transition-all duration-700 ${
                            item.status === 'HEALTHY' ? 'bg-emerald-500' :
                            item.status === 'LOW' ? 'bg-amber-500' :
                            'bg-red-500'
                          }`} style={{ width: `${Math.min((item.stock / 200) * 100, 100)}%` }} />
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-slate-900 tracking-tighter">UGX {item.price.toLocaleString()}</p>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Base Rate</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${statusColors[item.status]}`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => handleOpenEdit(item, e)}
                        className="p-3 hover:bg-indigo-50 rounded-2xl text-indigo-600 transition-all hover:scale-110 shadow-sm" 
                        title="Edit Definition"
                      >
                        <Edit size={20} />
                      </button>
                      <button 
                        onClick={(e) => handleDelete(item.id, e)}
                        className="p-3 hover:bg-red-50 rounded-2xl text-red-500 transition-all hover:scale-110 shadow-sm" 
                        title="Purge Listing"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* --- Detailed Commodity Modal --- */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[130] flex items-center justify-center p-4 animate-fade-in">
          <Card className="w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[95vh] custom-scrollbar border-none rounded-[40px] p-12 relative bg-white">
            <div className="absolute top-0 left-0 w-full h-3 bg-indigo-600"></div>
            <div className="flex justify-between items-start mb-12">
              <div className="flex gap-10 items-center">
                <div className="w-28 h-28 bg-slate-900 text-white rounded-[36px] flex items-center justify-center text-5xl font-black shadow-2xl ring-8 ring-slate-100 transform -rotate-3 hover:rotate-0 transition-transform">
                  <Package size={56} />
                </div>
                <div>
                  <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight mb-2">{selectedProduct.name}</h3>
                  <div className="flex flex-wrap items-center gap-4">
                     <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">ENTITY-ID: {selectedProduct.id}</p>
                     <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl shadow-indigo-100 ${statusColors[selectedProduct.status]}`}>
                        {selectedProduct.status} Status
                     </span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedProduct(null)} className="p-4 hover:bg-slate-100 rounded-3xl text-slate-400 transition-all hover:scale-110"><X size={32} /></button>
            </div>

            {/* Specifications Section */}
            <div className="mb-12">
               <span className="text-[10px] uppercase text-slate-400 font-black tracking-widest flex items-center gap-2 mb-4 px-2"><Info size={14} className="text-indigo-400"/> Commodity Specifications</span>
               <div className="text-slate-600 text-lg leading-relaxed font-medium bg-slate-50 p-8 rounded-[32px] border border-slate-100 shadow-inner">
                 {selectedProduct.description || "No technical specification data found for this entity. Documentation required for compliance verification."}
               </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-10 mb-12 border-y border-slate-100 py-12 px-2">
              <div className="space-y-2">
                <span className="text-[10px] uppercase text-slate-400 font-black tracking-widest flex items-center gap-2"><Warehouse size={14} className="text-indigo-400"/> Trade Operator</span>
                <p className="text-lg font-black text-slate-800 tracking-tight">{selectedProduct.vendor}</p>
                <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest opacity-60">Certified Source</p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] uppercase text-slate-400 font-black tracking-widest flex items-center gap-2"><DollarSign size={14} className="text-indigo-400"/> Unit Valuation</span>
                <p className="text-2xl font-black text-slate-900 tracking-tighter">UGX {selectedProduct.price.toLocaleString()}</p>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest opacity-60">Market Base Rate</p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] uppercase text-slate-400 font-black tracking-widest flex items-center gap-2"><Boxes size={14} className="text-indigo-400"/> Reserve Level</span>
                <p className={`text-2xl font-black tracking-tighter ${selectedProduct.stock === 0 ? 'text-red-600' : 'text-slate-800'}`}>
                  {selectedProduct.stock.toLocaleString()} <span className="text-sm opacity-40 font-bold ml-1">UNITS</span>
                </p>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest opacity-60">In-Transit: 0</p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] uppercase text-slate-400 font-black tracking-widest flex items-center gap-2"><Tag size={14} className="text-indigo-400"/> Classification</span>
                <p className="text-lg font-black text-slate-800 tracking-tight">{selectedProduct.category}</p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] uppercase text-slate-400 font-black tracking-widest flex items-center gap-2"><Zap size={14} className="text-indigo-400"/> System Health</span>
                <p className={`text-lg font-black tracking-tight ${
                  selectedProduct.status === 'CRITICAL' ? 'text-red-500' : 
                  selectedProduct.status === 'LOW' ? 'text-amber-500' : 'text-emerald-600'
                }`}>{selectedProduct.status}</p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] uppercase text-slate-400 font-black tracking-widest flex items-center gap-2"><ClipboardCheck size={14} className="text-indigo-400"/> Compliance</span>
                <p className="text-lg font-black text-emerald-600 tracking-tight flex items-center gap-1.5"><ShieldCheck size={18}/> VERIFIED</p>
              </div>
            </div>

            <div className="flex gap-4 justify-end">
              <Button variant="secondary" onClick={() => setSelectedProduct(null)} className="px-10 h-14 font-black uppercase text-[10px]">Close Dossier</Button>
              <Button 
                onClick={(e) => { handleOpenEdit(selectedProduct, e); setSelectedProduct(null); }} 
                variant="outline" 
                className="font-black uppercase tracking-widest text-[10px] px-8 h-14 border-2 shadow-sm"
              >
                <Edit size={18}/> Registry Edit
              </Button>
              <Button className="font-black uppercase tracking-widest text-[10px] px-12 h-14 shadow-2xl shadow-indigo-100 bg-indigo-600 border-none">
                <ShoppingCart size={20}/> Restock Request
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* --- Refactored Product Form Modal --- */}
      {showFormModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[150] flex items-center justify-center p-4 animate-fade-in">
           <Card className="w-full max-w-xl shadow-2xl border-none rounded-[40px] p-10 relative overflow-hidden bg-white">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600"></div>
              <div className="flex justify-between items-center mb-10">
                 <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
                       {editingProduct ? <Edit size={24} /> : <Plus size={24} />}
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                       {editingProduct ? 'Registry Update' : 'Initialize Listing'}
                    </h3>
                 </div>
                 <button onClick={() => setShowFormModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={28} /></button>
              </div>

              <div className="space-y-6">
                 <Input 
                   label="Commodity Designation *" 
                   placeholder="e.g. Basmati Rice (Premium Grade)" 
                   value={form.name} 
                   onChange={(e:any)=>setForm({...form, name: e.target.value})} 
                 />

                 <div className="grid grid-cols-2 gap-6">
                    <Input 
                      label="Valuation (UGX) *" 
                      type="number" 
                      placeholder="0.00" 
                      value={form.price} 
                      onChange={(e:any)=>setForm({...form, price: e.target.value})} 
                    />
                    <Input 
                      label="Current Reserve *" 
                      type="number" 
                      placeholder="0" 
                      value={form.stock} 
                      onChange={(e:any)=>setForm({...form, stock: e.target.value})} 
                    />
                 </div>

                 <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Classification Segment</label>
                    <div className="relative group">
                       <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 group-focus-within:text-indigo-400" />
                       <select 
                        value={form.category}
                        onChange={(e) => setForm({...form, category: e.target.value})}
                        className="w-full bg-black text-white border-2 border-slate-800 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold focus:border-indigo-600 outline-none appearance-none cursor-pointer shadow-xl transition-all"
                      >
                        <option value="General">General Trade</option>
                        <option value="Food">Food & Cereals</option>
                        <option value="Household">Household Essentials</option>
                        <option value="Electronics">Electronics Hub</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
                    </div>
                 </div>

                 <Input 
                   label="Technical Specifications & Notes" 
                   multiline 
                   placeholder="Define moisture levels, battery cycles, or sourcing nodes..." 
                   value={form.description} 
                   onChange={(e:any)=>setForm({...form, description: e.target.value})} 
                 />

                 <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-[24px] flex gap-4">
                    <Zap className="text-indigo-600 shrink-0 mt-0.5" size={20} />
                    <p className="text-[10px] text-indigo-700 leading-relaxed font-bold uppercase tracking-tight">
                       System logic: Status will be recalculated based on your <span className="underline decoration-indigo-300">Custom Threshold Profile</span> after commit.
                    </p>
                 </div>

                 <div className="flex gap-3 justify-end pt-4">
                    <Button variant="secondary" onClick={() => setShowFormModal(false)} className="px-8 h-12 font-black uppercase text-[10px]">Discard</Button>
                    <Button onClick={handleSave} className="px-12 h-12 font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100">
                       <Save size={18}/> Commit Ledger
                    </Button>
                 </div>
              </div>
           </Card>
        </div>
      )}
    </div>
  );
};