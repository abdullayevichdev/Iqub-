import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  TrendingUp, 
  TrendingDown, 
  MoreVertical,
  ChevronDown,
  Calendar as CalendarIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../lib/firestore-utils';

const data = [
  { name: 'Samo', xarajatlar: 900000, investitsiyalar: 100000 },
  { name: 'Farg\'ona City', xarajatlar: 400000, investitsiyalar: 600000 },
];

const ProjectCard = ({ name, image, sold, available, total }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
  >
    <div className="flex gap-4 mb-6">
      <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      <div>
        <h3 className="text-xl font-black text-slate-900">{name}</h3>
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Turar-joy majmuasi</p>
      </div>
    </div>

    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-slate-400">Sotilgan</span>
          <div className="flex items-center gap-2">
            <span className="text-slate-900">{sold}</span>
            <span className="text-slate-300 px-1.5 py-0.5 bg-slate-50 rounded-md">{Math.round((sold/total)*100)}%</span>
          </div>
        </div>
        <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(sold/total)*100}%` }}
            className="h-full bg-blue-500 rounded-full"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-slate-400">Sotuvda mavjud</span>
          <div className="flex items-center gap-2">
            <span className="text-slate-900">{available}</span>
            <span className="text-slate-300 px-1.5 py-0.5 bg-slate-50 rounded-md">{Math.round((available/total)*100)}%</span>
          </div>
        </div>
        <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(available/total)*100}%` }}
            className="h-full bg-[#F29900] rounded-full"
          />
        </div>
      </div>

      <div className="flex justify-between text-xs font-bold pt-2 border-t border-slate-50">
        <span className="text-slate-400">Jami</span>
        <div className="flex items-center gap-2">
          <span className="text-slate-900">{total}</span>
          <span className="text-slate-300 px-1.5 py-0.5 bg-slate-50 rounded-md">100%</span>
        </div>
      </div>
    </div>
  </motion.div>
);

export default function MainDashboardView() {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'objects'), orderBy('progress', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        image: `https://picsum.photos/seed/${doc.id}/200/200`,
        sold: doc.data().sold || Math.floor(Math.random() * 10),
        available: doc.data().apartments - (doc.data().sold || 0),
        total: doc.data().apartments
      }));
      setProjects(projectsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'objects');
    });

    return () => unsubscribe();
  }, []);

  const formatDate = (date: Date) => {
    const days = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
    const dayName = days[date.getDay()];
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${dayName}, ${day}.${month}.${year}`;
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">{formatDate(selectedDate)}</h1>
          <p className="text-slate-500">Bugungi asosiy ko'rsatkichlar va loyihalar holati</p>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
          >
            <CalendarIcon size={16} />
            Sana tanlash
            <ChevronDown size={16} />
          </button>
          
          <AnimatePresence>
            {showDatePicker && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl p-4 z-50 min-w-[200px]"
              >
                <input 
                  type="date" 
                  className="w-full p-2 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20"
                  onChange={(e) => {
                    setSelectedDate(new Date(e.target.value));
                    setShowDatePicker(false);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.length > 0 ? (
          projects.map(project => (
            <ProjectCard key={project.id} {...project} />
          ))
        ) : (
          <>
            <ProjectCard 
              name="Samo" 
              image="https://picsum.photos/seed/samo/200/200" 
              sold={3} 
              available={357} 
              total={360} 
            />
            <ProjectCard 
              name="Farg'ona City" 
              image="https://picsum.photos/seed/fargona/200/200" 
              sold={7} 
              available={273} 
              total={280} 
            />
          </>
        )}
      </div>

      {/* Chart Section */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Kirim/Chiqim</h3>
            <h2 className="text-3xl font-black text-slate-900">Xarajatlar va Investitsiyalar (bino bo'yicha)</h2>
          </div>
          <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={12}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94A3B8', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94A3B8', fontSize: 12 }}
                dx={-10}
                tickFormatter={(value) => `${value.toLocaleString()} so'm`}
              />
              <Tooltip 
                cursor={{ fill: '#F8FAFC' }}
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' 
                }}
                formatter={(value: any) => [`${value.toLocaleString()} so'm`]}
              />
              <Legend 
                verticalAlign="top" 
                align="right" 
                iconType="rect" 
                wrapperStyle={{ paddingBottom: '20px' }}
              />
              <Bar dataKey="xarajatlar" name="Xarajatlar" fill="#DC2626" radius={[6, 6, 0, 0]} barSize={60} />
              <Bar dataKey="investitsiyalar" name="Investitsiyalar" fill="#16A34A" radius={[6, 6, 0, 0]} barSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
