import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Code, Mic, Trophy, ArrowRight, X, CheckCircle2 } from 'lucide-react';

const courses = [
  {
    id: 'wsc',
    title: 'WSC Coaching',
    description: 'Master the World Scholar\'s Cup with expert strategies for debate, writing, and the quiz.',
    longDescription: 'Our World Scholar\'s Cup coaching program is designed to transform students into confident global citizens. We cover all four events of the competition with a focus on critical thinking and collaborative learning.',
    features: [
      'Comprehensive Debate Training',
      'Collaborative Writing Workshops',
      'Curriculum Mastery Sessions',
      'Mock Regional Rounds',
      'Personalized Feedback'
    ],
    icon: <Trophy size={32} className="text-accent" />,
    color: 'bg-accent/10',
  },
  {
    id: 'coding',
    title: 'Coding & Robotics',
    description: 'Build the future with hands-on projects in Python, Arduino, and advanced robotics.',
    longDescription: 'Dive deep into the world of technology. Our coding and robotics track takes students from basic logic to building complex autonomous systems using industry-standard tools and languages.',
    features: [
      'Python Programming Fundamentals',
      'Arduino Hardware Integration',
      'Robotics Design & Assembly',
      'Algorithm Development',
      'Project-Based Learning'
    ],
    icon: <Code size={32} className="text-white" />,
    color: 'bg-white/10',
  },
  {
    id: 'public-speaking',
    title: 'Public Speaking',
    description: 'Develop confidence and eloquence to captivate any audience with your voice.',
    longDescription: 'Unlock the power of your voice. This course focuses on the art of persuasion, storytelling, and body language, helping students overcome stage fright and become impactful communicators.',
    features: [
      'Speech Structure & Rhetoric',
      'Voice Modulation Techniques',
      'Body Language Mastery',
      'Impromptu Speaking Drills',
      'Persuasive Storytelling'
    ],
    icon: <Mic size={32} className="text-accent" />,
    color: 'bg-accent/10',
  },
];

export default function Courses({ content }: { content?: any }) {
  const [selectedCourse, setSelectedCourse] = useState<typeof courses[0] | null>(null);

  return (
    <section id="courses" className="py-32 px-6 bg-primary/50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(242,125,38,0.05),transparent_70%)]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold text-white mb-6"
          >
            Explore Our <span className="text-accent">Expert-Led</span> Courses
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/60 max-w-2xl mx-auto"
          >
            Choose from our specialized programs designed to build real-world skills and confidence.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-10 hover:shadow-2xl transition-all group cursor-default border-white/5 hover:border-accent/30"
            >
              <div className={`w-16 h-16 ${course.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                {course.icon}
              </div>
              <h3 className="text-2xl font-display font-bold text-white mb-4">{course.title}</h3>
              <p className="text-white/60 mb-8 leading-relaxed">
                {course.description}
              </p>
              <button
                onClick={() => setSelectedCourse(course)}
                className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-accent transition-colors"
              >
                Learn More
                <ArrowRight size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Course Details Modal */}
      <AnimatePresence>
        {selectedCourse && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCourse(null)}
              className="absolute inset-0 bg-primary/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-primary border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
            >
              <button
                onClick={() => setSelectedCourse(null)}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors z-10"
              >
                <X size={24} />
              </button>

              <div className="p-8 md:p-12">
                <div className={`w-20 h-20 ${selectedCourse.color} rounded-3xl flex items-center justify-center mb-8`}>
                  {selectedCourse.icon}
                </div>
                <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">{selectedCourse.title}</h3>
                <p className="text-lg text-white/70 mb-10 leading-relaxed">
                  {selectedCourse.longDescription}
                </p>

                <div className="space-y-4 mb-12">
                  <h4 className="text-sm font-bold text-accent uppercase tracking-widest">Key Features</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedCourse.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 text-white/80">
                        <CheckCircle2 size={18} className="text-accent shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="#apply"
                    onClick={() => setSelectedCourse(null)}
                    className="flex-1 px-8 py-4 bg-accent text-white font-bold rounded-2xl hover:bg-accent/90 transition-all text-center"
                  >
                    Apply Now
                  </a>
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="flex-1 px-8 py-4 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition-all border border-white/10"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
