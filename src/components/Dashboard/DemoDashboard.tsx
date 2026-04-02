import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import MainDashboardView from './MainDashboardView';
import InventoryView from './InventoryView';
import CRMView from './CRMView';
import WarehouseView from './WarehouseView';
import AdminView from './AdminView';
import ReportsView from './ReportsView';
import ClientsView from './ClientsView';
import PaymentsView from './PaymentsView';
import StaffView from './StaffView';
import ObjectsView from './ObjectsView';
import DidoxView from './DidoxView';
import KPIView from './KPIView';
import SalariesView from './SalariesView';
import UsersView from './UsersView';
import ContactsView from './ContactsView';
import DiscountsView from './DiscountsView';
import SMSView from './SMSView';

export default function DemoDashboard({ userName, onLogout }: { userName: string, onLogout?: () => void }) {
  const [activeTab, setActiveTab] = useState(userName === 'Admin' ? 'admin' : 'dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <MainDashboardView />;
      case 'admin':
        return <AdminView />;
      case 'inventory':
        return <InventoryView />;
      case 'crm':
        return <CRMView />;
      case 'warehouses':
        return <WarehouseView />;
      case 'reports':
        return <ReportsView />;
      case 'clients':
        return <ClientsView />;
      case 'payments':
        return <PaymentsView />;
      case 'staff':
        return <StaffView />;
      case 'objects':
        return <ObjectsView />;
      case 'didox':
        return <DidoxView />;
      case 'kpi':
        return <KPIView />;
      case 'salaries':
        return <SalariesView />;
      case 'users':
        return <UsersView />;
      case 'contacts':
        return <ContactsView />;
      case 'discounts':
        return <DiscountsView />;
      case 'sms':
        return <SMSView />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
              <span className="text-4xl font-black italic">Q</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 italic">iQUB Demo</h2>
            <p className="text-sm font-medium">Bu bo'lim demo versiyada hali mavjud emas.</p>
          </div>
        );
    }
  };

  return (
    <DashboardLayout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      userName={userName}
      onLogout={onLogout}
    >
      {renderContent()}
    </DashboardLayout>
  );
}
