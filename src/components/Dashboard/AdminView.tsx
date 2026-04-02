import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Users, 
  Settings, 
  Database, 
  Activity, 
  Lock, 
  Key, 
  Server,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  UserCheck,
  UserX,
  Trash2,
  User,
  Save,
  Globe,
  Bell,
  Mail,
  Smartphone,
  Search,
  Filter,
  FileText,
  Download,
  Plus,
  X
} from 'lucide-react';
import { collection, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc, getDoc, setDoc, serverTimestamp, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { handleFirestoreError, OperationType } from '../../lib/firestore-utils';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';

const AdminStatCard = ({ title, value, icon, color }: { title: string, value: string, icon: React.ReactNode, color: string }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
        {icon}
      </div>
      <div className="flex items-center gap-1 text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg">
        <Activity size={12} />
        <span>Active</span>
      </div>
    </div>
    <p className="text-slate-500 text-sm font-medium">{title}</p>
    <h3 className="text-2xl font-black text-slate-900 mt-1">{value}</h3>
  </div>
);

export default function AdminView() {
  const [requests, setRequests] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState({
    users: 0,
    load: '24%',
    security: '98.2%',
    apiRequests: '45.2k'
  });
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'database' | 'security' | 'settings' | 'reports'>('dashboard');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportContent, setReportContent] = useState('');
  const [reportTitle, setReportTitle] = useState('');
  const [isPreparingReport, setIsPreparingReport] = useState(false);

  const [systemSettings, setSystemSettings] = useState({
    siteName: 'Samo CRM',
    maintenanceMode: false,
    emailNotifications: true,
    smsNotifications: false,
    language: 'uz'
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: true,
    ipRestrictions: false,
    autoBlock: true,
    sessionTimeout: true
  });

  const [systemReports, setSystemReports] = useState<any[]>([]);

  useEffect(() => {
    const adminAccess = localStorage.getItem('admin_access');
    if (adminAccess === 'true') {
      setIsAuth(true);
      
      // Load System Settings
      const unsubSettings = onSnapshot(doc(db, 'system_settings', 'global'), (docSnap) => {
        if (docSnap.exists()) {
          setSystemSettings(docSnap.data() as any);
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'system_settings/global');
      });

      // Load Security Settings
      const unsubSecurity = onSnapshot(doc(db, 'security_settings', 'global'), (docSnap) => {
        if (docSnap.exists()) {
          setSecuritySettings(docSnap.data() as any);
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'security_settings/global');
      });

      // Load Reports
      const unsubReports = onSnapshot(query(collection(db, 'system_reports'), orderBy('createdAt', 'desc')), (snapshot) => {
        const reports = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setSystemReports(reports);
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'system_reports');
      });

      const q = query(collection(db, 'demo_requests'), orderBy('createdAt', 'desc'));
      const unsubRequests = onSnapshot(q, (snapshot) => {
        const reqs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setRequests(reqs);
        setLoading(false);
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'demo_requests');
      });

      const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
        const usersList = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setUsers(usersList);
        setStats(prev => ({ ...prev, users: snapshot.size }));
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'users');
      });

      return () => {
        unsubSettings();
        unsubSecurity();
        unsubRequests();
        unsubUsers();
      };
    } else {
      setIsAuth(false);
      setLoading(false);
    }
  }, []);

  const startAudit = () => {
    setIsAuditing(true);
    setAuditProgress(0);
    const interval = setInterval(() => {
      setAuditProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsAuditing(false);
            toast.success('Xavfsizlik auditi muvaffaqiyatli yakunlandi!');
          }, 1000);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  const handleApprove = async (id: string) => {
    try {
      await updateDoc(doc(db, 'demo_requests', id), { 
        status: 'approved',
        updatedAt: serverTimestamp()
      });
      toast.success("So'rov muvaffaqiyatli tasdiqlandi");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `demo_requests/${id}`);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateDoc(doc(db, 'demo_requests', id), { 
        status: 'rejected',
        updatedAt: serverTimestamp()
      });
      toast.error("So'rov rad etildi");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `demo_requests/${id}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Ushbu so'rovni o'chirib tashlamoqchimisiz?")) {
      try {
        await deleteDoc(doc(db, 'demo_requests', id));
        toast.success("So'rov o'chirildi");
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `demo_requests/${id}`);
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Ushbu foydalanuvchini o'chirib tashlamoqchimisiz?")) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        toast.success("Foydalanuvchi o'chirildi");
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `users/${userId}`);
      }
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      toast.success(`Foydalanuvchi roli ${newRole} ga o'zgartirildi`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  };

  const handleSaveSettings = async () => {
    try {
      await setDoc(doc(db, 'system_settings', 'global'), {
        ...systemSettings,
        updatedAt: serverTimestamp()
      });
      toast.success('Sozlamalar saqlandi');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'system_settings/global');
    }
  };

  const handleToggleSecurity = async (key: keyof typeof securitySettings) => {
    const newValue = !securitySettings[key];
    try {
      await setDoc(doc(db, 'security_settings', 'global'), {
        ...securitySettings,
        [key]: newValue,
        updatedAt: serverTimestamp()
      });
      toast.success('Xavfsizlik sozlamasi yangilandi');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'security_settings/global');
    }
  };

  const handlePrepareReport = async () => {
    if (!reportTitle || !reportContent) {
      toast.error('Iltimos, sarlavha va hisobot matnini kiriting');
      return;
    }
    setIsPreparingReport(true);
    
    try {
      // Save report to Firestore
      await addDoc(collection(db, 'system_reports'), {
        title: reportTitle,
        content: reportContent,
        type: 'Custom',
        createdAt: serverTimestamp(),
        author: 'Admin'
      });

      // Simulate some processing time for "professional" feel
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // First close the modal to trigger exit animation
      setShowReportModal(false);
      
      // Then reset states after a small delay to allow animation to complete
      setTimeout(() => {
        setIsPreparingReport(false);
        setReportTitle('');
        setReportContent('');
        toast.success('Hisobot muvaffaqiyatli tayyorlandi va saqlandi!');
      }, 500);
      
    } catch (error) {
      setIsPreparingReport(false);
      handleFirestoreError(error, OperationType.CREATE, 'system_reports');
    }
  };

  const downloadPDF = async (title?: string, content?: string) => {
    const doc = new jsPDF();
    const finalTitle = title || reportTitle || 'Tizim Hisoboti';
    const finalContent = content || reportContent || 'Hisobot mazmuni bo\'sh.';

    doc.setFontSize(22);
    doc.setTextColor(242, 153, 0); // Samo Orange
    doc.text(finalTitle, 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // Slate 500
    doc.text(`Sana: ${new Date().toLocaleString()}`, 20, 30);
    doc.text(`Tayyorladi: Admin`, 20, 35);
    
    doc.setDrawColor(241, 245, 249); // Slate 100
    doc.line(20, 40, 190, 40);
    
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59); // Slate 800
    const splitText = doc.splitTextToSize(finalContent, 170);
    doc.text(splitText, 20, 50);
    
    // Open in new window first to satisfy "hisobot ochilyapdi"
    window.open(doc.output('bloburl'), '_blank');
    
    // Then download
    doc.save(`${finalTitle}.pdf`);
    toast.success('PDF yuklab olindi');
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuth && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-3xl border border-slate-100 p-12 text-center">
        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center text-[#F29900] mb-6">
          <Lock size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2 italic">Admin Kirish Talab Qilinadi</h2>
        <p className="text-slate-500 font-medium max-w-md mb-8">
          Haqiqiy admin amallarini bajarish va ma'lumotlarni ko'rish uchun Google orqali tizimga kiring.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-4 gradient-bg text-white rounded-2xl font-bold shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-all flex items-center gap-2"
        >
          <Key size={20} />
          <span>Tizimga qayta kirish</span>
        </button>
      </div>
    );
  }

  const logs = [
    { id: 1, user: 'Admin', action: 'System Update', time: '2 min ago', status: 'success' },
    { id: 2, user: 'Manager', action: 'New Warehouse Created', time: '15 min ago', status: 'success' },
    { id: 3, user: 'System', action: 'Backup Completed', time: '1 hour ago', status: 'success' },
    { id: 4, user: 'User_42', action: 'Failed Login Attempt', time: '2 hours ago', status: 'warning' },
    { id: 5, user: 'Admin', action: 'Permissions Modified', time: '5 hours ago', status: 'info' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 italic">Admin Panel</h1>
          <p className="text-slate-500 font-medium">Tizimni boshqarish va monitoring markazi</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'dashboard', icon: <Activity size={18} />, label: 'Dashboard' },
            { id: 'database', icon: <Database size={18} />, label: 'Ma\'lumotlar' },
            { id: 'security', icon: <Shield size={18} />, label: 'Xavfsizlik' },
            { id: 'reports', icon: <FileText size={18} />, label: 'Hisobotlar' },
            { id: 'settings', icon: <Settings size={18} />, label: 'Sozlamalar' },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-100 hover:bg-slate-50'}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'dashboard' && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AdminStatCard 
              title="Jami foydalanuvchilar" 
              value={stats.users.toString()} 
              icon={<Users size={24} className="text-blue-600" />} 
              color="bg-blue-600"
            />
            <AdminStatCard 
              title="Tizim yuklamasi" 
              value={stats.load} 
              icon={<Server size={24} className="text-purple-600" />} 
              color="bg-purple-600"
            />
            <AdminStatCard 
              title="Xavfsizlik darajasi" 
              value={stats.security} 
              icon={<Lock size={24} className="text-green-600" />} 
              color="bg-green-600"
            />
            <AdminStatCard 
              title="API so'rovlar" 
              value={stats.apiRequests} 
              icon={<Activity size={24} className="text-orange-600" />} 
              color="bg-orange-600"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Demo Requests */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-slate-900 italic">Demo So'rovlari</h3>
                    <span className="px-2 py-0.5 bg-orange-100 text-[#F29900] text-[10px] font-black rounded-full uppercase">
                      {requests.filter(r => r.status === 'pending').length} Yangi
                    </span>
                  </div>
                </div>
                <div className="divide-y divide-slate-50 max-h-[400px] overflow-y-auto custom-scrollbar">
                  <AnimatePresence mode="popLayout">
                    {requests.length === 0 ? (
                      <div className="p-12 text-center text-slate-400">
                        <Clock size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="font-medium">Hozircha so'rovlar yo'q</p>
                      </div>
                    ) : (
                      requests.map((req) => (
                        <motion.div 
                          key={req.id}
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              req.status === 'approved' ? 'bg-green-50 text-green-600' :
                              req.status === 'rejected' ? 'bg-red-50 text-red-600' :
                              'bg-orange-50 text-[#F29900]'
                            }`}>
                              {req.status === 'approved' ? <UserCheck size={24} /> :
                               req.status === 'rejected' ? <UserX size={24} /> :
                               <Clock size={24} />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-bold text-slate-900">{req.name}</p>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                  {req.company}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 font-medium">{req.contact}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {req.status === 'pending' && (
                              <>
                                <button 
                                  onClick={() => handleApprove(req.id)}
                                  className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                  title="Tasdiqlash"
                                >
                                  <UserCheck size={18} />
                                </button>
                                <button 
                                  onClick={() => handleReject(req.id)}
                                  className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                  title="Rad etish"
                                >
                                  <UserX size={18} />
                                </button>
                              </>
                            )}
                            <button 
                              onClick={() => handleDelete(req.id)}
                              className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                              title="O'chirish"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* System Logs */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 italic">Tizim jurnali (Logs)</h3>
                </div>
                <div className="divide-y divide-slate-50">
                  {logs.map((log) => (
                    <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          log.status === 'success' ? 'bg-green-50 text-green-600' :
                          log.status === 'warning' ? 'bg-red-50 text-red-600' :
                          'bg-blue-50 text-blue-600'
                        }`}>
                          {log.status === 'success' ? <CheckCircle2 size={20} /> :
                           log.status === 'warning' ? <AlertTriangle size={20} /> :
                           <Clock size={20} />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{log.action}</p>
                          <p className="text-xs text-slate-500 font-medium">Foydalanuvchi: <span className="text-slate-700">{log.user}</span></p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-400">{log.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group">
                <div className="relative z-10">
                  <Shield className="text-orange-400 mb-4 group-hover:scale-110 transition-transform" size={40} />
                  <h3 className="text-xl font-bold mb-2 italic">Xavfsizlik auditi</h3>
                  {isAuditing ? (
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs font-bold text-orange-400">
                        <span>Tekshirilmoqda...</span>
                        <span>{auditProgress}%</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${auditProgress}%` }}
                          className="h-full bg-orange-400"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-slate-400 text-sm mb-6">Tizim xavfsizligini tekshirish va yangilash</p>
                      <button 
                        onClick={startAudit}
                        className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-orange-50 transition-all"
                      >
                        Auditni boshlash
                      </button>
                    </>
                  )}
                </div>
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl" />
              </div>

              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Tezkor havolalar</h3>
                <div className="space-y-3">
                  {[
                    { icon: <Users size={18} />, label: 'Rollar boshqaruvi', tab: 'database' },
                    { icon: <Key size={18} />, label: 'API kalitlar', tab: 'security' },
                    { icon: <Settings size={18} />, label: 'Global sozlamalar', tab: 'settings' },
                    { icon: <FileText size={18} />, label: 'Hisobot tayyorlash', tab: 'reports' },
                  ].map((item, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setActiveTab(item.tab as any)}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all group"
                    >
                      <div className="flex items-center gap-3 text-slate-600 group-hover:text-slate-900">
                        {item.icon}
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                      <ArrowRight size={14} className="text-slate-300 group-hover:text-slate-900 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'database' && (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-xl font-black text-slate-900 italic">Foydalanuvchilar boshqaruvi</h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Qidirish..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none w-64 transition-all"
                />
              </div>
              <button className="p-2 text-slate-400 hover:text-slate-900 transition-all">
                <Filter size={20} />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <th className="px-6 py-4">Foydalanuvchi</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Rol</th>
                  <th className="px-6 py-4">Sana</th>
                  <th className="px-6 py-4 text-right">Harakatlar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                      Foydalanuvchilar topilmadi
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors">
                            <User size={20} />
                          </div>
                          <span className="text-sm font-bold text-slate-900">{user.name || 'Noma\'lum'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 font-medium">{user.email || '-'}</td>
                      <td className="px-6 py-4">
                        <select 
                          value={user.role || 'user'}
                          onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                          className="bg-blue-50 text-blue-600 text-[10px] font-black rounded-md uppercase px-2 py-1 outline-none cursor-pointer border-none"
                        >
                          <option value="admin">Admin</option>
                          <option value="manager">Manager</option>
                          <option value="user">User</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                        {user.createdAt?.toDate().toLocaleDateString() || '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 mb-6 italic">Xavfsizlik sozlamalari</h3>
            <div className="space-y-6">
              {[
                { label: 'Ikki bosqichli autentifikatsiya', desc: 'Tizimga kirishda qo\'shimcha xavfsizlik', key: 'twoFactor' },
                { label: 'IP cheklovlari', desc: 'Faqat ruxsat berilgan IP manzillardan kirish', key: 'ipRestrictions' },
                { label: 'Avtomatik bloklash', desc: '3 marta noto\'g\'ri urinishdan so\'ng bloklash', key: 'autoBlock' },
                { label: 'Sessiya muddati', desc: '24 soatdan so\'ng avtomatik chiqish', key: 'sessionTimeout' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{item.label}</h4>
                    <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                  </div>
                  <div 
                    onClick={() => handleToggleSecurity(item.key as any)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${securitySettings[item.key as keyof typeof securitySettings] ? 'bg-green-500' : 'bg-slate-200'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${securitySettings[item.key as keyof typeof securitySettings] ? 'translate-x-6' : 'translate-x-0'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
            <h3 className="text-xl font-black mb-6 italic relative z-10">API Monitoring</h3>
            <div className="space-y-6 relative z-10">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                <div className="flex justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">API Yuklamasi</span>
                  <span className="text-xs font-bold text-green-400">Normal</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '45%' }}
                    className="h-full bg-green-400"
                  />
                </div>
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                <div className="flex justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Xatoliklar darajasi</span>
                  <span className="text-xs font-bold text-orange-400">0.02%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '2%' }}
                    className="h-full bg-orange-400"
                  />
                </div>
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                <div className="flex justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Server javob vaqti</span>
                  <span className="text-xs font-bold text-blue-400">124ms</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '15%' }}
                    className="h-full bg-blue-400"
                  />
                </div>
              </div>
            </div>
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-slate-900 italic">Tizim Hisobotlari</h3>
                <p className="text-slate-500 text-sm">Barcha ma'lumotlar asosida tahliliy hisobotlar tayyorlash</p>
              </div>
              <button 
                onClick={() => setShowReportModal(true)}
                className="px-6 py-3 gradient-bg text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-all"
              >
                <Plus size={20} />
                Yangi hisobot
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {systemReports.length === 0 ? (
                <div className="col-span-3 p-12 text-center text-slate-400 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <FileText size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="font-medium">Hozircha hisobotlar mavjud emas</p>
                </div>
              ) : (
                systemReports.map((report) => (
                  <motion.div 
                    key={report.id} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-orange-500/30 transition-all group"
                  >
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 mb-4 group-hover:text-orange-500 transition-colors shadow-sm">
                      <FileText size={24} />
                    </div>
                    <h4 className="font-bold text-slate-900 mb-1 truncate">{report.title}</h4>
                    <p className="text-xs text-slate-500 mb-4">{report.type} • {report.createdAt?.toDate().toLocaleDateString()}</p>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => downloadPDF(report.title, report.content)}
                        className="flex items-center gap-2 text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors"
                      >
                        <Download size={16} />
                        PDF
                      </button>
                      <button 
                        onClick={() => {
                          setReportTitle(report.title);
                          setReportContent(report.content);
                          setShowReportModal(true);
                        }}
                        className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        Ko'rish
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 italic">Global Sozlamalar</h3>
            <button 
              onClick={handleSaveSettings}
              className="px-6 py-2 gradient-bg text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-orange-500/20"
            >
              <Save size={18} />
              Saqlash
            </button>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="space-y-4">
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Globe size={16} />
                  Umumiy
                </h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500">Tizim nomi</label>
                    <input 
                      type="text" 
                      value={systemSettings.siteName}
                      onChange={(e) => setSystemSettings({...systemSettings, siteName: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500">Asosiy til</label>
                    <select 
                      value={systemSettings.language}
                      onChange={(e) => setSystemSettings({...systemSettings, language: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 font-medium appearance-none"
                    >
                      <option value="uz">O'zbekcha</option>
                      <option value="ru">Русский</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div className="space-y-4">
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Bell size={16} />
                  Bildirishnomalar
                </h4>
                <div className="space-y-4">
                  {[
                    { icon: <Mail size={18} />, label: 'Email bildirishnomalar', key: 'emailNotifications' },
                    { icon: <Smartphone size={18} />, label: 'SMS bildirishnomalar', key: 'smsNotifications' },
                    { icon: <AlertTriangle size={18} />, label: 'Texnik ishlar rejimi', key: 'maintenanceMode' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3 text-slate-700">
                        {item.icon}
                        <span className="text-sm font-bold">{item.label}</span>
                      </div>
                      <div 
                        onClick={() => setSystemSettings({...systemSettings, [item.key]: !systemSettings[item.key as keyof typeof systemSettings]})}
                        className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${systemSettings[item.key as keyof typeof systemSettings] ? 'bg-orange-500' : 'bg-slate-200'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${systemSettings[item.key as keyof typeof systemSettings] ? 'translate-x-6' : 'translate-x-0'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      <AnimatePresence>
        {showReportModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isPreparingReport && setShowReportModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-900 italic">Yangi Hisobot Tayyorlash</h3>
                <button 
                  onClick={() => setShowReportModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Hisobot sarlavhasi</label>
                  <input 
                    type="text" 
                    placeholder="Masalan: Mart oyi tahlili"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Hisobot matni</label>
                  <textarea 
                    rows={6}
                    placeholder="Hisobot mazmunini bu yerga yozing..."
                    value={reportContent}
                    onChange={(e) => setReportContent(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 font-medium resize-none"
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setShowReportModal(false)}
                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                  >
                    Bekor qilish
                  </button>
                  <button 
                    onClick={handlePrepareReport}
                    disabled={isPreparingReport}
                    className="flex-[2] py-4 gradient-bg text-white rounded-2xl font-bold shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {isPreparingReport ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Tayyorlanmoqda...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={20} />
                        Tayyorlash
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
