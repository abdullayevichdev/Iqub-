import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Contact, 
  Phone, 
  Mail, 
  MapPin,
  Search,
  Filter,
  Plus,
  X,
  MoreVertical,
  MessageSquare,
  Globe,
  Briefcase,
  Trash2,
  Edit2,
  ExternalLink
} from 'lucide-react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../lib/firestore-utils';
import { toast } from 'sonner';

export default function ContactsView() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    company: '',
    position: '',
    phone: '',
    email: '',
    address: '',
    type: 'Hamkor'
  });

  useEffect(() => {
    const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setContacts(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'contacts');
    });

    return () => unsubscribe();
  }, []);

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'contacts'), {
        ...newContact,
        createdAt: serverTimestamp()
      });
      toast.success("Kontakt muvaffaqiyatli qo'shildi!");
      setShowAddModal(false);
      setNewContact({ name: '', company: '', position: '', phone: '', email: '', address: '', type: 'Hamkor' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'contacts');
      toast.error("Xatolik yuz berdi");
    }
  };

  const deleteContact = async (id: string) => {
    if (!window.confirm("Haqiqatan ham ushbu kontaktni o'chirmoqchimisiz?")) return;
    try {
      await deleteDoc(doc(db, 'contacts', id));
      toast.success("Kontakt o'chirildi");
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'contacts');
    }
  };

  const filteredContacts = contacts.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Kontaktlar</h1>
          <p className="text-slate-500">Hamkorlar, pudratchilar va yetkazib beruvchilar bazasi</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 gradient-bg text-white rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-orange-500/20"
        >
          <Plus size={18} />
          Yangi kontakt
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Kontaktni qidirish..."
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

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Kontakt</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Kompaniya</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Telefon</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Email</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Tur</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                      <Contact className="mx-auto text-slate-200" size={32} />
                    </motion.div>
                  </td>
                </tr>
              ) : filteredContacts.length > 0 ? (
                filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center font-bold">
                          {contact.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{contact.name}</p>
                          <p className="text-xs text-slate-400 font-medium">{contact.position}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <Briefcase size={14} className="text-slate-400" />
                        {contact.company}
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-blue-600 font-bold hover:underline">
                        <Phone size={14} />
                        {contact.phone}
                      </a>
                    </td>
                    <td className="px-8 py-4 font-medium text-slate-600">{contact.email}</td>
                    <td className="px-8 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        contact.type === 'Hamkor' ? 'bg-blue-100 text-blue-600' : 
                        contact.type === 'Pudratchi' ? 'bg-purple-100 text-purple-600' : 
                        'bg-orange-100 text-orange-600'
                      }`}>
                        {contact.type}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 transition-all">
                          <MessageSquare size={18} />
                        </button>
                        <button onClick={() => deleteContact(contact.id)} className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-slate-400 italic">Kontaktlar topilmadi</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Contact Modal */}
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
              className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-900">Yangi kontakt</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleAddContact} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">To'liq ism</label>
                  <input 
                    required
                    type="text" 
                    value={newContact.name}
                    onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                    placeholder="Masalan: Azizbek Rahimov"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Kompaniya</label>
                  <input 
                    required
                    type="text" 
                    value={newContact.company}
                    onChange={(e) => setNewContact({...newContact, company: e.target.value})}
                    placeholder="Kompaniya nomi"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Lavozim</label>
                  <input 
                    type="text" 
                    value={newContact.position}
                    onChange={(e) => setNewContact({...newContact, position: e.target.value})}
                    placeholder="Masalan: Direktor"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Telefon</label>
                  <input 
                    required
                    type="tel" 
                    value={newContact.phone}
                    onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                    placeholder="+998 90 123 45 67"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                  <input 
                    type="email" 
                    value={newContact.email}
                    onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                    placeholder="example@company.com"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Turi</label>
                  <select 
                    value={newContact.type}
                    onChange={(e) => setNewContact({...newContact, type: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium appearance-none"
                  >
                    <option value="Hamkor">Hamkor</option>
                    <option value="Pudratchi">Pudratchi</option>
                    <option value="Yetkazib beruvchi">Yetkazib beruvchi</option>
                    <option value="Mijoz">Mijoz</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Manzil</label>
                  <input 
                    type="text" 
                    value={newContact.address}
                    onChange={(e) => setNewContact({...newContact, address: e.target.value})}
                    placeholder="Toshkent sh., Yunusobod tumani..."
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium"
                  />
                </div>
                <div className="md:col-span-2 pt-4">
                  <button 
                    type="submit"
                    className="w-full py-4 gradient-bg text-white rounded-2xl font-bold shadow-lg shadow-orange-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
                  >
                    Kontaktni saqlash
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
