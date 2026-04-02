import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wallet, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Search,
  Filter,
  MoreVertical,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  X,
  CreditCard,
  Banknote
} from 'lucide-react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../lib/firestore-utils';
import { toast } from 'sonner';

const StatCard = ({ title, value, change, isPositive, icon: Icon, color }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg`}>
        <Icon size={24} />
      </div>
      <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${
        isPositive ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'
      }`}>
        {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
        {change}
      </div>
    </div>
    <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</h3>
    <p className="text-2xl font-black text-slate-900">{value}</p>
  </motion.div>
);

export default function SalariesView() {
  const [salaries, setSalaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSalary, setNewSalary] = useState({
    staffName: '',
    amount: '',
    month: 'Aprel',
    status: 'To\'langan',
    bonus: '0'
  });

  useEffect(() => {
    const q = query(collection(db, 'salaries'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate ? doc.data().date.toDate().toLocaleDateString() : 'Hozir'
      }));
      setSalaries(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'salaries');
    });

    return () => unsubscribe();
  }, []);

  const handleAddSalary = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'salaries'), {
        ...newSalary,
        amount: Number(newSalary.amount),
        bonus: Number(newSalary.bonus),
        date: serverTimestamp()
      });
      toast.success("Maosh muvaffaqiyatli qo'shildi!");
      setShowAddModal(false);
      setNewSalary({ staffName: '', amount: '', month: 'Aprel', status: 'To\'langan', bonus: '0' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'salaries');
      toast.error("Xatolik yuz berdi");
    }
  };

  const filteredSalaries = salaries.filter(s => 
    s.staffName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPaid = salaries.reduce((acc, s) => acc + (s.status === 'To\'langan' ? s.amount : 0), 0);
  const totalPending = salaries.reduce((acc, s) => acc + (s.status === 'Kutilmoqda' ? s.amount : 0), 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Maoshlar</h1>
          <p className="text-slate-500">Xodimlar ish haqi va bonuslar boshqaruvi</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 gradient-bg text-white rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-orange-500/20"
        >
          <Plus size={18} />
          Maosh qo'shish
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Jami to'langan" 
          value={`${(totalPaid / 1000000).toFixed(1)} mln`} 
          change="+12.5%" 
          isPositive={true}
          icon={Wallet} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Kutilayotgan" 
          value={`${(totalPending / 1000000).toFixed(1)} mln`} 
          change="-2.4%" 
          isPositive={false}
          icon={Clock} 
          color="bg-orange-500" 
        />
        <StatCard 
          title="O'rtacha maosh" 
          value="8.5 mln" 
          change="+5.2%" 
          isPositive={true}
          icon={TrendingUp} 
          color="bg-green-500" 
        />
        <StatCard 
          title="Bonuslar jami" 
          value="45 mln" 
          change="+18.2%" 
          isPositive={true}
          icon={Banknote} 
          color="bg-purple-500" 
        />
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Xodim ismini qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium"
            />
          </div>
          <div className="flex gap-3">
            <button className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all">
              <Filter size={20} />
            </button>
            <button className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all">
              <Download size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Xodim</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Oy</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Summa</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Bonus</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Holat</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Sana</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-8 py-12 text-center">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                      <Clock className="mx-auto text-slate-300" size={32} />
                    </motion.div>
                  </td>
                </tr>
              ) : filteredSalaries.length > 0 ? (
                filteredSalaries.map((salary) => (
                  <tr key={salary.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                          {salary.staffName?.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-900">{salary.staffName}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4 font-medium text-slate-600">{salary.month}</td>
                    <td className="px-8 py-4 font-black text-slate-900">{salary.amount?.toLocaleString()} so'm</td>
                    <td className="px-8 py-4 font-bold text-green-600">+{salary.bonus?.toLocaleString()} so'm</td>
                    <td className="px-8 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-fit ${
                        salary.status === 'To\'langan' ? 'bg-green-100 text-green-600' : 
                        salary.status === 'Kutilmoqda' ? 'bg-orange-100 text-orange-600' : 
                        'bg-red-100 text-red-600'
                      }`}>
                        {salary.status === 'To\'langan' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                        {salary.status}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-sm text-slate-400 font-medium">{salary.date}</td>
                    <td className="px-8 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-slate-900 transition-all">
                        <MoreVertical size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-8 py-12 text-center text-slate-400 italic">Ma'lumotlar mavjud emas</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Salary Modal */}
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
                <h3 className="text-2xl font-black text-slate-900">Maosh qo'shish</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleAddSalary} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Xodim ismi</label>
                  <input 
                    required
                    type="text" 
                    value={newSalary.staffName}
                    onChange={(e) => setNewSalary({...newSalary, staffName: e.target.value})}
                    placeholder="Xodimning to'liq ismi"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Summa</label>
                    <input 
                      required
                      type="number" 
                      value={newSalary.amount}
                      onChange={(e) => setNewSalary({...newSalary, amount: e.target.value})}
                      placeholder="8 000 000"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Bonus</label>
                    <input 
                      type="number" 
                      value={newSalary.bonus}
                      onChange={(e) => setNewSalary({...newSalary, bonus: e.target.value})}
                      placeholder="500 000"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Oy</label>
                    <select 
                      value={newSalary.month}
                      onChange={(e) => setNewSalary({...newSalary, month: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium appearance-none"
                    >
                      <option value="Yanvar">Yanvar</option>
                      <option value="Fevral">Fevral</option>
                      <option value="Mart">Mart</option>
                      <option value="Aprel">Aprel</option>
                      <option value="May">May</option>
                      <option value="Iyun">Iyun</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Holat</label>
                    <select 
                      value={newSalary.status}
                      onChange={(e) => setNewSalary({...newSalary, status: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium appearance-none"
                    >
                      <option value="To'langan">To'langan</option>
                      <option value="Kutilmoqda">Kutilmoqda</option>
                      <option value="Bekor qilindi">Bekor qilindi</option>
                    </select>
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 gradient-bg text-white rounded-2xl font-bold shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Saqlash
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
