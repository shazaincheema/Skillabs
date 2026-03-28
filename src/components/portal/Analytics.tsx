import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Download
} from 'lucide-react';
import { motion } from 'motion/react';

const data = [
  { name: 'Jan', students: 400, revenue: 2400 },
  { name: 'Feb', students: 300, revenue: 1398 },
  { name: 'Mar', students: 200, revenue: 9800 },
  { name: 'Apr', students: 278, revenue: 3908 },
  { name: 'May', students: 189, revenue: 4800 },
  { name: 'Jun', students: 239, revenue: 3800 },
  { name: 'Jul', students: 349, revenue: 4300 },
];

const courseData = [
  { name: 'WSC Coaching', value: 400 },
  { name: 'Coding & Robotics', value: 300 },
  { name: 'Public Speaking', value: 300 },
];

const COLORS = ['#0B1F3A', '#F28C28', '#E5E7EB'];

export default function Analytics() {
  const stats = [
    { label: 'Total Students', value: '1,284', change: '+12.5%', trend: 'up', icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Active Courses', value: '12', change: '+2', trend: 'up', icon: BookOpen, color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'Monthly Revenue', value: '$42,500', change: '-3.2%', trend: 'down', icon: DollarSign, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Completion Rate', value: '84%', change: '+5.4%', trend: 'up', icon: TrendingUp, color: 'text-accent', bg: 'bg-accent/10' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:row justify-between items-start gap-4">
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
        {/* Revenue Chart */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-display font-bold text-primary mb-8">Revenue Growth</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F28C28" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#F28C28" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFF', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#0B1F3A', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#F28C28" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Student Enrollment Chart */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-display font-bold text-primary mb-8">Student Enrollment</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
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
          <h3 className="text-xl font-display font-bold text-primary mb-8">Course Distribution</h3>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={courseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {courseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-4">
              {courseData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-sm font-medium text-primary/60">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-display font-bold text-primary mb-8">Recent Activity</h3>
          <div className="space-y-6">
            {[
              { user: 'Alice Johnson', action: 'enrolled in', target: 'WSC Coaching', time: '2 mins ago' },
              { user: 'Bob Smith', action: 'completed', target: 'Coding Basics', time: '15 mins ago' },
              { user: 'Charlie Brown', action: 'booked a session for', target: 'Public Speaking', time: '1 hour ago' },
              { user: 'Diana Prince', action: 'made a payment for', target: 'Robotics Advanced', time: '3 hours ago' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-primary font-bold text-xs shrink-0">
                  {activity.user.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-primary">
                    <span className="font-bold">{activity.user}</span> {activity.action} <span className="font-bold">{activity.target}</span>
                  </p>
                  <p className="text-xs text-primary/40">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 border border-gray-200 text-primary font-bold rounded-xl text-sm hover:bg-gray-50 transition-all">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
}

import { cn } from '@/lib/utils';
import { BarChart3 } from 'lucide-react';
