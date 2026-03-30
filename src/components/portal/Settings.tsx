import { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Trash2, 
  Shield, 
  Mail, 
  Loader2,
  CheckCircle2,
  XCircle
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
  setDoc,
  getDocs
} from 'firebase/firestore';
import { db } from '@/firebase';
import { handleFirestoreError, OperationType } from '@/lib/firebase-utils';
import { useAuth } from '../auth/FirebaseProvider';

interface AdminUser {
  id: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'client';
}

export default function Settings() {
  const { user: currentUser } = useAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', '==', 'admin'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const adminData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AdminUser[];
      setAdmins(adminData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;
    
    setIsSubmitting(true);
    setMessage(null);

    try {
      // Check if user already exists
      const q = query(collection(db, 'users'), where('email', '==', newAdminEmail.trim().toLowerCase()));
      const querySnapshot = await getDocs(q);
      
      let sanitizedId = '';
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        sanitizedId = userDoc.id;
        await updateDoc(doc(db, 'users', sanitizedId), {
          role: 'admin'
        });
      } else {
        // If user doesn't exist, we can't really "add" them as admin in Firebase Auth easily from here
        // but we can create a record in 'users' collection so when they log in, they get the role.
        // We'll use a random ID or the email as ID (sanitized)
        sanitizedId = newAdminEmail.trim().toLowerCase().replace(/[^a-zA-Z0-9]/g, '_');
        await setDoc(doc(db, 'users', sanitizedId), {
          email: newAdminEmail.trim().toLowerCase(),
          role: 'admin',
          createdAt: new Date()
        });
      }

      setMessage({ type: 'success', text: `Admin access granted to ${newAdminEmail}` });
      setNewAdminEmail('');

      // Update backend for email notifications
      const updatedAdmins = [...admins, { id: sanitizedId, email: newAdminEmail.trim().toLowerCase(), role: 'admin' as const }];
      await fetch('/api/update-admin-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails: updatedAdmins.map(a => a.email) })
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'users');
      setMessage({ type: 'error', text: 'Failed to add admin. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveAdmin = async (adminId: string, adminEmail: string) => {
    if (adminEmail === currentUser?.email) {
      alert("You cannot remove your own admin access.");
      return;
    }

    if (!window.confirm(`Are you sure you want to remove admin access for ${adminEmail}?`)) return;

    try {
      await updateDoc(doc(db, 'users', adminId), {
        role: 'client'
      });
      setMessage({ type: 'success', text: `Admin access removed for ${adminEmail}` });

      // Update backend for email notifications
      const updatedAdmins = admins.filter(a => a.id !== adminId);
      await fetch('/api/update-admin-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails: updatedAdmins.map(a => a.email) })
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${adminId}`);
      setMessage({ type: 'error', text: 'Failed to remove admin access.' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-primary">Settings</h1>
        <p className="text-primary/60">Manage administrative access and platform configurations.</p>
      </div>

      {/* Admin Management Section */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="text-accent" size={24} />
            <h2 className="text-xl font-display font-bold text-primary">Admin Access Management</h2>
          </div>
          <p className="text-sm text-primary/60">Add or remove administrators by their email address.</p>
        </div>

        <div className="p-8 space-y-8">
          {/* Add Admin Form */}
          <form onSubmit={handleAddAdmin} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
              <input
                type="email"
                placeholder="Enter email address"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-accent transition-all text-primary font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
              Grant Access
            </button>
          </form>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "p-4 rounded-xl flex items-center gap-3 text-sm font-medium",
                message.type === 'success' ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              )}
            >
              {message.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
              {message.text}
            </motion.div>
          )}

          {/* Admin List */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-primary/40 uppercase tracking-widest">Current Administrators</h3>
            <div className="divide-y divide-gray-50 border border-gray-50 rounded-2xl overflow-hidden">
              {admins.map((admin) => (
                <div key={admin.id} className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center text-primary font-bold text-xs">
                      {(admin.displayName || admin.email[0]).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary">{admin.displayName || 'Admin User'}</p>
                      <p className="text-xs text-primary/40">{admin.email}</p>
                    </div>
                  </div>
                  {admin.email !== currentUser?.email && (
                    <button
                      onClick={() => handleRemoveAdmin(admin.id, admin.email)}
                      className="p-2 text-primary/20 hover:text-red-500 transition-all rounded-lg hover:bg-red-50"
                      title="Remove Admin Access"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Other Settings Placeholder */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-display font-bold text-primary mb-4">Platform Settings</h2>
        <div className="space-y-6">
          <div className="flex items-center justify-between py-4 border-b border-gray-50">
            <div>
              <p className="font-bold text-primary">Email Notifications</p>
              <p className="text-sm text-primary/60">Admins will receive notifications via Formspree for new applications.</p>
            </div>
          </div>
          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <div>
              <p className="font-bold text-primary">Maintenance Mode</p>
              <p className="text-sm text-primary/60">Temporarily disable the landing page for updates.</p>
            </div>
            <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
