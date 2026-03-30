import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export default function Stats({ content, isEditing, onUpdate }: { content?: any, isEditing?: boolean, onUpdate?: (data: any) => void }) {
  const statsList = content?.stats || [
    { label: 'Active Students', value: '2,500+' },
    { label: 'Expert Mentors', value: '50+' },
    { label: 'Courses Offered', value: '12+' },
    { label: 'Success Rate', value: '98%' },
  ];

  const handleBlur = (index: number, field: string, value: string) => {
    if (onUpdate) {
      const newStats = [...statsList];
      newStats[index] = { ...newStats[index], [field]: value };
      onUpdate({ ...content, stats: newStats });
    }
  };

  return (
    <section className="py-20 px-6 bg-primary relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {statsList.map((stat: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div 
                className={cn(
                  "text-3xl md:text-5xl font-display font-bold text-accent mb-2 outline-none",
                  isEditing && "focus:ring-2 focus:ring-accent rounded-lg"
                )}
                contentEditable={isEditing}
                onBlur={(e) => handleBlur(index, 'value', e.currentTarget.textContent || '')}
                suppressContentEditableWarning
              >
                {stat.value}
              </div>
              <div 
                className={cn(
                  "text-sm md:text-base text-white/60 font-medium uppercase tracking-wider outline-none",
                  isEditing && "focus:ring-2 focus:ring-accent rounded-lg"
                )}
                contentEditable={isEditing}
                onBlur={(e) => handleBlur(index, 'label', e.currentTarget.textContent || '')}
                suppressContentEditableWarning
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
