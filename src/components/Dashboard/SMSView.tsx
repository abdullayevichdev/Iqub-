import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  MessageSquare, 
  Users, 
  History,
  Search,
  Filter,
  Plus,
  X,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  Smartphone,
  Zap,
  BarChart3
} from 'lucide-react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../lib/firestore-utils';
import { toast } from 'sonner';

export default function SMSView() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMessage, setNewMessage] = useState({
    recipient: 'Barcha mijozlar',
    content: '',
    type: 'Marketing',
    status: 'Yuborildi'
  });

  useEffect(() => {
    const q = query(collection(db, 'sms_history'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toLocaleString() : 'Hozir'
      }));
      setMessages(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'sms_history');
    });

    return () => unsubscribe();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'sms_history'), {
        ...newMessage,
        createdAt: serverTimestamp()
      });
      toast.success("Xabar muvaffaqiyatli yuborildi!");
      setShowAddModal(false);
      setNewMessage({ recipient: 'Barcha mijozlar', content: '', type: 'Marketing', status: 'Yuborildi' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'sms_history');
      toast.error("Xatolik yuz berdi");
    }
  };

  const deleteMessage = async (id: string) => {
    if (!window.confirm("Haqiqatan ham ushbu xabarni o'chirmoqchimisiz?")) return;
    try {
      await deleteDoc(doc(db, 'sms_history', id));
      toast.success("Xabar o'chirildi");
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'sms_history');
    }
  };

  const filteredMessages = messages.filter(m => 
    m.recipient?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">SMS Xabarnoma</h1>
          <p className="text-slate-500">Mijozlarga xabarlar va marketing kampaniyalari</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 gradient-bg text-white rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-orange-500/20"
        >
          <Send size={18} />
          Yangi xabar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-lg mb-4">
            <MessageSquare size={24} />
          </div>
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Jami xabarlar</h3>
          <p className="text-2xl font-black text-slate-900">{messages.length} ta</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-green-500 text-white flex items-center justify-center shadow-lg mb-4">
            <CheckCircle2 size={24} />
          </div>
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Yetkazildi</h3>
          <p className="text-2xl font-black text-slate-900">98.2%</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg mb-4">
            <Zap size={24} />
          </div>
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Balans</h3>
          <p className="text-2xl font-black text-slate-900">450 000 so'm</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Xabarlarni qidirish..."
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

        <div className="divide-y divide-slate-50">
          {loading ? (
            <div className="p-12 text-center">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                <Smartphone className="mx-auto text-slate-200" size={32} />
              </motion.div>
            </div>
          ) : filteredMessages.length > 0 ? (
            filteredMessages.map((msg) => (
              <div key={msg.id} className="p-6 flex items-start justify-between hover:bg-slate-50 transition-all group">
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    msg.type === 'Marketing' ? 'bg-purple-50 text-purple-500' : 
                    msg.type === 'Xabarnoma' ? 'bg-blue-50 text-blue-500' : 
                    'bg-orange-50 text-orange-500'
                  }`}>
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-bold text-slate-900">{msg.recipient}</h4>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-black rounded-md uppercase tracking-widest">
                        {msg.type}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 font-medium mb-2 max-w-2xl">{msg.content}</p>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {msg.date}
                      </span>
                      <span className="flex items-center gap-1 text-green-500">
                        <CheckCircle2 size={12} />
                        {msg.status}
                      </span>
                    </div>
                  </div>
                </div>
                <button onClick={() => deleteMessage(msg.id)} className="p-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-slate-400 italic">Xabarlar topilmadi</div>
          )}
        </div>
      </div>

      {/* Add SMS Modal */}
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
                <h3 className="text-2xl font-black text-slate-900">Yangi xabar</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleSendMessage} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Qabul qiluvchi</label>
                  <select 
                    value={newMessage.recipient}
                    onChange={(e) => setNewMessage({...newMessage, recipient: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium appearance-none"
                  >
                    <option value="Barcha mijozlar">Barcha mijozlar</option>
                    <option value="Faol mijozlar">Faol mijozlar</option>
                    <option value="Qarzdorlar">Qarzdorlar</option>
                    <option value="Xodimlar">Xodimlar</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Xabar turi</label>
                  <select 
                    value={newMessage.type}
                    onChange={(e) => setNewMessage({...newMessage, type: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium appearance-none"
                  >
                    <option value="Marketing">Marketing</option>
                    <option value="Xabarnoma">Xabarnoma</option>
                    <option value="Tizim">Tizim</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Xabar matni</label>
                  <textarea 
                    required
                    value={newMessage.content}
                    onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                    placeholder="Xabar matnini kiriting..."
                    rows={5}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium resize-none"
                  />
                  <div className="flex justify-between px-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {newMessage.content.length} belgi
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {Math.ceil(newMessage.content.length / 160)} SMS
                    </span>
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 gradient-bg text-white rounded-2xl font-bold shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  Xabarni yuborish
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
