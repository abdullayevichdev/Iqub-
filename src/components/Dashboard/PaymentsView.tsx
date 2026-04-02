import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Filter, 
  MoreVertical,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Plus,
  X,
  Loader2,
  Trash2
} from 'lucide-react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../lib/firestore-utils';
import { toast } from 'sonner';

const PaymentCard = ({ title, amount, change, icon: Icon, color }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg`}>
        <Icon size={24} />
      </div>
      <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${
        change.startsWith('+') ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'
      }`}>
        {change.startsWith('+') ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {change}
      </div>
    </div>
    <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</h3>
    <p className="text-2xl font-black text-slate-900">{amount}</p>
  </motion.div>
);

export default function PaymentsView() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Barchasi');
  const [newPayment, setNewPayment] = useState({
    name: '',
    project: 'Samo',
    amount: '',
    type: 'income',
    status: 'Tasdiqlandi'
  });

  useEffect(() => {
    const q = query(collection(db, 'payments'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const paymentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate ? doc.data().date.toDate().toLocaleDateString() : doc.data().date
      }));
      setTransactions(paymentsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'payments');
    });

    return () => unsubscribe();
  }, []);

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'payments'), {
        ...newPayment,
        amount: Number(newPayment.amount),
        date: serverTimestamp()
      });
      toast.success('To\'lov muvaffaqiyatli saqlandi');
      setShowAddModal(false);
      setNewPayment({ name: '', project: 'Samo', amount: '', type: 'income', status: 'Tasdiqlandi' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'payments');
    }
  };

  const handleDeletePayment = async (id: string) => {
    if (window.confirm('Haqiqatan ham ushbu tranzaksiyani o\'chirmoqchimisiz?')) {
      try {
        await deleteDoc(doc(db, 'payments', id));
        toast.success('Tranzaksiya o\'chirildi');
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'payments');
      }
    }
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.project.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'Barchasi' || 
                       (filterType === 'Kirim' && t.type === 'income') ||
                       (filterType === 'Chiqim' && t.type === 'expense');
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">To'lovlar</h1>
          <p className="text-slate-500">Moliya, kirim va chiqim operatsiyalari nazorati</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold flex items-center gap-2 text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            <Calendar size={18} />
            Sana tanlash
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 gradient-bg text-white rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-orange-500/20"
          >
            <Plus size={18} />
            Yangi to'lov
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <PaymentCard 
          title="Umumiy balans" 
          amount="2.4 mlrd so'm" 
          change="+15%" 
          icon={CreditCard} 
          color="bg-blue-500" 
        />
        <PaymentCard 
          title="Bugungi kirim" 
          amount="75 mln so'm" 
          change="+8%" 
          icon={ArrowDownLeft} 
          color="bg-green-500" 
        />
        <PaymentCard 
          title="Bugungi chiqim" 
          amount="32 mln so'm" 
          change="-5%" 
          icon={ArrowUpRight} 
          color="bg-red-500" 
        />
        <PaymentCard 
          title="Kutilayotgan to'lovlar" 
          amount="120 mln so'm" 
          change="+2%" 
          icon={Calendar} 
          color="bg-orange-500" 
        />
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-xl font-black text-slate-900">Oxirgi tranzaksiyalar</h3>
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Qidirish..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none w-full md:w-64 transition-all"
              />
            </div>
            <div className="relative group">
              <button 
                className={`px-4 py-2 bg-slate-50 border rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${filterType !== 'Barchasi' ? 'text-orange-600 border-orange-200' : 'text-slate-600 border-slate-100'}`}
              >
                <Filter size={18} />
                {filterType}
              </button>
              <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {['Barchasi', 'Kirim', 'Chiqim'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 transition-colors ${filterType === type ? 'text-orange-600 bg-orange-50' : 'text-slate-600'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-slate-50">
                <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Tranzaksiya</th>
                <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Loyiha</th>
                <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Sana</th>
                <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Summa</th>
                <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <Loader2 className="animate-spin text-slate-300 mx-auto" size={32} />
                  </td>
                </tr>
              ) : filteredTransactions.length > 0 ? (
                <AnimatePresence mode="popLayout">
                  {filteredTransactions.map((t) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={t.id} 
                      className="hover:bg-slate-50 transition-all group"
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            t.type === 'income' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'
                          }`}>
                            {t.type === 'income' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{t.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                              {t.type === 'income' ? 'Kirim' : 'Chiqim'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 text-sm font-bold text-slate-900">{t.project}</td>
                      <td className="p-6 text-sm font-medium text-slate-500">{t.date}</td>
                      <td className={`p-6 text-sm font-black ${
                        t.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {t.type === 'income' ? '+' : '-'}{Number(t.amount).toLocaleString()} so'm
                      </td>
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                          t.status === 'Tasdiqlandi' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <button 
                          onClick={() => handleDeletePayment(t.id)}
                          className="p-2 text-slate-400 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400 italic">Tranzaksiyalar topilmadi</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Payment Modal */}
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
                <h3 className="text-2xl font-black text-slate-900">Yangi to'lov</h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleAddPayment} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">To'lov nomi</label>
                  <input 
                    required
                    type="text" 
                    value={newPayment.name}
                    onChange={(e) => setNewPayment({...newPayment, name: e.target.value})}
                    placeholder="Masalan: G'isht uchun to'lov"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Summa</label>
                    <input 
                      required
                      type="number" 
                      value={newPayment.amount}
                      onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
                      placeholder="0"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Turi</label>
                    <select 
                      value={newPayment.type}
                      onChange={(e) => setNewPayment({...newPayment, type: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium appearance-none"
                    >
                      <option value="income">Kirim</option>
                      <option value="expense">Chiqim</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Loyiha</label>
                  <select 
                    value={newPayment.project}
                    onChange={(e) => setNewPayment({...newPayment, project: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium appearance-none"
                  >
                    <option value="Samo">Samo</option>
                    <option value="Farg'ona City">Farg'ona City</option>
                    <option value="Registon Plaza">Registon Plaza</option>
                  </select>
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
