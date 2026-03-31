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
import { LoginModal } from './components/Modals';
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';

export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <LanguageProvider>
      <div className="relative">
        {/* Progress Bar */}
        {view === 'landing' && (
          <motion.div
            className="fixed top-0 left-0 right-0 h-1 gradient-bg z-[60] origin-left"
            style={{ scaleX }}
          />
        )}

        <Navbar 
          onViewChange={setView} 
          currentView={view} 
          onLoginClick={() => setIsLoginOpen(true)}
        />
        
        <AnimatePresence mode="wait">
          {view === 'landing' ? (
            <motion.main 
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Hero />
              <Features />
              <WhyIQUB />
              <AutomationSteps />
              <Testimonials />
              <FAQ />
              <Footer />
            </motion.main>
          ) : (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Dashboard />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modals */}
        <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      </div>
    </LanguageProvider>
  );
}
