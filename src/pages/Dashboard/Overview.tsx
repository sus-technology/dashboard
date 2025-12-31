import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Smartphone, TrendingUp, Activity, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { overviewStats, mockApps, mockActivityLogs } from '@/lib/mockData';
import { Link } from 'react-router-dom';

function AnimatedCounter({ end, duration = 1.5 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count.toLocaleString()}</span>;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

export default function Overview() {
  const stats = [
    { label: 'Total Apps', value: overviewStats.totalApps, icon: Smartphone, color: 'text-primary' },
    { label: 'Active Apps', value: overviewStats.activeApps, icon: Activity, color: 'text-secondary' },
    { label: 'Total Downloads', value: overviewStats.totalDownloads, icon: TrendingUp, color: 'text-primary' },
    { label: 'Monthly Growth', value: overviewStats.monthlyGrowth, icon: TrendingUp, suffix: '%', color: 'text-secondary' },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl lg:text-3xl mb-2">
              Welcome to <span className="gradient-text">Sus-Technology</span>
            </h2>
            <p className="text-muted-foreground">Build stunning mobile apps with AI. Get started by creating a new app or exploring templates.</p>
          </div>
          <Link to="/dashboard/app-builder">
            <Button variant="gradient" size="lg" className="w-full lg:w-auto">
              <Plus className="h-5 w-5" />
              Create New App
            </Button>
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={itemVariants} className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors duration-200">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="font-heading text-2xl lg:text-3xl mb-1">
              <AnimatedCounter end={stat.value} />
              {stat.suffix}
            </div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-lg">Recent Apps</h3>
            <Link to="/dashboard/my-apps" className="text-primary text-sm hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {mockApps.slice(0, 4).map((app) => (
              <div key={app.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{app.icon}</span>
                  <div>
                    <div className="font-medium">{app.name}</div>
                    <div className="text-sm text-muted-foreground">{app.lastUpdated}</div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${app.status === 'Live' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-lg">Recent Activity</h3>
            <Link to="/dashboard/activity" className="text-primary text-sm hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {mockActivityLogs.slice(0, 4).map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{log.description}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {log.user} • {new Date(log.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
