import { motion } from 'motion/react';
import { Link, Monitor, TrendingUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AutomationSteps() {
  const { t } = useLanguage();

  const steps = [
    {
      number: "01",
      title: t('steps.s1_title'),
      description: t('steps.s1_desc'),
      icon: Link,
    },
    {
      number: "02",
      title: t('steps.s2_title'),
      description: t('steps.s2_desc'),
      icon: Monitor,
    },
    {
      number: "03",
      title: t('steps.s3_title'),
      description: t('steps.s3_desc'),
      icon: TrendingUp,
    },
  ];

  const headingText = t('steps.title');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

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
    <section id="steps" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.h2
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight"
          >
            {headingText.split(" ").map((word, i, arr) => (
              <motion.span key={i} variants={wordVariants} className="inline-block mr-[0.25em]">
                {i >= arr.length - 3 ? (
                  <span className="gradient-text">{word}</span>
                ) : word}
              </motion.span>
            ))}
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-1.5 gradient-bg mx-auto rounded-full" 
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-12 relative">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.2,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              whileHover={{ 
                y: -10,
                scale: 1.02,
                transition: { type: "spring", stiffness: 400, damping: 10 }
              }}
              className="relative z-10 flex flex-col items-center text-center p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-slate-50 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group"
            >
              <div className="relative mb-8 md:mb-12">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-20 h-20 md:w-24 md:h-24 gradient-bg rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-500/20 text-white group-hover:shadow-orange-500/40 transition-all"
                >
                  <step.icon size={36} className="md:w-11 md:h-11" />
                </motion.div>
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.2, type: "spring" }}
                  className="absolute -top-4 -right-4 w-12 h-12 bg-white text-slate-900 rounded-full flex items-center justify-center font-black text-xl shadow-lg border-4 border-slate-50 group-hover:border-white transition-colors"
                >
                  {step.number}
                </motion.div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-iqub-orange-end transition-colors">{step.title}</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
