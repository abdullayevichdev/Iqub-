import { motion } from 'motion/react';
import { Quote } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Testimonials() {
  const { t } = useLanguage();

  const testimonials = [
    {
      name: "Malika K.",
      position: t('testimonials.pos1'),
      quote: t('testimonials.q1'),
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
    },
    {
      name: "Ahmad S.",
      position: t('testimonials.pos2'),
      quote: t('testimonials.q2'),
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
    },
    {
      name: "Azizbek R.",
      position: t('testimonials.pos3'),
      quote: t('testimonials.q3'),
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    },
    {
      name: "O‘tkir M.",
      position: t('testimonials.pos4'),
      quote: t('testimonials.q4'),
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    },
    {
      name: "Jasur B.",
      position: t('testimonials.pos5'),
      quote: t('testimonials.q5'),
      photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop",
    },
    {
      name: "Nigora T.",
      position: t('testimonials.pos6'),
      quote: t('testimonials.q6'),
      photo: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=200&auto=format&fit=crop",
    },
    {
      name: "Farhod E.",
      position: t('testimonials.pos7'),
      quote: t('testimonials.q7'),
      photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop",
    },
    {
      name: "Dilnoza A.",
      position: t('testimonials.pos8'),
      quote: t('testimonials.q8'),
      photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop",
    },
  ];

  const headingText = t('testimonials.title');
  const subText = t('testimonials.subtitle_val');
  
  // Duplicate testimonials for seamless infinite scroll
  const extendedTestimonials = [...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="py-24 bg-[#F8F9FB] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight"
          >
            {headingText}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 font-medium"
          >
            {subText}
          </motion.p>
        </div>

        <div className="relative group">
          <motion.div 
            className="flex gap-6 w-max"
            animate={{
              x: [0, -1 * (testimonials.length * 424)], // 400px width + 24px gap
            }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "linear",
            }}
            whileHover={{ animationPlayState: "paused" }}
          >
            {extendedTestimonials.map((testimonial, index) => (
              <div
                key={index}
                className="w-[350px] md:w-[400px] bg-white p-10 rounded-[2.5rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col justify-between"
              >
                <div>
                  <div className="mb-6">
                    <svg width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 18V9.5C0 6.5 0.5 4.16667 1.5 2.5C2.5 0.833333 4.16667 0 6.5 0V4C5.16667 4 4.33333 4.5 4 5.5C3.66667 6.5 3.5 7.5 3.5 8.5H7V18H0ZM13 18V9.5C13 6.5 13.5 4.16667 14.5 2.5C15.5 0.833333 17.1667 0 19.5 0V4C18.1667 4 17.3333 4.5 17 5.5C16.6667 6.5 16.5 7.5 16.5 8.5H20V18H13Z" fill="#141414"/>
                    </svg>
                  </div>
                  <p className="text-slate-700 leading-[1.6] mb-10 text-[15px] font-normal min-h-[120px]">
                    {testimonial.quote}
                  </p>
                </div>
                
                <div className="pt-8 border-t border-slate-100 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                    <img
                      src={testimonial.photo}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-[16px] font-bold text-slate-900 truncate">{testimonial.name}</h4>
                    <p className="text-[13px] text-slate-400 font-medium truncate">{testimonial.position}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
          
          {/* Gradient overlays for smooth fade */}
          <div className="absolute top-0 left-0 bottom-0 w-32 bg-linear-to-r from-[#F8F9FB] to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 bottom-0 w-32 bg-linear-to-l from-[#F8F9FB] to-transparent z-10 pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
