import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical,
  Phone,
  Mail,
  MapPin,
  X,
  Trash2,
  Loader2
} from 'lucide-react';
import { db } from '../../firebase';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  addDoc, 
  deleteDoc,
  doc,
  serverTimestamp 
} from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../lib/firestore-utils';
import { toast } from 'sonner';

const ClientCard = ({ id, name, phone, email, address, status, color, onDelete }: any) => (
  <motion.div 
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
  >
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white text-xl font-black shadow-lg shadow-blue-500/20`}>
          {name.charAt(0)}
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-900">{name}</h3>
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
            status === 'Faol' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
          }`}>
            {status}
          </span>
        </div>
      </div>
      <button 
        onClick={onDelete}
        className="p-2 text-slate-300 hover:text-red-500 transition-colors"
      >
        <Trash2 size={18} />
      </button>
    </div>

    <div className="space-y-3">
      <div className="flex items-center gap-3 text-slate-500">
        <Phone size={14} className="text-slate-400" />
        <span className="text-xs font-bold">{phone}</span>
      </div>
      <div className="flex items-center gap-3 text-slate-50">
        <Mail size={14} className="text-slate-400" />
        <span className="text-xs font-bold text-slate-500">{email || 'Email yo\'q'}</span>
      </div>
      <div className="flex items-center gap-3 text-slate-50">
        <MapPin size={14} className="text-slate-400" />
        <span className="text-xs font-bold text-slate-500">{address}</span>
      </div>
    </div>

    <div className="mt-6 pt-6 border-t border-slate-50 flex gap-2">
      <button 
        onClick={() => toast.info(`${name} profili tez kunda...`)}
        className="flex-1 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all"
      >
        Profil
      </button>
      <button 
        onClick={() => window.open(`tel:${phone}`)}
        className="flex-1 py-2.5 gradient-bg text-white rounded-xl text-xs font-bold shadow-lg shadow-orange-500/20"
      >
        Bog'lanish
      </button>
    </div>
  </motion.div>
);

export default function ClientsView() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newClient, setNewClient] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    status: 'Faol'
  });

  useEffect(() => {
    const q = query(collection(db, 'clients'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const clientsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        color: doc.data().color || 'bg-blue-500'
      }));
      setClients(clientsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'clients');
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteClient = async (id: string) => {
    if (window.confirm("Ushbu mijozni o'chirib tashlamoqchimisiz?")) {
      try {
        await deleteDoc(doc(db, 'clients', id));
        toast.success("Mijoz o'chirildi");
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `clients/${id}`);
      }
    }
  };

  const [filterStatus, setFilterStatus] = useState('Barchasi');

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'Barchasi' || c.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const colors = ['bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-green-500', 'bg-pink-500'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      await addDoc(collection(db, 'clients'), {
        ...newClient,
        color: randomColor,
        createdAt: serverTimestamp()
      });
      
      setIsModalOpen(false);
      setNewClient({
        name: '',
        phone: '',
        email: '',
        address: '',
        status: 'Faol'
      });
      toast.success("Yangi mijoz qo'shildi");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'clients');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2 italic">Mijozlar</h1>
          <p className="text-slate-500 font-medium">Barcha mijozlar bazasi va ular bilan ishlash tarixi</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Mijoz qidirish..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none w-64 shadow-sm font-medium"
            />
          </div>
          <div className="relative group">
            <button 
              className={`p-3 bg-white border border-slate-100 rounded-2xl transition-all shadow-sm flex items-center gap-2 ${filterStatus !== 'Barchasi' ? 'text-orange-600 border-orange-200 bg-orange-50' : 'text-slate-400 hover:text-slate-900'}`}
            >
              <Filter size={20} />
              {filterStatus !== 'Barchasi' && <span className="text-xs font-bold">{filterStatus}</span>}
            </button>
            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              {['Barchasi', 'Faol', 'Nofaol'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors ${filterStatus === status ? 'text-orange-600 bg-orange-50' : 'text-slate-600'}`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 gradient-bg text-white rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-all"
          >
            <UserPlus size={18} />
            Yangi mijoz
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="animate-spin mb-4" size={40} />
          <p className="text-sm font-bold uppercase tracking-widest">Yuklanmoqda...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredClients.map((client) => (
                <ClientCard 
                  key={client.id} 
                  {...client} 
                  onDelete={() => handleDeleteClient(client.id)}
                />
              ))}
            </AnimatePresence>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 italic">Mijozlar jadvali</h3>
              <button className="text-sm font-bold text-orange-600 hover:underline">Barchasini ko'rish</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-slate-50 bg-slate-50/50">
                    <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Mijoz</th>
                    <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Telefon</th>
                    <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Loyiha</th>
                    <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredClients.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-slate-400 italic font-medium">Mijozlar topilmadi</td>
                    </tr>
                  ) : (
                    filteredClients.map((client) => (
                      <tr key={client.id} className="hover:bg-slate-50 transition-all group">
                        <td className="p-6">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl ${client.color} flex items-center justify-center text-white font-bold`}>
                              {client.name[0]}
                            </div>
                            <span className="font-bold text-slate-900">{client.name}</span>
                          </div>
                        </td>
                        <td className="p-6 text-sm font-medium text-slate-600">{client.phone}</td>
                        <td className="p-6 text-sm font-bold text-slate-900">Farg'ona City</td>
                        <td className="p-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                            client.status === 'Faol' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                          }`}>
                            {client.status}
                          </span>
                        </td>
                        <td className="p-6 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleDeleteClient(client.id)}
                              className="p-2 text-slate-300 hover:text-red-500 transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                            <button className="p-2 text-slate-300 hover:text-slate-900 transition-all">
                              <MoreVertical size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Client Modal */}
          <AnimatePresence>
            {isModalOpen && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsModalOpen(false)}
                  className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                >
                  <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-2xl font-black text-slate-900 italic">Yangi mijoz qo'shish</h3>
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <form onSubmit={handleAddClient} className="p-8 space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">F.I.SH</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Mijoz ismini kiriting"
                        value={newClient.name}
                        onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 font-medium"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Telefon</label>
                        <input 
                          required
                          type="tel" 
                          placeholder="+998 90 123 45 67"
                          value={newClient.phone}
                          onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Email (ixtiyoriy)</label>
                        <input 
                          type="email" 
                          placeholder="example@mail.com"
                          value={newClient.email}
                          onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 font-medium"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Manzil</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Mijoz manzili"
                        value={newClient.address}
                        onChange={(e) => setNewClient({...newClient, address: e.target.value})}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 font-medium"
                      />
                    </div>
                    
                    <button 
                      type="submit"
                      className="w-full py-4 gradient-bg text-white rounded-2xl font-bold shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                      <UserPlus size={20} />
                      Mijozni saqlash
                    </button>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
