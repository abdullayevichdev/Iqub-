import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Percent, 
  Tag, 
  Calendar, 
  Clock,
  Search,
  Filter,
  Plus,
  X,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Edit2,
  Gift,
  Copy,
  Zap
} from 'lucide-react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../lib/firestore-utils';
import { toast } from 'sonner';

export default function DiscountsView() {
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDiscount, setNewDiscount] = useState({
    code: '',
    description: '',
    value: '',
    type: 'Foiz',
    startDate: '',
    endDate: '',
    status: 'Faol'
  });

  useEffect(() => {
    const q = query(collection(db, 'discounts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDiscounts(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'discounts');
    });

    return () => unsubscribe();
  }, []);

  const handleAddDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'discounts'), {
        ...newDiscount,
        createdAt: serverTimestamp()
      });
      toast.success("Chegirma muvaffaqiyatli qo'shildi!");
      setShowAddModal(false);
      setNewDiscount({ code: '', description: '', value: '', type: 'Foiz', startDate: '', endDate: '', status: 'Faol' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'discounts');
      toast.error("Xatolik yuz berdi");
    }
  };

  const deleteDiscount = async (id: string) => {
    if (!window.confirm("Haqiqatan ham ushbu chegirmani o'chirmoqchimisiz?")) return;
    try {
      await deleteDoc(doc(db, 'discounts', id));
      toast.success("Chegirma o'chirildi");
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'discounts');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Promokod nusxalandi!");
  };

  const filteredDiscounts = discounts.filter(d => 
    d.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Chegirmalar</h1>
          <p className="text-slate-500">Promokodlar va maxsus takliflar boshqaruvi</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 gradient-bg text-white rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-orange-500/20"
        >
          <Plus size={18} />
          Yangi chegirma
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
              <Percent className="mx-auto text-slate-200" size={48} />
            </motion.div>
          </div>
        ) : filteredDiscounts.length > 0 ? (
          filteredDiscounts.map((discount) => (
            <motion.div 
              key={discount.id}
              layout
              className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all"
            >
              <div className="p-6 bg-slate-50/50 border-b border-slate-50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-lg">
                    <Tag size={20} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900">{discount.code}</h4>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      discount.status === 'Faol' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {discount.status}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => copyToClipboard(discount.code)}
                  className="p-2 hover:bg-white rounded-lg transition-colors text-slate-400 hover:text-orange-500"
                >
                  <Copy size={18} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Chegirma miqdori</p>
                    <p className="text-3xl font-black text-slate-900">
                      {discount.value}{discount.type === 'Foiz' ? '%' : ' so\'m'}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
                    <Zap size={24} />
                  </div>
                </div>
                <p className="text-sm text-slate-500 font-medium line-clamp-2 min-h-[40px]">
                  {discount.description}
                </p>
                <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-slate-400">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {discount.startDate} - {discount.endDate}
                  </div>
                  <button onClick={() => deleteDiscount(discount.id)} className="text-red-400 hover:text-red-600 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-400 italic">Chegirmalar topilmadi</div>
        )}
      </div>

      {/* Add Discount Modal */}
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
                <h3 className="text-2xl font-black text-slate-900">Yangi chegirma</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleAddDiscount} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Promokod</label>
                    <input 
                      required
                      type="text" 
                      value={newDiscount.code}
                      onChange={(e) => setNewDiscount({...newDiscount, code: e.target.value.toUpperCase()})}
                      placeholder="SUMMER2024"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-black"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Miqdori</label>
                    <div className="relative">
                      <input 
                        required
                        type="number" 
                        value={newDiscount.value}
                        onChange={(e) => setNewDiscount({...newDiscount, value: e.target.value})}
                        placeholder="10"
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-black"
                      />
                      <select 
                        value={newDiscount.type}
                        onChange={(e) => setNewDiscount({...newDiscount, type: e.target.value})}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent font-bold text-orange-500 outline-none"
                      >
                        <option value="Foiz">%</option>
                        <option value="Summa">UZS</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Tavsif</label>
                  <textarea 
                    required
                    value={newDiscount.description}
                    onChange={(e) => setNewDiscount({...newDiscount, description: e.target.value})}
                    placeholder="Chegirma haqida ma'lumot..."
                    rows={3}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Boshlanish sanasi</label>
                    <input 
                      required
                      type="date" 
                      value={newDiscount.startDate}
                      onChange={(e) => setNewDiscount({...newDiscount, startDate: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Tugash sanasi</label>
                    <input 
                      required
                      type="date" 
                      value={newDiscount.endDate}
                      onChange={(e) => setNewDiscount({...newDiscount, endDate: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium"
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 gradient-bg text-white rounded-2xl font-bold shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Chegirmani saqlash
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
