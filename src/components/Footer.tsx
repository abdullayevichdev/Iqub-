import { motion } from 'motion/react';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <motion.div variants={itemVariants}>
            <a href="#" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center text-white font-bold text-xl">
                i
              </div>
              <span className="text-2xl font-extrabold tracking-tight">
                iQUB<span className="text-primary-gradient-via">ERP</span>
              </span>
            </a>
            <p className="text-slate-400 mb-8 leading-relaxed">
              {t('footer.desc')}
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Linkedin, Send].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -5, scale: 1.1 }}
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:gradient-bg transition-all duration-300"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-bold mb-6">{t('footer.links')}</h4>
            <ul className="space-y-4">
              {[
                { name: t('nav.home'), href: '#' },
                { name: t('nav.modules'), href: '#features' },
                { name: t('nav.benefits'), href: '#why-iqub' },
                { name: t('nav.faq'), href: '#faq' }
              ].map((link) => (
                <li key={link.name}>
                  <motion.a 
                    href={link.href} 
                    whileHover={{ x: 5 }}
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-gradient-via opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-bold mb-6">{t('footer.modules')}</h4>
            <ul className="space-y-4">
              {[
                t('footer.m1'), 
                t('footer.m2'), 
                t('footer.m3'), 
                t('footer.m4'), 
                t('footer.m5'), 
                t('footer.m6')
              ].map((link) => (
                <li key={link}>
                  <motion.a 
                    href="#" 
                    whileHover={{ x: 5 }}
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-orange opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-bold mb-6">{t('footer.contact')}</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <Phone size={18} className="text-primary-gradient-via" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">{t('footer.phone')}</p>
                  <a href="tel:+998712000000" className="text-slate-200 hover:text-white transition-colors">+998 71 200 00 00</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <Mail size={18} className="text-primary-gradient-via" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">{t('footer.email')}</p>
                  <a href="mailto:info@iqub.uz" className="text-slate-200 hover:text-white transition-colors">info@iqub.uz</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-primary-gradient-via" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">{t('footer.address')}</p>
                  <p className="text-slate-200">{t('footer.address_val')}</p>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div 
          variants={itemVariants}
          className="pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} iQUB ERP. {t('footer.rights')}
          </p>
          <div className="flex gap-8 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">{t('footer.privacy')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('footer.terms')}</a>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
