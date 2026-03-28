import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/landing/LandingPage';
import PortalLayout from './components/portal/PortalLayout';
import ClientDashboard from './components/portal/ClientDashboard';
import Booking from './components/portal/Booking';
import Analytics from './components/portal/Analytics';
import WebsiteEditor from './components/editor/WebsiteEditor';
import CourseManagement from './components/portal/CourseManagement';
import StudentManagement from './components/portal/StudentManagement';

import Resources from './components/portal/Resources';
import Payment from './components/portal/Payment';

// Placeholder components for remaining routes
const Placeholder = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-primary/20">
      <h1 className="text-4xl font-bold">?</h1>
    </div>
    <h2 className="text-2xl font-display font-bold text-primary">{title}</h2>
    <p className="text-primary/60 max-w-md">This feature is currently under development. Check back soon!</p>
  </div>
);

import { FirebaseProvider, useAuth } from './components/auth/FirebaseProvider';

import { Link } from 'react-router-dom';
import Logo from './components/ui/Logo';

// Auth Guard Component
const AuthGuard = ({ children, role }: { children: React.ReactNode, role?: 'client' | 'admin' }) => {
  const { user, profile, loading, signIn } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <Logo size={80} className="mb-8" />
        <h1 className="text-3xl font-display font-bold text-primary mb-4">Welcome to Skillabs Portal</h1>
        <p className="text-primary/60 mb-8 max-w-md">Please sign in with your Google account to access your dashboard and courses.</p>
        <button
          onClick={signIn}
          className="px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center gap-3"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6 bg-white p-1 rounded" />
          Sign in with Google
        </button>
      </div>
    );
  }

  if (role === 'admin' && profile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <h1 className="text-3xl font-display font-bold text-primary mb-4">Access Denied</h1>
        <p className="text-primary/60 mb-8 max-w-md">You do not have administrative privileges to access this portal.</p>
        <Link to="/portal/client" className="text-accent font-bold hover:underline">Go to Client Portal</Link>
      </div>
    );
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <FirebaseProvider>
      <Router>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Client Portal */}
          <Route path="/portal/client" element={<AuthGuard><PortalLayout role="client" /></AuthGuard>}>
            <Route index element={<ClientDashboard />} />
            <Route path="booking" element={<Booking />} />
            <Route path="resources" element={<Resources />} />
            <Route path="payments" element={<Payment />} />
          </Route>

          {/* Admin Portal */}
          <Route path="/portal/admin" element={<AuthGuard role="admin"><PortalLayout role="admin" /></AuthGuard>}>
            <Route index element={<Analytics />} />
            <Route path="editor" element={<WebsiteEditor />} />
            <Route path="courses" element={<CourseManagement />} />
            <Route path="students" element={<StudentManagement />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </FirebaseProvider>
  );
}
