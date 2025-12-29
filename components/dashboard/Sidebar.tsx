
import React from 'react';
import { 
  LayoutDashboard, 
  Store, 
  Package, 
  Users, 
  ShieldCheck, 
  Settings, 
  LogOut, 
  MessageSquare,
  History,
  Ticket,
  Truck,
  Box,
  UserPlus,
  CreditCard,
  Building2,
  Warehouse,
  Boxes,
  Map as MapIcon
} from 'lucide-react';
import { Role, UserProfile } from '../../types';
import { ROLES_HIERARCHY } from '../../constants';

interface SidebarProps {
  user: UserProfile;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onLogout: () => void;
}

export const Sidebar = ({ user, activeTab, setActiveTab, isOpen, setIsOpen, onLogout }: SidebarProps) => {
  
  const canSee = (requiredRoles?: Role[]) => {
    if (!requiredRoles) return true;
    if (user.role === 'SUPER_ADMIN') return true;
    const hierarchy = ROLES_HIERARCHY[user.role] || [];
    return requiredRoles.includes(user.role) || requiredRoles.some(role => hierarchy.includes(role));
  };

  const menuItems = [
    { name: 'Home', icon: LayoutDashboard },
    { name: 'Markets', icon: Building2, roles: ['SUPER_ADMIN', 'MARKET_ADMIN'] as Role[] },
    { name: 'Map View', icon: MapIcon, roles: ['SUPER_ADMIN', 'MARKET_ADMIN', 'VENDOR', 'SUPPLIER'] as Role[] },
    { name: user.role === 'VENDOR' ? 'My Store' : 'Vendors', icon: Store, roles: ['SUPER_ADMIN', 'MARKET_ADMIN', 'VENDOR'] as Role[] },
    { name: 'Suppliers', icon: Warehouse, roles: ['SUPER_ADMIN', 'MARKET_ADMIN', 'SUPPLIER'] as Role[] },
    { name: 'Inventory Control', icon: Box, roles: ['SUPER_ADMIN', 'MARKET_ADMIN', 'VENDOR', 'SUPPLIER'] as Role[] },
    { name: 'Billing & Dues', icon: CreditCard, roles: ['VENDOR', 'SUPPLIER'] as Role[] },
    { name: 'Gate Management', icon: Truck, roles: ['SUPER_ADMIN', 'MARKET_ADMIN', 'COUNTER_STAFF'] as Role[] },
    { name: 'Stock Counter', icon: Boxes, roles: ['SUPER_ADMIN', 'MARKET_ADMIN', 'COUNTER_STAFF'] as Role[] },
    { name: 'QR & Receipts', icon: Ticket, roles: ['COUNTER_STAFF', 'VENDOR'] as Role[] },
    { name: 'Audit Logs', icon: History, roles: ['SUPER_ADMIN', 'MARKET_ADMIN'] as Role[] },
    { name: 'KYC Verification', icon: ShieldCheck, roles: ['SUPER_ADMIN', 'MARKET_ADMIN'] as Role[] },
    { name: 'Support', icon: MessageSquare },
    { name: 'Settings', icon: Settings },
  ].filter(item => canSee(item.roles));

  return (
    <aside className={`bg-white border-r border-slate-100 flex flex-col transition-all duration-300 h-screen sticky top-0 z-50 ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
          <Store className="text-white" size={24} />
        </div>
        {isOpen && <h1 className="text-xl font-black text-slate-800 tracking-tight">MMIS</h1>}
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveTab(item.name)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
              activeTab === item.name 
              ? 'bg-indigo-600 text-white shadow-indigo-100 shadow-lg' 
              : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <item.icon size={20} />
            {isOpen && <span className="font-medium">{item.name}</span>}
          </button>
        ))}
        
        {user.kycStatus === 'NONE' && (
          <div className="mt-4 pt-4 border-t border-slate-50 space-y-1">
            <p className={`text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-3 ${!isOpen && 'hidden'}`}>Applications</p>
            <button onClick={() => setActiveTab('Become a Vendor')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-all ${activeTab === 'Become a Vendor' && 'bg-indigo-50'}`}>
              <Store size={16}/> {isOpen && 'Vendor Access'}
            </button>
            <button onClick={() => setActiveTab('Apply as Supplier')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all ${activeTab === 'Apply as Supplier' && 'bg-slate-100'}`}>
              <Package size={16}/> {isOpen && 'Supplier Access'}
            </button>
            <button onClick={() => setActiveTab('Admin Application')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all ${activeTab === 'Admin Application' && 'bg-slate-100'}`}>
              <UserPlus size={16}/> {isOpen && 'Market Admin Request'}
            </button>
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button 
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-all font-medium`}
        >
          <LogOut size={20} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};
