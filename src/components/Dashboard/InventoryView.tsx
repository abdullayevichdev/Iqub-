import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  CheckCircle2, 
  Search, 
  Filter, 
  Eye, 
  ArrowUpRight,
  MoreVertical,
  ChevronDown
} from 'lucide-react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../lib/firestore-utils';

const StatCard = ({ icon, label, value, subtext, color, trend }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-bold ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {trend > 0 ? <ArrowUpRight size={14} /> : <TrendingDown size={14} />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <h3 className="text-slate-500 text-sm font-medium mb-1">{label}</h3>
    <div className="flex items-baseline gap-2">
      <span className="text-3xl font-black text-slate-900">{value}</span>
    </div>
    <p className="text-slate-400 text-[10px] mt-2 font-medium uppercase tracking-wider">{subtext}</p>
  </motion.div>
);

export default function InventoryView() {
  const [inventory, setInventory] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'inventory'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const inventoryData = snapshot.docs.map(doc => {
        const data = doc.data();
        let status = 'Skladda mavjud';
        let statusColor = 'bg-green-50 text-green-600 border-green-100';
        
        if (data.amount === 0) {
          status = 'Skladga mavjud emas';
          statusColor = 'bg-red-50 text-red-600 border-red-100';
        } else if (data.amount < 10) {
          status = 'Skladda kam miqdorda';
          statusColor = 'bg-yellow-50 text-yellow-600 border-yellow-100';
        }

        return {
          id: doc.id,
          ...data,
          status,
          statusColor
        };
      });
      setInventory(inventoryData);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'inventory');
    });

    return () => unsubscribe();
  }, []);

  const stats = {
    total: inventory.length,
    low: inventory.filter(i => i.amount > 0 && i.amount < 10).length,
    out: inventory.filter(i => i.amount === 0).length,
    available: inventory.filter(i => i.amount >= 10).length
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Inventarizatsiya</h1>
          <p className="text-slate-500">Ombor inventarizatsiyasini ilg'or filtrlar yordamida boshqaring</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            Eksport (Excel)
          </button>
          <button className="px-6 py-3 gradient-bg text-white rounded-2xl text-sm font-bold shadow-lg shadow-orange-500/20 hover:scale-105 transition-all active:scale-95">
            Yangi mahsulot qo'shish
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Package className="text-blue-600" size={24} />} 
          label="Jami mahsulotlar" 
          value={stats.total.toString()} 
          subtext="Barcha toifalar bo'yicha" 
          color="bg-blue-50"
        />
        <StatCard 
          icon={<AlertTriangle className="text-yellow-600" size={24} />} 
          label="Skladda kam miqdorda" 
          value={stats.low.toString()} 
          subtext="Chegaradan kam mahsulotlar" 
          color="bg-yellow-50"
        />
        <StatCard 
          icon={<TrendingDown className="text-red-600" size={24} />} 
          label="Skladga mavjud emas" 
          value={stats.out.toString()} 
          subtext="Qayta zaxiraga olinishi kerak" 
          color="bg-red-50"
        />
        <StatCard 
          icon={<CheckCircle2 className="text-green-600" size={24} />} 
          label="Skladda mavjud" 
          value={stats.available.toString()} 
          subtext="Mahsulotlar mavjud" 
          color="bg-green-50"
        />
      </div>

      {/* Tabs & Filters */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-50">
          <button className="px-8 py-5 text-sm font-bold text-slate-900 border-b-2 border-[#F29900]">
            Invertarizatsiya mahsulotlari
          </button>
          <button className="px-8 py-5 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
            Monitoring
          </button>
          <button className="px-8 py-5 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
            Hisobotlar
          </button>
        </div>

        <div className="p-8">
          <div className="flex flex-col lg:flex-row gap-4 justify-between mb-8">
            <div className="relative flex-1 max-w-xl">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="SKU nomi bilan qidiring..." 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
              />
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition-all">
                Barcha Kategoriyalar
                <ChevronDown size={16} />
              </button>
              <button className="flex items-center gap-2 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition-all">
                <Filter size={18} />
                Ko'proq filtr
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-50">
                  <th className="pb-4 px-4">№</th>
                  <th className="pb-4 px-4">Mahsulot</th>
                  <th className="pb-4 px-4">SKU</th>
                  <th className="pb-4 px-4">Kategoriya</th>
                  <th className="pb-4 px-4">Miqdor</th>
                  <th className="pb-4 px-4">Status</th>
                  <th className="pb-4 px-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {inventory.length > 0 ? (
                  inventory.map((product, i) => (
                    <tr key={product.id} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
                      <td className="py-5 px-4 font-medium text-slate-400">{i + 1}</td>
                      <td className="py-5 px-4">
                        <div className="font-bold text-slate-900">{product.name}</div>
                      </td>
                      <td className="py-5 px-4 font-medium text-slate-500">{product.sku}</td>
                      <td className="py-5 px-4 font-medium text-slate-500">{product.category}</td>
                      <td className="py-5 px-4">
                        <div className="flex items-center gap-2 font-bold text-slate-900">
                          {product.amount === 0 ? (
                            <TrendingDown size={14} className="text-red-500" />
                          ) : (
                            <ArrowUpRight size={14} className="text-green-500" />
                          )}
                          {product.amount}
                        </div>
                      </td>
                      <td className="py-5 px-4">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold border ${product.statusColor}`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="py-5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                            <Eye size={18} />
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-600 hover:bg-slate-100 transition-all">
                            <ArrowUpRight size={14} className="text-red-500" />
                            Chiqim
                          </button>
                          <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 italic">Mahsulotlar mavjud emas</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex justify-between items-center text-xs text-slate-400 font-medium">
            <p>{inventory.length} ta buyum ko'rsatilmoqda</p>
            <p>Oxirgi yangilanish: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
