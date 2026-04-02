import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  FileCheck, 
  FileText, 
  Search, 
  Filter, 
  MoreVertical,
  Download,
  ExternalLink,
  Clock,
  RefreshCw
} from 'lucide-react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export default function DidoxView() {
  const [documents, setDocuments] = useState<any[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Barchasi');

  useEffect(() => {
    const q = query(collection(db, 'documents'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDocuments(docsData);
    });

    return () => unsubscribe();
  }, []);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.partner?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'Barchasi' || doc.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: documents.length,
    signed: documents.filter(d => d.status === 'Imzolandi').length,
    pending: documents.filter(d => d.status === 'Kutilmoqda').length
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Didox Integratsiyasi</h1>
          <p className="text-slate-500">Elektron hujjat almashinuvi va shartnomalar nazorati</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold flex items-center gap-2 text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            <RefreshCw size={18} className="text-blue-500" />
            Yangilash
          </button>
          <button className="px-6 py-3 gradient-bg text-white rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-orange-500/20">
            <FileCheck size={18} />
            Hujjat yuborish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mb-4">
            <FileText size={24} />
          </div>
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Jami hujjatlar</h3>
          <p className="text-2xl font-black text-slate-900">{stats.total} ta</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center mb-4">
            <FileCheck size={24} />
          </div>
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Imzolangan</h3>
          <p className="text-2xl font-black text-slate-900">{stats.signed} ta</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mb-4">
            <Clock size={24} />
          </div>
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Kutilmoqda</h3>
          <p className="text-2xl font-black text-slate-900">{stats.pending} ta</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-900">Hujjatlar ro'yxati</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Qidirish..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none w-48 transition-all"
              />
            </div>
            <div className="relative group">
              <button className="p-2 text-slate-400 hover:text-slate-900 transition-all">
                <Filter size={20} />
              </button>
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {['Barchasi', 'Imzolandi', 'Kutilmoqda', 'Rad etildi'].map((status) => (
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
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-slate-50">
                <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Hujjat nomi</th>
                <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Hamkor</th>
                <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Sana</th>
                <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-all group">
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{doc.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{doc.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-sm font-bold text-slate-900">{doc.partner}</td>
                    <td className="p-6 text-sm font-medium text-slate-500">{doc.date}</td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                        doc.status === 'Imzolandi' ? 'bg-green-50 text-green-600' : 
                        doc.status === 'Kutilmoqda' ? 'bg-orange-50 text-orange-600' :
                        'bg-red-50 text-red-600'
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-slate-400 hover:text-blue-500 transition-all">
                          <Download size={18} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-900 transition-all">
                          <ExternalLink size={18} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-900 transition-all">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400 italic">Hujjatlar mavjud emas</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
