import { useState } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Mail, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Filter,
  ChevronRight,
  UserPlus
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const initialStudents = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', enrolled: 'WSC Coaching', joined: 'Jan 12, 2026', progress: 85, status: 'Active' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', enrolled: 'Coding & Robotics', joined: 'Feb 05, 2026', progress: 42, status: 'Active' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', enrolled: 'Public Speaking', joined: 'Mar 10, 2026', progress: 15, status: 'Inactive' },
  { id: '4', name: 'Diana Prince', email: 'diana@example.com', enrolled: 'Advanced Robotics', joined: 'Mar 15, 2026', progress: 0, status: 'Active' },
];

export default function StudentManagement() {
  const [students, setStudents] = useState(initialStudents);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary">Student Management</h1>
          <p className="text-primary/60">Manage your students, track their progress, and handle enrollments.</p>
        </div>
        <button className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
          <UserPlus size={20} />
          Enroll New Student
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-accent transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-4 py-3 bg-white border border-gray-200 text-primary font-bold rounded-xl text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
            <Filter size={18} />
            Course
          </button>
          <button className="flex-1 md:flex-none px-4 py-3 bg-white border border-gray-200 text-primary font-bold rounded-xl text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
            Status
          </button>
        </div>
      </div>

      {/* Student List Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-primary/40 uppercase tracking-widest">Student</th>
                <th className="px-6 py-4 text-xs font-bold text-primary/40 uppercase tracking-widest">Enrolled Course</th>
                <th className="px-6 py-4 text-xs font-bold text-primary/40 uppercase tracking-widest">Joined Date</th>
                <th className="px-6 py-4 text-xs font-bold text-primary/40 uppercase tracking-widest">Progress</th>
                <th className="px-6 py-4 text-xs font-bold text-primary/40 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-primary/40 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredStudents.map((student, index) => (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50/50 transition-all group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center text-primary font-bold text-xs">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-primary">{student.name}</p>
                        <p className="text-xs text-primary/40">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-primary">{student.enrolled}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-primary/60">{student.joined}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            'h-full transition-all',
                            student.progress > 75 ? 'bg-green-500' : student.progress > 25 ? 'bg-accent' : 'bg-gray-300'
                          )}
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-primary/60">{student.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      'text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider',
                      student.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    )}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-primary/40 hover:text-accent transition-all">
                        <Mail size={16} />
                      </button>
                      <button className="p-2 text-primary/40 hover:text-primary transition-all">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Placeholder */}
      <div className="flex items-center justify-between pt-4">
        <p className="text-sm text-primary/40">Showing {filteredStudents.length} of {students.length} students</p>
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
