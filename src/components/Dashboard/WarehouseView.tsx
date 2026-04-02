import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Warehouse, 
  Package, 
  Box, 
  MapPin, 
  Eye, 
  Edit3, 
  ChevronDown,
  Scale,
  Maximize,
  Droplets,
  Ruler,
  Hash,
  Loader2
} from 'lucide-react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../lib/firestore-utils';

const StatCard = ({ icon, label, value, subtext, color }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
        <ChevronDown size={18} />
      </button>
    </div>
    <h3 className="text-slate-500 text-sm font-medium mb-1">{label}</h3>
    <div className="flex items-baseline gap-2">
      <span className="text-3xl font-black text-slate-900">{value}</span>
    </div>
    <p className="text-slate-400 text-[10px] mt-2 font-medium uppercase tracking-wider">{subtext}</p>
  </motion.div>
);

const CapacityBar = ({ icon, label, current, total }: any) => {
  const percentage = Math.min(100, (current / total) * 100);
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-bold">
        <div className="flex items-center gap-1.5 text-slate-500">
          {icon}
          <span>{label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-900">{current.toLocaleString()}/{total.toLocaleString()}</span>
          <span className="text-slate-300">{Math.round(percentage)}%</span>
        </div>
      </div>
      <div className="h-1 bg-slate-50 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className={`h-full rounded-full ${percentage > 90 ? 'bg-red-500' : 'bg-orange-400'}`}
        />
      </div>
    </div>
  );
};

const WarehouseCard = ({ name, location, code, status, usage, totalUsage, capacities }: any) => (
  <motion.div 
    whileHover={{ y: -8 }}
    className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group"
  >
    <div className="flex justify-between items-start mb-6">
      <div className="space-y-1">
        <h3 className="text-2xl font-black text-slate-900">{name}</h3>
        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
          <MapPin size={14} />
          <span>{location || 'Manzil ko\'rsatilmagan'}</span>
        </div>
        <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Kod: {code}</p>
      </div>
      <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold border ${
        status === 'Faol' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-slate-50 text-slate-400 border-slate-100'
      }`}>
        {status}
      </span>
    </div>

    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-black">
          <span className="text-slate-900">Foydalanish</span>
          <span className="text-red-500">{usage}%</span>
        </div>
        <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${usage}%` }}
            className="h-full bg-[#F29900] rounded-full"
          />
        </div>
        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <span>{(totalUsage?.total || 10000).toLocaleString()} ta umumiy</span>
          <span>{(totalUsage?.used || 0).toLocaleString()} ta ishlatilgan</span>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-50">
        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Sig'im Taqsimoti</h4>
        <div className="space-y-3">
          <CapacityBar icon={<Scale size={12} />} label="Og'irlik" current={capacities?.weight?.used || 0} total={capacities?.weight?.total || 10000} />
          <CapacityBar icon={<Maximize size={12} />} label="Hajm (Kubik)" current={capacities?.volume?.used || 0} total={capacities?.volume?.total || 10000} />
          <CapacityBar icon={<Droplets size={12} />} label="Hajm (Suyuq)" current={capacities?.liquid?.used || 0} total={capacities?.liquid?.total || 10000} />
          <CapacityBar icon={<Ruler size={12} />} label="Uzunlik" current={capacities?.length?.used || 0} total={capacities?.length?.total || 10000} />
          <CapacityBar icon={<Hash size={12} />} label="Dona" current={capacities?.units?.used || 0} total={capacities?.units?.total || 10000} />
        </div>
      </div>

      <div className="pt-6">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">To'liq manzil</p>
        <p className="text-xs text-slate-600 leading-relaxed mb-6">{location || 'Manzil ko\'rsatilmagan'}</p>
        
        <div className="flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            <Eye size={16} />
            Tafsilotlarni Ko'rish
          </button>
          <button className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all">
            <Edit3 size={18} />
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

export default function WarehouseView() {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'warehouses'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const warehousesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setWarehouses(warehousesData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'warehouses');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const stats = {
    total: warehouses.length,
    active: warehouses.filter(w => w.status === 'Faol').length,
    totalUsage: warehouses.reduce((acc, w) => acc + (w.usage || 0), 0) / (warehouses.length || 1)
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Omborlar</h1>
          <p className="text-slate-500">Barcha omborxonalar holati va sig'imi monitoringi</p>
        </div>
        <button className="px-6 py-3 gradient-bg text-white rounded-2xl text-sm font-bold shadow-lg shadow-orange-500/20 hover:scale-105 transition-all active:scale-95">
          Yangi ombor qo'shish
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          icon={<Warehouse className="text-blue-600" size={24} />} 
          label="Jami Omborlar" 
          value={stats.total} 
          subtext={`${stats.active} faol joylashuvlar`} 
          color="bg-blue-50"
        />
        <StatCard 
          icon={<Box className="text-orange-600" size={24} />} 
          label="O'rtacha Foydalanish" 
          value={`${Math.round(stats.totalUsage)}%`} 
          subtext="Barcha omborlar bo'yicha" 
          color="bg-orange-50"
        />
        <StatCard 
          icon={<Package className="text-green-600" size={24} />} 
          label="Faol Omborlar" 
          value={stats.active} 
          subtext="Hozirda ishlayotgan" 
          color="bg-green-50"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="animate-spin mb-4" size={40} />
          <p className="text-sm font-bold uppercase tracking-widest">Yuklanmoqda...</p>
        </div>
      ) : warehouses.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {warehouses.map((warehouse) => (
            <WarehouseCard key={warehouse.id} {...warehouse} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-4 bg-white rounded-[2.5rem] border border-slate-100 border-dashed">
          <Warehouse size={48} className="opacity-20" />
          <p className="text-sm font-bold uppercase tracking-widest">Omborlar topilmadi</p>
        </div>
      )}
    </div>
  );
}
