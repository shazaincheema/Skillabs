import { motion } from 'motion/react';
import { BookOpen, Calendar, Users, TrendingUp } from 'lucide-react';

const steps = [
  {
    title: 'Choose Course',
    description: 'Browse our expert-led programs and find the perfect fit for your goals.',
    icon: <BookOpen size={24} className="text-accent" />,
  },
  {
    title: 'Book Session',
    description: 'Schedule your first session at a time that works for you.',
    icon: <Calendar size={24} className="text-primary" />,
  },
  {
    title: 'Attend (Online or In-Person)',
    description: 'Join our interactive sessions and learn from the best.',
    icon: <Users size={24} className="text-accent" />,
  },
  {
    title: 'Track Progress',
    description: 'Monitor your growth and celebrate your achievements.',
    icon: <TrendingUp size={24} className="text-primary" />,
  },
];

export default function HowItWorks({ content }: { content?: any }) {
  return (
    <section id="how" className="py-32 px-6 bg-primary/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold text-white mb-6"
          >
            How It <span className="text-accent">Works</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/60 max-w-2xl mx-auto"
          >
            Start your skill journey in four simple steps.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2 z-0" />

          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 bg-primary border border-white/10 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 group-hover:border-accent transition-all shadow-lg">
                {step.icon}
              </div>
              <h4 className="text-xl font-display font-bold text-white mb-4">{step.title}</h4>
              <p className="text-white/60 text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
