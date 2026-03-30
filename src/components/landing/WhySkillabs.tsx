import { motion } from 'motion/react';
import { Users, Globe, Rocket, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

const defaultFeatures = [
  {
    title: 'Expert Mentors',
    description: 'Learn from industry leaders and experienced educators who are passionate about sharing their knowledge.',
    icon: <Users size={24} className="text-accent" />,
  },
  {
    title: 'Hybrid Learning',
    description: 'Enjoy the flexibility of online classes combined with the impact of in-person sessions.',
    icon: <Globe size={24} className="text-white" />,
  },
  {
    title: 'Real-world Skills',
    description: 'Our curriculum is designed to equip you with practical skills that are in high demand today.',
    icon: <Rocket size={24} className="text-accent" />,
  },
  {
    title: 'Personalized Growth',
    description: 'Receive tailored feedback and guidance to help you reach your individual goals.',
    icon: <Target size={24} className="text-white" />,
  },
];

export default function WhySkillabs({ content, isEditing, onUpdate }: { content?: any, isEditing?: boolean, onUpdate?: (data: any) => void }) {
  const title = content?.title || "Why Choose Skillabs?";
  const subtitle = content?.subtitle || "We provide a premium educational experience that focuses on your long-term success.";
  const features = content?.features || defaultFeatures;

  const handleBlur = (field: string, value: string) => {
    if (onUpdate) {
      onUpdate({ ...content, [field]: value });
    }
  };

  const handleFeatureBlur = (index: number, field: string, value: string) => {
    if (onUpdate) {
      const newFeatures = [...features];
      newFeatures[index] = { ...newFeatures[index], [field]: value };
      onUpdate({ ...content, features: newFeatures });
    }
  };

  return (
    <section id="why" className="py-32 px-6 bg-primary text-white overflow-hidden relative">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/5 skew-x-12 -translate-y-1/4" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn(
              "text-4xl md:text-5xl font-display font-bold mb-6 outline-none",
              isEditing && "focus:ring-2 focus:ring-accent rounded-lg"
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
              "text-lg text-white/60 max-w-2xl mx-auto outline-none",
              isEditing && "focus:ring-2 focus:ring-accent rounded-lg"
            )}
            contentEditable={isEditing}
            onBlur={(e) => handleBlur('subtitle', e.currentTarget.textContent || '')}
            suppressContentEditableWarning
          >
            {subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all group"
            >
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon || defaultFeatures[index % defaultFeatures.length].icon}
              </div>
              <h4 
                className={cn(
                  "text-xl font-display font-bold mb-4 outline-none",
                  isEditing && "focus:ring-2 focus:ring-accent rounded-lg"
                )}
                contentEditable={isEditing}
                onBlur={(e) => handleFeatureBlur(index, 'title', e.currentTarget.textContent || '')}
                suppressContentEditableWarning
              >
                {feature.title}
              </h4>
              <p 
                className={cn(
                  "text-white/60 text-sm leading-relaxed outline-none",
                  isEditing && "focus:ring-2 focus:ring-accent rounded-lg"
                )}
                contentEditable={isEditing}
                onBlur={(e) => handleFeatureBlur(index, 'description', e.currentTarget.textContent || '')}
                suppressContentEditableWarning
              >
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
