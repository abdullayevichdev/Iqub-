import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  TrendingUp, 
  Users, 
  CreditCard,
  ChevronRight,
  Download,
  Plus,
  X,
  Loader2,
  FileDown,
  Eye,
  Calendar,
  Info
} from 'lucide-react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../lib/firestore-utils';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';

const ReportCard = ({ title, value, change, icon: Icon, color }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg`}>
        <Icon size={24} />
      </div>
      <div className="flex items-center gap-1 text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-lg">
        <TrendingUp size={12} />
        {change}
      </div>
    </div>
    <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</h3>
    <p className="text-2xl font-black text-slate-900">{value}</p>
  </motion.div>
);

export default function ReportsView() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isPreparing, setIsPreparing] = useState(false);
  const [newReport, setNewReport] = useState({
    name: '',
    type: 'Moliyaviy',
    content: '',
    size: '1.2 MB'
  });

  useEffect(() => {
    const q = query(collection(db, 'reports'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reportsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate ? doc.data().date.toDate().toLocaleDateString() : doc.data().date
      }));
      setReports(reportsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'reports');
    });

    return () => unsubscribe();
  }, []);

  const handleAddReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPreparing(true);
    
    // Simulate preparation time for "beautiful animation" effect
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      await addDoc(collection(db, 'reports'), {
        ...newReport,
        date: serverTimestamp()
      });
      toast.success("Hisobot muvaffaqiyatli tayyorlandi!");
      setShowAddModal(false);
      setNewReport({ name: '', type: 'Moliyaviy', content: '', size: '1.2 MB' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'reports');
      toast.error("Xatolik yuz berdi");
    } finally {
      setIsPreparing(false);
    }
  };

  const handleDownload = (report: any) => {
    const doc = new jsPDF();
    
    // Add content to PDF
    doc.setFontSize(20);
    doc.text("iQUB ERP Tizimi - Hisobot", 20, 20);
    
    doc.setFontSize(14);
    doc.text(`Hisobot nomi: ${report.name}`, 20, 40);
    doc.text(`Turi: ${report.type}`, 20, 50);
    doc.text(`Sana: ${report.date}`, 20, 60);
    
    doc.setFontSize(12);
    doc.text("Mazmuni:", 20, 80);
    
    const splitContent = doc.splitTextToSize(report.content || "Mazmun mavjud emas", 170);
    doc.text(splitContent, 20, 90);
    
    doc.save(`${report.name}.pdf`);
    toast.success(`${report.name} PDF formatida yuklab olindi!`);
  };

  const handleView = (report: any) => {
    setSelectedReport(report);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Hisobotlar</h1>
          <p className="text-slate-500">Tizimdagi barcha ko'rsatkichlar va tahliliy ma'lumotlar</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 gradient-bg text-white rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-orange-500/20"
        >
          <Plus size={18} />
          Yangi hisobot
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ReportCard 
          title="Umumiy tushum" 
          value="1.2 mlrd so'm" 
          change="+12%" 
          icon={CreditCard} 
          color="bg-blue-500" 
        />
        <ReportCard 
          title="Yangi mijozlar" 
          value="124 ta" 
          change="+8%" 
          icon={Users} 
          color="bg-purple-500" 
        />
        <ReportCard 
          title="Sotilgan xonadonlar" 
          value="12 ta" 
          change="+15%" 
          icon={TrendingUp} 
          color="bg-green-500" 
        />
        <ReportCard 
          title="O'rtacha chek" 
          value="450 mln so'm" 
          change="+5%" 
          icon={FileText} 
          color="bg-orange-500" 
        />
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-900">Oxirgi tayyorlangan hisobotlar</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {loading ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="animate-spin text-slate-300" size={32} />
            </div>
          ) : reports.length > 0 ? (
            reports.map((report) => (
              <div key={report.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{report.name}</h4>
                    <p className="text-xs text-slate-400 font-medium">{report.date} • {report.size || '0.0 MB'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleDownload(report)}
                    className="p-3 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                    title="PDF yuklab olish"
                  >
                    <Download size={20} />
                  </button>
                  <button 
                    onClick={() => handleView(report)}
                    className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                    title="Ko'rish"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-slate-400 italic">Hisobotlar mavjud emas</div>
          )}
        </div>
      </div>

      {/* Add Report Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isPreparing && setShowAddModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-900">Yangi hisobot</h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  disabled={isPreparing}
                  className="p-2 hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-50"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleAddReport} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Hisobot nomi</label>
                  <input 
                    required
                    disabled={isPreparing}
                    type="text" 
                    value={newReport.name}
                    onChange={(e) => setNewReport({...newReport, name: e.target.value})}
                    placeholder="Masalan: Sentyabr oyi sotuvlari"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium disabled:opacity-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Turi</label>
                  <select 
                    disabled={isPreparing}
                    value={newReport.type}
                    onChange={(e) => setNewReport({...newReport, type: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium appearance-none disabled:opacity-50"
                  >
                    <option value="Moliyaviy">Moliyaviy</option>
                    <option value="Sotuv">Sotuv</option>
                    <option value="Xodimlar">Xodimlar</option>
                    <option value="Ombor">Ombor</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Hisobot mazmuni</label>
                  <textarea 
                    required
                    disabled={isPreparing}
                    value={newReport.content}
                    onChange={(e) => setNewReport({...newReport, content: e.target.value})}
                    placeholder="Hisobot haqida batafsil ma'lumot yozing..."
                    rows={4}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium resize-none disabled:opacity-50"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isPreparing}
                  className="w-full py-4 gradient-bg text-white rounded-2xl font-bold shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isPreparing ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Tayyorlanmoqda...
                    </>
                  ) : (
                    'Tayyorlash'
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Report Modal */}
      <AnimatePresence>
        {selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReport(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-lg">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">{selectedReport.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
                        <Calendar size={12} />
                        {selectedReport.date}
                      </span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-black rounded-md uppercase">
                        {selectedReport.type}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="p-2 hover:bg-white rounded-xl transition-colors shadow-sm border border-slate-100"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                  <div className="flex items-center gap-2 mb-4 text-slate-400">
                    <Info size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest">Hisobot mazmuni</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                    {selectedReport.content || "Ushbu hisobot uchun mazmun yozilmagan."}
                  </p>
                </div>
              </div>
              <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                <button 
                  onClick={() => handleDownload(selectedReport)}
                  className="flex-1 py-4 gradient-bg text-white rounded-2xl font-bold shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  <FileDown size={20} />
                  PDF yuklab olish
                </button>
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="px-8 py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all"
                >
                  Yopish
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
