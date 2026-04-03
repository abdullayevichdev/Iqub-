import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Building2, 
  ChevronRight, 
  TrendingUp, 
  Search,
  Bell,
  User,
  LogOut,
  Loader2,
  MoreVertical
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import MainDashboardView from './Dashboard/MainDashboardView';
import ObjectsView from './Dashboard/ObjectsView';
import PaymentsView from './Dashboard/PaymentsView';
import ClientsView from './Dashboard/ClientsView';
import DemoRequestsView from './Dashboard/DemoRequestsView';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestore-utils';

export default function Dashboard() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [notifications, setNotifications] = useState<any[]>([]);

  const menuItems = [
    { id: 'home', name: t('dash.home'), icon: LayoutDashboard },
    { id: 'objects', name: t('dash.objects'), icon: Building2 },
    { id: 'sales', name: t('dash.sales'), icon: TrendingUp },
    { id: 'clients', name: t('dash.clients'), icon: User },
    { id: 'demo_requests', name: "Demo so'rovlar", icon: Bell },
  ];

  const handleLogout = () => {
    localStorage.removeItem('admin_access');
    localStorage.removeItem('app_view');
    window.location.reload();
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <MainDashboardView />;
      case 'objects':
        return <ObjectsView />;
      case 'sales':
        return <PaymentsView />;
      case 'clients':
        return <ClientsView />;
      case 'demo_requests':
        return <DemoRequestsView />;
      default:
        return <MainDashboardView />;
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'notifications'), orderBy('time', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notificationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotifications(notificationsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'notifications');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-20">
        <Loader2 className="animate-spin text-iqub-orange-end" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex pt-20">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[70] shadow-2xl lg:hidden"
            >
              <div className="p-6 pt-24">
                <nav className="space-y-2">
                  {menuItems.map((item, i) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                        activeTab === item.id 
                          ? 'gradient-bg text-white shadow-lg shadow-orange-500/20' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <item.icon size={18} />
                      {item.name}
                    </button>
                  ))}
                </nav>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:block">
        <div className="p-6">
          <nav className="space-y-2">
            {menuItems.map((item, i) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === item.id 
                    ? 'gradient-bg text-white shadow-lg shadow-orange-500/20' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <item.icon size={18} />
                {item.name}
              </motion.button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600"
            >
              <MoreVertical size={20} className="rotate-90" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 md:mb-2">
                <span>{t('dash.home')}</span>
                <ChevronRight size={12} />
                <span className="text-slate-900">
                  {activeTab === 'home' ? t('dash.inventory') : 
                   activeTab === 'objects' ? t('dash.objects') :
                   activeTab === 'sales' ? t('dash.sales') :
                   t('dash.clients')}
                </span>
              </div>
              <h2 className="text-lg md:text-xl font-bold text-slate-900">
                {activeTab === 'home' ? t('dash.inventory') : 
                 activeTab === 'objects' ? t('dash.objects') :
                 activeTab === 'sales' ? t('dash.sales') :
                 t('dash.clients')}
              </h2>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder={t('dash.search')} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-iqub-orange-start focus:border-transparent outline-none"
              />
              {searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Natijalar</p>
                  <div className="p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                    <p className="text-sm font-bold text-slate-900">"{searchQuery}" bo'yicha qidiruv...</p>
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors relative"
              >
                <Bell size={18} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-50 font-bold text-slate-900">Bildirishnomalar</div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map(n => (
                        <div key={n.id} className="p-4 hover:bg-slate-50 border-b border-slate-50 last:border-0 cursor-pointer">
                          <p className="text-sm font-bold text-slate-900">{n.title}</p>
                          <p className="text-xs text-slate-500">{n.message}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/20 hover:scale-105 transition-all"
              >
                <User size={20} />
              </button>
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-50">
                      <p className="text-sm font-bold text-slate-900">Admin</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">Administrator</p>
                    </div>
                    <div className="p-2">
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <LogOut size={16} />
                        Chiqish
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderActiveTab()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
