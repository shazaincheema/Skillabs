import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../ui/Logo';
import { cn } from '@/lib/utils';

export default function CTA({ content, isEditing, onUpdate }: { content?: any, isEditing?: boolean, onUpdate?: (data: any) => void }) {
  const title = content?.title || "Unlock Your Potential with Skillabs.";
  const subtitle = content?.subtitle || "Join our community of lifelong learners and master the skills that matter. Expert-led sessions, hybrid learning, and personalized growth.";

  const handleBlur = (field: string, value: string) => {
    if (onUpdate) {
      onUpdate({ ...content, [field]: value });
    }
  };

  return (
    <section className="py-32 px-6 bg-primary overflow-hidden relative">
      {/* Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-accent/5 rounded-full blur-3xl opacity-50" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-semibold mb-8 border border-accent/20"
        >
          <Logo size={20} />
          <span>Start Your Skill Journey Today</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={cn(
            "text-4xl md:text-6xl font-display font-bold text-white mb-8 leading-tight outline-none",
            isEditing && "focus:ring-2 focus:ring-accent rounded-lg px-2"
          )}
          contentEditable={isEditing}
          onBlur={(e) => handleBlur('title', e.currentTarget.textContent || '')}
          suppressContentEditableWarning
        >
          {title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className={cn(
            "text-lg text-white/60 mb-12 max-w-2xl mx-auto outline-none",
            isEditing && "focus:ring-2 focus:ring-accent rounded-lg px-2"
          )}
          contentEditable={isEditing}
          onBlur={(e) => handleBlur('subtitle', e.currentTarget.textContent || '')}
          suppressContentEditableWarning
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#apply"
            className="w-full sm:w-auto px-10 py-5 bg-white text-primary font-bold rounded-2xl hover:bg-gray-50 transition-all shadow-2xl shadow-white/10 flex items-center justify-center gap-2 group"
            onClick={(e) => isEditing && e.preventDefault()}
          >
            Get Started Now
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#courses"
            className="w-full sm:w-auto px-10 py-5 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all border border-white/10 flex items-center justify-center gap-2"
            onClick={(e) => isEditing && e.preventDefault()}
          >
            Explore Courses
          </a>
        </motion.div>
      </div>
    </section>
  );
}
