import { useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { GetDemoModal } from './Modals';

interface HeroProps {
  onDemoSuccess?: (name: string) => void;
  isDemoModalOpen: boolean;
  setIsDemoModalOpen: (isOpen: boolean) => void;
}

export default function Hero({ onDemoSuccess, isDemoModalOpen, setIsDemoModalOpen }: HeroProps) {
  const { t } = useLanguage();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);

  const headingText = t('hero.title');
  const subText = t('hero.subtitle');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  } as const;

  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  } as const;

  return (
    <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden hero-gradient">
      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            y: [0, -40, 0],
            rotate: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-[10%] w-16 h-16 bg-iqub-orange-start/20 rounded-2xl rotate-12 blur-sm"
        />
        <motion.div 
          animate={{ 
            y: [0, 50, 0],
            rotate: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-[15%] w-24 h-24 bg-iqub-orange-end/10 rounded-full blur-md"
        />
        <motion.div 
          animate={{ 
            x: [0, 40, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-40 left-[20%] w-12 h-12 bg-iqub-orange-start/30 rounded-full blur-sm"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [45, 90, 45],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-[10%] w-32 h-32 border-4 border-iqub-orange-start/20 rounded-3xl rotate-45"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-50 text-iqub-orange-end text-xs font-black mb-10 border border-orange-100 shadow-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-iqub-orange-end animate-pulse" />
            {t('hero.trust')}
          </motion.div>
          
          <motion.h1
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.15] mb-8 tracking-tight"
          >
            {headingText.split(" ").map((word, i) => (
              <motion.span key={i} variants={wordVariants} className="inline-block mr-[0.25em]">
                {word === "Avtomatlashtiring!" ? (
                  <span className="gradient-text">{word}</span>
                ) : word}
              </motion.span>
            ))}
          </motion.h1>
          
          <motion.p
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-lg md:text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            {subText.split(" ").map((word, i) => (
              <motion.span key={i} variants={wordVariants} className="inline-block mr-[0.2em]">
                {word}
              </motion.span>
            ))}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-16 px-4"
          >
            <button 
              onClick={() => setIsDemoModalOpen(true)}
              className="w-full sm:w-auto bg-[#F29900] text-white px-8 sm:px-32 py-4 rounded-2xl text-xl font-bold shadow-md hover:scale-105 transition-all active:scale-95"
            >
              Get demo
            </button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1, type: "spring" }}
            className="mt-20 relative"
          >
            <motion.div 
              style={{ y: y1 }} 
              className="relative z-10"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border-[16px] border-white bg-white">
                <img 
                  src="https://iqub.uz/_next/image?url=%2Fimages%2Fhero-image.webp&w=3840&q=75" 
                  alt="iQUB ERP Dashboard" 
                  className="w-full h-auto"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
            
            {/* Decorative elements behind image */}
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute -top-20 -left-20 w-60 h-60 gradient-bg opacity-10 blur-[100px] rounded-full" 
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.1, 0.15, 0.1],
              }}
              transition={{ duration: 12, repeat: Infinity }}
              className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-500/10 blur-[120px] rounded-full" 
            />
          </motion.div>
        </div>
      </div>
      <GetDemoModal 
        isOpen={isDemoModalOpen} 
        onClose={() => setIsDemoModalOpen(false)} 
        onDemoSuccess={onDemoSuccess}
      />
    </section>
  );
}
