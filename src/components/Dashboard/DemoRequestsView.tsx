import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  Building, 
  Phone, 
  Search,
  Filter,
  MoreVertical,
  Trash2
} from 'lucide-react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../lib/firestore-utils';
import { toast } from 'sonner';

export default function DemoRequestsView() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('Barchasi');

  useEffect(() => {
    const q = query(collection(db, 'demo_requests'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requestsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRequests(requestsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'demo_requests');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'demo_requests', id), {
        status,
        updatedAt: serverTimestamp()
      });
      toast.success(status === 'approved' ? "So'rov tasdiqlandi" : "So'rov rad etildi");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `demo_requests/${id}`);
    }
  };

  const handleDeleteRequest = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'demo_requests', id));
      toast.success("So'rov o'chirildi");
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `demo_requests/${id}`);
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.contact?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'Barchasi' || 
      (filterStatus === 'Kutilmoqda' && req.status === 'pending') ||
      (filterStatus === 'Tasdiqlangan' && req.status === 'approved') ||
      (filterStatus === 'Rad etilgan' && req.status === 'rejected');

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-[#F29900]">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kutilmoqda</p>
              <h3 className="text-2xl font-black text-slate-900">
                {requests.filter(r => r.status === 'pending').length}
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tasdiqlangan</p>
              <h3 className="text-2xl font-black text-slate-900">
                {requests.filter(r => r.status === 'approved').length}
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
              <XCircle size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rad etilgan</p>
              <h3 className="text-2xl font-black text-slate-900">
                {requests.filter(r => r.status === 'rejected').length}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Qidirish (ism, kompaniya, kontakt)..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-medium"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {['Barchasi', 'Kutilmoqda', 'Tasdiqlangan', 'Rad etilgan'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filterStatus === status 
                  ? 'gradient-bg text-white shadow-lg shadow-orange-500/20' 
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Foydalanuvchi</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Kompaniya</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Kontakt</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sana</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {filteredRequests.map((req) => (
                  <motion.tr 
                    key={req.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#F29900] font-black italic">
                          {req.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-bold text-slate-900">{req.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Building size={14} />
                        <span className="text-sm font-medium">{req.company}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone size={14} />
                        <span className="text-sm font-medium">{req.contact}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-bold text-slate-400">
                        {req.createdAt?.toDate().toLocaleDateString('uz-UZ')}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        req.status === 'approved' ? 'bg-green-50 text-green-600 border border-green-100' :
                        req.status === 'rejected' ? 'bg-red-50 text-red-600 border border-red-100' :
                        'bg-orange-50 text-[#F29900] border border-orange-100'
                      }`}>
                        {req.status === 'approved' ? 'Tasdiqlangan' :
                         req.status === 'rejected' ? 'Rad etilgan' :
                         'Kutilmoqda'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        {req.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleStatusChange(req.id, 'approved')}
                              className="p-2 text-slate-300 hover:text-green-500 transition-colors"
                              title="Tasdiqlash"
                            >
                              <CheckCircle2 size={18} />
                            </button>
                            <button 
                              onClick={() => handleStatusChange(req.id, 'rejected')}
                              className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                              title="Rad etish"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => handleDeleteRequest(req.id)}
                          className="p-2 text-slate-300 hover:text-slate-900 transition-colors"
                          title="O'chirish"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {filteredRequests.length === 0 && (
          <div className="p-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
              <User size={40} />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-1">So'rovlar topilmadi</h4>
            <p className="text-sm text-slate-500">Qidiruv kriteriyalarini o'zgartirib ko'ring</p>
          </div>
        )}
      </div>
    </div>
  );
}
