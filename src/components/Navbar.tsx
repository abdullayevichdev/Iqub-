import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronRight, Globe, Layout, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  onViewChange: (view: 'landing' | 'dashboard') => void;
  currentView: 'landing' | 'dashboard';
  onLoginClick: () => void;
}

export default function Navbar({ onViewChange, currentView, onLoginClick }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.home'), href: '#home' },
    { name: t('nav.modules'), href: '#features' },
    { name: t('nav.benefits'), href: '#why-iqub' },
    { name: t('nav.faq'), href: '#faq' },
  ];

  const languages = [
    { code: 'uz' as const, name: 'Uzb', flag: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Flag_of_Uzbekistan.svg' },
    { code: 'ru' as const, name: 'Pyc', flag: 'https://upload.wikimedia.org/wikipedia/en/f/f3/Flag_of_Russia.svg' },
    { code: 'en' as const, name: 'Eng', flag: 'https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || currentView === 'dashboard' ? 'bg-white shadow-sm py-4' : 'bg-white py-6'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-8 md:px-16">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0 w-[120px]">
            <motion.button 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => onViewChange('landing')} 
              className="flex items-center"
            >
              <span className="text-[32px] font-[900] tracking-[-0.05em] text-[#141414] leading-none">
                i<span className="tracking-[-0.02em]">QUB</span>
              </span>
            </motion.button>
          </div>

          {/* Desktop Nav - Centered */}
          <div className="hidden md:flex flex-1 justify-center items-center space-x-14">
            {currentView === 'landing' && navLinks.map((link, i) => (
              <motion.a
                key={link.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                href={link.href}
                className={`text-[18px] font-bold transition-colors ${
                  link.name === t('nav.home') ? 'text-[#F27D26]' : 'text-[#141414] hover:text-[#F27D26]'
                }`}
              >
                {link.name}
              </motion.a>
            ))}
          </div>

          {/* Language Selector - Right */}
          <div className="hidden md:flex items-center space-x-10 w-[320px] justify-end">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className="flex items-center gap-3 group"
              >
                <div className={`w-8 h-8 rounded-full overflow-hidden shadow-sm border-2 transition-all ${
                  language === lang.code ? 'border-[#F27D26] scale-110' : 'border-transparent'
                }`}>
                  <img src={lang.flag} alt={lang.name} className="w-full h-full object-cover" />
                </div>
                <span className={`text-[16px] font-semibold transition-colors ${
                  language === lang.code ? 'text-[#F27D26]' : 'text-[#94A3B8] group-hover:text-[#F27D26]'
                }`}>
                  {lang.name}
                </span>
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-900 p-2 focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 px-3 space-y-4">
                <div className="flex items-center justify-center gap-6 py-4 border-b border-slate-100">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                        language === lang.code ? 'bg-slate-100 text-[#F27D26]' : 'text-slate-600'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full overflow-hidden border ${
                        language === lang.code ? 'border-[#F27D26]' : 'border-slate-200'
                      }`}>
                        <img src={lang.flag} alt={lang.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm font-bold">
                        {lang.name}
                      </span>
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => {
                    onViewChange(currentView === 'landing' ? 'dashboard' : 'landing');
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 text-slate-700 font-bold border border-slate-200 rounded-xl"
                >
                  <Layout size={18} />
                  {currentView === 'landing' ? t('nav.dashboard') : t('nav.landing')}
                </button>

                {!isAuthenticated && (
                  <button 
                    onClick={() => { onLoginClick(); setIsOpen(false); }}
                    className="w-full py-3 text-center font-bold text-slate-700 border border-slate-200 rounded-xl"
                  >
                    {t('nav.login')}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
