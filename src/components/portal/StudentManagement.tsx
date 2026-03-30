import { useState, useEffect } from 'react';
import { 
  Search, 
  Mail, 
  ChevronRight,
  UserPlus,
  Loader2,
  Trash2,
  X,
  Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/firebase';
import { handleFirestoreError, OperationType } from '@/lib/firebase-utils';

interface Student {
  id: string;
  displayName: string;
  email: string;
  role: string;
  progress: number;
  status?: 'Active' | 'Inactive';
  createdAt?: any;
}

export default function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    status: 'Active' as 'Active' | 'Inactive',
    progress: 0
  });

  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', '==', 'client'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const studentData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Student[];
      setStudents(studentData);
      setLoading(false);
    }, (error) => {
      console.error('Students snapshot error:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleStatus = async (studentId: string, currentStatus?: string) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      await updateDoc(doc(db, 'users', studentId), {
        status: newStatus
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${studentId}`);
    }
  };

  const deleteStudent = async (studentId: string) => {
    if (!window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) return;
    try {
      await deleteDoc(doc(db, 'users', studentId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${studentId}`);
    }
  };

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'users'), {
        ...formData,
        role: 'client',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setIsModalOpen(false);
      setFormData({ displayName: '', email: '', status: 'Active', progress: 0 });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'users');
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = (student.displayName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                         (student.email?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary">Student Management</h1>
          <p className="text-primary/60">Manage your students, track their progress, and handle enrollments.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          <UserPlus size={20} />
          Enroll New Student
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
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
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-3 bg-white border border-gray-200 text-primary font-bold rounded-xl text-sm hover:bg-gray-50 transition-all focus:outline-none"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Student List Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-primary/40 uppercase tracking-widest">Student</th>
                <th className="px-6 py-4 text-xs font-bold text-primary/40 uppercase tracking-widest">Progress</th>
                <th className="px-6 py-4 text-xs font-bold text-primary/40 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-primary/40 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode="popLayout">
                {filteredStudents.map((student, index) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50/50 transition-all group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center text-primary font-bold text-xs">
                          {(student.displayName || 'U').split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-primary">{student.displayName || 'Unnamed Student'}</p>
                          <p className="text-xs text-primary/40">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              'h-full transition-all',
                              (student.progress || 0) > 75 ? 'bg-green-500' : (student.progress || 0) > 25 ? 'bg-accent' : 'bg-gray-300'
                            )}
                            style={{ width: `${student.progress || 0}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-primary/60">{student.progress || 0}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => toggleStatus(student.id, student.status)}
                        className={cn(
                          'text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider transition-colors',
                          student.status === 'Active' ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-red-50 text-red-600 hover:bg-red-100'
                        )}
                      >
                        {student.status || 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a href={`mailto:${student.email}`} className="p-2 text-primary/40 hover:text-accent transition-all">
                          <Mail size={16} />
                        </a>
                        <button 
                          onClick={() => deleteStudent(student.id)}
                          className="p-2 text-primary/40 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredStudents.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-primary/40">No students found matching your criteria.</p>
            </div>
          )}
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
          </div>
          <button className="p-2 border border-gray-200 rounded-lg text-primary/40 disabled:opacity-50" disabled>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Enroll Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-primary/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-2xl font-display font-bold text-primary">Enroll Student</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-all text-primary/40 hover:text-primary">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleEnroll} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary">Full Name</label>
                  <input
                    required
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-accent transition-all text-primary font-medium"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary">Email Address</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-accent transition-all text-primary font-medium"
                    placeholder="e.g. john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary">Initial Progress (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-accent transition-all text-primary font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  Enroll Student
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
