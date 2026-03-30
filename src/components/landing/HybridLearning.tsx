import { motion } from 'motion/react';
import { Globe, MapPin, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HybridLearning({ content, isEditing, onUpdate }: { content?: any, isEditing?: boolean, onUpdate?: (data: any) => void }) {
  const title = content?.title || "The Best of Both Worlds: Hybrid Learning";
  const description = content?.description || "At Skillabs, we believe learning should fit your lifestyle. Our unique hybrid model combines the convenience of online sessions with the impact of in-person workshops.";

  const handleBlur = (field: string, value: string) => {
    if (onUpdate) {
      onUpdate({ ...content, [field]: value });
    }
  };

  return (
    <section id="hybrid" className="py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex-1"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 text-white rounded-full text-sm font-semibold mb-8 border border-white/10">
            <Globe size={16} className="text-accent" />
            <span>Flexibility First</span>
          </div>
          <h2 
            className={cn(
              "text-4xl md:text-5xl font-display font-bold text-white mb-8 leading-tight outline-none",
              isEditing && "focus:ring-2 focus:ring-accent rounded-lg"
            )}
            contentEditable={isEditing}
            onBlur={(e) => handleBlur('title', e.currentTarget.textContent || '')}
            suppressContentEditableWarning
          >
            {title}
          </h2>
          <p 
            className={cn(
              "text-lg text-white/60 mb-10 leading-relaxed outline-none",
              isEditing && "focus:ring-2 focus:ring-accent rounded-lg"
            )}
            contentEditable={isEditing}
            onBlur={(e) => handleBlur('description', e.currentTarget.textContent || '')}
            suppressContentEditableWarning
          >
            {description}
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent shrink-0">
                <Globe size={24} />
              </div>
              <div>
                <h4 className="text-xl font-display font-bold text-white mb-2">Online Sessions</h4>
                <p className="text-white/60 text-sm">Access expert-led classes from anywhere in the world.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="text-xl font-display font-bold text-white mb-2">Physical Workshops</h4>
                <p className="text-white/60 text-sm">Join us for hands-on projects and interactive group activities.</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex-1 relative"
        >
          <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="https://picsum.photos/seed/education/800/600"
              alt="Hybrid Learning"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="glass-card p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <p className="text-white font-bold">100% Flexible</p>
                  <p className="text-white/70 text-sm">Switch between modes anytime.</p>
                </div>
              </div>
            </div>
          </div>
          {/* Decorative Background */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
}
