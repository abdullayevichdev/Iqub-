import { motion } from 'motion/react';
import { Users, LayoutDashboard, Home, Warehouse } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Features() {
  const { t } = useLanguage();

  const modules = [
    {
      title: t('features.crm.title'),
      description: t('features.crm.desc'),
      icon: Users,
      image: "https://iqub.uz/_next/image?url=%2Fimages%2Fabout-1.webp&w=1920&q=75"
    },
    {
      title: t('features.dashboard'),
      description: t('features.finance.desc'),
      icon: LayoutDashboard,
      image: "https://iqub.uz/_next/image?url=%2Fimages%2Fabout-2.webp&w=1920&q=75"
    },
    {
      title: t('features.objects'),
      description: t('features.warehouse.desc'),
      icon: Home,
      image: "https://iqub.uz/_next/image?url=%2Fimages%2Fabout-3.webp&w=1920&q=75"
    },
    {
      title: t('features.warehouse.title'),
      description: t('features.warehouse.desc'),
      icon: Warehouse,
      image: "https://iqub.uz/_next/image?url=%2Fimages%2Fabout-4.webp&w=1920&q=75"
    }
  ];

  const headingText = t('features.title');
  const subText = t('features.subtitle');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
  } as const;

  const wordVariants = {
    hidden: { opacity: 0, y: 10 },
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
    <section id="features" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <motion.h2
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight"
          >
            {headingText.split(" ").map((word, i) => (
              <motion.span key={i} variants={wordVariants} className="inline-block mr-[0.25em]">
                {word === "Yagona" || word === "Tizimda" || word === "Boshqaring!" ? (
                  <span className="gradient-text">{word}</span>
                ) : word}
              </motion.span>
            ))}
          </motion.h2>
          <motion.p
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-lg text-slate-600 font-medium"
          >
            {subText.split(" ").map((word, i) => (
              <motion.span key={i} variants={wordVariants} className="inline-block mr-[0.2em]">
                {word}
              </motion.span>
            ))}
          </motion.p>
        </div>

        <div className="space-y-16 md:space-y-32">
          {modules.map((module, index) => (
            <div 
              key={module.title}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8 lg:gap-24`}
            >
              <motion.div 
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="flex-1 text-center lg:text-left"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 gradient-bg rounded-2xl text-white shadow-lg shadow-orange-500/20 mb-6 md:mb-8">
                  <module.icon size={24} className="md:w-8 md:h-8" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 md:mb-6">{module.title}</h3>
                <p className="text-base md:text-lg text-slate-600 leading-relaxed font-medium mb-6 md:mb-8">
                  {module.description}
                </p>
                <motion.button
                  whileHover={{ x: 10 }}
                  className="flex items-center justify-center lg:justify-start gap-2 text-iqub-orange-end font-bold text-lg mx-auto lg:mx-0"
                >
                  {t('features.more')} <span className="text-2xl">→</span>
                </motion.button>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9, x: index % 2 === 0 ? 50 : -50 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
                className="flex-1 w-full"
              >
                <div className="relative group">
                  <div className="absolute -inset-4 gradient-bg opacity-10 blur-2xl rounded-[2rem] md:rounded-[3rem] group-hover:opacity-20 transition-opacity" />
                  <div className="relative rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200 border-4 md:border-8 border-white bg-white">
                    <img 
                      src={module.image} 
                      alt={module.title}
                      className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
