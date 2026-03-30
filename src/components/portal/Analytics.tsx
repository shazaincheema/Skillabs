import { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Download,
  Loader2,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { collection, query, where, orderBy, limit, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { handleFirestoreError, OperationType } from '@/lib/firebase-utils';

interface Activity {
  user: string;
  action: string;
  target: string;
  time: string;
  timestamp: any;
}

export default function Analytics() {
  const [studentCount, setStudentCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [applicationCount, setApplicationCount] = useState(0);
  const [pendingApps, setPendingApps] = useState(0);
  const [courseDistribution, setCourseDistribution] = useState<{ name: string, value: number }[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [enrollmentData, setEnrollmentData] = useState<{ name: string, students: number }[]>([]);
  const [studentChange, setStudentChange] = useState('0');
  const [appChange, setAppChange] = useState('0');
  const [pendingChange, setPendingChange] = useState('0');
  const [loading, setLoading] = useState(true);

  const COLORS = ['#0B1F3A', '#F28C28', '#E5E7EB', '#4B5563', '#9CA3AF'];

  useEffect(() => {
    // Fetch student count and enrollment trend
    const studentsQuery = query(collection(db, 'users'), where('role', '==', 'client'));
    const unsubscribeStudents = onSnapshot(studentsQuery, (snapshot) => {
      setStudentCount(snapshot.size);
      
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
      
      let currentPeriod = 0;
      let previousPeriod = 0;

      // Calculate enrollment trend
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonth = now.getMonth();
      const last7Months = [];
      for (let i = 6; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        last7Months.push({ name: months[monthIndex], students: 0, monthIndex });
      }

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.createdAt) {
          const date = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
          
          // Trend calculation
          if (date >= thirtyDaysAgo) currentPeriod++;
          else if (date >= sixtyDaysAgo) previousPeriod++;

          const month = months[date.getMonth()];
          const monthData = last7Months.find(m => m.name === month);
          if (monthData) {
            monthData.students++;
          }
        }
      });
      setEnrollmentData(last7Months);
      
      const diff = currentPeriod - previousPeriod;
      setStudentChange(diff >= 0 ? `+${diff}` : `${diff}`);
    });

    // Fetch course count and distribution
    const coursesQuery = collection(db, 'courses');
    const unsubscribeCourses = onSnapshot(coursesQuery, (snapshot) => {
      setCourseCount(snapshot.size);
      const coursesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
      
      // Calculate course interest based on applications
      const applicationsQuery = collection(db, 'applications');
      getDocs(applicationsQuery).then(appSnapshot => {
        const counts: Record<string, number> = {};
        appSnapshot.docs.forEach(doc => {
          const courseName = doc.data().course;
          if (courseName) {
            counts[courseName] = (counts[courseName] || 0) + 1;
          }
        });
        
        const dist = coursesData.map(c => ({
          name: c.title,
          value: counts[c.title] || 0
        })).filter(d => d.value > 0).slice(0, 5);
        
        // Fallback if no applications yet
        if (dist.length === 0) {
          setCourseDistribution(coursesData.slice(0, 5).map(c => ({ name: c.title, value: 1 })));
        } else {
          setCourseDistribution(dist);
        }
      }).catch(error => {
        console.error('Course distribution error:', error);
      });
    }, (error) => {
      console.error('Courses snapshot error:', error);
    });

    // Fetch application count and pending
    const applicationsQuery = collection(db, 'applications');
    const unsubscribeApplications = onSnapshot(applicationsQuery, (snapshot) => {
      setApplicationCount(snapshot.size);
      const pending = snapshot.docs.filter(doc => doc.data().status === 'Pending').length;
      setPendingApps(pending);

      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
      
      let currentApps = 0;
      let previousApps = 0;
      let currentPending = 0;
      let previousPending = 0;

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const date = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
        
        if (date >= thirtyDaysAgo) {
          currentApps++;
          if (data.status === 'Pending') currentPending++;
        } else if (date >= sixtyDaysAgo) {
          previousApps++;
          if (data.status === 'Pending') previousPending++;
        }
      });

      const appDiff = currentApps - previousApps;
      setAppChange(appDiff >= 0 ? `+${appDiff}` : `${appDiff}`);
      
      const pendingDiff = currentPending - previousPending;
      setPendingChange(pendingDiff >= 0 ? `+${pendingDiff}` : `${pendingDiff}`);
    }, (error) => {
      console.error('Applications snapshot error:', error);
    });

    // Combined Recent Activity (Applications + New Students)
    const qRecentApps = query(collection(db, 'applications'), orderBy('createdAt', 'desc'), limit(10));
    const qRecentStudents = query(collection(db, 'users'), where('role', '==', 'client'), orderBy('createdAt', 'desc'), limit(10));

    let apps: Activity[] = [];
    let students: Activity[] = [];

    const updateActivity = () => {
      const combined = [...apps, ...students]
        .sort((a, b) => {
          const timeA = a.timestamp?.seconds || 0;
          const timeB = b.timestamp?.seconds || 0;
          return timeB - timeA;
        })
        .slice(0, 6);
      setRecentActivity(combined);
      setLoading(false);
    };

    const unsubscribeRecentApps = onSnapshot(qRecentApps, (snapshot) => {
      apps = snapshot.docs.map(doc => {
        const data = doc.data();
        const date = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
        const now = new Date();
        const diff = Math.floor((now.getTime() - date.getTime()) / 60000);
        let timeStr = diff < 1 ? 'Just now' : diff < 60 ? `${diff} mins ago` : diff < 1440 ? `${Math.floor(diff/60)} hours ago` : `${Math.floor(diff/1440)} days ago`;
        return {
          user: data.name || 'Anonymous',
          action: 'applied for',
          target: data.course || 'a course',
          time: timeStr,
          timestamp: data.createdAt
        };
      });
      updateActivity();
    }, (error) => {
      console.error('Recent apps snapshot error:', error);
    });

    const unsubscribeRecentStudents = onSnapshot(qRecentStudents, (snapshot) => {
      students = snapshot.docs.map(doc => {
        const data = doc.data();
        const date = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
        const now = new Date();
        const diff = Math.floor((now.getTime() - date.getTime()) / 60000);
        let timeStr = diff < 1 ? 'Just now' : diff < 60 ? `${diff} mins ago` : diff < 1440 ? `${Math.floor(diff/60)} hours ago` : `${Math.floor(diff/1440)} days ago`;
        return {
          user: data.displayName || data.email?.split('@')[0] || 'New Student',
          action: 'enrolled in',
          target: 'Skillabs Portal',
          time: timeStr,
          timestamp: data.createdAt
        };
      });
      updateActivity();
    }, (error) => {
      console.error('Recent students snapshot error:', error);
    });

    return () => {
      unsubscribeStudents();
      unsubscribeCourses();
      unsubscribeApplications();
      unsubscribeRecentApps();
      unsubscribeRecentStudents();
    };
  }, []);

  const stats = [
    { label: 'Total Students', value: studentCount.toLocaleString(), change: studentChange, trend: studentChange.startsWith('+') ? 'up' : 'down', icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Active Courses', value: courseCount.toString(), change: '+1', trend: 'up', icon: BookOpen, color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'Total Applications', value: applicationCount.toString(), change: appChange, trend: appChange.startsWith('+') ? 'up' : 'down', icon: TrendingUp, color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'Pending Review', value: pendingApps.toString(), change: pendingChange, trend: pendingChange.startsWith('+') ? 'up' : 'down', icon: Clock, color: 'text-primary', bg: 'bg-primary/10' },
  ];

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
          <h1 className="text-3xl font-display font-bold text-primary">Analytics Dashboard</h1>
          <p className="text-primary/60">Monitor your platform's performance and growth.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 text-primary font-bold rounded-xl text-sm hover:bg-gray-50 transition-all flex items-center gap-2">
            <Filter size={18} />
            Filter
          </button>
          <button className="px-4 py-2 bg-primary text-white font-bold rounded-xl text-sm hover:bg-primary/90 transition-all flex items-center gap-2">
            <Download size={18} />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', stat.bg)}>
                <stat.icon size={20} className={stat.color} />
              </div>
              <div className={cn(
                'flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full',
                stat.trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              )}>
                {stat.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.change}
              </div>
            </div>
            <p className="text-sm font-medium text-primary/60 mb-1">{stat.label}</p>
            <h3 className="text-2xl font-display font-bold text-primary">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Student Enrollment Chart */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-display font-bold text-primary mb-8">Student Enrollment Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <Tooltip 
                  cursor={{ fill: '#F9FAFB' }}
                  contentStyle={{ backgroundColor: '#FFF', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="students" fill="#0B1F3A" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course Distribution */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-display font-bold text-primary mb-8">Course Interest</h3>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={courseDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {courseDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-4 ml-4">
              {courseDistribution.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-xs font-medium text-primary/60 truncate max-w-[120px]">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2">
          <h3 className="text-xl font-display font-bold text-primary mb-8">Recent Activity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                    {activity.user.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-primary">
                      <span className="font-bold">{activity.user}</span> {activity.action} <span className="font-bold">{activity.target}</span>
                    </p>
                    <p className="text-xs text-primary/40">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-primary/40 text-center col-span-2 py-12">No recent activity found.</p>
            )}
          </div>
          <button className="w-full mt-8 py-3 border border-gray-200 text-primary font-bold rounded-xl text-sm hover:bg-gray-50 transition-all">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
}
