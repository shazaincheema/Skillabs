import { useState, useEffect } from 'react';
import { 
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  Filter,
  Loader2,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc,
  addDoc,
  serverTimestamp,
  getDocs,
  where
} from 'firebase/firestore';
import { db } from '@/firebase';
import { handleFirestoreError, OperationType } from '@/lib/firebase-utils';

interface Application {
  id: string;
  name: string;
  email: string;
  age: string;
  contactNumber: string;
  course: string;
  mode: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: any;
}

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'applications'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const appData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Application[];
      setApplications(appData);
      setLoading(false);
    }, (error) => {
      console.error('Applications snapshot error:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateStatus = async (appId: string, newStatus: 'Approved' | 'Rejected') => {
    try {
      const appRef = doc(db, 'applications', appId);
      await updateDoc(appRef, {
        status: newStatus
      });

      if (newStatus === 'Approved') {
        const app = applications.find(a => a.id === appId);
        if (app) {
          // Check if student already exists
          const studentQuery = query(collection(db, 'users'), where('email', '==', app.email), where('role', '==', 'client'));
          const studentSnapshot = await getDocs(studentQuery);
          
          if (studentSnapshot.empty) {
            // Create new student record in 'users' collection
            await addDoc(collection(db, 'users'), {
              displayName: app.name,
              email: app.email,
              role: 'client',
              status: 'Active',
              progress: 0,
              enrolledCourse: app.course,
              enrolledMode: app.mode,
              contactNumber: app.contactNumber,
              age: app.age,
              createdAt: serverTimestamp()
            });
          }
        }
      }

      if (selectedApp?.id === appId) {
        setSelectedApp(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `applications/${appId}`);
    }
  };

  const deleteApplication = async (appId: string) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    try {
      await deleteDoc(doc(db, 'applications', appId));
      if (selectedApp?.id === appId) setSelectedApp(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `applications/${appId}`);
    }
  };

  const filteredApps = applications.filter(app => {
    const matchesSearch = (app.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                         (app.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                         (app.course?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
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
      <div>
        <h1 className="text-3xl font-display font-bold text-primary">Course Applications</h1>
        <p className="text-primary/60">Review and manage new student applications from the landing page.</p>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" />
          <input
            type="text"
            placeholder="Search applications..."
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
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-primary/40 uppercase tracking-widest">Applicant</th>
                <th className="px-6 py-4 text-xs font-bold text-primary/40 uppercase tracking-widest">Course</th>
                <th className="px-6 py-4 text-xs font-bold text-primary/40 uppercase tracking-widest">Mode</th>
                <th className="px-6 py-4 text-xs font-bold text-primary/40 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-primary/40 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-primary/40 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode="popLayout">
                {filteredApps.map((app, index) => (
                  <motion.tr
                    key={app.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50/50 transition-all group"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-bold text-primary">{app.name}</p>
                        <p className="text-xs text-primary/40">{app.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-primary">{app.course}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-primary/60">{app.mode}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-primary/40">
                        {app.createdAt?.toDate ? app.createdAt.toDate().toLocaleDateString() : 'Just now'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        'text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider',
                        app.status === 'Approved' ? 'bg-green-50 text-green-600' : 
                        app.status === 'Rejected' ? 'bg-red-50 text-red-600' : 
                        'bg-yellow-50 text-yellow-600'
                      )}>
                        {app.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setSelectedApp(app)}
                          className="p-2 text-primary/40 hover:text-accent transition-all"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => deleteApplication(app.id)}
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
          {filteredApps.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-primary/40">No applications found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApp(null)}
              className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-primary">Application Details</h2>
                    <p className="text-primary/40">Submitted on {selectedApp.createdAt?.toDate().toLocaleString()}</p>
                  </div>
                  <button onClick={() => setSelectedApp(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <XCircle size={24} className="text-primary/20" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-primary/40 font-bold">Full Name</p>
                    <p className="text-primary font-bold">{selectedApp.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-primary/40 font-bold">Age</p>
                    <p className="text-primary font-bold">{selectedApp.age}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-primary/40 font-bold">Email</p>
                    <p className="text-primary font-bold">{selectedApp.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-primary/40 font-bold">Phone</p>
                    <p className="text-primary font-bold">{selectedApp.contactNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-primary/40 font-bold">Course</p>
                    <p className="text-primary font-bold">{selectedApp.course}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-primary/40 font-bold">Mode</p>
                    <p className="text-primary font-bold">{selectedApp.mode}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex gap-3">
                  <button 
                    onClick={() => updateStatus(selectedApp.id, 'Approved')}
                    className={cn(
                      "flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all",
                      selectedApp.status === 'Approved' ? "bg-green-500 text-white" : "bg-green-50 text-green-600 hover:bg-green-100"
                    )}
                  >
                    <CheckCircle2 size={18} />
                    Approve
                  </button>
                  <button 
                    onClick={() => updateStatus(selectedApp.id, 'Rejected')}
                    className={cn(
                      "flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all",
                      selectedApp.status === 'Rejected' ? "bg-red-500 text-white" : "bg-red-50 text-red-600 hover:bg-red-100"
                    )}
                  >
                    <XCircle size={18} />
                    Reject
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
