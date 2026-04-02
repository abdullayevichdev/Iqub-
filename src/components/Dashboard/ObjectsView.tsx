import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  MapPin, 
  TrendingUp, 
  MoreVertical,
  Plus,
  LayoutGrid,
  List,
  Loader2,
  Search,
  Filter,
  Trash2,
  X
} from 'lucide-react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../lib/firestore-utils';
import { toast } from 'sonner';

const ObjectCard = ({ id, name, location, progress, image, status, apartments, onDelete }: any) => (
  <motion.div 
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    whileHover={{ y: -5 }}
    className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300"
  >
    <div className="relative h-48">
      <img src={image || `https://picsum.photos/seed/${name}/400/300`} alt={name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-900 shadow-sm">
        {status || 'Qurilmoqda'}
      </div>
    </div>
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-black text-slate-900 mb-1">{name}</h3>
          <div className="flex items-center gap-1 text-slate-400">
            <MapPin size={12} />
            <span className="text-xs font-medium">{location || 'Manzil ko\'rsatilmagan'}</span>
          </div>
        </div>
        <div className="flex gap-1">
          <button 
            onClick={onDelete}
            className="p-2 text-slate-300 hover:text-red-500 transition-all"
          >
            <Trash2 size={18} />
          </button>
          <button className="p-2 text-slate-300 hover:text-slate-900 transition-all">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-400">Qurilish jarayoni</span>
            <span className="text-slate-900">{progress}%</span>
          </div>
          <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-blue-500 rounded-full"
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-50">
          <div className="flex items-center gap-2">
            <Building2 size={16} className="text-slate-400" />
            <span className="text-xs font-bold text-slate-900">{apartments} xonadon</span>
          </div>
          <div className="flex items-center gap-1 text-green-500">
            <TrendingUp size={14} />
            <span className="text-xs font-black">+{Math.floor(Math.random() * 20)}%</span>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

export default function ObjectsView() {
  const [objects, setObjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'objects'), orderBy('progress', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const objectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setObjects(objectsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'objects');
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteObject = async (id: string) => {
    if (window.confirm("Ushbu obyektni o'chirib tashlamoqchimisiz?")) {
      try {
        await deleteDoc(doc(db, 'objects', id));
        toast.success("Obyekt o'chirildi");
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `objects/${id}`);
      }
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newObject, setNewObject] = useState({
    name: '',
    location: '',
    apartments: '',
    progress: 0,
    status: 'Qurilmoqda',
    image: ''
  });

  const [filterStatus, setFilterStatus] = useState('Barchasi');

  const filteredObjects = objects.filter(obj => {
    const matchesSearch = obj.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         obj.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'Barchasi' || obj.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleAddObject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'objects'), {
        ...newObject,
        apartments: parseInt(newObject.apartments as string) || 0,
        progress: typeof newObject.progress === 'string' ? parseInt(newObject.progress) : (newObject.progress || 0),
        createdAt: serverTimestamp()
      });
      setIsModalOpen(false);
      setNewObject({
        name: '',
        location: '',
        apartments: '',
        progress: 0,
        status: 'Qurilmoqda',
        image: ''
      });
      toast.success("Yangi obyekt muvaffaqiyatli qo'shildi");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'objects');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2 italic">Obyektlar</h1>
          <p className="text-slate-500 font-medium">Qurilish loyihalari va obyektlar nazorati</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white p-1 rounded-2xl border border-slate-100 shadow-sm flex">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
            >
              <LayoutGrid size={20} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
            >
              <List size={20} />
            </button>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 gradient-bg text-white rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-all"
          >
            <Plus size={18} />
            Yangi obyekt
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Obyektlarni qidirish..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium shadow-sm"
          />
        </div>
        <div className="relative group">
          <button 
            className={`px-6 py-4 bg-white border rounded-2xl font-bold flex items-center gap-2 transition-all shadow-sm ${filterStatus !== 'Barchasi' ? 'text-orange-600 border-orange-200 bg-orange-50' : 'text-slate-600 border-slate-100 hover:bg-slate-50'}`}
          >
            <Filter size={18} />
            Filtr {filterStatus !== 'Barchasi' && `: ${filterStatus}`}
          </button>
          <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            {['Barchasi', 'Qurilmoqda', 'Boshlanmoqda', 'Bitgan'].map((status) => (
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
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="animate-spin mb-4" size={40} />
          <p className="text-sm font-bold uppercase tracking-widest">Yuklanmoqda...</p>
        </div>
      ) : filteredObjects.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredObjects.map((obj) => (
                <ObjectCard 
                  key={obj.id} 
                  {...obj} 
                  onDelete={() => handleDeleteObject(obj.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <th className="px-8 py-4">Obyekt nomi</th>
                  <th className="px-8 py-4">Manzil</th>
                  <th className="px-8 py-4">Progress</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredObjects.map((obj) => (
                  <tr key={obj.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center font-bold">
                          {obj.name?.[0]}
                        </div>
                        <span className="font-bold text-slate-900">{obj.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-slate-500 font-medium">{obj.location || '-'}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden w-24">
                          <div 
                            className="h-full bg-orange-500 rounded-full" 
                            style={{ width: `${obj.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-black text-slate-900">{obj.progress}%</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {obj.status || 'Faol'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleDeleteObject(obj.id)}
                          className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button className="p-2 text-slate-300 hover:text-slate-900 transition-all">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-4 bg-white rounded-[2.5rem] border border-slate-100 border-dashed">
          <Building2 size={48} className="opacity-20" />
          <p className="text-sm font-bold uppercase tracking-widest">Obyektlar topilmadi</p>
        </div>
      )}

      {/* Add Object Modal */}
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
                <h3 className="text-2xl font-black text-slate-900 italic">Yangi obyekt qo'shish</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleAddObject} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Obyekt nomi</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Masalan: Farg'ona City"
                    value={newObject.name}
                    onChange={(e) => setNewObject({...newObject, name: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Manzil</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Obyekt manzili"
                    value={newObject.location}
                    onChange={(e) => setNewObject({...newObject, location: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Xonadonlar soni</label>
                    <input 
                      required
                      type="number" 
                      placeholder="0"
                      value={newObject.apartments}
                      onChange={(e) => setNewObject({...newObject, apartments: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Progress (%)</label>
                    <input 
                      required
                      type="number" 
                      min="0"
                      max="100"
                      placeholder="0"
                      value={newObject.progress}
                      onChange={(e) => setNewObject({...newObject, progress: parseInt(e.target.value) || 0})}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Rasm URL (ixtiyoriy)</label>
                  <input 
                    type="text" 
                    placeholder="https://..."
                    value={newObject.image}
                    onChange={(e) => setNewObject({...newObject, image: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 font-medium"
                  />
                </div>
                
                <button 
                  type="submit"
                  className="w-full py-4 gradient-bg text-white rounded-2xl font-bold shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Obyektni saqlash
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
