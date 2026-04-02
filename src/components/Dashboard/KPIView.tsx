import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Award, 
  ChevronRight,
  MoreVertical,
  Star,
  X,
  Trophy,
  Zap,
  Users,
  Calendar
} from 'lucide-react';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { toast } from 'sonner';

export default function KPIView() {
  const [staff, setStaff] = useState<any[]>([]);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);

  useEffect(() => {
    const q = query(collection(db, 'staff'), orderBy('performance', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const staffData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStaff(staffData);
    });

    return () => unsubscribe();
  }, []);

  const radarData = [
    { subject: 'Sotuv', A: 120, B: 110, fullMark: 150 },
    { subject: 'Mijozlar', A: 98, B: 130, fullMark: 150 },
    { subject: 'Hujjatlar', A: 86, B: 130, fullMark: 150 },
    { subject: 'Intizom', A: 99, B: 100, fullMark: 150 },
    { subject: 'KPI', A: 85, B: 90, fullMark: 150 },
    { subject: 'Loyihalar', A: 65, B: 85, fullMark: 150 },
  ];

  const barData = staff.map(s => ({
    name: s.name,
    kpi: s.performance || 0,
    role: s.role
  }));

  const averageKPI = staff.length > 0 
    ? (staff.reduce((acc, s) => acc + (s.performance || 0), 0) / staff.length).toFixed(1)
    : 0;

  const handleReward = (staffMember: any) => {
    toast.success(`${staffMember.name} muvaffaqiyatli mukofotlandi!`);
    setShowRewardModal(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">KPI va Samaradorlik</h1>
          <p className="text-slate-500">Xodimlar va bo'limlar ish faoliyati tahlili</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowCompareModal(true)}
            className="px-6 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold flex items-center gap-2 text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
          >
            <BarChart3 size={18} />
            Taqqoslash
          </button>
          <button 
            onClick={() => setShowRewardModal(true)}
            className="px-6 py-3 gradient-bg text-white rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-orange-500/20"
          >
            <Award size={18} />
            Mukofotlash
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Radar Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-slate-900">Umumiy samaradorlik</h3>
            <div className="flex items-center gap-2 text-orange-500 bg-orange-50 px-3 py-1 rounded-full text-xs font-bold">
              <Star size={14} fill="currentColor" />
              {averageKPI}%
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#F1F5F9" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Radar
                  name="Joriy oy"
                  dataKey="A"
                  stroke="#F29900"
                  fill="#F29900"
                  fillOpacity={0.6}
                />
                <Radar
                  name="O'tgan oy"
                  dataKey="B"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.3}
                />
                <Legend />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-slate-900">Xodimlar bo'yicha KPI</h3>
            <button className="p-2 text-slate-400 hover:text-slate-900 transition-all">
              <MoreVertical size={20} />
            </button>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#475569', fontSize: 12, fontWeight: 'bold' }} 
                />
                <Tooltip 
                  cursor={{ fill: '#F8FAFC' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="kpi" fill="#F29900" radius={[0, 6, 6, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-900">Eng yaxshi natijalar</h3>
          <button className="text-sm font-bold text-orange-600 hover:underline">Barchasini ko'rish</button>
        </div>
        <div className="divide-y divide-slate-50">
          {barData.length > 0 ? (
            barData.map((item, i) => (
              <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-all group">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                    i === 0 ? 'bg-yellow-100 text-yellow-600' : 
                    i === 1 ? 'bg-slate-100 text-slate-600' : 
                    i === 2 ? 'bg-orange-100 text-orange-600' : 
                    'bg-slate-50 text-slate-400'
                  }`}>
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{item.name}</h4>
                    <p className="text-xs text-slate-400 font-medium">{item.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">{item.kpi}%</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Samaradorlik</p>
                  </div>
                  <button className="p-2 text-slate-400 hover:text-slate-900 transition-all">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-slate-400 italic">Ma'lumotlar mavjud emas</div>
          )}
        </div>
      </div>

      {/* Reward Modal */}
      <AnimatePresence>
        {showRewardModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRewardModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-900">Xodimni mukofotlash</h3>
                <button onClick={() => setShowRewardModal(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Xodimni tanlang</label>
                  <select 
                    onChange={(e) => setSelectedStaff(staff.find(s => s.id === e.target.value))}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium appearance-none"
                  >
                    <option value="">Tanlang...</option>
                    {staff.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Mukofot turi</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="p-4 bg-orange-50 border border-orange-100 rounded-2xl text-orange-600 font-bold flex flex-col items-center gap-2">
                      <Zap size={24} />
                      Pul mukofoti
                    </button>
                    <button className="p-4 bg-blue-50 border border-blue-100 rounded-2xl text-blue-600 font-bold flex flex-col items-center gap-2">
                      <Trophy size={24} />
                      Faxriy yorliq
                    </button>
                  </div>
                </div>
                <button 
                  onClick={() => selectedStaff && handleReward(selectedStaff)}
                  disabled={!selectedStaff}
                  className="w-full py-4 gradient-bg text-white rounded-2xl font-bold shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                  Mukofotlash
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Compare Modal */}
      <AnimatePresence>
        {showCompareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCompareModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-900">KPI Taqqoslash</h3>
                <button onClick={() => setShowCompareModal(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Users size={18} className="text-blue-500" />
                      Bo'limlar bo'yicha
                    </h4>
                    <div className="space-y-4">
                      {[
                        { name: 'Sotuv', value: 85, color: 'bg-blue-500' },
                        { name: 'Marketing', value: 72, color: 'bg-purple-500' },
                        { name: 'Moliya', value: 94, color: 'bg-green-500' },
                      ].map((dept, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between text-xs font-bold text-slate-600">
                            <span>{dept.name}</span>
                            <span>{dept.value}%</span>
                          </div>
                          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${dept.value}%` }}
                              className={`h-full ${dept.color}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Calendar size={18} className="text-orange-500" />
                      Oylar bo'yicha
                    </h4>
                    <div className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { month: 'Yan', val: 65 },
                          { month: 'Fev', val: 78 },
                          { month: 'Mar', val: 82 },
                          { month: 'Apr', val: 90 },
                        ]}>
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                          <Bar dataKey="val" fill="#F29900" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

