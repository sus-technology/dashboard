import { motion } from 'framer-motion';
import { Users, Activity, Clock, TrendingUp } from 'lucide-react';
import { mockAnalytics } from '@/lib/mockData';
import { containerVariants, itemVariants } from '@/lib/animations';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm text-muted-foreground">{entry.name}: <span className="font-medium text-foreground">{entry.value.toLocaleString()}</span></p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const stats = [
    { label: 'Total Users', value: mockAnalytics.totalUsers.toLocaleString(), icon: Users, change: '+12%', positive: true },
    { label: 'Active Users', value: mockAnalytics.activeUsers.toLocaleString(), icon: Activity, change: '+8%', positive: true },
    { label: 'Total Sessions', value: mockAnalytics.totalSessions.toLocaleString(), icon: TrendingUp, change: '+24%', positive: true },
    { label: 'Avg. Session', value: mockAnalytics.avgSessionDuration, icon: Clock, change: '+2%', positive: true },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <div><h2 className="font-heading text-2xl">Analytics</h2><p className="text-muted-foreground">Monitor your app performance and user engagement</p></div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={itemVariants} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3"><div className="p-2 rounded-lg bg-muted"><stat.icon className="h-5 w-5 text-primary" /></div><span className={`text-sm font-medium ${stat.positive ? 'text-primary' : 'text-destructive'}`}>{stat.change}</span></div>
            <div className="font-heading text-2xl mb-1">{stat.value}</div><div className="text-sm text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-heading text-lg mb-4">Daily Active Users</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockAnalytics.usageByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="users" name="Users" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: 'hsl(var(--primary))' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-heading text-lg mb-4">Sessions by Day</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockAnalytics.usageByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="sessions" name="Sessions" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-heading text-lg mb-4">Weekly Overview</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-border"><th className="text-left p-3 text-sm font-medium text-muted-foreground">Day</th><th className="text-right p-3 text-sm font-medium text-muted-foreground">Users</th><th className="text-right p-3 text-sm font-medium text-muted-foreground">Sessions</th><th className="text-right p-3 text-sm font-medium text-muted-foreground hidden sm:table-cell">Engagement</th></tr></thead>
            <tbody>
              {mockAnalytics.usageByDay.map((day) => (
                <tr key={day.day} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium">{day.day}</td><td className="p-3 text-right text-muted-foreground">{day.users.toLocaleString()}</td><td className="p-3 text-right text-muted-foreground">{day.sessions.toLocaleString()}</td>
                  <td className="p-3 text-right hidden sm:table-cell"><div className="flex items-center justify-end gap-2"><div className="w-20 h-2 bg-muted rounded-full overflow-hidden"><div className="h-full gradient-primary rounded-full" style={{ width: `${(day.sessions / 5000) * 100}%` }} /></div><span className="text-sm text-muted-foreground">{Math.round((day.sessions / 5000) * 100)}%</span></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
