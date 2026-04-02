import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  UserPlus, 
  Briefcase, 
  Calendar, 
  MoreVertical,
  Phone,
  Mail,
  Star,
  Plus,
  X,
  Search,
  Filter,
  Loader2
} from 'lucide-react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../lib/firestore-utils';
import { toast } from 'sonner';

const StaffCard = ({ id, name, role, phone, email, performance, color, onDelete }: any) => (
  <motion.div 
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 relative group"
  >
    <button 
      onClick={() => onDelete(id)}
      className="absolute top-4 right-4 p-2 bg-red-50 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
    >
      <X size={16} />
    </button>
    <div className="flex items-center gap-4 mb-6">
      <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white text-xl font-black shadow-lg shadow-blue-500/20`}>
        {name.charAt(0)}
      </div>
      <div>
        <h3 className="text-lg font-black text-slate-900">{name}</h3>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{role}</p>
      </div>
    </div>

    <div className="space-y-3 mb-6">
      <div className="flex items-center gap-3 text-slate-500">
        <Phone size={14} className="text-slate-400" />
        <span className="text-xs font-bold">{phone}</span>
      </div>
      <div className="flex items-center gap-3 text-slate-50">
        <Mail size={14} className="text-slate-400" />
        <span className="text-xs font-bold text-slate-500">{email}</span>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-slate-50">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">KPI</span>
        <div className="flex items-center gap-1 text-orange-500">
          <Star size={12} fill="currentColor" />
          <span className="text-xs font-black">{performance}%</span>
        </div>
      </div>
    </div>

    <div className="flex gap-2">
      <button className="flex-1 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all">
        Profil
      </button>
      <button className="flex-1 py-2.5 gradient-bg text-white rounded-xl text-xs font-bold shadow-lg shadow-orange-500/20">
        Bog'lanish
      </button>
    </div>
  </motion.div>
);

export default function StaffView() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('Barchasi');
  const [newStaff, setNewStaff] = useState({
    name: '',
    role: 'Menejer',
    phone: '',
    email: '',
    performance: 100,
    color: 'bg-blue-500'
  });

  useEffect(() => {
    const q = query(collection(db, 'staff'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const staffData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        color: doc.data().color || 'bg-blue-500'
      }));
      setStaff(staffData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'staff');
    });

    return () => unsubscribe();
  }, []);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'staff'), {
        ...newStaff,
        createdAt: serverTimestamp()
      });
      toast.success('Xodim muvaffaqiyatli qo\'shildi');
      setShowAddModal(false);
      setNewStaff({ name: '', role: 'Menejer', phone: '', email: '', performance: 100, color: 'bg-blue-500' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'staff');
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (window.confirm('Haqiqatan ham ushbu xodimni o\'chirmoqchimisiz?')) {
      try {
        await deleteDoc(doc(db, 'staff', id));
        toast.success('Xodim o\'chirildi');
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'staff');
      }
    }
  };

  const filteredStaff = staff.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         s.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'Barchasi' || s.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Xodimlar</h1>
          <p className="text-slate-500">Kompaniya xodimlari va ularning ish faoliyati nazorati</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold flex items-center gap-2 text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            <Calendar size={18} />
            Davomat
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 gradient-bg text-white rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-orange-500/20"
          >
            <UserPlus size={18} />
            Yangi xodim
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Xodimlarni qidirish..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium shadow-sm"
          />
        </div>
        <div className="relative group">
          <button 
            className={`px-6 py-4 bg-white border rounded-2xl font-bold flex items-center gap-2 transition-all shadow-sm ${filterRole !== 'Barchasi' ? 'text-orange-600 border-orange-200 bg-orange-50' : 'text-slate-600 border-slate-100 hover:bg-slate-50'}`}
          >
            <Filter size={18} />
            Lavozim {filterRole !== 'Barchasi' && `: ${filterRole}`}
          </button>
          <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            {['Barchasi', 'Menejer', 'Sotuvchi', 'Muhandis', 'Dizayner'].map((role) => (
              <button
                key={role}
                onClick={() => setFilterRole(role)}
                className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors ${filterRole === role ? 'text-orange-600 bg-orange-50' : 'text-slate-600'}`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="col-span-full p-12 flex justify-center">
              <Loader2 className="animate-spin text-slate-300" size={32} />
            </div>
          ) : filteredStaff.length > 0 ? (
            filteredStaff.map((s) => (
              <StaffCard key={s.id} {...s} onDelete={handleDeleteStaff} />
            ))
          ) : (
            <div className="col-span-full p-12 text-center text-slate-400 italic">Xodimlar topilmadi</div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-900">Xodimlar ro'yxati</h3>
          <div className="flex gap-2">
            <button className="p-2 text-slate-400 hover:text-slate-900 transition-all">
              <Briefcase size={20} />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-900 transition-all">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-slate-50">
                <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Xodim</th>
                <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Lavozim</th>
                <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Telefon</th>
                <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider">KPI</th>
                <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStaff.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-all group">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center text-white font-bold`}>
                        {s.name[0]}
                      </div>
                      <span className="font-bold text-slate-900">{s.name}</span>
                    </div>
                  </td>
                  <td className="p-6 text-sm font-medium text-slate-600">{s.role}</td>
                  <td className="p-6 text-sm font-medium text-slate-500">{s.phone}</td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-50 rounded-full overflow-hidden w-24">
                        <div 
                          className="h-full bg-orange-500 rounded-full" 
                          style={{ width: `${s.performance}%` }}
                        />
                      </div>
                      <span className="text-xs font-black text-slate-900">{s.performance}%</span>
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <button 
                      onClick={() => handleDeleteStaff(s.id)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-all"
                    >
                      <X size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
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
                <h3 className="text-2xl font-black text-slate-900">Yangi xodim</h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleAddStaff} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">F.I.SH</label>
                  <input 
                    required
                    type="text" 
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                    placeholder="Masalan: Anvar Karimov"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Lavozim</label>
                    <select 
                      value={newStaff.role}
                      onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium appearance-none"
                    >
                      <option value="Menejer">Menejer</option>
                      <option value="Sotuvchi">Sotuvchi</option>
                      <option value="Muhandis">Muhandis</option>
                      <option value="Dizayner">Dizayner</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Telefon</label>
                    <input 
                      required
                      type="tel" 
                      value={newStaff.phone}
                      onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
                      placeholder="+998"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                  <input 
                    required
                    type="email" 
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                    placeholder="example@mail.com"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium"
                  />
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
