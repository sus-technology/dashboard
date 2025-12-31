import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Smartphone, Layout, Users, LogIn, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockActivityLogs, ActivityLog } from '@/lib/mockData';
import { containerVariants, rowVariants } from '@/lib/animations';
import { cn } from '@/lib/utils';

const typeIcons: Record<ActivityLog['type'], React.ElementType> = {
  app_created: Smartphone,
  template_used: Layout,
  team_action: Users,
  login: LogIn,
  settings_changed: Settings
};

const typeColors: Record<ActivityLog['type'], string> = {
  app_created: 'bg-primary/20 text-primary',
  template_used: 'bg-secondary/20 text-secondary',
  team_action: 'bg-muted text-foreground',
  login: 'bg-muted text-muted-foreground',
  settings_changed: 'bg-muted text-muted-foreground'
};

const filterOptions = [
  { value: 'all', label: 'All Activity' },
  { value: 'app_created', label: 'App Created' },
  { value: 'template_used', label: 'Template Used' },
  { value: 'team_action', label: 'Team Actions' },
  { value: 'login', label: 'Logins' },
  { value: 'settings_changed', label: 'Settings' }
];

const randomUsers = ['Sarah Chen', 'Alex Johnson', 'Mike Wilson', 'Emma Davis', 'John Doe', 'Jane Smith'];
const logTemplates: Record<ActivityLog['type'], string[]> = {
  app_created: [
    'Created new app "{name}"',
    'Started project "{name}"',
    'Initialized "{name}" dashboard'
  ],
  template_used: [
    'Used "{name}" template',
    'Applied "{name}" design',
    'Imported "{name}" configuration'
  ],
  team_action: [
    'Added new member to team',
    'Updated permissions for {name}',
    'Changed role for {name}'
  ],
  login: [
    'Login from {name} device',
    'Successful authentication via {name}',
    'Active session started on {name}'
  ],
  settings_changed: [
    'Updated {name} preferences',
    'Changed {name} settings',
    'Modified {name} configuration'
  ]
};

const randomNames = ['ShopEasy', 'FitTracker', 'Marketplace Pro', 'ChatConnect', 'TaskFlow', 'Nexus', 'MacOS', 'Browser', 'Mobile App'];

export default function ActivityLogs() {
  console.log('ActivityLogs component rendered');
  console.log('mockActivityLogs:', mockActivityLogs);
  
  const [logs, setLogs] = useState<ActivityLog[]>(mockActivityLogs);
  const [filter, setFilter] = useState<string>('all');
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const types: ActivityLog['type'][] = ['app_created', 'template_used', 'team_action', 'login', 'settings_changed'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      const randomUser = randomUsers[Math.floor(Math.random() * randomUsers.length)];
      const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
      const templates = logTemplates[randomType];
      const randomDescription = templates[Math.floor(Math.random() * templates.length)].replace('{name}', randomName);

      const newLog: ActivityLog = {
        id: Math.random().toString(36).substr(2, 9),
        type: randomType,
        description: randomDescription,
        user: randomUser,
        timestamp: new Date().toISOString(),
        details: 'Automatically generated log entry for demonstration.'
      };

      setLogs(prevLogs => [newLog, ...prevLogs.slice(0, 49)]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const filteredLogs = logs.filter(log => filter === 'all' || log.type === filter);
  const formatTimestamp = (timestamp: string) => { const date = new Date(timestamp); return { date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }; };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h2 className="font-heading text-2xl">Activity & Logs</h2><p className="text-muted-foreground">Track all actions and events in your workspace</p></div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {filterOptions.map((option) => <Button key={option.value} variant={filter === option.value ? 'default' : 'outline'} size="sm" onClick={() => setFilter(option.value)} className={cn('flex-shrink-0', filter === option.value && 'bg-primary text-primary-foreground')}>{option.label}</Button>)}
      </div>

      <motion.div variants={containerVariants} className="bg-card border border-border rounded-xl overflow-hidden">
        <AnimatePresence mode="popLayout">
          {filteredLogs.map((log) => {
            const Icon = typeIcons[log.type];
            const { date, time } = formatTimestamp(log.timestamp);
            const isExpanded = expandedLog === log.id;
            return (
              <motion.div key={log.id} variants={rowVariants} initial="hidden" animate="visible" exit="exit" layout className="border-b border-border last:border-0">
                <button onClick={() => setExpandedLog(isExpanded ? null : log.id)} className="w-full flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors text-left">
                  <div className={cn('p-2 rounded-lg flex-shrink-0', typeColors[log.type])}><Icon className="h-4 w-4" /></div>
                  <div className="flex-1 min-w-0"><div className="font-medium truncate">{log.description}</div><div className="text-sm text-muted-foreground">{log.user} • {date} at {time}</div></div>
                  {log.details && <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.15 }} className="flex-shrink-0"><ChevronRight className="h-5 w-5 text-muted-foreground" /></motion.div>}
                </button>
                <AnimatePresence>
                  {isExpanded && log.details && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                      <div className="px-4 pb-4 pl-16"><div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">{log.details}</div></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {filteredLogs.length === 0 && <div className="p-12 text-center"><p className="text-muted-foreground">No activity logs found</p></div>}
      </motion.div>
    </motion.div>
  );
}
