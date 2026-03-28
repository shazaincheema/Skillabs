import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../ui/Logo';

export default function Hero({ content }: { content?: any }) {
  const title = content?.title || "Master Lifelong Skills with Skillabs";
  const subtitle = content?.subtitle || "Expert-led sessions in WSC Coaching, Coding & Robotics, and Public Speaking. Unlock your potential with our premium educational platform.";
  const ctaPrimary = content?.ctaPrimary || "Get Started";
  const ctaSecondary = content?.ctaSecondary || "Explore Courses";

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-32 px-6 overflow-hidden bg-primary">
      {/* Atmospheric Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-white/5 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(242,125,38,0.05),transparent_70%)]" />
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 text-white/80 rounded-full text-sm font-semibold mb-8 border border-white/10 backdrop-blur-sm"
        >
          <Sparkles size={16} className="text-accent" />
          <span>Hybrid Learning — Online & In-Person</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl font-display font-bold text-white mb-8 leading-[1] tracking-tight"
        >
          {title.split('with Skillabs')[0]} <br />
          <span className="text-accent drop-shadow-[0_0_30px_rgba(242,125,38,0.3)]">with Skillabs.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-2xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <Link
            to="/portal/client"
            className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group"
          >
            {ctaPrimary}
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#courses"
            className="w-full sm:w-auto px-8 py-4 bg-white text-primary font-bold rounded-2xl hover:bg-gray-50 transition-all border border-gray-200 flex items-center justify-center gap-2"
          >
            {ctaSecondary}
          </a>
        </motion.div>

        {/* Tagline from image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex items-center justify-center gap-4 text-2xl md:text-3xl font-display font-bold text-white/80"
        >
          <span>Learn.</span>
          <span className="text-accent">Achieve.</span>
          <span>Become.</span>
        </motion.div>

        {/* Logo in Hero as requested */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 flex items-center justify-center opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default"
        >
          <Logo size={120} showText={true} textColor="text-white" />
        </motion.div>
      </div>
    </section>
  );
}
