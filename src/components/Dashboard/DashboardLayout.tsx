import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Target, 
  CreditCard, 
  FileCheck, 
  UserCircle, 
  Wallet, 
  Building2, 
  Warehouse, 
  UserPlus, 
  Contact, 
  Percent, 
  MessageSquare, 
  BarChart3,
  Search,
  Bell,
  ChevronDown,
  Menu,
  X,
  Package,
  ShoppingCart,
  Hammer,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Eye,
  Filter,
  MoreVertical,
  LogOut,
  Settings,
  Shield
} from 'lucide-react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../lib/firestore-utils';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  badge?: string;
  hasSubmenu?: boolean;
  key?: string | number;
}

const SidebarItem = ({ icon, label, active, onClick, badge, hasSubmenu }: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      active 
        ? 'bg-[#F29900] text-white shadow-lg shadow-orange-500/20' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    <div className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`}>
      {icon}
    </div>
    <span className="flex-1 text-left text-sm font-medium">{label}</span>
    {badge && (
      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
        active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
      }`}>
        {badge}
      </span>
    )}
    {hasSubmenu && (
      <ChevronDown size={14} className={`${active ? 'text-white' : 'text-slate-300'}`} />
    )}
  </button>
);

export default function DashboardLayout({ children, activeTab, setActiveTab, userName, onLogout }: { 
  children: React.ReactNode, 
  activeTab: string, 
  setActiveTab: (tab: string) => void,
  userName: string,
  onLogout?: () => void
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProjectSelector, setShowProjectSelector] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    // Fetch Projects
    const unsubProjects = onSnapshot(collection(db, 'objects'), (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(projectsData);
      if (projectsData.length > 0 && !selectedProject) {
        setSelectedProject(projectsData[0]);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'objects');
    });

    // Fetch Notifications
    const q = query(collection(db, 'notifications'), orderBy('time', 'desc'), limit(10));
    const unsubNotifications = onSnapshot(q, (snapshot) => {
      const notificationsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotifications(notificationsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'notifications');
    });

    return () => {
      unsubProjects();
      unsubNotifications();
    };
  }, []);

  const sidebarItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashbord' },
    { id: 'admin', icon: <Shield size={20} />, label: 'Admin Panel', badge: 'PRO' },
    { id: 'reports', icon: <FileText size={20} />, label: 'Hisobotlar', hasSubmenu: true },
    { id: 'clients', icon: <Users size={20} />, label: 'Mijozlar' },
    { id: 'crm', icon: <Target size={20} />, label: 'CRM' },
    { id: 'payments', icon: <CreditCard size={20} />, label: 'To\'lovlar', hasSubmenu: true },
    { id: 'didox', icon: <FileCheck size={20} />, label: 'Didox' },
    { id: 'staff', icon: <UserCircle size={20} />, label: 'Xodimlar' },
    { id: 'salaries', icon: <Wallet size={20} />, label: 'Maoshlar' },
    { id: 'objects', icon: <Building2 size={20} />, label: 'Obyektlar' },
    { id: 'warehouses', icon: <Warehouse size={20} />, label: 'Omborxonalar' },
    { id: 'inventory', icon: <Package size={20} />, label: 'Inventarizatsiya' },
    { id: 'users', icon: <UserPlus size={20} />, label: 'Foydalanuvchilar', hasSubmenu: true },
    { id: 'contacts', icon: <Contact size={20} />, label: 'Kontaktlar' },
    { id: 'discounts', icon: <Percent size={20} />, label: 'Chegirma' },
    { id: 'sms', icon: <MessageSquare size={20} />, label: 'SMS Xabarnoma' },
    { id: 'kpi', icon: <BarChart3 size={20} />, label: 'KPI' },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-white border-r border-slate-100 flex flex-col relative z-30"
      >
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/20">
            <span className="text-white font-black text-xl italic">Q</span>
          </div>
          {isSidebarOpen && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-black text-slate-900 italic"
            >
              iQUB
            </motion.span>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 custom-scrollbar">
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={isSidebarOpen ? item.label : ''}
              active={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
              hasSubmenu={isSidebarOpen && item.hasSubmenu}
              badge={isSidebarOpen ? item.badge : ''}
            />
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-50">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all group"
          >
            <LogOut size={20} className="group-hover:rotate-180 transition-transform duration-300" />
            {isSidebarOpen && <span className="text-sm font-medium">Chiqish</span>}
          </button>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 shadow-sm z-40"
        >
          {isSidebarOpen ? <X size={12} /> : <Menu size={12} />}
        </button>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 flex-shrink-0 z-20">
          <div className="flex items-center gap-6">
            {/* Project Selector */}
            <div className="relative">
              <div 
                onClick={() => setShowProjectSelector(!showProjectSelector)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-100 rounded-xl cursor-pointer hover:bg-orange-100 transition-all group"
              >
                <Warehouse size={18} className="text-[#F29900]" />
                <span className="text-[#F29900] font-bold text-sm">
                  {selectedProject ? selectedProject.name : 'warehouse'}
                </span>
                <ChevronDown size={14} className="text-[#F29900] group-hover:translate-y-0.5 transition-transform" />
              </div>

              <AnimatePresence>
                {showProjectSelector && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-50 font-bold text-slate-900 text-xs uppercase tracking-wider">Loyihani tanlang</div>
                    <div className="max-h-64 overflow-y-auto">
                      {projects.map(p => (
                        <div 
                          key={p.id}
                          onClick={() => {
                            setSelectedProject(p);
                            setShowProjectSelector(false);
                          }}
                          className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0 flex items-center gap-3 ${selectedProject?.id === p.id ? 'bg-orange-50' : ''}`}
                        >
                          <Building2 size={16} className={selectedProject?.id === p.id ? 'text-orange-600' : 'text-slate-400'} />
                          <span className={`text-sm font-bold ${selectedProject?.id === p.id ? 'text-orange-600' : 'text-slate-700'}`}>{p.name}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Breadcrumbs */}
            <div className="hidden md:flex items-center gap-2 text-sm">
              <span className="text-slate-400">Bosh sahifa</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-900 font-medium capitalize">{activeTab}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Search */}
            <div className="hidden lg:flex items-center relative">
              <Search size={18} className="absolute left-3 text-slate-400" />
              <input 
                type="text" 
                placeholder="Qidirish..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none w-64 transition-all"
              />
              {searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl p-4 z-50">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Natijalar</p>
                  <div className="space-y-2">
                    <div className="p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                      <p className="text-sm font-bold text-slate-900">"{searchQuery}" bo'yicha qidiruv...</p>
                      <p className="text-xs text-slate-500">Demo versiyada qidiruv cheklangan</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 hover:bg-slate-50 rounded-xl transition-all ${showNotifications ? 'text-slate-900 bg-slate-50' : 'text-slate-400'}`}
              >
                <Bell size={22} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 w-80 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                      <h4 className="font-bold text-slate-900">Bildirishnomalar</h4>
                      <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">3 yangi</span>
                    </div>
                    <div className="max-h-96 overflow-y-auto py-2">
                      {notifications.map((n) => (
                        <div key={n.id} className="px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0">
                          <p className="text-sm font-bold text-slate-900">{n.title}</p>
                          <p className="text-xs text-slate-500 mb-1">{n.message}</p>
                          <p className="text-[10px] text-slate-400">{n.time}</p>
                        </div>
                      ))}
                    </div>
                    <button className="w-full p-3 text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all border-t border-slate-50">
                      Barchasini ko'rish
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900">{userName}</p>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                  {userName === 'Admin' ? 'Tizim Administratori' : 'Super omborxona mudiri'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/20">
                {userName.charAt(0)}
              </div>
              <ChevronDown size={16} className="text-slate-400 cursor-pointer hover:text-slate-900 transition-colors" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
