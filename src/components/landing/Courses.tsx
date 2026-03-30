import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Code, Mic, Trophy, ArrowRight, X, CheckCircle2, Loader2, BookOpen } from 'lucide-react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { handleFirestoreError, OperationType } from '../../lib/firebase-utils';
import { cn } from '@/lib/utils';

interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription?: string;
  features?: string[];
  price: string;
  status: 'Active' | 'Draft';
  image?: string;
  media?: string[];
}

const categoryIcons: Record<string, React.ReactNode> = {
  'WSC Coaching': <Trophy size={32} className="text-accent" />,
  'Coding & Robotics': <Code size={32} className="text-white" />,
  'Public Speaking': <Mic size={32} className="text-accent" />,
  'Default': <BookOpen size={32} className="text-accent" />
};

const categoryColors: Record<string, string> = {
  'WSC Coaching': 'bg-accent/10',
  'Coding & Robotics': 'bg-white/10',
  'Public Speaking': 'bg-accent/10',
  'Default': 'bg-accent/10'
};

export default function Courses({ content, isEditing, onUpdate }: { content?: any, isEditing?: boolean, onUpdate?: (data: any) => void }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  const title = content?.title || "Explore Our Expert-Led Courses";
  const subtitle = content?.subtitle || "Choose from our specialized programs designed to build real-world skills and confidence.";

  const handleBlur = (field: string, value: string) => {
    if (onUpdate) {
      onUpdate({ ...content, [field]: value });
    }
  };

  useEffect(() => {
    const q = query(
      collection(db, 'courses'), 
      where('status', '==', 'Active'),
      orderBy('order', 'asc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const coursesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Course[];
      setCourses(coursesData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'courses');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section id="courses" className="py-32 px-6 bg-primary/50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(242,125,38,0.05),transparent_70%)]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn(
              "text-4xl md:text-5xl font-display font-bold text-white mb-6 outline-none",
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

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card overflow-hidden hover:shadow-2xl transition-all group cursor-default border-white/5 hover:border-accent/30 flex flex-col"
              >
                <div className="relative h-48 bg-white/5 overflow-hidden">
                  {course.image ? (
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className={`w-full h-full ${categoryColors[course.category] || categoryColors.Default} flex items-center justify-center`}>
                      {categoryIcons[course.category] || categoryIcons.Default}
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-primary/80 backdrop-blur-md text-[10px] font-bold text-white rounded-full uppercase tracking-widest border border-white/10">
                      {course.category}
                    </span>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-display font-bold text-white mb-4 group-hover:text-accent transition-colors">{course.title}</h3>
                  <p className="text-white/60 mb-8 leading-relaxed line-clamp-3">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                    <span className="text-accent font-bold">{course.price}</span>
                    <button
                      onClick={() => setSelectedCourse(course)}
                      className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-accent transition-colors"
                    >
                      Learn More
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
            <p className="text-white/40 font-medium">No courses available at the moment. Check back soon!</p>
          </div>
        )}
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
              className="relative w-full max-w-3xl bg-primary border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <button
                onClick={() => setSelectedCourse(null)}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors z-50 bg-primary/50 backdrop-blur-md p-2 rounded-full"
              >
                <X size={24} />
              </button>

              <div className="overflow-y-auto flex-1 custom-scrollbar">
                {/* Hero Image / Header */}
                <div className="relative h-64 md:h-80 w-full">
                  {selectedCourse.image ? (
                    <img src={selectedCourse.image} alt={selectedCourse.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className={`w-full h-full ${categoryColors[selectedCourse.category] || categoryColors.Default} flex items-center justify-center`}>
                      {categoryIcons[selectedCourse.category] || categoryIcons.Default}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-accent text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
                        {selectedCourse.category}
                      </span>
                    </div>
                    <h3 className="text-3xl md:text-5xl font-display font-bold text-white">{selectedCourse.title}</h3>
                  </div>
                </div>

                <div className="p-8 md:p-12 pt-8">
                  <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/10">
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Price</p>
                        <p className="text-2xl font-bold text-accent">{selectedCourse.price}</p>
                      </div>
                      <div className="w-px h-10 bg-white/10" />
                      <div className="text-center">
                        <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Status</p>
                        <p className="text-sm font-bold text-green-400">Enrolling Now</p>
                      </div>
                    </div>
                    <a
                      href="#apply"
                      onClick={() => setSelectedCourse(null)}
                      className="px-8 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-all shadow-lg shadow-accent/20"
                    >
                      Apply Now
                    </a>
                  </div>

                  {/* Media Gallery */}
                  {selectedCourse.media && selectedCourse.media.length > 0 && (
                    <div className="space-y-4 mb-12">
                      <h4 className="text-sm font-bold text-accent uppercase tracking-widest">Course Gallery</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedCourse.media.map((url, i) => (
                          <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="aspect-video rounded-2xl overflow-hidden border border-white/10 bg-white/5 group"
                          >
                            <img src={url} alt={`${selectedCourse.title} media ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="md:col-span-2 space-y-8">
                      <div>
                        <h4 className="text-sm font-bold text-accent uppercase tracking-widest mb-4">About the Course</h4>
                        <p className="text-lg text-white/70 leading-relaxed">
                          {selectedCourse.longDescription || selectedCourse.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-8">
                      {selectedCourse.features && selectedCourse.features.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="text-sm font-bold text-accent uppercase tracking-widest">What you'll learn</h4>
                          <div className="space-y-3">
                            {selectedCourse.features.map((feature, i) => (
                              <div key={i} className="flex items-start gap-3 text-white/80">
                                <CheckCircle2 size={18} className="text-accent shrink-0 mt-0.5" />
                                <span className="text-sm leading-tight">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-primary/50 backdrop-blur-md border-t border-white/10 flex gap-4">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="flex-1 px-8 py-4 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition-all border border-white/10"
                >
                  Close Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
