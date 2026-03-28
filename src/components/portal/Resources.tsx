import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  Download, 
  PlayCircle, 
  FileText, 
  BookOpen, 
  ExternalLink,
  ChevronRight,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

const resources = [
  { id: '1', title: 'WSC Debate Fundamentals', type: 'PDF', category: 'Academic', size: '2.4 MB', rating: 4.8 },
  { id: '2', title: 'Python for Beginners', type: 'Video', category: 'Tech', duration: '15:30', rating: 4.9 },
  { id: '3', title: 'Public Speaking Mastery', type: 'Course', category: 'Soft Skills', lessons: 12, rating: 5.0 },
  { id: '4', title: 'Robotics Kit Guide', type: 'PDF', category: 'Tech', size: '5.1 MB', rating: 4.7 },
  { id: '5', title: 'WSC Writing Workshop', type: 'Video', category: 'Academic', duration: '45:00', rating: 4.9 },
  { id: '6', title: 'Arduino Basics', type: 'Course', category: 'Tech', lessons: 8, rating: 4.6 },
];

export default function Resources() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary">Resources Library</h1>
          <p className="text-primary/60">Access all your course materials, recordings, and guides.</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" />
          <input
            type="text"
            placeholder="Search resources..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-accent transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-4 py-3 bg-white border border-gray-200 text-primary font-bold rounded-xl text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
            <Filter size={18} />
            Category
          </button>
          <button className="flex-1 md:flex-none px-4 py-3 bg-white border border-gray-200 text-primary font-bold rounded-xl text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
            Type
          </button>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource, index) => (
          <motion.div
            key={resource.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col"
          >
            <div className="flex items-start justify-between mb-6">
              <div className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center transition-all',
                resource.type === 'Video' ? 'bg-red-50 text-red-500' : 
                resource.type === 'PDF' ? 'bg-blue-50 text-blue-500' : 'bg-accent/10 text-accent'
              )}>
                {resource.type === 'Video' ? <PlayCircle size={24} /> : 
                 resource.type === 'PDF' ? <FileText size={24} /> : <BookOpen size={24} />}
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-accent">
                <Star size={14} fill="currentColor" />
                {resource.rating}
              </div>
            </div>

            <h3 className="text-lg font-display font-bold text-primary mb-2 group-hover:text-accent transition-colors">
              {resource.title}
            </h3>
            <p className="text-xs text-primary/40 mb-6 uppercase tracking-widest font-bold">
              {resource.category} • {resource.type}
            </p>

            <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
              <span className="text-xs text-primary/40 font-medium">
                {resource.size || `${resource.duration || `${resource.lessons} Lessons`}`}
              </span>
              <button className="flex items-center gap-2 text-sm font-bold text-primary hover:text-accent transition-colors">
                {resource.type === 'Course' ? 'View Course' : 'Download'}
                {resource.type === 'Course' ? <ChevronRight size={16} /> : <Download size={16} />}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
