import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  PlayCircle, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  ChevronRight,
  TrendingUp,
  BookOpen,
  Award,
  BarChart3,
  Megaphone
} from 'lucide-react';

import { useAuth } from '../auth/FirebaseProvider';
import { cn } from '@/lib/utils';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase';

interface PortalConfig {
  welcomeMessage: string;
  announcement: string;
}

export default function ClientDashboard() {
  const { profile } = useAuth();
  const [portalConfig, setPortalConfig] = useState<PortalConfig>({
    welcomeMessage: "You're making great progress. Keep it up!",
    announcement: ""
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'config', 'landing-page'), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        if (data.portal) {
          setPortalConfig(data.portal);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const stats = [
    { label: 'Courses Enrolled', value: '3', icon: BookOpen, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Sessions Completed', value: '12', icon: CheckCircle2, color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'Hours Learned', value: '24', icon: Clock, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Skills Mastered', value: '5', icon: Award, color: 'text-accent', bg: 'bg-accent/10' },
  ];

  const upcomingSessions = [
    { title: 'WSC Debate Strategy', date: 'Today, 4:00 PM', type: 'Online', instructor: 'Dr. Sarah Smith' },
    { title: 'Robotics Workshop', date: 'Tomorrow, 10:00 AM', type: 'In-Person', instructor: 'Prof. James Wilson' },
  ];

  const recentResources = [
    { title: 'Public Speaking Guide', type: 'PDF', size: '2.4 MB' },
    { title: 'Coding Basics Video', type: 'Video', duration: '15:30' },
  ];

  return (
    <div className="space-y-8">
      {/* Announcement Bar */}
      {portalConfig.announcement && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-accent/10 border border-accent/20 p-4 rounded-2xl flex items-center gap-4 text-accent"
        >
          <div className="bg-accent text-white p-2 rounded-xl">
            <Megaphone size={20} />
          </div>
          <p className="text-sm font-bold">{portalConfig.announcement}</p>
        </motion.div>
      )}

      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary">Welcome back, {profile?.displayName || 'User'}! 👋</h1>
          <p className="text-primary/60">{portalConfig.welcomeMessage}</p>
        </div>
        <button className="px-6 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 flex items-center gap-2">
          <Calendar size={20} />
          Book New Session
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
          >
            <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-4', stat.bg)}>
              <stat.icon size={24} className={stat.color} />
            </div>
            <p className="text-sm font-medium text-primary/60 mb-1">{stat.label}</p>
            <h3 className="text-2xl font-display font-bold text-primary">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Sessions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold text-primary">Upcoming Sessions</h2>
            <button className="text-sm font-bold text-accent hover:underline flex items-center gap-1">
              View All <ChevronRight size={16} />
            </button>
          </div>
          <div className="space-y-4">
            {upcomingSessions.map((session) => (
              <div key={session.title} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-accent/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-primary group-hover:bg-accent/10 group-hover:text-accent transition-all">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-primary">{session.title}</h4>
                    <p className="text-xs text-primary/60">{session.date} • {session.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-primary">{session.instructor}</p>
                  <button className="text-xs font-bold text-accent hover:underline">Join Now</button>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Chart Placeholder */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-display font-bold text-primary">Learning Progress</h2>
              <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold">
                <TrendingUp size={14} />
                +12% this week
              </div>
            </div>
            <div className="h-48 bg-gray-50 rounded-xl flex items-center justify-center text-primary/20 border-2 border-dashed border-gray-200">
              <BarChart3 size={48} />
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          {/* Recent Resources */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-display font-bold text-primary mb-6">Recent Resources</h2>
            <div className="space-y-4">
              {recentResources.map((resource) => (
                <div key={resource.title} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-all cursor-pointer group">
                  <div className="w-10 h-10 bg-primary/5 rounded-lg flex items-center justify-center text-primary group-hover:bg-accent/10 group-hover:text-accent transition-all">
                    {resource.type === 'Video' ? <PlayCircle size={20} /> : <BookOpen size={20} />}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-primary truncate">{resource.title}</h4>
                    <p className="text-xs text-primary/60">{resource.type} • {resource.size || resource.duration}</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-accent" />
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 border border-gray-200 text-primary font-bold rounded-xl text-sm hover:bg-gray-50 transition-all">
              View All Resources
            </button>
          </div>

          {/* Achievement Card */}
          <div className="bg-primary text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <Award size={40} className="text-accent mb-4" />
            <h3 className="text-xl font-display font-bold mb-2">Next Milestone</h3>
            <p className="text-white/60 text-sm mb-6">Complete 3 more sessions to earn the "Skill Master" badge!</p>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div className="bg-accent h-full w-[70%]" />
            </div>
            <p className="text-right text-xs mt-2 text-white/40">70% Complete</p>
          </div>
        </div>
      </div>
    </div>
  );
}
