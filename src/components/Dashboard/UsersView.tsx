import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UserCircle, 
  Shield, 
  Mail, 
  Phone,
  Search,
  Filter,
  MoreVertical,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  Lock,
  Unlock,
  Trash2,
  Edit2
} from 'lucide-react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../lib/firestore-utils';
import { toast } from 'sonner';

export default function UsersView() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Operator',
    status: 'Faol'
  });

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'users');
    });

    return () => unsubscribe();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'users'), {
        ...newUser,
        createdAt: serverTimestamp()
      });
      toast.success("Foydalanuvchi muvaffaqiyatli qo'shildi!");
      setShowAddModal(false);
      setNewUser({ name: '', email: '', phone: '', role: 'Operator', status: 'Faol' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'users');
      toast.error("Xatolik yuz berdi");
    }
  };

  const toggleStatus = async (user: any) => {
    const newStatus = user.status === 'Faol' ? 'Bloklangan' : 'Faol';
    try {
      await updateDoc(doc(db, 'users', user.id), { status: newStatus });
      toast.success(`Foydalanuvchi ${newStatus.toLowerCase()} holatiga o'tkazildi`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'users');
    }
  };

  const deleteUser = async (id: string) => {
    if (!window.confirm("Haqiqatan ham ushbu foydalanuvchini o'chirmoqchimisiz?")) return;
    try {
      await deleteDoc(doc(db, 'users', id));
      toast.success("Foydalanuvchi o'chirildi");
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'users');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Foydalanuvchilar</h1>
          <p className="text-slate-500">Tizim administratorlari va xodimlar ruxsatnomalari</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 gradient-bg text-white rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-orange-500/20"
        >
          <Plus size={18} />
          Yangi foydalanuvchi
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Foydalanuvchini qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium"
            />
          </div>
          <div className="flex gap-3">
            <button className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all">
              <Filter size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
          {loading ? (
            <div className="col-span-full py-12 text-center">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                <UserCircle className="mx-auto text-slate-200" size={48} />
              </motion.div>
            </div>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <motion.div 
                key={user.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 relative">
                    <UserCircle size={32} />
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white flex items-center justify-center ${
                      user.status === 'Faol' ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {user.status === 'Faol' ? <CheckCircle2 size={10} className="text-white" /> : <Lock size={10} className="text-white" />}
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => toggleStatus(user)} className="p-2 bg-slate-50 text-slate-400 hover:text-orange-500 rounded-lg transition-colors">
                      {user.status === 'Faol' ? <Lock size={16} /> : <Unlock size={16} />}
                    </button>
                    <button onClick={() => deleteUser(user.id)} className="p-2 bg-slate-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <h4 className="text-lg font-black text-slate-900 mb-1">{user.name}</h4>
                <div className="flex items-center gap-2 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md w-fit mb-4">
                  <Shield size={12} />
                  {user.role}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-500">
                    <Mail size={16} />
                    <span className="text-sm font-medium truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500">
                    <Phone size={16} />
                    <span className="text-sm font-medium">{user.phone}</span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-slate-400 italic">Foydalanuvchilar topilmadi</div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
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
                <h3 className="text-2xl font-black text-slate-900">Yangi foydalanuvchi</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleAddUser} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">To'liq ism</label>
                  <input 
                    required
                    type="text" 
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    placeholder="Masalan: Alisher Usmonov"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email manzili</label>
                  <input 
                    required
                    type="email" 
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    placeholder="example@iqub.uz"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Telefon</label>
                    <input 
                      required
                      type="tel" 
                      value={newUser.phone}
                      onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                      placeholder="+998 90 123 45 67"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Roli</label>
                    <select 
                      value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium appearance-none"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Menejer">Menejer</option>
                      <option value="Operator">Operator</option>
                      <option value="Buxgalter">Buxgalter</option>
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
