import { motion } from 'motion/react';
import { Building2, PieChart, DollarSign, Users2, Warehouse, ClipboardList } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function WhyIQUB() {
  const { t } = useLanguage();

  const advantages = [
    {
      title: t('why.control.title'),
      description: t('why.control.desc'),
      icon: Building2,
    },
    {
      title: t('why.crm.title'),
      description: t('why.crm.desc'),
      icon: PieChart,
    },
    {
      title: t('why.finance.title'),
      description: t('why.finance.desc'),
      icon: DollarSign,
    },
    {
      title: t('why.hr.title'),
      description: t('why.hr.desc'),
      icon: Users2,
    },
    {
      title: t('why.warehouse.title'),
      description: t('why.warehouse.desc'),
      icon: Warehouse,
    },
    {
      title: t('why.kpi.title'),
      description: t('why.kpi.desc'),
      icon: ClipboardList,
    },
  ];

  const headingText = t('why.title');
  const subText = t('why.subtitle');

  return (
    <section id="why-iqub" className="py-24 bg-[#F8F9FB] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight"
          >
            {headingText}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base md:text-lg text-slate-600 leading-relaxed font-medium"
          >
            {subText}
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {advantages.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col items-start text-left"
            >
              <div className="w-12 h-12 bg-orange-100/50 rounded-xl flex items-center justify-center mb-8 text-orange-500">
                <item.icon size={24} />
              </div>
              <h3 className="text-[22px] font-bold text-slate-900 mb-4 leading-tight">
                {item.title}
              </h3>
              <p className="text-slate-500 text-[15px] leading-relaxed font-normal">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
