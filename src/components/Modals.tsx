import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Phone, Building, Loader2, ChevronLeft, ArrowRight, CheckCircle2, Shield, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { auth, db } from '../firebase';
import { collection, addDoc, serverTimestamp, onSnapshot, query, where, limit, orderBy, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose, onDemoSuccess }: ModalProps & { onDemoSuccess?: (name: string) => void }) {
  const { t } = useLanguage();
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@iqub.uz');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password === '2000') {
      // Set a local storage flag for admin access
      localStorage.setItem('admin_access', 'true');
      onDemoSuccess?.('Admin');
      onClose();
      setLoading(false);
      return;
    }

    setError('Noto\'g\'ri parol yoki admin kodi.');
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-8"
          >
            <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors">
              <X size={24} />
            </button>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-black text-slate-900 mb-2 italic">iQUB</h3>
              <p className="text-slate-50 text-sm font-medium">Tizimga kirish</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#F29900] transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Email yoki Login"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-medium"
                  required
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#F29900] transition-colors" size={18} />
                <input
                  type="password"
                  placeholder="Parol"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-medium"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full gradient-bg text-white py-4 rounded-2xl font-bold shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Kirish"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export function GetDemoModal({ isOpen, onClose, onDemoSuccess }: ModalProps & { onDemoSuccess?: (name: string) => void }) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', company: '', contact: '' });
  const [step, setStep] = useState<'form' | 'providing' | 'ready' | 'pending_approval'>(() => {
    const savedId = localStorage.getItem('demo_request_id');
    const isApproved = localStorage.getItem('demo_approved') === 'true';
    if (savedId && !isApproved) return 'pending_approval';
    return 'form';
  });
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(() => localStorage.getItem('demo_request_id'));

  const isLocked = step === 'pending_approval' || step === 'providing';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLocked) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isLocked]);

  useEffect(() => {
    const savedName = localStorage.getItem('demo_user_name');
    const savedCompany = localStorage.getItem('demo_user_company');
    const savedContact = localStorage.getItem('demo_user_contact');
    
    if (savedName || savedCompany || savedContact) {
      setFormData({
        name: savedName || '',
        company: savedCompany || '',
        contact: savedContact || ''
      });
    }

    if (requestId) {
      setStep('pending_approval');
    }
  }, []);

  useEffect(() => {
    if (requestId && step === 'pending_approval') {
      const unsub = onSnapshot(doc(db, 'demo_requests', requestId), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.status === 'approved') {
            setStep('ready');
            localStorage.setItem('demo_approved', 'true');
          } else if (data.status === 'rejected') {
            alert("Sizning so'rovingiz rad etildi.");
            localStorage.removeItem('demo_request_id');
            localStorage.removeItem('demo_user_name');
            localStorage.removeItem('demo_user_company');
            localStorage.removeItem('demo_user_contact');
            setRequestId(null);
            setStep('form');
            onClose();
          }
        }
      }, (error) => {
        console.error("Error listening to demo request:", error);
      });
      return () => unsub();
    }
  }, [requestId, step]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted!");
    console.log("Form data:", formData);
    
    if (loading) {
      console.log("Already loading, skipping...");
      return;
    }

    setLoading(true);
    
    try {
      console.log("Attempting to save to Firestore...");
      // Save request to Firestore - allowing unauthenticated writes for demo requests
      const requestData = {
        ...formData,
        status: 'pending',
        createdAt: serverTimestamp(),
      };
      
      console.log("Request data to be saved:", requestData);
      
      const docRef = await addDoc(collection(db, 'demo_requests'), requestData);
      console.log("Successfully saved to Firestore! ID:", docRef.id);
      
      localStorage.setItem('demo_request_id', docRef.id);
      localStorage.setItem('demo_user_name', formData.name);
      localStorage.setItem('demo_user_company', formData.company);
      localStorage.setItem('demo_user_contact', formData.contact);
      
      setRequestId(docRef.id);
      setStep('providing');
      
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.random() * 25; // Increased increment
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(interval);
          setTimeout(() => setStep('pending_approval'), 400); // Reduced from 800
        }
        setProgress(currentProgress);
      }, 150); // Reduced from 300
    } catch (error: any) {
      console.error("CRITICAL ERROR in handleSubmit:", error);
      alert("Xatolik yuz berdi: " + (error.message || "Noma'lum xato"));
      // Fallback: if Firestore fails, still show the progress bar for demo purposes
      // but warn the user that it's not being saved.
      console.warn("Falling back to local-only demo mode due to Firestore error.");
      setStep('providing');
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.random() * 25; // Increased increment
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(interval);
          setTimeout(() => setStep('ready'), 400); // Reduced from 800
        }
        setProgress(currentProgress);
      }, 150); // Reduced from 300
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step === 'ready') {
      const timer = setTimeout(() => {
        handleStartDemo();
      }, 1000); // Reduced from 3000
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleStartDemo = () => {
    onDemoSuccess?.(formData.name || 'Mehmon');
    onClose();
  };

  const handleBack = async () => {
    if (requestId) {
      try {
        await deleteDoc(doc(db, 'demo_requests', requestId));
      } catch (error) {
        console.error("Error deleting demo request:", error);
      }
    }
    
    // Clear local storage
    localStorage.removeItem('demo_request_id');
    localStorage.removeItem('demo_user_name');
    localStorage.removeItem('demo_user_company');
    localStorage.removeItem('demo_user_contact');
    localStorage.removeItem('demo_approved');
    
    // Reset states
    setRequestId(null);
    setStep('form');
    setFormData({ name: '', company: '', contact: '' });
    
    onClose();
    // Force a page refresh to clear any pending states in App.tsx
    window.location.reload();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative z-[101] w-full max-w-5xl bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:min-h-[600px]"
          >
            {/* Left Side: Image */}
            <div className="w-full md:w-1/2 relative overflow-hidden bg-slate-900 h-[200px] md:h-auto flex-shrink-0">
              <img 
                src="https://iqub.uz/_next/image?url=%2Fimages%2Fimage.webp&w=1920&q=75" 
                alt="Building Complex" 
                className="w-full h-full object-cover opacity-80"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
              
              <button 
                onClick={handleBack}
                className="absolute top-4 left-4 md:top-8 md:left-8 z-20 bg-black/40 hover:bg-black/60 text-white text-[10px] md:text-xs py-1.5 px-3 md:py-2 md:px-4 rounded-xl backdrop-blur-md flex items-center gap-2 transition-all border border-white/10"
              >
                <ChevronLeft size={14} className="md:w-4 md:h-4" />
                Ortga qaytish
              </button>

              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[240px] md:w-[280px] bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-2xl p-4 md:p-8 border border-slate-100 hidden sm:block"
              >
                <h4 className="text-[#F29900] font-black text-lg md:text-xl mb-2 md:mb-4 italic flex items-center gap-2">
                  <Building size={18} className="md:w-5 md:h-5" />
                  И Блок
                </h4>
                <div className="space-y-2 md:space-y-3">
                  <div className="flex justify-between text-[10px] md:text-[11px] font-bold">
                    <span className="text-slate-400 uppercase tracking-wider">Sotuvda:</span>
                    <span className="text-slate-900">45 ta</span>
                  </div>
                  <div className="flex justify-between text-[10px] md:text-[11px] font-bold">
                    <span className="text-slate-400 uppercase tracking-wider">Sotilgan:</span>
                    <span className="text-slate-900">0 ta</span>
                  </div>
                  <div className="flex justify-between text-[10px] md:text-[11px] font-bold">
                    <span className="text-slate-400 uppercase tracking-wider">Maydon:</span>
                    <span className="text-slate-900">42.9 - 72.5 m²</span>
                  </div>
                  <div className="pt-2 md:pt-3 border-t border-slate-50">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-[10px] md:text-[11px] font-bold uppercase tracking-wider">Narx:</span>
                      <span className="text-[#F29900] font-black">300 mln+</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8">
                <p className="text-white/60 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] mb-1">iQUB Ecosystem</p>
                <h4 className="text-white text-sm md:text-lg font-black italic">Professional boshqaruv tizimi</h4>
              </div>
            </div>

            {/* Right Side: Flow */}
            <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center bg-white overflow-y-auto">
              <AnimatePresence mode="wait">
                {step === 'form' && (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 md:space-y-8"
                  >
                    <div>
                      <h3 className="text-2xl md:text-4xl font-black text-slate-900 mb-1 md:mb-2">Demo olish</h3>
                      <p className="text-sm md:text-base text-slate-500 font-medium">Tizim imkoniyatlarini bepul sinab ko'ring</p>
                    </div>

                    <form 
                      onSubmit={(e) => {
                        console.log("Form onSubmit triggered!");
                        handleSubmit(e);
                      }} 
                      className="space-y-4 md:space-y-5"
                    >
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Ismingiz</label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#F29900] transition-colors" size={18} />
                          <input
                            type="text"
                            placeholder="Ismingizni kiriting"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full pl-12 pr-4 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-medium"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Kompaniya nomi</label>
                        <div className="relative group">
                          <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#F29900] transition-colors" size={18} />
                          <input
                            type="text"
                            placeholder="Kompaniya nomi"
                            value={formData.company}
                            onChange={(e) => setFormData({...formData, company: e.target.value})}
                            className="w-full pl-12 pr-4 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-medium"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Telefon / Email</label>
                        <div className="relative group">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#F29900] transition-colors" size={18} />
                          <input
                            type="text"
                            placeholder="+998 90 123 45 67"
                            value={formData.contact}
                            onChange={(e) => setFormData({...formData, contact: e.target.value})}
                            className="w-full pl-12 pr-4 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-medium"
                            required
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        onClick={() => console.log("Button clicked!")}
                        className="w-full gradient-bg text-white py-4 md:py-5 rounded-2xl font-black shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-2 md:mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <Loader2 className="animate-spin" size={20} />
                        ) : (
                          <>
                            Send request
                            <ArrowRight size={20} />
                          </>
                        )}
                      </button>
                    </form>
                  </motion.div>
                )}

                {step === 'providing' && (
                  <motion.div
                    key="providing"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="flex flex-col items-center text-center space-y-8"
                  >
                    <div className="relative">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="w-32 h-32 rounded-full border-4 border-slate-100 border-t-[#F29900]"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center text-white shadow-xl shadow-orange-500/20"
                        >
                          <span className="text-2xl font-black italic">Q</span>
                        </motion.div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-3">
                        <h3 className="text-2xl font-black text-slate-900">{formData.name}</h3>
                        <motion.div
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="px-3 py-1 bg-orange-50 text-[#F29900] text-[10px] font-black rounded-full border border-orange-100 uppercase tracking-widest"
                        >
                          Demo berish...
                        </motion.div>
                      </div>
                      <p className="text-slate-500 font-medium max-w-xs mx-auto">
                        Siz uchun professional demo muhit tayyorlanmoqda. Iltimos, kuting...
                      </p>
                    </div>

                    <div className="w-full max-w-xs space-y-2">
                      <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <span>Tayyorlanmoqda</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          className="h-full gradient-bg rounded-full"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 'pending_approval' && (
                  <motion.div
                    key="pending_approval"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center text-center space-y-8"
                  >
                    <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center text-[#F29900] shadow-inner">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Clock size={64} />
                      </motion.div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-3">
                        <h3 className="text-3xl font-black text-slate-900">{formData.name}</h3>
                        <div className="px-3 py-1 bg-orange-50 text-[#F29900] text-[10px] font-black rounded-full border border-orange-100 uppercase tracking-widest flex items-center gap-1">
                          Kutilmoqda
                        </div>
                      </div>
                      <p className="text-slate-500 font-medium max-w-xs mx-auto">
                        Sizning so'rovingiz admin panelga yuborildi. Admin ruxsat bergandan so'ng demo boshlanadi.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 w-full">
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</p>
                          <p className="text-sm font-bold text-slate-900">Admin tasdiqlashini kutmoqda...</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 'ready' && (
                  <motion.div
                    key="ready"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center text-center space-y-8"
                  >
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 shadow-inner">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 12 }}
                      >
                        <CheckCircle2 size={64} />
                      </motion.div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-3">
                        <h3 className="text-3xl font-black text-slate-900">{formData.name}</h3>
                        <div className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-full border border-green-100 uppercase tracking-widest">
                          TAYYOR
                        </div>
                      </div>
                      <p className="text-slate-500 font-medium max-w-xs mx-auto">
                        Sizning so'rovingiz tasdiqlandi! Demo muhitga yo'naltirilmoqdasiz...
                      </p>
                    </div>

                    <button
                      onClick={handleStartDemo}
                      className="w-full gradient-bg text-white py-5 rounded-2xl font-black shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                    >
                      Demoni boshlash
                      <ArrowRight size={20} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
