import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../ui/Logo';

export default function CTA({ content }: { content?: any }) {
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
          className="text-4xl md:text-6xl font-display font-bold text-white mb-8 leading-tight"
        >
          Unlock Your Potential <br />
          <span className="text-accent">with Skillabs.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg text-white/60 mb-12 max-w-2xl mx-auto"
        >
          Join our community of lifelong learners and master the skills that matter.
          Expert-led sessions, hybrid learning, and personalized growth.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/portal/client"
            className="w-full sm:w-auto px-10 py-5 bg-white text-primary font-bold rounded-2xl hover:bg-gray-50 transition-all shadow-2xl shadow-white/10 flex items-center justify-center gap-2 group"
          >
            Get Started Now
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#courses"
            className="w-full sm:w-auto px-10 py-5 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all border border-white/10 flex items-center justify-center gap-2"
          >
            Explore Courses
          </a>
        </motion.div>
      </div>
    </section>
  );
}
