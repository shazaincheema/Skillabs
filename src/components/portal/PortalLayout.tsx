import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  CreditCard, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  GraduationCap,
  Globe,
  Users,
  BarChart3,
  FileText
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';

import { useAuth } from '../auth/FirebaseProvider';

import Logo from '../ui/Logo';

export default function PortalLayout({ role }: { role: 'admin' }) {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const { profile, logout } = useAuth();

  const adminLinks = [
    { name: 'Analytics', href: '/portal/admin', icon: BarChart3 },
    { name: 'Website Editor', href: '/portal/admin/editor', icon: Globe },
    { name: 'Courses', href: '/portal/admin/courses', icon: BookOpen },
    { name: 'Students', href: '/portal/admin/students', icon: Users },
    { name: 'Applications', href: '/portal/admin/applications', icon: FileText },
  ];

  const links = adminLinks;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 280 : 80 }}
        className="bg-primary text-white flex flex-col fixed h-full z-50 overflow-hidden"
      >
        <div className="p-6 flex items-center justify-between mb-8">
          {isOpen ? (
            <Link to="/" className="flex items-center gap-2">
              <Logo size={32} showText={true} textColor="text-white" />
            </Link>
          ) : (
            <div className="flex justify-center w-full">
              <Logo size={32} />
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors hidden md:block"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {links.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  'flex items-center gap-4 px-4 py-3 rounded-xl transition-all group',
                  isActive 
                    ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                )}
              >
                <link.icon size={20} className={cn(isActive ? 'text-white' : 'text-white/60 group-hover:text-white')} />
                {isOpen && <span className="font-medium">{link.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/portal/admin/settings"
            className={cn(
              "flex items-center gap-4 px-4 py-3 rounded-xl transition-all group",
              location.pathname === '/portal/admin/settings'
                ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            )}
          >
            <Settings size={20} className={cn(location.pathname === '/portal/admin/settings' ? 'text-white' : 'text-white/60 group-hover:text-white')} />
            {isOpen && <span className="font-medium">Settings</span>}
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-all"
          >
            <LogOut size={20} />
            {isOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main 
        className={cn(
          'flex-1 transition-all duration-300 min-h-screen',
          isOpen ? 'md:ml-[280px]' : 'md:ml-[80px]'
        )}
      >
        <header className="bg-white border-b border-gray-200 h-20 flex items-center justify-between px-8 sticky top-0 z-40">
          <h2 className="text-xl font-display font-bold text-primary">
            {links.find(l => l.href === location.pathname)?.name || 'Portal'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-primary">{profile?.displayName || 'User'}</p>
              <p className="text-xs text-primary/60 capitalize">{profile?.role || role}</p>
            </div>
            <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.displayName || 'User'}`}
                alt="Profile"
              />
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
