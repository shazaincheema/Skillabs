import { useState } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  BookOpen, 
  Users, 
  Clock, 
  DollarSign,
  Filter,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const initialCourses = [
  { id: '1', title: 'WSC Coaching', category: 'Academic', students: 124, sessions: 48, price: 299, status: 'Active' },
  { id: '2', title: 'Coding & Robotics', category: 'Tech', students: 86, sessions: 36, price: 399, status: 'Active' },
  { id: '3', title: 'Public Speaking', category: 'Soft Skills', students: 92, sessions: 24, price: 199, status: 'Active' },
  { id: '4', title: 'Advanced Robotics', category: 'Tech', students: 45, sessions: 40, price: 499, status: 'Draft' },
];

export default function CourseManagement() {
  const [courses, setCourses] = useState(initialCourses);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary">Course Management</h1>
          <p className="text-primary/60">Create, edit, and manage your educational programs.</p>
        </div>
        <button className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
          <Plus size={20} />
          Add New Course
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-accent transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-4 py-3 bg-white border border-gray-200 text-primary font-bold rounded-xl text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
            <Filter size={18} />
            Category
          </button>
          <button className="flex-1 md:flex-none px-4 py-3 bg-white border border-gray-200 text-primary font-bold rounded-xl text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
            Status
          </button>
        </div>
      </div>

      {/* Course List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col md:row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-6 w-full md:w-auto">
              <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-accent/10 group-hover:text-accent transition-all">
                <BookOpen size={32} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-xl font-display font-bold text-primary">{course.title}</h3>
                  <span className={cn(
                    'text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider',
                    course.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                  )}>
                    {course.status}
                  </span>
                </div>
                <p className="text-sm text-primary/60">{course.category}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8 w-full md:w-auto">
              <div className="text-center md:text-left">
                <p className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-1 flex items-center gap-1.5 justify-center md:justify-start">
                  <Users size={12} />
                  Students
                </p>
                <p className="text-lg font-display font-bold text-primary">{course.students}</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-1 flex items-center gap-1.5 justify-center md:justify-start">
                  <Clock size={12} />
                  Sessions
                </p>
                <p className="text-lg font-display font-bold text-primary">{course.sessions}</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-1 flex items-center gap-1.5 justify-center md:justify-start">
                  <DollarSign size={12} />
                  Price
                </p>
                <p className="text-lg font-display font-bold text-primary">${course.price}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button className="flex-1 md:flex-none p-3 bg-gray-50 text-primary hover:bg-accent/10 hover:text-accent rounded-xl transition-all">
                <Edit2 size={18} />
              </button>
              <button className="flex-1 md:flex-none p-3 bg-gray-50 text-red-400 hover:bg-red-50 rounded-xl transition-all">
                <Trash2 size={18} />
              </button>
              <button className="flex-1 md:flex-none p-3 bg-gray-50 text-primary hover:bg-gray-100 rounded-xl transition-all">
                <MoreVertical size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination Placeholder */}
      <div className="flex items-center justify-between pt-4">
        <p className="text-sm text-primary/40">Showing {filteredCourses.length} of {courses.length} courses</p>
        <div className="flex items-center gap-2">
          <button className="p-2 border border-gray-200 rounded-lg text-primary/40 disabled:opacity-50" disabled>
            <ChevronRight size={18} className="rotate-180" />
          </button>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 bg-primary text-white rounded-lg text-xs font-bold">1</button>
            <button className="w-8 h-8 hover:bg-gray-100 rounded-lg text-xs font-bold">2</button>
          </div>
          <button className="p-2 border border-gray-200 rounded-lg text-primary hover:bg-gray-50">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
