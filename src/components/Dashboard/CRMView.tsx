import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  UserPlus, 
  MessageSquare, 
  TrendingUp, 
  RefreshCw,
  MoreVertical,
  ChevronDown,
  Plus,
  X,
  Search,
  Filter
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../lib/firestore-utils';

const data = [
  { name: '1 sep', value: 15 },
  { name: '2 sep', value: 23 },
  { name: '3 sep', value: 18 },
  { name: '4 sep', value: 32 },
  { name: '5 sep', value: 28 },
  { name: '6 sep', value: 19 },
  { name: '7 sep', value: 38 },
  { name: '8 sep', value: 29 },
];

const StatCard = ({ icon, label, value, color }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={`${color} p-6 rounded-3xl border border-white/20 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden`}
  >
    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4 backdrop-blur-sm">
      {icon}
    </div>
    <h3 className="text-slate-700/60 text-sm font-bold mb-1">{label}</h3>
    <span className="text-3xl font-black text-slate-900">{value}</span>
  </motion.div>
);

export default function CRMView() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [leads, setLeads] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    phone: '',
    source: 'Telegram',
    status: 'Yangi',
    notes: ''
  });

  useEffect(() => {
    const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leadsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLeads(leadsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'leads');
    });

    return () => unsubscribe();
  }, []);

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'leads'), {
        ...newLead,
        createdAt: serverTimestamp()
      });
      setShowAddModal(false);
      setNewLead({ name: '', phone: '', source: 'Telegram', status: 'Yangi', notes: '' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'leads');
    }
  };

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'Yangi').length,
    noResponse: leads.filter(l => l.status === 'Javob berilmagan').length,
    converted: leads.filter(l => l.status === 'Sotuv').length
  };
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm inline-flex gap-1">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'dashboard' ? 'bg-purple-50 text-purple-700' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <TrendingUp size={16} />
            Dashbord
          </button>
          <button 
            onClick={() => setActiveTab('leads')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'leads' ? 'bg-purple-50 text-purple-700' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Users size={16} />
            Lidlar
          </button>
          <button className="px-6 py-2.5 text-slate-500 hover:bg-slate-50 rounded-xl text-sm font-bold flex items-center gap-2 transition-all">
            <MessageSquare size={16} />
            Postlar
          </button>
          <button className="px-6 py-2.5 text-slate-500 hover:bg-slate-50 rounded-xl text-sm font-bold flex items-center gap-2 transition-all">
            <RefreshCw size={16} />
            Sozlamalar
          </button>
        </div>
        {activeTab === 'leads' && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 gradient-bg text-white rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-orange-500/20"
          >
            <Plus size={18} />
            Yangi lid
          </button>
        )}
      </div>

      {activeTab === 'dashboard' ? (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              icon={<Users className="text-blue-600" size={20} />} 
              label="Jami lidlar" 
              value={stats.total} 
              color="bg-[#E0F2FE]"
            />
            <StatCard 
              icon={<UserPlus className="text-green-600" size={20} />} 
              label="Yangi lidlar" 
              value={stats.new} 
              color="bg-[#DCFCE7]"
            />
            <StatCard 
              icon={<MessageSquare className="text-orange-600" size={20} />} 
              label="Javob berilmagan" 
              value={stats.noResponse} 
              color="bg-[#FEF3C7]"
            />
            <StatCard 
              icon={<TrendingUp className="text-purple-600" size={20} />} 
              label="Sotuvlar" 
              value={stats.converted} 
              color="bg-[#F3E8FF]"
            />
          </div>

          {/* Chart Section */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Statistika</h3>
                <h2 className="text-3xl font-black text-slate-900">Faollik grafigi</h2>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                    dx={-10}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' 
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8B5CF6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                    dot={{ r: 6, fill: '#fff', stroke: '#8B5CF6', strokeWidth: 2 }}
                    activeDot={{ r: 8, fill: '#8B5CF6', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900">Lidlar ro'yxati</h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Qidirish..." 
                  className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none w-48 transition-all"
                />
              </div>
              <button className="p-2 text-slate-400 hover:text-slate-900 transition-all">
                <Filter size={20} />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-slate-50">
                  <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Ism</th>
                  <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Telefon</th>
                  <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Manba</th>
                  <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {leads.length > 0 ? (
                  leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50 transition-all group">
                      <td className="p-6">
                        <p className="font-bold text-slate-900">{lead.name}</p>
                      </td>
                      <td className="p-6 text-sm font-bold text-slate-900">{lead.phone}</td>
                      <td className="p-6">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          {lead.source}
                        </span>
                      </td>
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                          lead.status === 'Sotuv' ? 'bg-green-50 text-green-600' : 
                          lead.status === 'Yangi' ? 'bg-blue-50 text-blue-600' :
                          'bg-orange-50 text-orange-600'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <button className="p-2 text-slate-400 hover:text-slate-900 transition-all">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-400 italic">Lidlar mavjud emas</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-900">Yangi lid qo'shish</h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleAddLead} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Ism sharifi</label>
                  <input 
                    required
                    type="text" 
                    value={newLead.name}
                    onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                    placeholder="Masalan: Alisher Azizov"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Telefon raqami</label>
                  <input 
                    required
                    type="tel" 
                    value={newLead.phone}
                    onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
                    placeholder="+998 90 123 45 67"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Manba</label>
                    <select 
                      value={newLead.source}
                      onChange={(e) => setNewLead({...newLead, source: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium appearance-none"
                    >
                      <option value="Telegram">Telegram</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Facebook">Facebook</option>
                      <option value="Tavsiya">Tavsiya</option>
                      <option value="Boshqa">Boshqa</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Status</label>
                    <select 
                      value={newLead.status}
                      onChange={(e) => setNewLead({...newLead, status: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium appearance-none"
                    >
                      <option value="Yangi">Yangi</option>
                      <option value="Jarayonda">Jarayonda</option>
                      <option value="Javob berilmagan">Javob berilmagan</option>
                      <option value="Sotuv">Sotuv</option>
                    </select>
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 gradient-bg text-white rounded-2xl font-bold shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Qo'shish
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
