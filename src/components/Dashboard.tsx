import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Building2, 
  Home, 
  Clock, 
  CheckCircle2,
  ChevronRight, 
  TrendingUp, 
  Search,
  Bell,
  User,
  Loader2,
  MoreVertical,
  Package
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const iconMap: Record<string, any> = {
  Building2,
  Home,
  Clock,
  CheckCircle2,
};

export default function Dashboard() {
  const { t } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const notifications = [
    { id: 1, title: 'Yangi lid', message: 'Sizga yangi lid biriktirildi', time: '2 daqiqa oldin' },
    { id: 2, title: 'To\'lov tasdiqlandi', message: 'Farg\'ona City loyihasi bo\'yicha to\'lov', time: '1 soat oldin' },
  ];

  const menuItems = [
    { name: t('dash.home'), icon: LayoutDashboard, active: true },
    { name: t('dash.objects'), icon: Building2 },
    { name: t('dash.sales'), icon: TrendingUp },
    { name: t('dash.clients'), icon: User },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/dashboard');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
                      key={item.name}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                        item.active 
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
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  item.active 
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
                <span className="text-slate-900">{t('dash.inventory')}</span>
              </div>
              <h2 className="text-lg md:text-xl font-bold text-slate-900">{t('dash.inventory')}</h2>
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
            <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center text-white font-bold">
              <User size={20} />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {data?.stats.map((stat: any, index: number) => {
            const Icon = iconMap[stat.icon] || Package;
            // Translate stat label if it's one of the known ones
            const label = stat.label === 'Obyektlar' ? t('dash.objects') :
                         stat.label === 'Xonadonlar' ? t('dash.apartments') :
                         stat.label === 'Jarayonda' ? t('dash.in_progress') :
                         stat.label === 'Tayyor' ? t('dash.ready') : stat.label;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
                whileHover={{ 
                  y: -5,
                  scale: 1.02,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-shadow"
              >
                <motion.div 
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className={`w-12 h-12 bg-linear-to-br ${stat.color} rounded-xl flex items-center justify-center text-white mb-4 shadow-lg`}
                >
                  <Icon size={24} />
                </motion.div>
                <p className="text-sm font-bold text-slate-500 mb-1">{label}</p>
                <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
              </motion.div>
            );
          })}
        </div>

        {/* Objects and Sales */}
        <div className="grid lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-base font-bold text-slate-900">{t('dash.obj_status')}</h4>
              <button className="text-sm font-bold text-iqub-orange-end hover:underline">{t('dash.all')}</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-slate-100">
                    <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{t('dash.obj_name')}</th>
                    <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{t('dash.blocks')}</th>
                    <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{t('dash.progress')}</th>
                    <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{t('dash.status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data?.objects.map((obj: any, i: number) => (
                    <motion.tr 
                      key={i} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-4">
                        <p className="text-sm font-bold text-slate-900">{obj.name}</p>
                        <p className="text-xs text-slate-500">{obj.apartments} {t('dash.apartments')}</p>
                      </td>
                      <td className="py-4 text-sm font-medium text-slate-600">{obj.blocks} {t('dash.blocks_count')}</td>
                      <td className="py-4">
                        <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${obj.progress}%` }}
                            className="h-full gradient-bg"
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 mt-1 block">{obj.progress}%</span>
                      </td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                          obj.status === 'Tayyor' ? 'bg-green-100 text-green-600' : 
                          obj.status === 'Qurilmoqda' ? 'bg-orange-100 text-orange-600' :
                          obj.status === 'Poydevor' ? 'bg-blue-100 text-blue-600' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {obj.status === 'Tayyor' ? t('dash.ready') : 
                           obj.status === 'Qurilmoqda' ? t('dash.building') :
                           obj.status === 'Poydevor' ? t('dash.foundation') :
                           t('dash.in_progress')}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h4 className="text-base font-bold text-slate-900 mb-8">{t('dash.recent_sales')}</h4>
            <div className="space-y-6">
              {data?.recentSales.map((sale: any, i: number) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <User size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900">{sale.client}</p>
                    <p className="text-xs text-slate-500">{sale.object}</p>
                  </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">{sale.amount}</p>
                      <p className={`text-[10px] font-bold uppercase ${
                        sale.status === "To'landi" ? 'text-green-500' : 'text-orange-500'
                      }`}>{sale.status === "To'landi" ? t('dash.paid') : t('dash.pending')}</p>
                    </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 text-sm font-bold text-slate-600 hover:text-iqub-orange-end transition-colors flex items-center justify-center gap-2">
              {t('dash.all')} <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Clients Table */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-base font-bold text-slate-900">{t('dash.client_list')}</h4>
            <button className="text-sm font-bold text-iqub-orange-end hover:underline">{t('dash.all')}</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-slate-100">
                  <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{t('dash.client')}</th>
                  <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{t('dash.phone')}</th>
                  <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{t('dash.total')}</th>
                  <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{t('dash.status')}</th>
                  <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">{t('dash.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data?.clients.map((client: any, i: number) => (
                  <motion.tr 
                    key={i} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-bold">
                          {client.name[0]}
                        </div>
                        <p className="text-sm font-bold text-slate-900">{client.name}</p>
                      </div>
                    </td>
                    <td className="py-4 text-sm font-medium text-slate-600">{client.phone}</td>
                    <td className="py-4 text-sm font-bold text-slate-900">{client.total} UZS</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                        client.status === 'Faol' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                        {client.status === 'Faol' ? t('dash.active') : t('dash.pending')}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                    </motion.tr>
                  ))}
                </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
