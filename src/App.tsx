import { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import WhyIQUB from './components/WhyIQUB';
import AutomationSteps from './components/AutomationSteps';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import DemoDashboard from './components/Dashboard/DemoDashboard';
import { LoginModal } from './components/Modals';
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';
import { Toaster } from 'sonner';

export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard' | 'demo'>(() => {
    const savedView = localStorage.getItem('app_view');
    if (savedView === 'demo' && localStorage.getItem('demo_approved') === 'true') {
      return 'demo';
    }
    if (savedView === 'dashboard' && localStorage.getItem('admin_access') === 'true') {
      return 'dashboard';
    }
    return 'landing';
  });
  const [demoUser, setDemoUser] = useState(() => localStorage.getItem('demo_user_name') || '');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const isDemoPending = !!localStorage.getItem('demo_request_id') && localStorage.getItem('demo_approved') !== 'true';

  const [isDemoModalOpen, setIsDemoModalOpen] = useState(() => {
    return isDemoPending;
  });

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const handleDemoSuccess = (name: string) => {
    setDemoUser(name);
    setView('demo');
    setIsDemoModalOpen(false);
    localStorage.setItem('app_view', 'demo');
    localStorage.setItem('demo_user_name', name);
    localStorage.setItem('demo_approved', 'true');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.removeItem('app_view');
    localStorage.removeItem('demo_approved');
    localStorage.removeItem('demo_request_id');
    localStorage.removeItem('demo_user_name');
    localStorage.removeItem('demo_user_company');
    localStorage.removeItem('demo_user_contact');
    localStorage.removeItem('admin_access');
    setView('landing');
    setIsDemoModalOpen(false);
  };

  const handleViewChange = (newView: 'landing' | 'dashboard' | 'demo') => {
    if (isDemoPending) return; // Prevent view change if pending
    setView(newView);
    localStorage.setItem('app_view', newView);
  };

  return (
    <LanguageProvider>
      <div className={`relative ${isDemoPending ? 'overflow-hidden h-screen' : ''}`}>
        {/* Progress Bar */}
        {view === 'landing' && !isDemoPending && (
          <motion.div
            className="fixed top-0 left-0 right-0 h-1 gradient-bg z-[60] origin-left"
            style={{ scaleX }}
          />
        )}

        {view !== 'demo' && !isDemoPending && (
          <Navbar 
            onViewChange={handleViewChange} 
            currentView={view} 
            onLoginClick={() => setIsLoginOpen(true)}
          />
        )}
        
        <AnimatePresence mode="wait">
          {view === 'landing' ? (
            <motion.main 
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Hero 
                onDemoSuccess={handleDemoSuccess} 
                isDemoModalOpen={isDemoModalOpen}
                setIsDemoModalOpen={setIsDemoModalOpen}
              />
              <Features />
              <WhyIQUB />
              <AutomationSteps />
              <Testimonials />
              <FAQ />
              <Footer onAdminClick={() => setIsLoginOpen(true)} />
            </motion.main>
          ) : view === 'dashboard' ? (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Dashboard />
            </motion.div>
          ) : (
            <motion.div 
              key="demo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="h-screen"
            >
              <DemoDashboard 
                userName={demoUser} 
                onLogout={handleLogout}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modals */}
        <LoginModal 
          isOpen={isLoginOpen} 
          onClose={() => setIsLoginOpen(false)} 
          onDemoSuccess={handleDemoSuccess}
        />
        <Toaster position="top-center" richColors />
      </div>
    </LanguageProvider>
  );
}
