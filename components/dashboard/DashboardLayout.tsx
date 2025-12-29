
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { UserProfile } from '../../types';
import { Home } from './Home';
import { KYCModule } from './KYCModule';
import { AdminApplicationForm } from './AdminApplicationForm';
import { ContactForm } from '../contact/ContactForm';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { VendorManagement } from './VendorManagement';
import { SupplierManagement } from './SupplierManagement';
import { MarketRegistry } from './MarketRegistry';
import { InteractiveMap } from './InteractiveMap';
import { AuditLogs } from './AuditLogs';
import { QRManagement } from './QRManagement';
import { NotificationCenter } from './NotificationCenter';
import { Chatbot } from './Chatbot';
import { GateManagement } from './GateManagement';
import { StockCounterTerminal } from './StockCounterTerminal';
import { InventoryManagement } from './InventoryManagement';
import { ProfileSettings } from './ProfileSettings';
import { TransactionHistory } from './TransactionHistory';
import { Header } from '../ui/Header';
import { Footer } from '../ui/Footer';
import { PaymentGateway } from '../payments/PaymentGateway';

interface DashboardLayoutProps {
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  onLogout: () => void;
}

export const DashboardLayout = ({ user, setUser, onLogout }: DashboardLayoutProps) => {
  const [activeTab, setActiveTab] = useState('Home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return <Home user={user} />;
      case 'Vendors':
      case 'My Store':
        return <VendorManagement user={user} />;
      case 'Suppliers':
        return <SupplierManagement user={user} />;
      case 'Markets':
        return <MarketRegistry user={user} />;
      case 'Map View':
        return <InteractiveMap user={user} />;
      case 'KYC Verification':
        return <VendorManagement user={user} />;
      case 'Inventory Control':
        return <InventoryManagement user={user} />;
      case 'Billing & Dues':
      case 'Transactions':
        return <TransactionHistory user={user} />;
      case 'Settings':
        return <ProfileSettings user={user} setUser={setUser} />;
      case 'Audit Logs':
        return <AuditLogs />;
      case 'Become a Vendor':
        return <KYCModule type="VENDOR" userEmail={user.email} onComplete={() => {
          setUser({ ...user, kycStatus: 'SUBMITTED', appliedRole: 'VENDOR' });
          setActiveTab('Home');
        }} />;
      case 'Apply as Supplier':
        return <KYCModule type="SUPPLIER" userEmail={user.email} onComplete={() => {
          setUser({ ...user, kycStatus: 'SUBMITTED', appliedRole: 'SUPPLIER' });
          setActiveTab('Home');
        }} />;
      case 'Admin Application':
        return <AdminApplicationForm userEmail={user.email} onComplete={() => {
          setUser({ ...user, kycStatus: 'SUBMITTED', appliedRole: 'MARKET_ADMIN' });
          setActiveTab('Home');
        }} />;
      case 'Support':
        return <ContactForm />;
      case 'QR & Receipts':
        return <QRManagement />;
      case 'Gate Management':
        return <GateManagement />;
      case 'Stock Counter':
        return <StockCounterTerminal />;
      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <h3 className="text-xl font-bold text-slate-800">{activeTab} module is coming soon</h3>
            <p className="text-slate-500 max-w-md">The component for {activeTab} is being prepared for deployment.</p>
            <Button onClick={() => setActiveTab('Home')}>Back to Home</Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          user={user} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen}
          onLogout={onLogout}
        />

        <div className="flex-1 flex flex-col overflow-y-auto">
          <Header 
            user={user} 
            onLogout={onLogout} 
            onLogoClick={() => setActiveTab('Home')}
            onNotificationClick={() => setShowNotifications(!showNotifications)}
          />
          
          <div className="relative">
            {showNotifications && <NotificationCenter onClose={() => setShowNotifications(false)} />}
          </div>

          <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
            {renderContent()}
          </main>
          
          <Footer />
        </div>
      </div>

      <Chatbot />
    </div>
  );
};
