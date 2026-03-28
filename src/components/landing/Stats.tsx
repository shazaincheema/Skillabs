import { motion } from 'motion/react';

const stats = [
  { label: 'Active Students', value: '2,500+' },
  { label: 'Expert Mentors', value: '50+' },
  { label: 'Courses Offered', value: '12+' },
  { label: 'Success Rate', value: '98%' },
];

export default function Stats() {
  return (
    <section className="py-20 px-6 bg-primary relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-5xl font-display font-bold text-accent mb-2">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-white/60 font-medium uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
